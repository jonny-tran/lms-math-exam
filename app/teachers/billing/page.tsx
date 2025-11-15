import { SiteHeader } from "@/components/teachers/dashboard/site-header";
import { DataTable } from "@/components/teachers/dashboard/data-table";

// Mock data - will be replaced with API call
const mockBillingData = [
  {
    id: 1,
    header: "Premium Plan - January 2024",
    type: "Subscription",
    status: "Active",
    target: "29.99",
    limit: "USD",
    reviewer: "Paid",
  },
  {
    id: 2,
    header: "Premium Plan - December 2023",
    type: "Subscription",
    status: "Done",
    target: "29.99",
    limit: "USD",
    reviewer: "Paid",
  },
  {
    id: 3,
    header: "AI Exam Generation - 100 credits",
    type: "Purchase",
    status: "Done",
    target: "19.99",
    limit: "USD",
    reviewer: "Paid",
  },
];

export default function BillingPage() {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <div className="mb-4">
                <h1 className="text-2xl font-semibold">Billing</h1>
                <p className="text-muted-foreground">
                  View your payment history and manage subscriptions
                </p>
              </div>
              <DataTable data={mockBillingData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

