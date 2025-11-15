import { SiteHeader } from "@/components/teachers/dashboard/site-header";
import { DataTable } from "@/components/teachers/dashboard/data-table";

// Mock data - will be replaced with API call
const mockClassesData = [
  {
    id: 1,
    header: "Mathematics - Class 10A",
    type: "Class",
    status: "Active",
    target: "30",
    limit: "28",
    reviewer: "Nguyễn Văn A",
  },
  {
    id: 2,
    header: "Physics - Class 11A",
    type: "Class",
    status: "Active",
    target: "25",
    limit: "24",
    reviewer: "Trần Thị B",
  },
  {
    id: 3,
    header: "Mathematics - Class 10B",
    type: "Class",
    status: "Active",
    target: "32",
    limit: "30",
    reviewer: "Nguyễn Văn A",
  },
];

export default function ClassesPage() {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <div className="mb-4">
                <h1 className="text-2xl font-semibold">Classes</h1>
                <p className="text-muted-foreground">
                  Manage your classes and students
                </p>
              </div>
              <DataTable data={mockClassesData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

