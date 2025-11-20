"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SiteHeader } from "@/components/teachers/dashboard/site-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { paymentService } from "@/services/payment-service";
import { VerifyPaymentResponse } from "@/types/payment-types";
import { IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

const REDIRECT_DELAY = 3000; // 3 seconds

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationResult, setVerificationResult] =
    useState<VerifyPaymentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasRedirectedRef = useRef(false);

  const redirectToBilling = useCallback(() => {
    if (hasRedirectedRef.current) return;
    hasRedirectedRef.current = true;
    router.push("/teachers/billing");
  }, [router]);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        setIsVerifying(true);
        setError(null);

        // Get all query parameters from URL
        const params = new URLSearchParams();
        searchParams.forEach((value, key) => {
          params.append(key, value);
        });

        // Check errorCode from query params first
        const errorCode = searchParams.get("errorCode");
        const message = searchParams.get("message");
        const localMessage = searchParams.get("localMessage");

        // If there is an errorCode and it's not 0 (success), show error immediately
        if (errorCode && errorCode !== "0") {
          const errorMsg =
            decodeURIComponent(localMessage || message || "Payment failed") ||
            "Payment was not successful";
          setError(errorMsg);
          toast.error(errorMsg, {
            description: `Error code: ${errorCode}`,
          });
          setIsVerifying(false);
          // Auto redirect after 3 seconds
          redirectTimeoutRef.current = setTimeout(() => {
            redirectToBilling();
          }, REDIRECT_DELAY);
          return;
        }

        // Call API to verify payment
        const result = await paymentService.verifyPaymentCallback(params);
        setVerificationResult(result);

        // Show toast based on result
        if (result.success) {
          toast.success(result.message || "Payment successful!", {
            description: "You will be redirected to the billing page...",
          });
          // Auto redirect after 3 seconds
          redirectTimeoutRef.current = setTimeout(() => {
            redirectToBilling();
          }, REDIRECT_DELAY);
        } else {
          const errorMsg = result.message || "Payment was not successful";
          setError(errorMsg);
          toast.error(errorMsg, {
            description: result.errorCode
              ? `Error code: ${result.errorCode}`
              : undefined,
          });
          // Auto redirect after 3 seconds
          redirectTimeoutRef.current = setTimeout(() => {
            redirectToBilling();
          }, REDIRECT_DELAY);
        }
      } catch (err: unknown) {
        console.error("Payment verification failed:", err);
        const errorMessage =
          (err as AxiosError<{ message?: string }>).response?.data?.message ||
          (err as Error).message ||
          "Unable to verify payment. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage);
        // Auto redirect after 3 seconds
        redirectTimeoutRef.current = setTimeout(() => {
          redirectToBilling();
        }, REDIRECT_DELAY);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();

    // Cleanup timeout when component unmounts
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, [searchParams, redirectToBilling]);

  const handleBackToBilling = () => {
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
    }
    redirectToBilling();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Verification</CardTitle>
        <CardDescription>Processing payment result from MoMo</CardDescription>
      </CardHeader>
      <CardContent>
        {isVerifying ? (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <Spinner className="size-8" />
            <p className="text-muted-foreground">Verifying payment...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
              <IconCircleX className="size-8 text-destructive" />
            </div>
            <div className="text-center">
              <h3 className="mb-2 text-lg font-semibold">
                Verification failed
              </h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
            <Button onClick={handleBackToBilling} variant="outline">
              Back to billing page
            </Button>
          </div>
        ) : verificationResult?.success ? (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="flex size-16 items-center justify-center rounded-full bg-green-500/10">
              <IconCircleCheck className="size-8 text-green-500" />
            </div>
            <div className="text-center">
              <h3 className="mb-2 text-lg font-semibold">
                Payment successful!
              </h3>
              <p className="text-muted-foreground">
                {verificationResult.message ||
                  "Your payment has been successfully processed."}
              </p>
              {verificationResult.data && (
                <div className="mt-4 rounded-lg border p-4 text-left">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Transaction ID:
                      </span>
                      <span className="font-medium">
                        {verificationResult.data.transId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order ID:</span>
                      <span className="font-medium">
                        {verificationResult.data.orderId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(Number(verificationResult.data.amount))}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Button onClick={handleBackToBilling}>Back to billing page</Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="flex size-16 items-center justify-center rounded-full bg-yellow-500/10">
              <IconCircleX className="size-8 text-yellow-500" />
            </div>
            <div className="text-center">
              <h3 className="mb-2 text-lg font-semibold">
                Payment unsuccessful
              </h3>
              <p className="text-muted-foreground">
                {verificationResult?.message ||
                  "Your payment could not be processed."}
              </p>
              {verificationResult?.errorCode && (
                <Badge variant="outline" className="mt-2">
                  Error code: {verificationResult.errorCode}
                </Badge>
              )}
            </div>
            <Button onClick={handleBackToBilling} variant="outline">
              Back to billing page
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function PaymentCallbackPage() {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <div className="mx-auto max-w-2xl">
                <Suspense
                  fallback={
                    <Card>
                      <CardHeader>
                        <CardTitle>Payment Verification</CardTitle>
                        <CardDescription>
                          Processing payment result from MoMo
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col items-center justify-center gap-4 py-8">
                          <Spinner className="size-8" />
                          <p className="text-muted-foreground">
                            Loading payment verification...
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  }
                >
                  <PaymentCallbackContent />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
