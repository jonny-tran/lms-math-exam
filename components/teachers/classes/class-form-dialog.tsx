"use client";

import { useEffect, useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SubjectDto } from "@/types/subject";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Spinner } from "@/components/ui/spinner";

const classFormSchema = z
  .object({
    name: z.string().min(1, "Please enter the class name."),
    schedule: z.string().min(1, "Please enter the class schedule."),
    subjectId: z.number().int().min(1, "Please select a subject."),
    teacherId: z.number().int(),
    startDate: z.date({ message: "Please select the start date." }),
    endDate: z.date().nullable(),
  })
  .refine(
    (values) =>
      !values.endDate ||
      (values.startDate &&
        values.endDate.getTime() > values.startDate.getTime()),
    {
      path: ["endDate"],
      message: "End date must be after start date.",
    }
  );

export type ClassFormValues = z.infer<typeof classFormSchema>;

interface ClassFormDialogProps {
  mode: "create" | "edit";
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjects: SubjectDto[];
  defaultValues: ClassFormValues;
  onSubmit: (values: ClassFormValues) => Promise<void>;
  isSubmitting?: boolean;
  isLoadingDetails?: boolean;
  selectedSubjectTitle?: string | null;
  selectedSubjectTeacherId?: number | null;
}

const formatDateLabel = (date: Date | null) => {
  if (!date) {
    return "Select date";
  }

  return format(date, "dd/MM/yyyy");
};

export function ClassFormDialog({
  mode,
  title,
  description,
  open,
  onOpenChange,
  subjects,
  defaultValues,
  onSubmit,
  isSubmitting,
  isLoadingDetails,
  selectedSubjectTitle,
  selectedSubjectTeacherId,
}: ClassFormDialogProps) {
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues,
  });

  const mergedSubjects = useMemo(() => {
    if (!defaultValues.subjectId) {
      return subjects;
    }

    const exists = subjects.some(
      (subject) => subject.subjectId === defaultValues.subjectId
    );

    if (exists) {
      return subjects;
    }

    const fallback: SubjectDto = {
      subjectId: defaultValues.subjectId,
      teacherId: selectedSubjectTeacherId ?? defaultValues.teacherId,
      title:
        selectedSubjectTitle ??
        `Subject #${String(defaultValues.subjectId ?? "").padStart(2, "0")}`,
      description: null,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      teacherName: null,
      classes: [],
    };

    return [fallback, ...subjects];
  }, [
    subjects,
    defaultValues.subjectId,
    defaultValues.teacherId,
    selectedSubjectTeacherId,
    selectedSubjectTitle,
  ]);

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form, open]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {isLoadingDetails ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Spinner className="size-5" />
            Loading class information...
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void handleSubmit(event);
              }}
              className="space-y-4"
            >
              <input
                type="hidden"
                {...form.register("teacherId", { valueAsNumber: true })}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g.: 8A Math - HH" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="schedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g.: Tue-Fri 19:00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select
                      disabled={mergedSubjects.length === 0}
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? String(field.value) : ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mergedSubjects.map((subject) => (
                          <SelectItem
                            key={subject.subjectId}
                            value={String(subject.subjectId)}
                          >
                            {subject.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {formatDateLabel(field.value)}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) =>
                              field.onChange(date ?? field.value)
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? formatDateLabel(field.value)
                                : "Select date"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="p-0">
                          <Calendar
                            mode="single"
                            selected={field.value ?? undefined}
                            onSelect={(date) => field.onChange(date ?? null)}
                            disabled={(date) =>
                              form.getValues("startDate")
                                ? date < form.getValues("startDate")
                                : false
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Saving..."
                    : mode === "create"
                    ? "Create class"
                    : "Update"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
