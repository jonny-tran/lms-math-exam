import { SiteHeader } from "@/components/teachers/dashboard/site-header";
import { DataTable } from "@/components/teachers/dashboard/data-table";

// Mock data - will be replaced with API call
const mockSubjectsData = [
  {
    id: 1,
    header: "Mathematics",
    type: "Subject",
    status: "Active",
    target: "3",
    limit: "3",
    reviewer: "Nguyễn Văn A",
  },
  {
    id: 2,
    header: "Physics",
    type: "Subject",
    status: "Active",
    target: "2",
    limit: "2",
    reviewer: "Trần Thị B",
  },
  {
    id: 3,
    header: "Chemistry",
    type: "Subject",
    status: "Active",
    target: "2",
    limit: "2",
    reviewer: "Phạm Thị D",
  },
];

export default function SubjectsPage() {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <div className="mb-4">
                <h1 className="text-2xl font-semibold">Subjects</h1>
                <p className="text-muted-foreground">
                  Manage your subjects and course materials
                </p>
              </div>
              <DataTable data={mockSubjectsData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

