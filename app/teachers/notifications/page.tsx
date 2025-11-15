import { SiteHeader } from "@/components/teachers/dashboard/site-header";
import { DataTable } from "@/components/teachers/dashboard/data-table";

// Mock data - will be replaced with API call
const mockNotificationsData = [
  {
    id: 1,
    header: "New exam submission from Class 10A",
    type: "Exam",
    status: "Unread",
    target: "2024-01-15",
    limit: "10:30 AM",
    reviewer: "System",
  },
  {
    id: 2,
    header: "Gradebook update completed",
    type: "System",
    status: "Read",
    target: "2024-01-14",
    limit: "3:45 PM",
    reviewer: "System",
  },
  {
    id: 3,
    header: "New student enrolled in Class 10B",
    type: "Class",
    status: "Unread",
    target: "2024-01-14",
    limit: "9:15 AM",
    reviewer: "System",
  },
  {
    id: 4,
    header: "AI exam generation completed",
    type: "Exam",
    status: "Read",
    target: "2024-01-13",
    limit: "2:20 PM",
    reviewer: "AI System",
  },
  {
    id: 5,
    header: "Payment successful - Premium Plan",
    type: "Billing",
    status: "Read",
    target: "2024-01-12",
    limit: "11:00 AM",
    reviewer: "Payment System",
  },
];

export default function NotificationsPage() {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <div className="mb-4">
                <h1 className="text-2xl font-semibold">Notifications</h1>
                <p className="text-muted-foreground">
                  View and manage your notifications
                </p>
              </div>
              <DataTable data={mockNotificationsData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

