import axios from "axios";
import { http } from "@/lib/http";
import {
  CreateAiConfigRequest,
  UpdateAiConfigRequest,
  AiConfigDto,
  CreateAiChatRequest,
  AiChatDto,
  GenerateQuizRequest,
  QuizQuestionDto,
  AiCallLogDto,
} from "@/types/ai-types";

const handleAiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    throw error;
  }

  throw error;
};

// ==================== AI Configurations ====================

/**
 * Creates a new AI configuration profile for a specific teacher
 */
const createAiConfig = async (
  payload: CreateAiConfigRequest
): Promise<AiConfigDto> => {
  try {
    const { data } = await http.post<AiConfigDto>("/ai-configs", payload);
    return data;
  } catch (error) {
    throw handleAiError(error);
  }
};

/**
 * Retrieves a list of all AI configurations created by a specific teacher
 */
const getAiConfigsByTeacher = async (
  teacherId: number
): Promise<AiConfigDto[]> => {
  try {
    const { data } = await http.get<AiConfigDto[]>("/ai-configs", {
      params: { teacher_id: teacherId },
    });
    return data;
  } catch (error) {
    throw handleAiError(error);
  }
};

/**
 * Retrieves the details of a specific AI configuration by its ID
 */
const getAiConfigById = async (id: number): Promise<AiConfigDto> => {
  try {
    const { data } = await http.get<AiConfigDto>(`/ai-configs/${id}`);
    return data;
  } catch (error) {
    throw handleAiError(error);
  }
};

/**
 * Updates an existing AI configuration
 */
const updateAiConfig = async (
  id: number,
  payload: UpdateAiConfigRequest
): Promise<AiConfigDto> => {
  try {
    const { data } = await http.put<AiConfigDto>(`/ai-configs/${id}`, payload);
    return data;
  } catch (error) {
    throw handleAiError(error);
  }
};

/**
 * Permanently removes an AI configuration
 */
const deleteAiConfig = async (id: number): Promise<void> => {
  try {
    await http.delete(`/ai-configs/${id}`);
  } catch (error) {
    throw handleAiError(error);
  }
};

// ==================== AI Chat History ====================

/**
 * Initiates or records a new chat session between a teacher and the AI
 */
const createAiChat = async (
  payload: CreateAiChatRequest
): Promise<AiChatDto> => {
  try {
    const { data } = await http.post<AiChatDto>("/ai-history-chats", payload);
    return data;
  } catch (error) {
    throw handleAiError(error);
  }
};

/**
 * Retrieves the history of AI chat sessions for a specific teacher
 */
const getAiChatsByTeacher = async (
  teacherId: number
): Promise<AiChatDto[]> => {
  try {
    const { data } = await http.get<AiChatDto[]>("/ai-history-chats", {
      params: { teacher_id: teacherId },
    });
    return data;
  } catch (error) {
    throw handleAiError(error);
  }
};

/**
 * Retrieves a specific chat log by ID
 */
const getAiChatById = async (id: number): Promise<AiChatDto> => {
  try {
    const { data } = await http.get<AiChatDto>(`/ai-history-chats/${id}`);
    return data;
  } catch (error) {
    throw handleAiError(error);
  }
};

/**
 * Marks a chat session as deleted without removing it from the database (Soft Delete)
 */
const deleteAiChat = async (id: number): Promise<void> => {
  try {
    await http.delete(`/ai-history-chats/${id}`);
  } catch (error) {
    throw handleAiError(error);
  }
};

// ==================== Quiz Generation ====================

/**
 * Uses AI to generate a list of quiz questions based on provided topics, difficulty, and grade level
 */
const generateQuiz = async (
  payload: GenerateQuizRequest
): Promise<QuizQuestionDto[]> => {
  try {
    const { data } = await http.post<QuizQuestionDto[]>("/quiz", payload);
    return data;
  } catch (error) {
    throw handleAiError(error);
  }
};

// ==================== AI Call Logs ====================

/**
 * Retrieves logs of AI interactions, useful for auditing or debugging usage
 * Can be filtered by configuration or student
 */
const getAiCallLogs = async (params?: {
  config_id?: number;
  student_id?: number;
}): Promise<AiCallLogDto[]> => {
  try {
    const { data } = await http.get<AiCallLogDto[]>("/ai-call-logs", {
      params,
    });
    return data;
  } catch (error) {
    throw handleAiError(error);
  }
};

/**
 * Retrieves a specific AI call log
 */
const getAiCallLogById = async (id: number): Promise<AiCallLogDto> => {
  try {
    const { data } = await http.get<AiCallLogDto>(`/ai-call-logs/${id}`);
    return data;
  } catch (error) {
    throw handleAiError(error);
  }
};

/**
 * Marks a log entry as deleted (Soft Delete)
 */
const deleteAiCallLog = async (id: number): Promise<void> => {
  try {
    await http.delete(`/ai-call-logs/${id}`);
  } catch (error) {
    throw handleAiError(error);
  }
};

// ==================== Export Service ====================

export const aiService = {
  // AI Configurations
  createAiConfig,
  getAiConfigsByTeacher,
  getAiConfigById,
  updateAiConfig,
  deleteAiConfig,

  // AI Chat History
  createAiChat,
  getAiChatsByTeacher,
  getAiChatById,
  deleteAiChat,

  // Quiz Generation
  generateQuiz,

  // AI Call Logs
  getAiCallLogs,
  getAiCallLogById,
  deleteAiCallLog,
};

