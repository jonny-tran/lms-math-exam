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
import { TeacherDto, TeacherStatus } from "@/types/admin-types";

export const createColumns = (
  onViewDetails?: (teacherId: number) => void,
  onStatusChange?: (teacherId: number, newStatus: TeacherStatus) => void,
  updatingIds?: Set<number>
): ColumnDef<TeacherDto>[] => [
  {
    accessorKey: "teacherId",
    header: "ID",
    cell: ({ row }) => {
      return <span className="font-mono">{row.original.teacherId}</span>;
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
      return <span>{row.original.email || "—"}</span>;
    },
  },
  {
    accessorKey: "department",
    header: "Khoa/Bộ môn",
    cell: ({ row }) => {
      return <span>{row.original.department || "—"}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: "default" | "secondary" | "destructive" = "default";
      let label = "";

      if (status === TeacherStatus.Pending) {
        variant = "secondary";
        label = "Chờ duyệt";
      } else if (status === TeacherStatus.Active) {
        variant = "default";
        label = "Hoạt động";
      } else if (status === TeacherStatus.Suspended) {
        variant = "destructive";
        label = "Đã khóa";
      }

      return <Badge variant={variant}>{label}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => {
      const teacher = row.original;
      const status = teacher.status;
      const isPending = status === TeacherStatus.Pending;
      const isActive = status === TeacherStatus.Active;
      const isSuspended = status === TeacherStatus.Suspended;
      const isUpdating = updatingIds?.has(teacher.teacherId);

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
                onViewDetails?.(teacher.teacherId);
              }}
            >
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {isPending && (
              <DropdownMenuItem
                onClick={() => {
                  onStatusChange?.(teacher.teacherId, TeacherStatus.Active);
                }}
                disabled={isUpdating}
              >
                {isUpdating ? "Đang xử lý..." : "Phê duyệt"}
              </DropdownMenuItem>
            )}
            {isActive && (
              <DropdownMenuItem
                onClick={() => {
                  onStatusChange?.(
                    teacher.teacherId,
                    TeacherStatus.Suspended
                  );
                }}
                disabled={isUpdating}
              >
                {isUpdating ? "Đang xử lý..." : "Khóa tài khoản"}
              </DropdownMenuItem>
            )}
            {isSuspended && (
              <DropdownMenuItem
                onClick={() => {
                  onStatusChange?.(teacher.teacherId, TeacherStatus.Active);
                }}
                disabled={isUpdating}
              >
                {isUpdating ? "Đang xử lý..." : "Kích hoạt tài khoản"}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

