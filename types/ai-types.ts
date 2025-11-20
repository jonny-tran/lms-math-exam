// --- AI Configuration DTOs ---
export interface CreateAiConfigRequest {
  teacher_id: number;
  config_name: string;
  model_name?: string;
  temperature?: number;
  max_tokens?: number;
  settings_json?: string;
  is_active?: boolean; // defaults to true if omitted
}

export interface UpdateAiConfigRequest {
  config_name?: string;
  model_name?: string;
  temperature?: number;
  max_tokens?: number;
  settings_json?: string;
  is_active?: boolean;
}

export interface AiConfigDto {
  config_id: number;
  teacher_id: number;
  config_name: string;
  model_name?: string;
  temperature?: number;
  max_tokens?: number;
  settings_json?: string;
  is_active: boolean;
  created_at: string;
}

// --- AI Chat History DTOs ---
export interface CreateAiChatRequest {
  teacher_id: number;
  message: string;
  chat_summary?: string;
}

export interface AiChatDto {
  chat_id: number;
  teacher_id: number;
  message: string;
  chat_summary?: string;
  created_at: string;
}

// --- Quiz Generation DTOs ---
export interface GenerateQuizRequest {
  topic?: string;
  grade?: number;
  difficulty?: string;
  count: number; // defaults to 5
  type?: string; // defaults to "multiple_choice"
  teacher_id?: number;
  student_id?: number;
  config_id?: number;
}

export interface QuizQuestionDto {
  id: string;
  question: string;
  choices: string[];
  answer_index: number;
  explanation?: string;
  topic?: string;
  difficulty?: string;
}

// --- AI Call Log DTOs ---
export interface AiCallLogDto {
  log_id: number;
  config_id: number;
  student_id?: number;
  matrix_id?: number;
  service_name?: string;
  request_text?: string;
  response_text?: string;
  created_at: string;
}

