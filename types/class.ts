export interface ClassEnrollmentDto {
  studentId?: number;
  name?: string | null;
  username?: string | null;
  email?: string | null;
  enrolledAt?: string | null;
  [key: string]: unknown;
}

export interface ClassSummaryDto {
  classId: number;
  name: string;
  schedule: string;
  startDate: string;
  endDate: string | null;
}

export interface ClassDto extends ClassSummaryDto {
  subjectId: number;
  teacherId: number;
  createdAt: string;
  subjectTitle: string | null;
  teacherName: string;
  enrolledStudents: ClassEnrollmentDto[];
}

export interface CreateClassRequest {
  subjectId: number;
  teacherId: number;
  name: string;
  schedule: string;
  startDate: string;
  endDate: string | null;
}

export type UpdateClassRequest = CreateClassRequest;
