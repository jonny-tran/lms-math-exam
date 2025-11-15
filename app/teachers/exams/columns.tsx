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

// 1. Define the data type for Exam (based on exam_matrix)
export type Exam = {
  id: string;
  name: string; // Tên đề thi
  className: string; // Tên lớp (mock)
  type: "AI" | "Manual"; // Loại (AI/Thủ công)
  totalQuestions: number; // total_questions
  createdAt: string;
};

// 2. Define the columns
export const columns: ColumnDef<Exam>[] = [
  {
    accessorKey: "name",
    header: "Exam Name",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.className}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const variant = row.original.type === "AI" ? "default" : "secondary";
      return <Badge variant={variant}>{row.original.type}</Badge>;
    },
  },
  {
    accessorKey: "totalQuestions",
    header: "Questions",
    cell: ({ row }) => {
      return (
        <Badge variant="outline">{row.original.totalQuestions}</Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      // Format date consistently
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return <span>{`${month}/${day}/${year}`}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const exam = row.original;
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
              onClick={() => navigator.clipboard.writeText(exam.id)}
            >
              Copy Exam ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Submissions</DropdownMenuItem>
            <DropdownMenuItem>Edit Exam</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete Exam
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

