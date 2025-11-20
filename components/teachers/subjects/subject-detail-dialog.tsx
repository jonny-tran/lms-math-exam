"use client";

import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SubjectDto } from "@/types/subject";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";

interface SubjectDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjectData: SubjectDto | null;
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

  return format(date, "dd/MM/yyyy HH:mm");
};

export function SubjectDetailDialog({
  open,
  onOpenChange,
  subjectData,
  isLoading,
}: SubjectDetailDialogProps) {
  const classCount = subjectData?.classes?.length ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Subject details</DialogTitle>
          <DialogDescription>
            View the latest information for this subject.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Spinner className="size-5" />
            Loading details...
          </div>
        ) : (
          <div className="space-y-4">
            <DetailRow label="Subject title" value={subjectData?.title} />
            <DetailRow
              label="Description"
              value={subjectData?.description ?? "—"}
            />
            <DetailRow
              label="Teacher"
              value={subjectData?.teacherName ?? "—"}
            />
            <DetailRow label="Class count" value={String(classCount)} />
            <DetailRow
              label="Created at"
              value={formatDate(subjectData?.createdAt)}
            />
            <DetailRow
              label="Updated at"
              value={formatDate(subjectData?.updatedAt)}
            />

            {classCount > 0 && subjectData?.classes && (
              <div className="space-y-2 pt-2 border-t">
                <p className="text-sm font-medium text-foreground">Classes</p>
                <div className="space-y-2">
                  {subjectData.classes.map((classItem) => (
                    <div
                      key={classItem.classId}
                      className="rounded-lg border p-3 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{classItem.name}</p>
                        <Badge variant="outline">{classItem.schedule}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span>
                          Start: {formatDate(classItem.startDate)}
                        </span>
                        {classItem.endDate && (
                          <span className="ml-2">
                            End: {formatDate(classItem.endDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

