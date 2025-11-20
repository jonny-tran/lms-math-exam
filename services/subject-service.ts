import axios from "axios";
import { http } from "@/lib/http";
import {
  SubjectDto,
  CreateSubjectRequest,
  UpdateSubjectRequest,
} from "@/types/subject";

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

const getSubjectById = async (id: number): Promise<SubjectDto> => {
  try {
    const { data } = await http.get<SubjectDto>(`/subjects/${id}`);
    return data;
  } catch (error) {
    throw handleSubjectError(error);
  }
};

const createSubject = async (
  payload: CreateSubjectRequest
): Promise<SubjectDto> => {
  try {
    const { data } = await http.post<SubjectDto>("/subjects", payload);
    return data;
  } catch (error) {
    throw handleSubjectError(error);
  }
};

const updateSubject = async (
  id: number,
  payload: UpdateSubjectRequest
): Promise<SubjectDto> => {
  try {
    const { data } = await http.put<SubjectDto>(`/subjects/${id}`, payload);
    return data;
  } catch (error) {
    throw handleSubjectError(error);
  }
};

const deleteSubject = async (id: number): Promise<void> => {
  try {
    await http.delete(`/subjects/${id}`);
  } catch (error) {
    throw handleSubjectError(error);
  }
};

export const subjectService = {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
};

