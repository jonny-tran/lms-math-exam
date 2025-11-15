import * as React from "react";

import { SiteHeader } from "@/components/teachers/dashboard/site-header";

// 1. Import local components
import { Syllabus, columns } from "./columns";

import { SyllabusDataTable } from "./syllabus-data-table";

// Mock data (from original file)
const mockSubjectsData: Syllabus[] = [
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

export default async function SubjectsPage() {
  const data = mockSubjectsData;

  return (
    <>
      <SiteHeader />
      {/* Use <main> tag for content spacing per Gold Standard */}
      <main className="flex flex-1 flex-col gap-6 p-4 lg:gap-8 lg:p-6">
        {/* Page Title & Description (Updated) */}
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold md:text-2xl">
            AI Syllabus
          </h1>
          <p className="text-muted-foreground">
            Quản lý và huấn luyện AI dựa trên syllabus của bạn.
          </p>
        </div>

        {/* 3. Render the local data table */}
        <SyllabusDataTable columns={columns} data={data} />
      </main>
    </>
  );
}

