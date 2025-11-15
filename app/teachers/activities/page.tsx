import * as React from "react";

import { SiteHeader } from "@/components/teachers/dashboard/site-header";

// 1. Import local components
import { Activity, columns } from "./columns";

import { ActivitiesDataTable } from "./activities-data-table";

// 2. Create new mock data that matches our 'Activity' type
async function getActivityData(): Promise<Activity[]> {
  // This mock data matches the screenshot (image_4b853e.png)
  return [
    {
      id: "ACT-001",
      name: "Homework Chapter 1: Derivatives",
      className: "Class 12A1",
      type: "Assignment",
      createdAt: "2025-09-05T10:00:00Z",
    },
    {
      id: "ACT-002",
      name: "Quick Quiz: Limits",
      className: "Class 12A2",
      type: "Quiz",
      createdAt: "2025-09-03T14:30:00Z",
    },
    {
      id: "ACT-003",
      name: "Lab: Function Plotting",
      className: "Class 12A1",
      type: "Lab",
      createdAt: "2025-09-01T09:00:00Z",
    },
  ];
}

export default async function ActivitiesPage() {
  const data = await getActivityData();

  return (
    <>
      <SiteHeader />
      {/* Use <main> tag for content spacing per Gold Standard */}
      <main className="flex flex-1 flex-col gap-6 p-4 lg:gap-8 lg:p-6">
        {/* Page Title & Description */}
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold md:text-2xl">
            Manage Activities
          </h1>
          <p className="text-muted-foreground">
            View and manage your course activities, homework, and quizzes.
          </p>
        </div>
        
        {/* 3. Render the local data table */}
        <ActivitiesDataTable columns={columns} data={data} />
      </main>
    </>
  );
}
