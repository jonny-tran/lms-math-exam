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

// 1. Define the data type for Syllabus (based on mockSubjectsData)
export type Syllabus = {
  id: number;
  header: string; // Tên Syllabus
  type: string; // Loại
  status: string; // Trạng thái
  target: string;
  limit: string;
  reviewer: string;
};

// 2. Define the columns
export const columns: ColumnDef<Syllabus>[] = [
  {
    accessorKey: "header",
    header: "Syllabus Name",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.header}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.reviewer}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <Badge variant="outline">{row.original.type}</Badge>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge variant="secondary">{row.original.status}</Badge>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const syllabus = row.original;
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
              onClick={() => navigator.clipboard.writeText(String(syllabus.id))}
            >
              Copy Syllabus ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Train AI</DropdownMenuItem>
            <DropdownMenuItem>Edit Syllabus</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete Syllabus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

