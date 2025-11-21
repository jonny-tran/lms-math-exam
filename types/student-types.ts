export enum StudentStatus {
  Active = 0,
  Suspended = 1,
}

export interface ClassInfoDto {
  classId: number;
  name: string;
  subjectTitle: string;
  teacherName: string;
  schedule: string;
}

export interface StudentDto {
  studentId: number;
  userId: number;
  name: string;
  username: string;
  email: string;
  major: string;
  enrollmentDate: string; // ISO Date
  status: StudentStatus;
  enrolledClasses: ClassInfoDto[]; // <--- Source for "My Classes"
}

export interface CreateStudentRequest {
  userId: number;
  name: string;
  major: string;
  classId?: number;
}

export interface UpdateStudentRequest {
  name?: string;
  major?: string;
  classId?: number;
  status?: StudentStatus;
  enrollmentDate?: string;
}

// Note: ClassDto from /api/Class endpoint matches the structure in types/class.ts
// We can reuse ClassDto from class.ts for consistency
export type { ClassDto } from "./class";
