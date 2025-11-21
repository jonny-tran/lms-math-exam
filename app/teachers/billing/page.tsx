"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/teachers/dashboard/site-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { useTeacherIdentity } from "@/hooks/use-teacher-identity";
import { useAuth } from "@/hooks/use-auth";
import { paymentService } from "@/services/payment-service";
import {
  PaymentResponseDto,
  PaymentStatus,
  PaymentMethod,
  CreatePaymentRequest,
} from "@/types/payment-types";
import { IconCreditCard, IconLoader } from "@tabler/icons-react";
import { AxiosError } from "axios";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}/${month}/${year}`;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const getStatusBadge = (status: PaymentStatus | string) => {
  // Handle string status from API
  if (typeof status === "string") {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge variant="default">Completed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }
  // Handle enum status
  switch (status) {
    case PaymentStatus.Completed:
      return <Badge variant="default">Completed</Badge>;
    case PaymentStatus.Pending:
      return <Badge variant="secondary">Pending</Badge>;
    case PaymentStatus.Failed:
      return <Badge variant="destructive">Failed</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getMethodLabel = (method: PaymentMethod | string) => {
  if (typeof method === "string") {
    return method; // Return string directly if API returns string
  }
  switch (method) {
    case PaymentMethod.Bank:
      return "Bank";
    case PaymentMethod.Momo:
      return "MoMo";
    case PaymentMethod.Cash:
      return "Cash";
    default:
      return "Unknown";
  }
};

export default function BillingPage() {
  const { teacherId, isLoading: isLoadingTeacher } = useTeacherIdentity();
  const { getCurrentUser } = useAuth();
  const [payments, setPayments] = useState<PaymentResponseDto[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
  });
  const [teacherName, setTeacherName] = useState("");

  // Get teacher name info
  useEffect(() => {
    const fetchTeacherInfo = async () => {
      try {
        const user = await getCurrentUser();
        setTeacherName(user.username || user.email || "Teacher");
      } catch (error) {
        console.error("Failed to fetch teacher info:", error);
      }
    };
    fetchTeacherInfo();
  }, [getCurrentUser]);

  // Get payment history
  useEffect(() => {
    const fetchPayments = async () => {
      if (!teacherId) return;

      setIsLoadingPayments(true);
      try {
        // Get all payments and filter by teacherId on client-side
        const allPayments = await paymentService.getAllPayments();
        // Filter payments by teacherId - only show payments for current teacher
        const teacherPayments = allPayments.filter(
          (payment) => payment.teacherId === teacherId
        );
        // Sort by paymentDate descending (newest first)
        teacherPayments.sort(
          (a, b) =>
            new Date(b.paymentDate).getTime() -
            new Date(a.paymentDate).getTime()
        );
        setPayments(teacherPayments);
      } catch (error) {
        console.error("Failed to fetch payments:", error);
        toast.error("Could not load payment history");
      } finally {
        setIsLoadingPayments(false);
      }
    };

    fetchPayments();
  }, [teacherId]);

  // Handle callback redirect with toast notification
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentResult = urlParams.get("paymentResult");

    if (paymentResult && teacherId) {
      // Clear the query parameter from URL
      window.history.replaceState({}, "", "/teachers/billing");

      // Show toast based on payment result
      if (paymentResult === "success") {
        toast.success("Payment completed successfully!", {
          description: "Your payment has been processed.",
          duration: 5000,
        });
      } else if (paymentResult === "failed") {
        toast.error("Payment failed", {
          description:
            "Please try again or contact support if the problem persists.",
          duration: 5000,
        });
      }

      // Refresh payments after a short delay to allow backend to process
      setTimeout(async () => {
        if (!teacherId) return;

        setIsLoadingPayments(true);
        try {
          const allPayments = await paymentService.getAllPayments();
          // Filter payments by teacherId - only show payments for current teacher
          const teacherPayments = allPayments.filter(
            (payment) => payment.teacherId === teacherId
          );
          // Sort by paymentDate descending (newest first)
          teacherPayments.sort(
            (a, b) =>
              new Date(b.paymentDate).getTime() -
              new Date(a.paymentDate).getTime()
          );
          setPayments(teacherPayments);
        } catch (error) {
          console.error("Failed to refresh payments:", error);
        } finally {
          setIsLoadingPayments(false);
        }
      }, 1500);
    }
  }, [teacherId]);

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teacherId) {
      toast.error("Could not find teacher information");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsProcessing(true);
    try {
      const payload: CreatePaymentRequest = {
        teacherId,
        amount,
        teacherName,
        description: formData.description || undefined,
      };

      const response = await paymentService.createPayment(payload);

      // Redirect to MoMo payment URL
      if (response.momoPaymentUrl) {
        toast.success("Redirecting to MoMo...");
        window.location.href = response.momoPaymentUrl;
      } else {
        toast.error("Did not receive payment URL from MoMo");
      }
    } catch (error: unknown) {
      console.error("Payment creation failed:", error);
      const errorMessage =
        (error as AxiosError<{ message?: string }>).response?.data?.message ||
        (error as Error).message ||
        "Could not create payment. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetForm = () => {
    setFormData({ amount: "", description: "" });
  };

  if (isLoadingTeacher) {
    return (
      <>
        <SiteHeader />
        <div className="flex flex-1 flex-col items-center justify-center">
          <Spinner className="size-8" />
        </div>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold">Billing</h1>
                  <p className="text-muted-foreground">
                    View your payment history and manage subscription package
                  </p>
                </div>
                <Dialog
                  open={isDialogOpen}
                  onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) {
                      handleResetForm();
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <IconCreditCard className="size-4" />
                      Pay / Upgrade
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create new payment</DialogTitle>
                      <DialogDescription>
                        Enter your payment info to redirect to MoMo
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitPayment}>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="amount">
                            Amount (VND){" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="amount"
                            type="number"
                            min="1000"
                            step="1000"
                            placeholder="Enter amount (e.g. 100000)"
                            value={formData.amount}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                amount: e.target.value,
                              })
                            }
                            required
                            disabled={isProcessing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">
                            Description (optional)
                          </Label>
                          <Input
                            id="description"
                            type="text"
                            placeholder="E.g: Premium package payment Jan 2024"
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description: e.target.value,
                              })
                            }
                            disabled={isProcessing}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                          disabled={isProcessing}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isProcessing}>
                          {isProcessing ? (
                            <>
                              <IconLoader className="mr-2 size-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Pay via MoMo"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Payment History Table */}
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingPayments ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex items-center justify-center gap-2">
                            <Spinner className="size-5" />
                            <span className="text-muted-foreground">
                              Loading payment history...
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : payments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <p className="text-muted-foreground">
                            No payment history yet
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      payments.map((payment) => (
                        <TableRow key={payment.paymentId}>
                          <TableCell className="font-medium">
                            #{payment.paymentId}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(payment.amount)}
                          </TableCell>
                          <TableCell>
                            {getMethodLabel(payment.method)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(payment.status)}
                          </TableCell>
                          <TableCell>
                            {formatDate(payment.paymentDate)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
