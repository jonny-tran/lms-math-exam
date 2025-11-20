"use client";

import { useCallback, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { aiService } from "@/services/ai-service";
import { CreateAiChatRequest, AiChatDto } from "@/types/ai-types";

export const useAiChats = (teacherId?: number) => {
  const [chats, setChats] = useState<AiChatDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChats = useCallback(async () => {
    if (!teacherId) {
      setError("Teacher ID is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await aiService.getAiChatsByTeacher(teacherId);
      setChats(data);
      return data;
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { error?: string } | undefined)?.error ??
          err.message
        : (err as Error).message;

      setError(message);
      toast.error(message ?? "Failed to fetch chat history");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  const createChat = useCallback(
    async (payload: CreateAiChatRequest): Promise<AiChatDto> => {
      setLoading(true);
      setError(null);

      try {
        const newChat = await aiService.createAiChat(payload);
        setChats((prev) => [newChat, ...prev]);
        toast.success("Chat session created successfully");
        return newChat;
      } catch (err) {
        const message = axios.isAxiosError(err)
          ? (err.response?.data as { error?: string } | undefined)?.error ??
            err.message
          : (err as Error).message;

        setError(message);
        toast.error(message ?? "Failed to create chat session");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteChat = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await aiService.deleteAiChat(id);
      setChats((prev) => prev.filter((chat) => chat.chat_id !== id));
      toast.success("Chat session deleted successfully");
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { error?: string } | undefined)?.error ??
          err.message
        : (err as Error).message;

      setError(message);
      toast.error(message ?? "Failed to delete chat session");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getChatById = useCallback(async (id: number): Promise<AiChatDto> => {
    setLoading(true);
    setError(null);

    try {
      const chat = await aiService.getAiChatById(id);
      return chat;
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { error?: string } | undefined)?.error ??
          err.message
        : (err as Error).message;

      setError(message);
      toast.error(message ?? "Failed to fetch chat");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    chats,
    loading,
    error,
    fetchChats,
    createChat,
    deleteChat,
    getChatById,
  };
};

