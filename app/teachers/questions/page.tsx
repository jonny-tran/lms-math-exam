import { SiteHeader } from "@/components/teachers/dashboard/site-header";
import { DataTable } from "@/components/teachers/dashboard/data-table";

// Mock data - will be replaced with API call
const mockQuestionsData = [
  {
    id: 1,
    header: "What is 2 + 2?",
    type: "Multiple Choice",
    status: "Active",
    target: "Easy",
    limit: "Mathematics",
    reviewer: "Nguyễn Văn A",
  },
  {
    id: 2,
    header: "Solve for x: 2x + 5 = 15",
    type: "Short Answer",
    status: "Active",
    target: "Medium",
    limit: "Mathematics",
    reviewer: "Nguyễn Văn A",
  },
  {
    id: 3,
    header: "Calculate the derivative of x²",
    type: "Short Answer",
    status: "Active",
    target: "Hard",
    limit: "Mathematics",
    reviewer: "Lê Văn C",
  },
];

export default function QuestionsPage() {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <div className="mb-4">
                <h1 className="text-2xl font-semibold">Question Bank</h1>
                <p className="text-muted-foreground">
                  Manage your exam questions and question bank
                </p>
              </div>
              <DataTable data={mockQuestionsData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

