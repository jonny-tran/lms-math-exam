import * as React from "react";

import { SiteHeader } from "@/components/teachers/dashboard/site-header";

// 1. Import local components
import { GradebookEntry, columns } from "./columns";

import { GradebookDataTable } from "./gradebook-data-table";

// 2. Create new mock data that matches our 'GradebookEntry' type
async function getGradebookData(): Promise<GradebookEntry[]> {
  return [
    {
      id: "ATT-001",
      studentName: "Nguyen Van An",
      examName: "Midterm Exam - Algebra",
      className: "Class 10A",
      score: 85,
      status: "Completed",
      submissionDate: "2025-10-20T10:30:00Z",
    },
    {
      id: "ATT-002",
      studentName: "Tran Thi Binh",
      examName: "Midterm Exam - Algebra",
      className: "Class 10A",
      score: 92,
      status: "Completed",
      submissionDate: "2025-10-20T10:32:00Z",
    },
    {
      id: "ATT-003",
      studentName: "Le Van Cuong",
      examName: "Final Exam - Geometry",
      className: "Class 11B",
      score: 78,
      status: "Completed",
      submissionDate: "2025-10-19T14:05:00Z",
    },
    {
      id: "ATT-004",
      studentName: "Pham Thi Dung",
      examName: "Final Exam - Geometry",
      className: "Class 11B",
      score: null,
      status: "In Progress",
      submissionDate: null,
    },
  ];
}

export default async function GradebookPage() {
  const data = await getGradebookData();

  return (
    <>
      <SiteHeader />
      {/* Use <main> tag for content spacing per Gold Standard */}
      <main className="flex flex-1 flex-col gap-6 p-4 lg:gap-8 lg:p-6">
        {/* Page Title & Description */}
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold md:text-2xl">
            Gradebook
          </h1>
          <p className="text-muted-foreground">
            View and manage student grades and exam attempts.
          </p>
        </div>

        {/* 3. Render the local data table */}
        <GradebookDataTable columns={columns} data={data} />
      </main>
    </>
  );
}
