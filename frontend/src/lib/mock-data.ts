import {
  type AppointmentResponse,
  AppointmentStatus,
  type DoctorResponse,
  type Specialty,
  type AdminDashboardResponse,
  type AdminStatisticsResponse,
  type MedicalNoteResponse,
} from '@/types';

// ── Specialties ────────────────────────────────────────────────────────────
export const MOCK_SPECIALTIES: Specialty[] = [
  { id: 1, name: 'Tim Mạch', description: 'Khoa chuyên điều trị các bệnh về tim mạch, huyết áp, và hệ tuần hoàn' },
  { id: 2, name: 'Da Liễu', description: 'Chẩn đoán và điều trị các bệnh về da, tóc, và móng' },
  { id: 3, name: 'Nhi Khoa', description: 'Chăm sóc sức khỏe trẻ em từ sơ sinh đến 16 tuổi' },
  { id: 4, name: 'Thần Kinh', description: 'Điều trị các bệnh về hệ thần kinh trung ương và ngoại biên' },
  { id: 5, name: 'Nội Tổng Quát', description: 'Khám và tư vấn sức khỏe tổng quát, nội khoa' },
  { id: 6, name: 'Mắt', description: 'Khám và điều trị các bệnh về mắt và thị lực' },
  { id: 7, name: 'Tai Mũi Họng', description: 'Chẩn đoán và điều trị bệnh lý tai, mũi, họng' },
  { id: 8, name: 'Chỉnh Hình', description: 'Điều trị các bệnh lý về xương khớp, cơ và dây chằng' },
];

// ── Doctors ────────────────────────────────────────────────────────────────
export const MOCK_DOCTORS: (DoctorResponse & { experienceYears: number; consultationFees: number; imageUrl?: string })[] = [
  { id: 1, fullName: 'BS. CKI Nguyễn Văn An', specialtyName: 'Tim Mạch', bio: 'Hơn 15 năm kinh nghiệm trong lĩnh vực tim mạch can thiệp. Tốt nghiệp Đại học Y Dược TP.HCM.', experienceYears: 15, consultationFees: 350000 },
  { id: 2, fullName: 'BS. CKII Trần Thị Bích Ngọc', specialtyName: 'Da Liễu', bio: 'Chuyên gia da liễu thẩm mỹ, nhiều năm công tác tại Bệnh viện Da Liễu TP.HCM.', experienceYears: 12, consultationFees: 400000 },
  { id: 3, fullName: 'TS.BS Lê Minh Tuấn', specialtyName: 'Nhi Khoa', bio: 'Tiến sĩ Y khoa chuyên ngành Nhi. Phó khoa Nhi Bệnh viện Nhi Đồng 1.', experienceYears: 20, consultationFees: 500000 },
  { id: 4, fullName: 'BS. CKI Phạm Hoàng Dũng', specialtyName: 'Thần Kinh', bio: 'Chuyên gia về thần kinh học, đặc biệt trong chẩn đoán và điều trị đau đầu mãn tính.', experienceYears: 10, consultationFees: 380000 },
  { id: 5, fullName: 'PGS.TS Vũ Thị Mai Lan', specialtyName: 'Nội Tổng Quát', bio: 'Phó Giáo sư Tiến sĩ chuyên ngành Nội khoa tổng quát, hơn 25 năm kinh nghiệm lâm sàng.', experienceYears: 25, consultationFees: 450000 },
  { id: 6, fullName: 'BS. CKI Hoàng Đức Thắng', specialtyName: 'Mắt', bio: 'Bác sĩ chuyên khoa Mắt, kinh nghiệm phẫu thuật Phaco và điều trị bệnh lý võng mạc.', experienceYears: 8, consultationFees: 320000 },
  { id: 7, fullName: 'BS. CKII Đỗ Thị Hồng Nhung', specialtyName: 'Tai Mũi Họng', bio: 'Chuyên gia phẫu thuật nội soi xoang và điều trị viêm tai giữa mãn tính.', experienceYears: 14, consultationFees: 360000 },
  { id: 8, fullName: 'BS. CKI Bùi Quang Huy', specialtyName: 'Chỉnh Hình', bio: 'Chuyên khoa chấn thương chỉnh hình, phẫu thuật nội soi khớp gối, khớp vai.', experienceYears: 11, consultationFees: 400000 },
];

