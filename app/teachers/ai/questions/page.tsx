import * as React from "react";

import { SiteHeader } from "@/components/teachers/dashboard/site-header";

// Import local components
import { Question, columns } from "./columns";

import { QuestionsDataTable } from "./questions-data-table";

// Mock data - will be replaced with API call
async function getQuestionData(): Promise<Question[]> {
  return [
    {
      id: "QST-001",
      header: "What is 2 + 2?",
      type: "Multiple Choice",
      status: "Active",
      target: "Easy",
      limit: "Mathematics",
      reviewer: "Nguyễn Văn A",
    },
    {
      id: "QST-002",
      header: "Solve for x: 2x + 5 = 15",
      type: "Short Answer",
      status: "Active",
      target: "Medium",
      limit: "Mathematics",
      reviewer: "Nguyễn Văn A",
    },
    {
      id: "QST-003",
      header: "Calculate the derivative of x²",
      type: "Short Answer",
      status: "Active",
      target: "Hard",
      limit: "Mathematics",
      reviewer: "Lê Văn C",
    },
  ];
}

export default async function QuestionsPage() {
  const data = await getQuestionData();

  return (
    <>
      <SiteHeader />
      {/* Use <main> tag for content spacing per Gold Standard */}
      <main className="flex flex-1 flex-col gap-6 p-4 lg:gap-8 lg:p-6">
        {/* Page Title & Description */}
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold md:text-2xl">
            AI Question Bank
          </h1>
          <p className="text-muted-foreground">
            Quản lý ngân hàng câu hỏi để huấn luyện AI.
          </p>
        </div>

        {/* Render the local data table */}
        <QuestionsDataTable columns={columns} data={data} />
      </main>
    </>
  );
}
