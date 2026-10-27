/* ═══════════════════════════════════════════════════════════════════════════
   TypeScript types matching Spring Boot backend DTOs & models exactly.
   ═══════════════════════════════════════════════════════════════════════════ */

// ── Enums ──────────────────────────────────────────────────────────────────
export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export type UserRole = 'USER' | 'DOCTOR' | 'ADMIN';

// ── Auth ───────────────────────────────────────────────────────────────────
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  username: string;
  password: string;
  phone: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

// ── Specialty ──────────────────────────────────────────────────────────────
export interface Specialty {
  id: number;
  name: string;
  description: string;
}

export interface SpecialtyRequest {
  name: string;
  description: string;
}

// ── Doctor ──────────────────────────────────────────────────────────────────
export interface DoctorResponse {
  id: number;
  fullName: string;
  specialtyName: string;
  bio: string;
}

export interface DoctorRegistrationRequest {
  specialtyId: number;
  experienceYears: number;
  consultationFees: number;
  bio: string;
  imageUrl: string;
}

export interface DoctorRegistrationResponse {
  id: number;
  userId: number;
  fullName: string;
  specialtyId: number;
  specialtyName: string;
  experienceYears: number;
  consultationFees: number;
  bio: string;
  imageUrl: string;
}

// ── Appointment ────────────────────────────────────────────────────────────
export interface AppointmentRequest {
  doctorId: number;
  appointmentTime: string; // ISO datetime
  reason: string;
}

export interface AppointmentResponse {
  id: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  specialtyName: string;
  appointmentTime: string; // ISO datetime
  reason: string;
  status: AppointmentStatus;
  createdAt: string; // ISO datetime
}

export interface AppointmentStatusRequest {
  status: AppointmentStatus;
}

// ── Medical Notes ──────────────────────────────────────────────────────────
export interface MedicalNoteRequest {
  diagnosis: string;
  prescription: string;
  note: string;
}

export interface MedicalNoteResponse {
  id: number;
  appointmentId: number;
  doctorId: number;
  diagnosis: string;
  prescription: string;
  note: string;
  createdAt: string;
}

// ── Admin ──────────────────────────────────────────────────────────────────
export interface AdminDashboardResponse {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  todayAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
}

export interface DailyAppointmentStatistic {
  date: string; // ISO date
  total: number;
  completed: number;
  cancelled: number;
}

export interface AdminStatisticsResponse {
  appointmentsByStatus: Record<string, number>;
  lastSevenDays: DailyAppointmentStatistic[];
}

// ── Generic API Response ───────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

// ── Auth Store ──────────────────────────────────────────────────────────────
export interface AuthUser {
  username: string;
  role: UserRole;
  accessToken: string;
  refreshToken: string;
}
