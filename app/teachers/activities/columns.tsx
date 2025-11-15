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

// 1. Define the data type for Activity (based on screenshot)
export type Activity = {
  id: string;
  name: string; // from activities.title
  className: string; // Mocked name from activities.class_id
  type: "Assignment" | "Quiz" | "Lab"; // Conceptual type
  createdAt: string; // from activities.created_at
};

// 2. Define the columns
export const columns: ColumnDef<Activity>[] = [
  {
    accessorKey: "name",
    header: "Activity Name",
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
      // Use a Badge to display the type
      let variant: "default" | "secondary" | "outline" = "outline";
      if (row.original.type === "Assignment") variant = "secondary";
      if (row.original.type === "Quiz") variant = "default";
      
      return <Badge variant={variant}>{row.original.type}</Badge>;
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
      const activity = row.original;
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
              onClick={() => navigator.clipboard.writeText(activity.id)}
            >
              Copy Activity ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Activity</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete Activity
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

