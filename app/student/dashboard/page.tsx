"use client";

import { useStudentProfile } from "@/hooks/use-student-profile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { BookOpen, Calendar, User } from "lucide-react";

export default function StudentDashboardPage() {
  const { student, isLoading, error, refresh } = useStudentProfile();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-sm text-muted-foreground">
          {error || "Unable to load student profile."}
        </p>
        <Button onClick={refresh}>Retry</Button>
      </div>
    );
  }

  const enrolledClasses = student.enrolledClasses || [];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Welcome, {student.name}!</h1>
        <p className="text-muted-foreground">
          Here are your enrolled classes. Browse the{" "}
          <Link
            href="/student/marketplace"
            className="text-primary underline hover:no-underline"
          >
            marketplace
          </Link>{" "}
          to discover more classes.
        </p>
      </div>

      {/* My Classes Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">My Classes</h2>
          <Button variant="outline" asChild>
            <Link href="/student/marketplace">Browse Marketplace</Link>
          </Button>
        </div>

        {enrolledClasses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-4 py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
              <div className="flex flex-col items-center gap-2 text-center">
                <h3 className="text-lg font-semibold">
                  No classes enrolled yet
                </h3>
                <p className="text-sm text-muted-foreground">
                  Start exploring the marketplace to find classes that interest
                  you.
                </p>
              </div>
              <Button asChild>
                <Link href="/student/marketplace">Browse Classes</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {enrolledClasses.map((classInfo) => (
              <Card
                key={classInfo.classId}
                className="flex h-full flex-col transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <CardTitle className="text-lg">
                        {classInfo.name}
                      </CardTitle>
                      <CardDescription>
                        {classInfo.subjectTitle}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-3">
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Teacher:</span>
                      <span className="font-medium">
                        {classInfo.teacherName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Schedule:</span>
                      <span className="font-medium">{classInfo.schedule}</span>
                    </div>
                  </div>
                </CardContent>
                <div className="px-6 pb-6">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/student/marketplace/${classInfo.classId}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
