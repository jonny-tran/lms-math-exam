import axios from "axios";
import { http } from "@/lib/http";
import {
  CreatePaymentRequest,
  UpdatePaymentRequest,
  PaymentResponseDto,
  PaymentWithMomoResponse,
  VerifyPaymentResponse,
  PaymentStatus,
} from "@/types/payment-types";

const handlePaymentError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    throw error;
  }
  throw error;
};

// ==================== Payment Management ====================

/**
 * Creates a payment record and initiates MoMo payment
 * Returns payment URL for redirect
 */
const createPayment = async (
  payload: CreatePaymentRequest
): Promise<PaymentWithMomoResponse> => {
  try {
    const { data } = await http.post<PaymentWithMomoResponse>(
      "/payments",
      payload
    );
    return data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

/**
 * Verifies payment callback from MoMo
 * Accepts query parameters from MoMo redirect URL
 */
const verifyPaymentCallback = async (
  queryParams: URLSearchParams | string
): Promise<VerifyPaymentResponse> => {
  try {
    // If queryParams is a string (full URL), extract search params
    const params =
      typeof queryParams === "string"
        ? new URLSearchParams(new URL(queryParams).search)
        : queryParams;

    const { data } = await http.get<VerifyPaymentResponse>(
      "/payments/callback",
      {
        params: Object.fromEntries(params),
      }
    );
    return data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

/**
 * Retrieves details of a specific payment
 */
const getPaymentById = async (id: number): Promise<PaymentResponseDto> => {
  try {
    const { data } = await http.get<PaymentResponseDto>(`/payments/${id}`);
    return data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

/**
 * Retrieves all payments in the system
 */
const getAllPayments = async (): Promise<PaymentResponseDto[]> => {
  try {
    const { data } = await http.get<PaymentResponseDto[]>("/payments");
    return data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

/**
 * Retrieves payment history for a specific teacher
 */
const getPaymentsByTeacher = async (
  teacherId: number
): Promise<PaymentResponseDto[]> => {
  try {
    const { data } = await http.get<PaymentResponseDto[]>(
      `/payments/by-teacher/${teacherId}`
    );
    return data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

/**
 * Filters payments by status
 */
const getPaymentsByStatus = async (
  status: PaymentStatus
): Promise<PaymentResponseDto[]> => {
  try {
    const { data } = await http.get<PaymentResponseDto[]>(
      `/payments/by-status/${status}`
    );
    return data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

/**
 * Updates general details of a payment
 */
const updatePayment = async (
  id: number,
  payload: UpdatePaymentRequest
): Promise<PaymentResponseDto> => {
  try {
    const { data } = await http.put<PaymentResponseDto>(
      `/payments/${id}`,
      payload
    );
    return data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

/**
 * Quickly changes the status of a payment
 */
const updatePaymentStatus = async (
  id: number,
  status: PaymentStatus
): Promise<{ message: string; payment: PaymentResponseDto }> => {
  try {
    const { data } = await http.patch<{
      message: string;
      payment: PaymentResponseDto;
    }>(`/payments/${id}/status`, status);
    return data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

/**
 * Removes a payment record
 */
const deletePayment = async (id: number): Promise<void> => {
  try {
    await http.delete(`/payments/${id}`);
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// ==================== Export Service ====================

export const paymentService = {
  createPayment,
  verifyPaymentCallback,
  getPaymentById,
  getAllPayments,
  getPaymentsByTeacher,
  getPaymentsByStatus,
  updatePayment,
  updatePaymentStatus,
  deletePayment,
};

