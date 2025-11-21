"use client";

import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import { Calendar, User, Search, BookOpen } from "lucide-react";
import axios from "axios";

export default function MarketplacePage() {
  const [classes, setClasses] = useState<ClassDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await studentService.getAllAvailableClasses();
        setClasses(data);
      } catch (err) {
        const message = axios.isAxiosError(err)
          ? err.response?.data?.error || err.message
          : "Failed to load classes";
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchClasses();
  }, []);

  const filteredClasses = classes.filter((cls) => {
    const query = searchQuery.toLowerCase();
    return (
      cls.name.toLowerCase().includes(query) ||
      cls.subjectTitle?.toLowerCase().includes(query) ||
      cls.teacherName.toLowerCase().includes(query) ||
      cls.schedule.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-full max-w-sm" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button
          onClick={() => {
            setIsLoading(true);
            setError(null);
            void studentService
              .getAllAvailableClasses()
              .then(setClasses)
              .catch((err) => {
                const message = axios.isAxiosError(err)
                  ? err.response?.data?.error || err.message
                  : "Failed to load classes";
                setError(message);
                toast.error(message);
              })
              .finally(() => setIsLoading(false));
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Class Marketplace</h1>
        <p className="text-muted-foreground">
          Browse all available classes and enroll in the ones that interest you.
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search classes by name, subject, teacher, or schedule..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Classes Grid */}
      {filteredClasses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
            <div className="flex flex-col items-center gap-2 text-center">
              <h3 className="text-lg font-semibold">
                {searchQuery
                  ? "No classes found"
                  : "No classes available"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search terms."
                  : "Check back later for new classes."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredClasses.length} of {classes.length} classes
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClasses.map((cls) => (
              <Card
                key={cls.classId}
                className="flex h-full flex-col transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <CardTitle className="text-lg">{cls.name}</CardTitle>
                      <CardDescription>
                        {cls.subjectTitle || "No subject"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-3">
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Teacher:</span>
                      <span className="font-medium">{cls.teacherName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Schedule:</span>
                      <span className="font-medium">{cls.schedule}</span>
                    </div>
                    {cls.enrolledStudents && cls.enrolledStudents.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Enrolled:</span>
                        <Badge variant="secondary">
                          {cls.enrolledStudents.length} students
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
                <div className="px-6 pb-6">
                  <Button className="w-full" asChild>
                    <Link href={`/student/marketplace/${cls.classId}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

