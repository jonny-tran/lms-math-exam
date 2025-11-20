"use client";

import { useCallback, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { aiService } from "@/services/ai-service";
import { AiCallLogDto } from "@/types/ai-types";

interface GetAiCallLogsParams {
  config_id?: number;
  student_id?: number;
}

export const useAiCallLogs = () => {
  const [logs, setLogs] = useState<AiCallLogDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(
    async (params?: GetAiCallLogsParams): Promise<AiCallLogDto[]> => {
      setLoading(true);
      setError(null);

      try {
        const data = await aiService.getAiCallLogs(params);
        setLogs(data);
        return data;
      } catch (err) {
        const message = axios.isAxiosError(err)
          ? (err.response?.data as { error?: string } | undefined)?.error ??
            err.message
          : (err as Error).message;

        setError(message);
        toast.error(message ?? "Failed to fetch AI call logs");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getLogById = useCallback(async (id: number): Promise<AiCallLogDto> => {
    setLoading(true);
    setError(null);

    try {
      const log = await aiService.getAiCallLogById(id);
      return log;
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { error?: string } | undefined)?.error ??
          err.message
        : (err as Error).message;

      setError(message);
      toast.error(message ?? "Failed to fetch AI call log");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteLog = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await aiService.deleteAiCallLog(id);
      setLogs((prev) => prev.filter((log) => log.log_id !== id));
      toast.success("AI call log deleted successfully");
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { error?: string } | undefined)?.error ??
          err.message
        : (err as Error).message;

      setError(message);
      toast.error(message ?? "Failed to delete AI call log");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    logs,
    loading,
    error,
    fetchLogs,
    getLogById,
    deleteLog,
  };
};

