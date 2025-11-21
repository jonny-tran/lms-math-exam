// --- Enums ---
export enum PaymentMethod {
  Bank = 0,
  Momo = 1,
  Cash = 2,
}

export enum PaymentStatus {
  Pending = 0,
  Completed = 1,
  Failed = 2,
}

// --- DTOs ---
export interface CreatePaymentRequest {
  teacherId: number;
  amount: number;
  teacherName: string;
  description?: string;
}

export interface UpdatePaymentRequest {
  amount?: number;
  method?: PaymentMethod;
  status?: PaymentStatus;
}

export interface PaymentResponseDto {
  paymentId: number;
  teacherId: number;
  teacherName: string;
  amount: number;
  paymentDate: string; // ISO Date String
  method: PaymentMethod | string; // Support both enum and string from API
  status: PaymentStatus | string; // Support both enum and string from API
  description?: string | null;
}

export interface PaymentWithMomoResponse extends PaymentResponseDto {
  momoPaymentUrl: string;
  momoOrderId: string;
}

export interface MomoCallbackResponseModel {
  partnerCode: string;
  accessKey: string;
  requestId: string;
  amount: string;
  orderId: string;
  orderInfo: string;
  orderType: string;
  transId: string;
  message: string;
  localMessage: string;
  responseTime: string;
  errorCode: number;
  payType: string;
  extraData: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  data?: MomoCallbackResponseModel;
  errorCode?: number;
}
