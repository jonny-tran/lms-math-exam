"use client";

import { ColumnDef } from "@tanstack/react-table";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";

// 1. Define the data type for Gradebook (based on exam_attempts)
export type GradebookEntry = {
  id: string;
  studentName: string; // Mocked
  examName: string; // Mocked
  className: string; // Mocked
  score: number | null;
  status: "Completed" | "In Progress" | "Not Started";
  submissionDate: string | null; // from end_time
};

// 2. Define the columns
export const columns: ColumnDef<GradebookEntry>[] = [
  {
    accessorKey: "studentName",
    header: "Student",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.studentName}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.className}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "examName",
    header: "Exam",
  },
  {
    accessorKey: "score",
    header: "Score",
    cell: ({ row }) => {
      const { score, status } = row.original;

      if (status !== "Completed" || score === null) {
        return <span className="text-muted-foreground">-</span>;
      }

      // Format score
      return <span className="font-medium">{score}/100</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { status } = row.original;

      let variant: "default" | "secondary" | "outline" = "outline";

      if (status === "Completed") variant = "default";

      if (status === "In Progress") variant = "secondary";

      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "submissionDate",
    header: "Submission Date",
    cell: ({ row }) => {
      const { submissionDate } = row.original;

      if (!submissionDate) {
        return <span className="text-muted-foreground">-</span>;
      }

      const date = new Date(submissionDate);

      const year = date.getFullYear();

      const month = String(date.getMonth() + 1).padStart(2, "0");

      const day = String(date.getDate()).padStart(2, "0");

      return <span>{`${month}/${day}/${year}`}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const entry = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(entry.id)}
            >
              Copy Attempt ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit Grade</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

