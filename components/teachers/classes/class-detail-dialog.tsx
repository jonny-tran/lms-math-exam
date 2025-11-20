"use client";

import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClassDto } from "@/types/class";
import { Spinner } from "@/components/ui/spinner";

interface ClassDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classData: ClassDto | null;
  isLoading?: boolean;
}

const formatDate = (value: string | null | undefined) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return format(date, "dd/MM/yyyy");
};

export function ClassDetailDialog({
  open,
  onOpenChange,
  classData,
  isLoading,
}: ClassDetailDialogProps) {
  const studentCount = Array.isArray(classData?.enrolledStudents)
    ? classData?.enrolledStudents.length
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Class details</DialogTitle>
          <DialogDescription>
            View the latest information for this class.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Spinner className="size-5" />
            Loading details...
          </div>
        ) : (
          <div className="space-y-4">
            <DetailRow label="Class name" value={classData?.name} />
            <DetailRow label="Subject" value={classData?.subjectTitle ?? "—"} />
            <DetailRow label="Teacher" value={classData?.teacherName ?? "—"} />
            <DetailRow label="Schedule" value={classData?.schedule ?? "—"} />
            <DetailRow label="Start date" value={formatDate(classData?.startDate)} />
            <DetailRow label="End date" value={formatDate(classData?.endDate)} />
            <DetailRow label="Created at" value={formatDate(classData?.createdAt)} />
            <DetailRow label="Student count" value={String(studentCount ?? 0)} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => (
  <div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="font-medium text-foreground">{value ?? "—"}</p>
  </div>
);

