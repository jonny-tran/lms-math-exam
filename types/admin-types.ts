import { SubjectDto } from "./subject";
import { ClassDto } from "./class";
import { ClassInfoDto } from "./student-types";

// --- Enums ---
export enum StudentStatus {
  Active = 0,
  Suspended = 1,
}

export enum TeacherStatus {
  Pending = 0,
  Active = 1,
  Suspended = 2,
}

// --- DTOs ---
export interface StudentDto {
  studentId: number;
  userId: number;
  name: string;
  username: string;
  email: string;
  major: string;
  enrollmentDate: string; // ISO Date
  status: StudentStatus;
  enrolledClasses?: ClassInfoDto[];
}

export interface TeacherDto {
  teacherId: number;
  userId: number;
  name: string;
  username: string;
  email: string;
  bio?: string;
  hireDate: string; // ISO Date
  department?: string;
  status: TeacherStatus;
  subjects?: SubjectDto[];
  classes?: ClassDto[];
}

// --- Request Bodies ---
export interface UpdateStudentStatusRequest {
  status: StudentStatus;
}

export interface UpdateTeacherStatusRequest {
  status: TeacherStatus;
}
