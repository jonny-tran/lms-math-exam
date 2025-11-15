import { SiteHeader } from "@/components/teachers/dashboard/site-header";
import { DataTable } from "@/components/teachers/dashboard/data-table";

// Mock data - will be replaced with API call
const mockGradebookData = [
  {
    id: 1,
    header: "Nguyễn Văn An - Midterm Exam",
    type: "Exam Attempt",
    status: "Completed",
    target: "100",
    limit: "85",
    reviewer: "Class 10A",
  },
  {
    id: 2,
    header: "Trần Thị Bình - Midterm Exam",
    type: "Exam Attempt",
    status: "Completed",
    target: "100",
    limit: "92",
    reviewer: "Class 10A",
  },
  {
    id: 3,
    header: "Lê Văn Cường - Final Exam",
    type: "Exam Attempt",
    status: "Completed",
    target: "100",
    limit: "78",
    reviewer: "Class 10B",
  },
];

export default function GradebookPage() {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <div className="mb-4">
                <h1 className="text-2xl font-semibold">Gradebook</h1>
                <p className="text-muted-foreground">
                  View and manage student grades and exam attempts
                </p>
              </div>
              <DataTable data={mockGradebookData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
