import axios from "axios";
import { http } from "@/lib/http";
import {
  ClassDto,
  CreateClassRequest,
  UpdateClassRequest,
} from "@/types/class";

const handleClassError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    throw error;
  }

  throw error;
};

const getAllClasses = async (): Promise<ClassDto[]> => {
  try {
    const { data } = await http.get<ClassDto[]>("/classes");
    return data;
  } catch (error) {
    throw handleClassError(error);
  }
};

const getClassById = async (id: number): Promise<ClassDto> => {
  try {
    const { data } = await http.get<ClassDto>(`/classes/${id}`);
    return data;
  } catch (error) {
    throw handleClassError(error);
  }
};

const createClass = async (payload: CreateClassRequest): Promise<ClassDto> => {
  try {
    const { data } = await http.post<ClassDto>("/classes", payload);
    return data;
  } catch (error) {
    throw handleClassError(error);
  }
};

const updateClass = async (
  id: number,
  payload: UpdateClassRequest
): Promise<ClassDto> => {
  try {
    const { data } = await http.put<ClassDto>(`/classes/${id}`, payload);
    return data;
  } catch (error) {
    throw handleClassError(error);
  }
};

const deleteClass = async (id: number): Promise<void> => {
  try {
    await http.delete(`/classes/${id}`);
  } catch (error) {
    throw handleClassError(error);
  }
};

export const classService = {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
};
