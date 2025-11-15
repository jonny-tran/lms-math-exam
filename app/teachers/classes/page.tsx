import * as React from "react"

import { Class, columns } from "./columns"

import { ClassDataTable } from "./class-data-table"

// Mock Data Function
async function getClassData(): Promise<Class[]> {
  // In the future, this will be an API call.
  // Based on physical_diagram.jpg
  return [
    {
      id: "CLS-001",
      name: "Advanced AI",
      schedule: "Mon, Wed 10:00-11:30",
      studentCount: 25,
      createdAt: "2025-09-01T10:00:00Z",
      subject: "Artificial Intelligence",
    },
    {
      id: "CLS-002",
      name: "Intro to Databases",
      schedule: "Tue, Thu 13:00-14:30",
      studentCount: 42,
      createdAt: "2025-09-01T13:00:00Z",
      subject: "Database Systems",
    },
    {
      id: "CLS-003",
      name: "Web Development",
      schedule: "Fri 09:00-12:00",
      studentCount: 31,
      createdAt: "2025-09-02T09:00:00Z",
      subject: "Computer Science",
    },
  ]
}

export default async function ClassesPage() {
  const data = await getClassData()

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 lg:gap-8 lg:p-6">
      {/* Page Title */}
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Manage Classes</h1>
      </div>
      {/* Data Table */}
      <ClassDataTable columns={columns} data={data} />
    </main>
  )
}