// ── Available time slots ───────────────────────────────────────────────────
export const MOCK_TIME_SLOTS: string[] = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '13:30', '14:00', '14:30', '15:00',
  '15:30', '16:00', '16:30',
];

// ── Appointments ───────────────────────────────────────────────────────────
const now = new Date();
const today = now.toISOString().split('T')[0];
const tomorrow = new Date(now.getTime() + 86400000).toISOString().split('T')[0];

export const MOCK_APPOINTMENTS: AppointmentResponse[] = [
  {
    id: 1001,
    patientId: 10,
    patientName: 'Nguyễn Minh Khôi',
    doctorId: 1,
    doctorName: 'BS. CKI Nguyễn Văn An',
    specialtyName: 'Tim Mạch',
    appointmentTime: `${today}T09:00:00`,
    reason: 'Khám tổng quát định kỳ, kiểm tra huyết áp',
    status: AppointmentStatus.CONFIRMED,
    createdAt: `${today}T07:30:00`,
  },
  {
    id: 1002,
    patientId: 11,
    patientName: 'Trần Thị Thu Hà',
    doctorId: 2,
    doctorName: 'BS. CKII Trần Thị Bích Ngọc',
    specialtyName: 'Da Liễu',
    appointmentTime: `${today}T10:30:00`,
    reason: 'Tái khám mụn trứng cá, theo dõi điều trị',
    status: AppointmentStatus.PENDING,
    createdAt: `${today}T06:15:00`,
  },
  {
    id: 1003,
    patientId: 12,
    patientName: 'Lê Quốc Bảo',
    doctorId: 3,
    doctorName: 'TS.BS Lê Minh Tuấn',
    specialtyName: 'Nhi Khoa',
    appointmentTime: `${today}T14:00:00`,
    reason: 'Bé bị sốt cao 3 ngày, ho kéo dài',
    status: AppointmentStatus.CONFIRMED,
    createdAt: `${today}T08:00:00`,
  },
  {
    id: 1004,
    patientId: 13,
    patientName: 'Phạm Anh Thư',
    doctorId: 1,
    doctorName: 'BS. CKI Nguyễn Văn An',
    specialtyName: 'Tim Mạch',
    appointmentTime: `${today}T15:30:00`,
    reason: 'Đau ngực khi gắng sức, khó thở',
    status: AppointmentStatus.CHECKED_IN,
    createdAt: `${today}T09:20:00`,
  },
  {
    id: 1005,
    patientId: 14,
    patientName: 'Võ Đình Trung',
    doctorId: 5,
    doctorName: 'PGS.TS Vũ Thị Mai Lan',
    specialtyName: 'Nội Tổng Quát',
    appointmentTime: `${tomorrow}T09:30:00`,
    reason: 'Khám sức khỏe hàng năm, xét nghiệm máu',
    status: AppointmentStatus.PENDING,
    createdAt: `${today}T10:45:00`,
  },
  {
    id: 1006,
    patientId: 15,
    patientName: 'Đặng Thị Hương Giang',
    doctorId: 4,
    doctorName: 'BS. CKI Phạm Hoàng Dũng',
    specialtyName: 'Thần Kinh',
    appointmentTime: `${today}T08:30:00`,
    reason: 'Đau đầu migraine tái phát thường xuyên',
    status: AppointmentStatus.COMPLETED,
    createdAt: new Date(now.getTime() - 86400000 * 2).toISOString(),
  },
  {
    id: 1007,
    patientId: 16,
    patientName: 'Huỳnh Thanh Phong',
    doctorId: 6,
    doctorName: 'BS. CKI Hoàng Đức Thắng',
    specialtyName: 'Mắt',
    appointmentTime: new Date(now.getTime() - 86400000).toISOString().split('T')[0] + 'T11:00:00',
    reason: 'Kiểm tra thị lực, khám mắt định kỳ',
    status: AppointmentStatus.CANCELLED,
    createdAt: new Date(now.getTime() - 86400000 * 3).toISOString(),
  },
  {
    id: 1008,
    patientId: 17,
    patientName: 'Mai Thị Tuyết Nhung',
    doctorId: 7,
    doctorName: 'BS. CKII Đỗ Thị Hồng Nhung',
    specialtyName: 'Tai Mũi Họng',
    appointmentTime: `${tomorrow}T14:30:00`,
    reason: 'Viêm xoang mãn tính, nghẹt mũi kéo dài',
    status: AppointmentStatus.PENDING,
    createdAt: `${today}T11:30:00`,
  },
];

