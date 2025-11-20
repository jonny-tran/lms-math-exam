import axios from "axios";
import { http } from "@/lib/http";
import { SubjectDto } from "@/types/subject";

const handleSubjectError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    throw error;
  }

  throw error;
};

const getAllSubjects = async (): Promise<SubjectDto[]> => {
  try {
    const { data } = await http.get<SubjectDto[]>("/subjects");
    return data;
  } catch (error) {
    throw handleSubjectError(error);
  }
};

export const subjectService = {
  getAllSubjects,
};

