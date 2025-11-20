"use client";

import { useCallback, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { aiService } from "@/services/ai-service";
import {
  GenerateQuizRequest,
  QuizQuestionDto,
} from "@/types/ai-types";

export const useQuiz = () => {
  const [questions, setQuestions] = useState<QuizQuestionDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuiz = useCallback(
    async (payload: GenerateQuizRequest): Promise<QuizQuestionDto[]> => {
      setLoading(true);
      setError(null);
      setQuestions([]);

      try {
        const generatedQuestions = await aiService.generateQuiz(payload);
        setQuestions(generatedQuestions);
        toast.success(
          `Successfully generated ${generatedQuestions.length} quiz questions`
        );
        return generatedQuestions;
      } catch (err) {
        const message = axios.isAxiosError(err)
          ? (err.response?.data as { error?: string } | undefined)?.error ??
            err.message
          : (err as Error).message;

        setError(message);
        toast.error(message ?? "Failed to generate quiz questions");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearQuestions = useCallback(() => {
    setQuestions([]);
    setError(null);
  }, []);

  return {
    questions,
    loading,
    error,
    generateQuiz,
    clearQuestions,
  };
};

