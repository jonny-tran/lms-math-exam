import { ClassSummaryDto } from "./class";

export interface SubjectSummaryDto {
  subjectId: number;
  title: string;
}

export interface SubjectDto {
  subjectId: number;
  teacherId: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string | null;
  teacherName: string;
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