// ── Medical Notes ──────────────────────────────────────────────────────────
export const MOCK_MEDICAL_NOTES: MedicalNoteResponse[] = [
  {
    id: 1,
    appointmentId: 1006,
    doctorId: 4,
    diagnosis: 'Migraine không có aura, tần suất 3-4 lần/tháng',
    prescription: 'Sumatriptan 50mg khi có cơn, Topiramate 25mg x 2 lần/ngày dự phòng',
    note: 'Bệnh nhân cần tránh stress, ngủ đủ giấc. Tái khám sau 4 tuần.',
    createdAt: `${today}T09:15:00`,
  },
];

// ── Admin Dashboard ────────────────────────────────────────────────────────
export const MOCK_ADMIN_DASHBOARD: AdminDashboardResponse = {
  totalPatients: 1247,
  totalDoctors: 38,
  totalAppointments: 8563,
  todayAppointments: 42,
  pendingAppointments: 15,
  confirmedAppointments: 18,
  completedAppointments: 7,
  cancelledAppointments: 2,
};

// ── Admin Statistics ───────────────────────────────────────────────────────
export const MOCK_ADMIN_STATISTICS: AdminStatisticsResponse = {
  appointmentsByStatus: {
    PENDING: 15,
    CONFIRMED: 18,
    CHECKED_IN: 3,
    COMPLETED: 7,
    CANCELLED: 2,
  },
  lastSevenDays: Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getTime() - (6 - i) * 86400000);
    const total = Math.floor(Math.random() * 25) + 20;
    const completed = Math.floor(total * (0.5 + Math.random() * 0.3));
    const cancelled = Math.floor(Math.random() * 5);
    return {
      date: d.toISOString().split('T')[0],
      total,
      completed,
      cancelled,
    };
  }),
};

// ── Notifications ──────────────────────────────────────────────────────────
export interface MockNotification {
  id: string;
  title: string;
  message: string;
  type: 'appointment_created' | 'status_changed' | 'cancelled' | 'reminder';
  read: boolean;
  createdAt: string;
}

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: 'n1',
    title: 'Lịch hẹn được xác nhận',
    message: 'Lịch khám Tim Mạch với BS. Nguyễn Văn An lúc 09:00 ngày mai đã được xác nhận.',
    type: 'status_changed',
    read: false,
    createdAt: new Date(now.getTime() - 600000).toISOString(),
  },
  {
    id: 'n2',
    title: 'Lịch hẹn mới',
    message: 'Bạn có lịch hẹn mới khám Da Liễu lúc 10:30 hôm nay.',
    type: 'appointment_created',
    read: false,
    createdAt: new Date(now.getTime() - 3600000).toISOString(),
  },
  {
    id: 'n3',
    title: 'Nhắc lịch khám',
    message: 'Bạn có lịch khám Nội Tổng Quát ngày mai lúc 09:30. Đừng quên nhé!',
    type: 'reminder',
    read: true,
    createdAt: new Date(now.getTime() - 7200000).toISOString(),
  },
  {
    id: 'n4',
    title: 'Lịch hẹn bị huỷ',
    message: 'Lịch khám Mắt ngày 26/10 đã bị huỷ. Vui lòng đặt lịch lại.',
    type: 'cancelled',
    read: true,
    createdAt: new Date(now.getTime() - 86400000).toISOString(),
  },
];
