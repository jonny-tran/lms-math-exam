import { SiteHeader } from "@/components/teachers/dashboard/site-header";
import { DataTable } from "@/components/teachers/dashboard/data-table";

// Mock data - will be replaced with API call
const mockActivitiesData = [
  {
    id: 1,
    header: "Homework Assignment 1 - Mathematics",
    type: "Assignment",
    status: "Active",
    target: "30",
    limit: "28",
    reviewer: "Nguyễn Văn A",
  },
  {
    id: 2,
    header: "Lab Exercise 1 - Physics",
    type: "Lab",
    status: "Active",
    target: "25",
    limit: "24",
    reviewer: "Trần Thị B",
  },
  {
    id: 3,
    header: "Practice Quiz - Functions",
    type: "Quiz",
    status: "Done",
    target: "30",
    limit: "30",
    reviewer: "Nguyễn Văn A",
  },
];

export default function ActivitiesPage() {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <div className="mb-4">
                <h1 className="text-2xl font-semibold">Activities</h1>
                <p className="text-muted-foreground">
                  Manage learning activities and assignments
                </p>
              </div>
              <DataTable data={mockActivitiesData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
