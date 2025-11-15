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

// 1. Define the data type for Question (based on mockQuestionsData)
export type Question = {
  id: string;
  header: string; // Tên câu hỏi
  type: "Multiple Choice" | "Short Answer" | "True/False"; // Loại câu hỏi
  status: "Active" | "Inactive"; // Trạng thái
  target: "Easy" | "Medium" | "Hard"; // Độ khó
  limit: string; // Chủ đề (Subject)
  reviewer: string; // Người tạo
};

// 2. Define the columns
export const columns: ColumnDef<Question>[] = [
  {
    accessorKey: "header",
    header: "Question",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.header}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.limit}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const variant = row.original.type === "Multiple Choice" ? "default" : "secondary";
      return <Badge variant={variant}>{row.original.type}</Badge>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const variant = row.original.status === "Active" ? "default" : "outline";
      return <Badge variant={variant}>{row.original.status}</Badge>;
    },
  },
  {
    accessorKey: "target",
    header: "Difficulty",
    cell: ({ row }) => {
      const { target } = row.original;
      let variant: "default" | "secondary" | "outline" = "outline";
      if (target === "Easy") variant = "default";
      if (target === "Medium") variant = "secondary";
      if (target === "Hard") variant = "outline";
      
      return <Badge variant={variant}>{target}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const question = row.original;
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
              onClick={() => navigator.clipboard.writeText(question.id)}
            >
              Copy Question ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Question</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete Question
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

