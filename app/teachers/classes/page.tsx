"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ClassDataTable } from "@/components/teachers/classes/class-data-table";
import { getClassColumns } from "@/components/teachers/classes/columns";
import {
  ClassFormDialog,
  ClassFormValues,
} from "@/components/teachers/classes/class-form-dialog";
import { ClassDetailDialog } from "@/components/teachers/classes/class-detail-dialog";
import { classService } from "@/services/class-service";
import { subjectService } from "@/services/subject-service";
import { useTeacherIdentity } from "@/hooks/use-teacher-identity";
import { ClassDto } from "@/types/class";
import { SubjectDto } from "@/types/subject";
import { Spinner } from "@/components/ui/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: string; message?: string };
    return data?.error ?? data?.message ?? error.message;
  }

  return (error as Error).message ?? "An error has occurred.";
};

export default function ClassesPage() {
  const {
    teacherId,
    isLoading: identityLoading,
    error: identityError,
    refresh,
  } = useTeacherIdentity();
  const [classes, setClasses] = useState<ClassDto[]>([]);
  const [subjects, setSubjects] = useState<SubjectDto[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ClassDto | null>(null);
  const [viewingClass, setViewingClass] = useState<ClassDto | null>(null);
  const [isCreateSubmitting, setIsCreateSubmitting] = useState(false);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [createSeed, setCreateSeed] = useState<number>(() => Date.now());

  const loadData = useCallback(async () => {
    if (!teacherId) {
      return;
    }

    setIsDataLoading(true);
    try {
      const [classesResponse, subjectsResponse] = await Promise.all([
        classService.getAllClasses(),
        subjectService.getAllSubjects(),
      ]);

      setClasses(classesResponse);
      setSubjects(subjectsResponse);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsDataLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    if (teacherId) {
      void loadData();
    }
  }, [teacherId, loadData]);

  const tableData = useMemo(() => {
    if (!teacherId) {
      return [];
    }

    return classes.filter((classItem) => classItem.teacherId === teacherId);
  }, [classes, teacherId]);

  const handleAddClick = useCallback(() => {
    if (!teacherId) {
      toast.error("Unable to identify teacher. Please try again.");
      return;
    }

    if (!subjects.length) {
      toast.error(
        "There are currently no subjects. Please create a subject first."
      );
      return;
    }

    setCreateSeed(Date.now());
    setIsCreateOpen(true);
  }, [subjects.length, teacherId]);

  const fetchClassDetail = useCallback(async (classItem: ClassDto) => {
    try {
      const detail = await classService.getClassById(classItem.classId);
      return detail;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return null;
    }
  }, []);

  const handleEditRequest = useCallback(
    async (classItem: ClassDto) => {
      setIsEditOpen(true);
      setIsFetchingDetails(true);
      const detail = await fetchClassDetail(classItem);
      if (detail) {
        setEditingClass(detail);
      } else {
        setIsEditOpen(false);
      }
      setIsFetchingDetails(false);
    },
    [fetchClassDetail]
  );

  const handleViewRequest = useCallback(
    async (classItem: ClassDto) => {
      setIsViewOpen(true);
      setIsViewingDetails(true);
      const detail = await fetchClassDetail(classItem);
      if (detail) {
        setViewingClass(detail);
      } else {
        setIsViewOpen(false);
      }
      setIsViewingDetails(false);
    },
    [fetchClassDetail]
  );

  const handleDeletePrompt = useCallback((classItem: ClassDto) => {
    setDeleteTarget(classItem);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleCreateSubmit = useCallback(
    async (values: ClassFormValues) => {
      setIsCreateSubmitting(true);
      try {
        await classService.createClass({
          name: values.name,
          schedule: values.schedule,
          subjectId: values.subjectId,
          teacherId: values.teacherId,
          startDate: values.startDate.toISOString(),
          endDate: values.endDate ? values.endDate.toISOString() : null,
        });
        toast.success("A new class has been created.");
        setIsCreateOpen(false);
        await loadData();
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setIsCreateSubmitting(false);
      }
    },
    [loadData]
  );

  const handleEditSubmit = useCallback(
    async (values: ClassFormValues) => {
      if (!editingClass) {
        return;
      }

      setIsEditSubmitting(true);
      try {
        await classService.updateClass(editingClass.classId, {
          name: values.name,
          schedule: values.schedule,
          subjectId: values.subjectId,
          teacherId: values.teacherId,
          startDate: values.startDate.toISOString(),
          endDate: values.endDate ? values.endDate.toISOString() : null,
        });

        toast.success("Class has been updated.");
        setIsEditOpen(false);
        setEditingClass(null);
        await loadData();
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setIsEditSubmitting(false);
      }
    },
    [editingClass, loadData]
  );

  const handleDeleteSubmit = useCallback(async () => {
    if (!deleteTarget) {
      return;
    }

    setIsDeleteSubmitting(true);
    try {
      await classService.deleteClass(deleteTarget.classId);
      toast.success("Class has been deleted.");
      setIsDeleteDialogOpen(false);
      setDeleteTarget(null);
      await loadData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsDeleteSubmitting(false);
    }
  }, [deleteTarget, loadData]);

  const columns = useMemo(
    () =>
      getClassColumns({
        onView: (classItem) => void handleViewRequest(classItem),
        onEdit: (classItem) => void handleEditRequest(classItem),
        onDelete: handleDeletePrompt,
      }),
    [handleDeletePrompt, handleEditRequest, handleViewRequest]
  );

  const baseFormValues = useMemo<ClassFormValues>(
    () => ({
      name: "",
      schedule: "",
      subjectId: subjects[0]?.subjectId ?? 0,
      teacherId: teacherId ?? 0,
      startDate: new Date(createSeed || Date.now()),
      endDate: null,
    }),
    [subjects, teacherId, createSeed]
  );

  const editFormValues = useMemo<ClassFormValues>(() => {
    if (!editingClass) {
      return baseFormValues;
    }

    return {
      name: editingClass.name,
      schedule: editingClass.schedule,
      subjectId: editingClass.subjectId,
      teacherId: editingClass.teacherId,
      startDate: new Date(editingClass.startDate),
      endDate: editingClass.endDate ? new Date(editingClass.endDate) : null,
    };
  }, [baseFormValues, editingClass]);

  const handleEditOpenChange = (open: boolean) => {
    if (!open) {
      setEditingClass(null);
    }
    setIsEditOpen(open);
  };

  const handleViewOpenChange = (open: boolean) => {
    if (!open) {
      setViewingClass(null);
    }
    setIsViewOpen(open);
  };

  const handleDeleteDialogChange = (open: boolean) => {
    if (!open) {
      setDeleteTarget(null);
    }
    setIsDeleteDialogOpen(open);
  };

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 lg:gap-8 lg:p-6">
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold md:text-2xl">Class Management</h1>
        <p className="text-muted-foreground">
          Create, edit, and monitor the classes you are in charge of.
        </p>
      </div>

      {identityLoading ? (
        <div className="flex h-48 items-center justify-center gap-3 rounded-lg border">
          <Spinner className="size-5" />
          <span className="text-sm text-muted-foreground">
            Verifying teacher information...
          </span>
        </div>
      ) : identityError ? (
        <div className="flex flex-col gap-4 rounded-lg border border-destructive/30 bg-destructive/5 p-6">
          <div>
            <p className="font-medium text-destructive">
              Unable to verify teacher account.
            </p>
            <p className="text-sm text-muted-foreground">{identityError}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refresh()}>
              Retry
            </Button>
          </div>
        </div>
      ) : (
        <ClassDataTable
          columns={columns}
          data={tableData}
          onAdd={handleAddClick}
          isLoading={isDataLoading}
          emptyMessage="You do not have any classes yet."
        />
      )}

      {teacherId && (
        <ClassFormDialog
          mode="create"
          title="Add Class"
          description="Enter information to create a new class."
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          subjects={subjects}
          defaultValues={baseFormValues}
          onSubmit={handleCreateSubmit}
          isSubmitting={isCreateSubmitting}
        />
      )}

      <ClassFormDialog
        mode="edit"
        title="Edit Class"
        description="Update information for the selected class."
        open={isEditOpen}
        onOpenChange={handleEditOpenChange}
        subjects={subjects}
        defaultValues={editFormValues}
        onSubmit={handleEditSubmit}
        isSubmitting={isEditSubmitting}
        isLoadingDetails={isFetchingDetails && !editingClass}
        selectedSubjectTitle={editingClass?.subjectTitle ?? null}
        selectedSubjectTeacherId={editingClass?.teacherId ?? null}
      />

      <ClassDetailDialog
        open={isViewOpen}
        onOpenChange={handleViewOpenChange}
        classData={viewingClass}
        isLoading={isViewingDetails && !viewingClass}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={handleDeleteDialogChange}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete class?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the class{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.name ?? ""}
              </span>
              . If the class has dependencies, the operation may fail.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleteSubmitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => void handleDeleteSubmit()}
              disabled={isDeleteSubmitting}
            >
              {isDeleteSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
