import axios from "axios";
import { http } from "@/lib/http";
import { MeResponse } from "@/types/auth";
import {
  CreateTeacherProfileRequest,
  TeacherDto,
} from "@/types/teacher";

const handleTeacherError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    throw error;
  }

  throw error;
};

const getAllTeachers = async (): Promise<TeacherDto[]> => {
  try {
    const { data } = await http.get<TeacherDto[]>("/teachers");
    return data;
  } catch (error) {
    throw handleTeacherError(error);
  }
};

const createTeacherProfile = async (
  payload: CreateTeacherProfileRequest
): Promise<TeacherDto> => {
  try {
    const { data } = await http.post<TeacherDto>("/teachers", payload);
    return data;
  } catch (error) {
    throw handleTeacherError(error);
  }
};

const getMe = async (): Promise<MeResponse> => {
  try {
    const { data } = await http.get<MeResponse>("/api/Auth/me");
    return data;
  } catch (error) {
    throw handleTeacherError(error);
  }
};

export const teacherService = {
  getAllTeachers,
  createTeacherProfile,
  getMe,
};

