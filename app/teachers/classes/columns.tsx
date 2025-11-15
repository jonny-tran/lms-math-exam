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

// This is the data type for a row
export type Class = {
  id: string;
  name: string;
  schedule: string;
  studentCount: number;
  createdAt: string;
  subject: string; // Mocked, based on subject_id
};

export const columns: ColumnDef<Class>[] = [
  {
    accessorKey: "name",
    header: "Class Name",
    cell: ({ row }): React.ReactNode => {
      return (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.subject}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "schedule",
    header: "Schedule",
  },
  {
    accessorKey: "studentCount",
    header: "Students",
    cell: ({ row }): React.ReactNode => {
      return <Badge variant="outline">{row.original.studentCount}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell: ({ row }): React.ReactNode => {
      const date = new Date(row.original.createdAt);
      // Format date consistently to avoid hydration mismatch
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return <span>{`${month}/${day}/${year}`}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }): React.ReactNode => {
      const classRow = row.original;
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
              onClick={() => navigator.clipboard.writeText(classRow.id)}
            >
              Copy Class ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Students</DropdownMenuItem>
            <DropdownMenuItem>Edit Class</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete Class
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
