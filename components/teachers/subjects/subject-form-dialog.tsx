"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const subjectFormSchema = z.object({
  teacherId: z.number().int(),
  title: z.string().min(1, "Please enter the subject title."),
  description: z.string().min(1, "Please enter the subject description."),
});

export type SubjectFormValues = z.infer<typeof subjectFormSchema>;

interface SubjectFormDialogProps {
  mode: "create" | "edit";
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues: SubjectFormValues;
  onSubmit: (values: SubjectFormValues) => Promise<void>;
  isSubmitting?: boolean;
  isLoadingDetails?: boolean;
}

export function SubjectFormDialog({
  mode,
  title,
  description,
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
  isSubmitting,
  isLoadingDetails,
}: SubjectFormDialogProps) {
  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues,
  });

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
            Loading subject information...
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
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g.: Geometry 8" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g.: Area, perimeter"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    ? "Create subject"
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
