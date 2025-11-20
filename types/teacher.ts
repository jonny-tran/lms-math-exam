import { ClassSummaryDto } from "./class";
import { SubjectSummaryDto } from "./subject";

export interface TeacherDto {
  teacherId: number;
  userId: number;
  name: string;
  username: string;
  email: string | null;
  bio: string;
  hireDate: string;
  department: string;
  status: number;
  subjects: SubjectSummaryDto[];
  classes: ClassSummaryDto[];
}

export interface CreateTeacherProfileRequest {
  userId: number;
  name: string;
  bio: string;
  hireDate: string;
  department: string;
}
