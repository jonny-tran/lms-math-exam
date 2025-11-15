import * as React from "react";

import { SiteHeader } from "@/components/teachers/dashboard/site-header";

// 1. Import local components
import { Exam, columns } from "./columns";

import { ExamsDataTable } from "./exams-data-table";

// 2. Create new mock data that matches our 'Exam' type
async function getExamData(): Promise<Exam[]> {
  return [
    {
      id: "EXM-001",
      name: "Midterm Exam - Algebra",
      className: "Class 10A",
      type: "AI",
      totalQuestions: 20,
      createdAt: "2025-10-15T08:00:00Z",
    },
    {
      id: "EXM-002",
      name: "Final Exam - Geometry",
      className: "Class 11B",
      type: "Manual",
      totalQuestions: 25,
      createdAt: "2025-10-10T11:30:00Z",
    },
    {
      id: "EXM-003",
      name: "Quarterly Exam - Statistics",
      className: "Class 10A",
      type: "AI",
      totalQuestions: 18,
      createdAt: "2025-09-20T16:45:00Z",
    },
  ];
}

export default async function ExamsPage() {
  const data = await getExamData();

  return (
    <>
      <SiteHeader />
      {/* Use <main> tag for content spacing per Gold Standard */}
      <main className="flex flex-1 flex-col gap-6 p-4 lg:gap-8 lg:p-6">
        {/* Page Title & Description */}
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold md:text-2xl">
            Manage AI Exams
          </h1>
          <p className="text-muted-foreground">
            Create, manage, and review AI-generated exams and exam matrices.
          </p>
        </div>

        {/* 3. Render the local data table */}
        <ExamsDataTable columns={columns} data={data} />
      </main>
    </>
  );
}
