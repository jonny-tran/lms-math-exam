"use client";

import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubjectDto } from "@/types/subject";

interface SubjectCardProps {
  subject: SubjectDto;
  onView: (subject: SubjectDto) => void;
  onEdit: (subject: SubjectDto) => void;
  onDelete: (subject: SubjectDto) => void;
}

export function SubjectCard({
  subject,
  onView,
  onEdit,
  onDelete,
}: SubjectCardProps) {
  const classCount = subject.classes?.length ?? 0;

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex flex-col space-y-1.5">
          <CardTitle className="text-lg">{subject.title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {subject.description || "No description"}
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onView(subject)}>
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(subject)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit subject
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(subject)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete subject
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Teacher:</span>
            <span className="font-medium">{subject.teacherName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Classes:</span>
            <Badge variant="secondary">{classCount}</Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onView(subject)}
        >
          View details
        </Button>
      </CardFooter>
    </Card>
  );
}

