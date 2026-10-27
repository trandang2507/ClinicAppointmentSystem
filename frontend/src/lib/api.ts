import axios from 'axios';

const API_BASE_URL = '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach JWT token ──────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('mediflow_auth');
    if (stored) {
      try {
        const auth = JSON.parse(stored);
        if (auth.accessToken) {
          config.headers.Authorization = `Bearer ${auth.accessToken}`;
        }
      } catch {
        // invalid JSON, ignore
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 + token refresh ───────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const stored = localStorage.getItem('mediflow_auth');
        if (stored) {
          const auth = JSON.parse(stored);
          const { data: newToken } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken: auth.refreshToken,
          });
          const updated = { ...auth, accessToken: newToken };
          localStorage.setItem('mediflow_auth', JSON.stringify(updated));
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        }
      } catch {
        localStorage.removeItem('mediflow_auth');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth API ───────────────────────────────────────────────────────────────
export const authApi = {
  login: (data: { username: string; password: string }) =>
    api.post('/auth/login', data),
  register: (data: { fullName: string; email: string; username: string; password: string; phone: string }) =>
    api.post('/auth/register', data),
  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),
  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),
};

// ── Appointment API ────────────────────────────────────────────────────────
export const appointmentApi = {
  create: (data: { doctorId: number; appointmentTime: string; reason: string }) =>
    api.post('/appointments', data),
  getMyAppointments: () =>
    api.get('/appointments/my'),
  getById: (id: number) =>
    api.get(`/appointments/${id}`),
  cancel: (id: number) =>
    api.put(`/appointments/${id}/cancel`),
};

// ── Doctor Appointment API ─────────────────────────────────────────────────
export const doctorAppointmentApi = {
  getAppointments: () =>
    api.get('/doctor/appointments'),
  confirm: (id: number) =>
    api.put(`/doctor/appointments/${id}/confirm`),
  updateStatus: (id: number, data: { status: string }) =>
    api.put(`/doctor/appointments/${id}/status`, data),
  addMedicalNote: (id: number, data: { diagnosis: string; prescription: string; note: string }) =>
    api.post(`/doctor/appointments/${id}/medical-notes`, data),
};

// ── Doctor API ─────────────────────────────────────────────────────────────
export const doctorApi = {
  getAll: (specialtyId?: number) =>
    api.get('/doctors', { params: specialtyId ? { specialtyId } : {} }),
  getById: (id: number) =>
    api.get(`/doctors/${id}`),
  getAvailableSlots: (doctorId: number, date: string) =>
    api.get(`/doctors/${doctorId}/available-slots`, { params: { date } }),
};

// ── Specialty API ──────────────────────────────────────────────────────────
export const specialtyApi = {
  getAll: () =>
    api.get('/specialties'),
  getById: (id: number) =>
    api.get(`/specialties/${id}`),
  create: (data: { name: string; description: string }) =>
    api.post('/specialties', data),
  update: (id: number, data: { name: string; description: string }) =>
    api.put(`/specialties/${id}`, data),
  delete: (id: number) =>
    api.delete(`/specialties/${id}`),
};

// ── Admin API ──────────────────────────────────────────────────────────────
export const adminApi = {
  getDashboard: () =>
    api.get('/admin/dashboard'),
  getAppointments: () =>
    api.get('/admin/appointments'),
  getStatistics: () =>
    api.get('/admin/statistics'),
  registerDoctor: (data: {
    specialtyId: number;
    experienceYears: number;
    consultationFees: number;
    bio: string;
    imageUrl: string;
  }) => api.post('/admin/register', data),
};
