import { SiteHeader } from "@/components/teachers/dashboard/site-header";
import { DataTable } from "@/components/teachers/dashboard/data-table";

// Mock data - will be replaced with API call
const mockExamsData = [
  {
    id: 1,
    header: "Midterm Exam - Algebra",
    type: "AI Exam",
    status: "Active",
    target: "60",
    limit: "20",
    reviewer: "AI System",
  },
  {
    id: 2,
    header: "Final Exam - Geometry",
    type: "AI Exam",
    status: "Pending",
    target: "90",
    limit: "25",
    reviewer: "AI System",
  },
  {
    id: 3,
    header: "Quarterly Exam - Statistics",
    type: "AI Exam",
    status: "In Process",
    target: "75",
    limit: "18",
    reviewer: "AI System",
  },
];

export default function ExamsPage() {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <div className="mb-4">
                <h1 className="text-2xl font-semibold">AI Exams</h1>
                <p className="text-muted-foreground">
                  Manage AI-generated exams and exam matrices
                </p>
              </div>
              <DataTable data={mockExamsData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

