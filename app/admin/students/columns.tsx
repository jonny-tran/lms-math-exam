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
import { StudentDto, StudentStatus } from "@/types/admin-types";

export const createColumns = (
  onViewDetails?: (studentId: number) => void,
  onStatusChange?: (studentId: number, newStatus: StudentStatus) => void,
  updatingIds?: Set<number>
): ColumnDef<StudentDto>[] => [
  {
    accessorKey: "studentId",
    header: "ID",
    cell: ({ row }) => {
      return <span className="font-mono">{row.original.studentId}</span>;
    },
  },
  {
    accessorKey: "name",
    header: "Tên",
    cell: ({ row }) => {
      return <span className="font-medium">{row.original.name}</span>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return <span>{row.original.email}</span>;
    },
  },
  {
    accessorKey: "major",
    header: "Chuyên ngành",
    cell: ({ row }) => {
      return <span>{row.original.major}</span>;
    },
  },
  {
    accessorKey: "enrollmentDate",
    header: "Ngày đăng ký",
    cell: ({ row }) => {
      const date = new Date(row.original.enrollmentDate);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return <span>{`${day}/${month}/${year}`}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status;
      const isActive = status === StudentStatus.Active;
      return (
        <Badge variant={isActive ? "default" : "destructive"}>
          {isActive ? "Hoạt động" : "Đã khóa"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => {
      const student = row.original;
      const isActive = student.status === StudentStatus.Active;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                onViewDetails?.(student.studentId);
              }}
            >
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                const newStatus = isActive
                  ? StudentStatus.Suspended
                  : StudentStatus.Active;
                onStatusChange?.(student.studentId, newStatus);
              }}
              disabled={updatingIds?.has(student.studentId)}
            >
              {updatingIds?.has(student.studentId)
                ? "Đang xử lý..."
                : isActive
                  ? "Khóa tài khoản"
                  : "Kích hoạt tài khoản"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

