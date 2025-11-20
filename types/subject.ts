import { ClassSummaryDto } from "./class";

export interface SubjectSummaryDto {
  subjectId: number;
  title: string;
}

export interface SubjectDto {
  subjectId: number;
  teacherId: number;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string | null;
  teacherName: string | null;
  classes?: ClassSummaryDto[];
}

export interface CreateSubjectRequest {
  teacherId: number;
  title: string;
  description: string;
}

export interface UpdateSubjectRequest {
  teacherId: number;
  title: string;
  description: string;
}
