"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStudentProfile } from "@/hooks/use-student-profile";
import { studentService } from "@/services/student-service";
import { ClassDto } from "@/types/student-types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowLeft, Calendar, User, Clock, Users } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { format } from "date-fns";

export default function ClassDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const classId = Number(params.id);
  const {
    student,
    isLoading: studentLoading,
    refresh: refreshStudent,
  } = useStudentProfile();

  const [classData, setClassData] = useState<ClassDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNaN(classId)) {
      setError("Invalid class ID");
      setIsLoading(false);
      return;
    }

    const fetchClassDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await studentService.getClassDetails(classId);
        setClassData(data);
      } catch (err) {
        const message = axios.isAxiosError(err)
          ? err.response?.data?.error || err.message
          : "Failed to load class details";
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchClassDetails();
  }, [classId]);

  const isEnrolled = student?.enrolledClasses?.some(
    (cls) => cls.classId === classId
  );

  const handleEnroll = async () => {
    if (!student) {
      toast.error("Please wait for your profile to load.");
      return;
    }

    setIsEnrolling(true);
    try {
      await studentService.enrollStudent(student.studentId, classId);
      toast.success("Successfully enrolled in class!");
      // Refresh student profile to get updated enrolled classes
      await refreshStudent();
      // Optionally refresh class details to show updated enrollment count
      if (classData) {
        const updated = await studentService.getClassDetails(classId);
        setClassData(updated);
      }
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error ||
          err.response?.data?.message ||
          err.message
        : "Failed to enroll in class";
      toast.error(message);
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleUnenroll = async () => {
    if (!student) {
      toast.error("Please wait for your profile to load.");
      return;
    }

    if (
      !confirm(
        "Are you sure you want to drop this class? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsEnrolling(true);
    try {
      await studentService.unenrollStudent(student.studentId, classId);
      toast.success("Successfully dropped class!");
      // Refresh student profile
      await refreshStudent();
      // Optionally refresh class details
      if (classData) {
        const updated = await studentService.getClassDetails(classId);
        setClassData(updated);
      }
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error ||
          err.response?.data?.message ||
          err.message
        : "Failed to drop class";
      toast.error(message);
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading || studentLoading) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-96" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-sm text-muted-foreground">
          {error || "Class not found"}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button
            onClick={() => {
              if (!isNaN(classId)) {
                setIsLoading(true);
                setError(null);
                void studentService
                  .getClassDetails(classId)
                  .then(setClassData)
                  .catch((err) => {
                    const message = axios.isAxiosError(err)
                      ? err.response?.data?.error || err.message
                      : "Failed to load class details";
                    setError(message);
                    toast.error(message);
                  })
                  .finally(() => setIsLoading(false));
              }
            }}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Back Button */}
      <Button variant="ghost" asChild className="w-fit">
        <Link href="/student/marketplace">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Marketplace
        </Link>
      </Button>

      {/* Class Details Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <CardTitle className="text-2xl">{classData.name}</CardTitle>
              <CardDescription className="text-base">
                {classData.subjectTitle || "No subject"}
              </CardDescription>
            </div>
            {isEnrolled && (
              <Badge variant="default" className="shrink-0">
                Enrolled
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Class Information */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Teacher</span>
                <span className="font-medium">{classData.teacherName}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Schedule</span>
                <span className="font-medium">{classData.schedule}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">
                  Start Date
                </span>
                <span className="font-medium">
                  {classData.startDate
                    ? format(new Date(classData.startDate), "PPp")
                    : "Not set"}
                </span>
              </div>
            </div>

            {classData.endDate && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    End Date
                  </span>
                  <span className="font-medium">
                    {format(new Date(classData.endDate), "PPp")}
                  </span>
                </div>
              </div>
            )}

            {classData.enrolledStudents &&
              classData.enrolledStudents.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      Enrolled Students
                    </span>
                    <span className="font-medium">
                      {classData.enrolledStudents.length} student
                      {classData.enrolledStudents.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            {isEnrolled ? (
              <Button
                variant="destructive"
                onClick={handleUnenroll}
                disabled={isEnrolling || !student}
                className="w-full md:w-auto"
              >
                {isEnrolling ? "Dropping..." : "Drop Class"}
              </Button>
            ) : (
              <Button
                onClick={handleEnroll}
                disabled={isEnrolling || !student}
                className="w-full md:w-auto"
              >
                {isEnrolling ? "Enrolling..." : "Enroll Now"}
              </Button>
            )}
            <Button variant="outline" asChild className="w-full md:w-auto">
              <Link href="/student/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
