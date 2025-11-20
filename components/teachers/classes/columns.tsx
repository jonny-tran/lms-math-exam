"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { ClassDto } from "@/types/class";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ClassColumnHandlers = {
  onView?: (classItem: ClassDto) => void;
  onEdit?: (classItem: ClassDto) => void;
  onDelete?: (classItem: ClassDto) => void;
};

const formatDate = (value?: string | null) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("vi-VN");
};

export const getClassColumns = ({
  onView,
  onEdit,
  onDelete,
}: ClassColumnHandlers = {}): ColumnDef<ClassDto>[] => [
  {
    accessorKey: "name",
    header: "Class Name",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.name}</span>
        <span className="text-xs text-muted-foreground">
          {row.original.subjectTitle ?? "No subject assigned"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "schedule",
    header: "Schedule",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => <span>{formatDate(row.original.startDate)}</span>,
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => <span>{formatDate(row.original.endDate)}</span>,
  },
  {
    id: "studentCount",
    header: "Student Count",
    cell: ({ row }) => {
      const count = Array.isArray(row.original.enrolledStudents)
        ? row.original.enrolledStudents.length
        : 0;
      return <Badge variant="outline">{count}</Badge>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const classRow = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onView?.(classRow)}
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">View details</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit?.(classRow)}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit class</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive focus-visible:text-destructive"
            onClick={() => onDelete?.(classRow)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete class</span>
          </Button>
        </div>
      );
    },
  },
];
