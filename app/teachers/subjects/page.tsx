"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { IconPlus } from "@tabler/icons-react";
import { SiteHeader } from "@/components/teachers/dashboard/site-header";
import { SubjectCard } from "@/components/teachers/subjects/subject-card";
import { SubjectFormDialog, SubjectFormValues } from "@/components/teachers/subjects/subject-form-dialog";
import { SubjectDetailDialog } from "@/components/teachers/subjects/subject-detail-dialog";
import { subjectService } from "@/services/subject-service";
import { useTeacherIdentity } from "@/hooks/use-teacher-identity";
import { SubjectDto } from "@/types/subject";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: string; message?: string };
    return data?.error ?? data?.message ?? error.message;
  }

  return (error as Error).message ?? "An error has occurred.";
};

export default function SubjectsPage() {
  const {
    teacherId,
    isLoading: identityLoading,
    error: identityError,
    refresh,
  } = useTeacherIdentity();
  const [subjects, setSubjects] = useState<SubjectDto[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SubjectDto | null>(null);
  const [viewingSubject, setViewingSubject] = useState<SubjectDto | null>(null);
  const [isCreateSubmitting, setIsCreateSubmitting] = useState(false);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [createSeed, setCreateSeed] = useState<number>(() => Date.now());
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = useCallback(async () => {
    if (!teacherId) {
      return;
    }

    setIsDataLoading(true);
    try {
      const subjectsResponse = await subjectService.getAllSubjects();
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

  const filteredSubjects = useMemo(() => {
    if (!searchQuery.trim()) {
      return subjects.filter((subject) => subject.teacherId === teacherId);
    }

    const query = searchQuery.toLowerCase();
    return subjects.filter(
      (subject) =>
        subject.teacherId === teacherId &&
        (subject.title.toLowerCase().includes(query) ||
          subject.description?.toLowerCase().includes(query) ||
          subject.teacherName?.toLowerCase().includes(query))
    );
  }, [subjects, teacherId, searchQuery]);

  const handleAddClick = useCallback(() => {
    if (!teacherId) {
      toast.error("Unable to identify teacher. Please try again.");
      return;
    }

    setCreateSeed(Date.now());
    setIsCreateOpen(true);
  }, [teacherId]);

  const fetchSubjectDetail = useCallback(async (subject: SubjectDto) => {
    try {
      const detail = await subjectService.getSubjectById(subject.subjectId);
      return detail;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return null;
    }
  }, []);

  const handleEditRequest = useCallback(
    async (subject: SubjectDto) => {
      setIsEditOpen(true);
      setIsFetchingDetails(true);
      const detail = await fetchSubjectDetail(subject);
      if (detail) {
        setEditingSubject(detail);
      } else {
        setIsEditOpen(false);
      }
      setIsFetchingDetails(false);
    },
    [fetchSubjectDetail]
  );

  const handleViewRequest = useCallback(
    async (subject: SubjectDto) => {
      setIsViewOpen(true);
      setIsViewingDetails(true);
      const detail = await fetchSubjectDetail(subject);
      if (detail) {
        setViewingSubject(detail);
      } else {
        setIsViewOpen(false);
      }
      setIsViewingDetails(false);
    },
    [fetchSubjectDetail]
  );

  const handleDeletePrompt = useCallback((subject: SubjectDto) => {
    setDeleteTarget(subject);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleCreateSubmit = useCallback(
    async (values: SubjectFormValues) => {
      setIsCreateSubmitting(true);
      try {
        await subjectService.createSubject({
          teacherId: values.teacherId,
          title: values.title,
          description: values.description,
        });
        toast.success("A new subject has been created.");
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
    async (values: SubjectFormValues) => {
      if (!editingSubject) {
        return;
      }

      setIsEditSubmitting(true);
      try {
        await subjectService.updateSubject(editingSubject.subjectId, {
          teacherId: values.teacherId,
          title: values.title,
          description: values.description,
        });

        toast.success("Subject has been updated.");
        setIsEditOpen(false);
        setEditingSubject(null);
        await loadData();
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setIsEditSubmitting(false);
      }
    },
    [editingSubject, loadData]
  );

  const handleDeleteSubmit = useCallback(async () => {
    if (!deleteTarget) {
      return;
    }

    setIsDeleteSubmitting(true);
    try {
      await subjectService.deleteSubject(deleteTarget.subjectId);
      toast.success("Subject has been deleted.");
      setIsDeleteDialogOpen(false);
      setDeleteTarget(null);
      await loadData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsDeleteSubmitting(false);
    }
  }, [deleteTarget, loadData]);

  const baseFormValues = useMemo<SubjectFormValues>(
    () => ({
      teacherId: teacherId ?? 0,
      title: "",
      description: "",
    }),
    [teacherId]
  );

  const editFormValues = useMemo<SubjectFormValues>(() => {
    if (!editingSubject) {
      return baseFormValues;
    }

    return {
      teacherId: editingSubject.teacherId,
      title: editingSubject.title,
      description: editingSubject.description ?? "",
    };
  }, [baseFormValues, editingSubject]);

  const handleEditOpenChange = (open: boolean) => {
    if (!open) {
      setEditingSubject(null);
    }
    setIsEditOpen(open);
  };

  const handleViewOpenChange = (open: boolean) => {
    if (!open) {
      setViewingSubject(null);
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
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col gap-6 p-4 lg:gap-8 lg:p-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold md:text-2xl">
            Subject Management
          </h1>
          <p className="text-muted-foreground">
            Create, edit, and manage your subjects.
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
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <Input
                placeholder="Search subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
              <Button onClick={handleAddClick}>
                <IconPlus className="mr-2 h-4 w-4" />
                Add Subject
              </Button>
            </div>

            {isDataLoading ? (
              <div className="flex h-48 items-center justify-center gap-3 rounded-lg border">
                <Spinner className="size-5" />
                <span className="text-sm text-muted-foreground">
                  Loading data...
                </span>
              </div>
            ) : filteredSubjects.length === 0 ? (
              <div className="flex h-48 items-center justify-center rounded-lg border">
                  <p className="text-sm text-muted-foreground">
                    {searchQuery.trim()
                      ? "No subjects found."
                      : "You do not have any subjects yet."}
                  </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredSubjects.map((subject) => (
                  <SubjectCard
                    key={subject.subjectId}
                    subject={subject}
                    onView={handleViewRequest}
                    onEdit={handleEditRequest}
                    onDelete={handleDeletePrompt}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {teacherId && (
          <SubjectFormDialog
            mode="create"
            title="Add Subject"
            description="Enter information to create a new subject."
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            defaultValues={baseFormValues}
            onSubmit={handleCreateSubmit}
            isSubmitting={isCreateSubmitting}
          />
        )}

        <SubjectFormDialog
          mode="edit"
          title="Edit Subject"
          description="Update information for the selected subject."
          open={isEditOpen}
          onOpenChange={handleEditOpenChange}
          defaultValues={editFormValues}
          onSubmit={handleEditSubmit}
          isSubmitting={isEditSubmitting}
          isLoadingDetails={isFetchingDetails && !editingSubject}
        />

        <SubjectDetailDialog
          open={isViewOpen}
          onOpenChange={handleViewOpenChange}
          subjectData={viewingSubject}
          isLoading={isViewingDetails && !viewingSubject}
        />

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={handleDeleteDialogChange}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete subject?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently delete the subject{" "}
                <span className="font-medium text-foreground">
                  {deleteTarget?.title ?? ""}
                </span>
                . If the subject has related classes, the operation may fail.
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
    </>
  );
}
