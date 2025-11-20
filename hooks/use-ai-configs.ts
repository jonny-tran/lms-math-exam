"use client";

import { useCallback, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { aiService } from "@/services/ai-service";
import {
  CreateAiConfigRequest,
  UpdateAiConfigRequest,
  AiConfigDto,
} from "@/types/ai-types";

export const useAiConfigs = (teacherId?: number) => {
  const [configs, setConfigs] = useState<AiConfigDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfigs = useCallback(async () => {
    if (!teacherId) {
      setError("Teacher ID is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await aiService.getAiConfigsByTeacher(teacherId);
      setConfigs(data);
      return data;
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { error?: string } | undefined)?.error ??
          err.message
        : (err as Error).message;

      setError(message);
      toast.error(message ?? "Failed to fetch AI configurations");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  const createConfig = useCallback(
    async (payload: CreateAiConfigRequest): Promise<AiConfigDto> => {
      setLoading(true);
      setError(null);

      try {
        const newConfig = await aiService.createAiConfig(payload);
        setConfigs((prev) => [...prev, newConfig]);
        toast.success("AI configuration created successfully");
        return newConfig;
      } catch (err) {
        const message = axios.isAxiosError(err)
          ? (err.response?.data as { error?: string } | undefined)?.error ??
            err.message
          : (err as Error).message;

        setError(message);
        toast.error(message ?? "Failed to create AI configuration");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateConfig = useCallback(
    async (
      id: number,
      payload: UpdateAiConfigRequest
    ): Promise<AiConfigDto> => {
      setLoading(true);
      setError(null);

      try {
        const updatedConfig = await aiService.updateAiConfig(id, payload);
        setConfigs((prev) =>
          prev.map((config) =>
            config.config_id === id ? updatedConfig : config
          )
        );
        toast.success("AI configuration updated successfully");
        return updatedConfig;
      } catch (err) {
        const message = axios.isAxiosError(err)
          ? (err.response?.data as { error?: string } | undefined)?.error ??
            err.message
          : (err as Error).message;

        setError(message);
        toast.error(message ?? "Failed to update AI configuration");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteConfig = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await aiService.deleteAiConfig(id);
      setConfigs((prev) => prev.filter((config) => config.config_id !== id));
      toast.success("AI configuration deleted successfully");
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { error?: string } | undefined)?.error ??
          err.message
        : (err as Error).message;

      setError(message);
      toast.error(message ?? "Failed to delete AI configuration");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getConfigById = useCallback(
    async (id: number): Promise<AiConfigDto> => {
      setLoading(true);
      setError(null);

      try {
        const config = await aiService.getAiConfigById(id);
        return config;
      } catch (err) {
        const message = axios.isAxiosError(err)
          ? (err.response?.data as { error?: string } | undefined)?.error ??
            err.message
          : (err as Error).message;

        setError(message);
        toast.error(message ?? "Failed to fetch AI configuration");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    configs,
    loading,
    error,
    fetchConfigs,
    createConfig,
    updateConfig,
    deleteConfig,
    getConfigById,
  };
};

