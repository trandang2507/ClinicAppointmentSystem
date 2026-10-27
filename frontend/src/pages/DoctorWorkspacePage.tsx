import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  CheckCircle2,
  Clock3,
  UserCheck,
  XCircle,
  FileEdit,
  Save,
  Pill,
  Sparkles,
  Search,
  Filter,
  AlertCircle,
  ChevronRight,
  ClipboardList,
} from 'lucide-react';
import { MOCK_APPOINTMENTS, MOCK_MEDICAL_NOTES } from '@/lib/mock-data';
import { AppointmentStatus, type AppointmentResponse, type MedicalNoteResponse } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate, formatTime, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export function DoctorWorkspacePage() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>(MOCK_APPOINTMENTS);
  const [notes, setNotes] = useState<Record<number, MedicalNoteResponse>>(() => {
    const map: Record<number, MedicalNoteResponse> = {};
    MOCK_MEDICAL_NOTES.forEach((n) => {
      map[n.appointmentId] = n;
    });
    return map;
  });

  const [selectedId, setSelectedId] = useState<number>(MOCK_APPOINTMENTS[0]?.id || 1001);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  // Selected appointment
  const currentAppointment = useMemo(() => {
    return appointments.find((a) => a.id === selectedId) || appointments[0];
  }, [appointments, selectedId]);

  // Notes state for active appointment
  const currentNote = currentAppointment ? notes[currentAppointment.id] : undefined;
  const [diagnosis, setDiagnosis] = useState(currentNote?.diagnosis || '');
  const [prescription, setPrescription] = useState(currentNote?.prescription || '');
  const [doctorNote, setDoctorNote] = useState(currentNote?.note || '');
  const [isSaving, setIsSaving] = useState(false);

  // Sync state when selected appointment changes
  const handleSelectAppointment = (apt: AppointmentResponse) => {
    setSelectedId(apt.id);
    const existing = notes[apt.id];
    setDiagnosis(existing?.diagnosis || '');
    setPrescription(existing?.prescription || '');
    setDoctorNote(existing?.note || '');
  };

  // Status transitions
  const updateAppointmentStatus = (newStatus: AppointmentStatus) => {
    if (!currentAppointment) return;
    setAppointments((prev) =>
      prev.map((a) => (a.id === currentAppointment.id ? { ...a, status: newStatus } : a))
    );

    const labels: Record<AppointmentStatus, string> = {
      [AppointmentStatus.PENDING]: 'Chờ xác nhận',
      [AppointmentStatus.CONFIRMED]: 'Đã xác nhận',
      [AppointmentStatus.CHECKED_IN]: 'Bệnh nhân đã đến',
      [AppointmentStatus.COMPLETED]: 'Đã hoàn thành khám',
      [AppointmentStatus.CANCELLED]: 'Đã huỷ',
    };

    toast.success(`Đã cập nhật trạng thái: ${labels[newStatus]}`);
  };

  // Save Medical Note
  const handleSaveNotes = () => {
    if (!currentAppointment) return;
    if (!diagnosis.trim()) {
      toast.error('Vui lòng nhập chẩn đoán lâm sàng');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      const newNote: MedicalNoteResponse = {
        id: notes[currentAppointment.id]?.id || Date.now(),
        appointmentId: currentAppointment.id,
        doctorId: currentAppointment.doctorId,
        diagnosis,
        prescription,
        note: doctorNote,
        createdAt: new Date().toISOString(),
      };

      setNotes((prev) => ({ ...prev, [currentAppointment.id]: newNote }));

      // Automatically complete appointment if not already
      if (currentAppointment.status !== AppointmentStatus.COMPLETED) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === currentAppointment.id ? { ...a, status: AppointmentStatus.COMPLETED } : a))
        );
      }

      setIsSaving(false);
      toast.success('Hồ sơ bệnh án đã được lưu vào hệ thống');
    }, 400);
  };

  // Preset prescriptions for fast clinic entry
  const addQuickPrescription = (text: string) => {
    setPrescription((prev) => (prev ? `${prev}\n• ${text}` : `• ${text}`));
    toast('Đã thêm mẫu thuốc', { icon: '💊' });
  };

  // Filtered list
  const filteredList = useMemo(() => {
    return appointments.filter((apt) => {
      if (statusFilter !== 'ALL' && apt.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          apt.patientName.toLowerCase().includes(q) ||
          apt.reason.toLowerCase().includes(q) ||
          String(apt.id).includes(q)
        );
      }
      return true;
    });
  }, [appointments, statusFilter, search]);

  // Statistics for top bar
  const stats = useMemo(() => {
    const total = appointments.length;
    const completed = appointments.filter((a) => a.status === AppointmentStatus.COMPLETED).length;
    const checkedIn = appointments.filter((a) => a.status === AppointmentStatus.CHECKED_IN).length;
    const pending = appointments.filter((a) => a.status === AppointmentStatus.PENDING).length;
    return { total, completed, checkedIn, pending };
  }, [appointments]);

  return (
    <div className="space-y-6">
      {/* Top Banner / Doctor Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-teal-900 to-slate-900 text-white shadow-md">
        <div className="flex items-center gap-4">
          <Avatar name="BS. CKI Nguyễn Văn An" size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Phòng khám Tim Mạch
              </span>
              <span className="text-xs text-slate-300 font-mono">Ca trực: 08:00 - 17:00</span>
            </div>
            <h1 className="text-xl font-bold font-heading mt-1">Bác sĩ Nguyễn Văn An</h1>
            <p className="text-xs text-slate-300">Không gian làm việc & Quản lý bệnh nhân trong ngày</p>
          </div>
        </div>

        {/* Mini stats */}
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-xs font-mono">
          <div className="text-center px-2">
            <span className="block text-slate-300 text-[10px] uppercase">Tổng ca</span>
            <span className="text-base font-bold text-white">{stats.total}</span>
          </div>
          <div className="w-px h-7 bg-white/20" />
          <div className="text-center px-2">
            <span className="block text-amber-300 text-[10px] uppercase">Đã đến</span>
            <span className="text-base font-bold text-amber-300">{stats.checkedIn}</span>
          </div>
          <div className="w-px h-7 bg-white/20" />
          <div className="text-center px-2">
            <span className="block text-emerald-400 text-[10px] uppercase">Đã khám</span>
            <span className="text-base font-bold text-emerald-400">{stats.completed}</span>
          </div>
        </div>
      </div>

      {/* Split-Pane Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Schedule Queue */}
        <div className="lg:col-span-5 space-y-3">
          {/* Filters & Search */}
          <div className="p-3 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/60 dark:border-white/5 space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm tên bệnh nhân..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200/60 dark:border-white/5 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
              {[
                { key: 'ALL', label: 'Tất cả' },
                { key: AppointmentStatus.CHECKED_IN, label: 'Đã đến' },
                { key: AppointmentStatus.CONFIRMED, label: 'Đã xác nhận' },
                { key: AppointmentStatus.PENDING, label: 'Chờ duyệt' },
                { key: AppointmentStatus.COMPLETED, label: 'Đã xong' },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setStatusFilter(f.key)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap',
                    statusFilter === f.key
                      ? 'bg-teal-500/10 text-teal-700 dark:text-teal-400 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Queue List */}
          <div className="space-y-2">
            {filteredList.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/60 dark:border-white/5 text-slate-400 text-xs">
                Không có bệnh nhân nào theo bộ lọc này.
              </div>
            ) : (
              filteredList.map((apt) => {
                const isSelected = apt.id === currentAppointment?.id;
                const isCheckedIn = apt.status === AppointmentStatus.CHECKED_IN;

                return (
                  <motion.div
                    key={apt.id}
                    layout
                    onClick={() => handleSelectAppointment(apt)}
                    className={cn(
                      'p-3.5 rounded-2xl transition-all duration-200 cursor-pointer border text-xs',
                      isSelected
                        ? 'bg-teal-500/5 dark:bg-teal-500/10 border-teal-500 shadow-sm'
                        : 'bg-white dark:bg-[#111827] border-slate-200/60 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={apt.patientName} size="md" />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                              {apt.patientName}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">#{apt.id}</span>
                          </div>
                          <span className="font-mono text-teal-600 dark:text-teal-400 font-medium">
                            {formatTime(apt.appointmentTime)}
                          </span>
                        </div>
                      </div>

                      <StatusBadge status={apt.status} />
                    </div>

                    <p className="mt-2 text-slate-500 dark:text-slate-400 line-clamp-1 italic">
                      "{apt.reason}"
                    </p>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Master-Detail & Clinical Notes Workspace */}
        <div className="lg:col-span-7">
          {currentAppointment ? (
            <motion.div
              key={currentAppointment.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/60 dark:border-white/5 p-6 shadow-sm space-y-6"
            >
              {/* Header: Patient Info & Quick Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <Avatar name={currentAppointment.patientName} size="lg" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white">
                        {currentAppointment.patientName}
                      </h2>
                      <StatusBadge status={currentAppointment.status} />
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Giờ hẹn: {formatTime(currentAppointment.appointmentTime)} • Ngày {formatDate(currentAppointment.appointmentTime)}
                    </p>
                  </div>
                </div>

                {/* Status Quick Action Buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {currentAppointment.status === AppointmentStatus.PENDING && (
                    <button
                      onClick={() => updateAppointmentStatus(AppointmentStatus.CONFIRMED)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Xác nhận
                    </button>
                  )}

                  {currentAppointment.status === AppointmentStatus.CONFIRMED && (
                    <button
                      onClick={() => updateAppointmentStatus(AppointmentStatus.CHECKED_IN)}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" /> Bệnh nhân đã tới
                    </button>
                  )}

                  {currentAppointment.status !== AppointmentStatus.COMPLETED &&
                    currentAppointment.status !== AppointmentStatus.CANCELLED && (
                      <button
                        onClick={() => updateAppointmentStatus(AppointmentStatus.CANCELLED)}
                        className="px-3 py-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl text-xs font-medium transition-colors flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Huỷ
                      </button>
                    )}
                </div>
              </div>

              {/* Patient Reason Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200/50 dark:border-white/5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Lý do đăng ký khám bệnh
                </span>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                  {currentAppointment.reason}
                </p>
              </div>

              {/* Medical Notes & Prescription Editor */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400">
                      <FileEdit className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        Bệnh án & Toa thuốc điện tử
                      </h3>
                      <p className="text-[11px] text-slate-400">Lưu trực tiếp vào hồ sơ y tế bệnh nhân</p>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveNotes}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-medium transition-colors shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {isSaving ? 'Đang lưu...' : 'Lưu hồ sơ & Hoàn tất'}
                  </button>
                </div>

                {/* Diagnosis input */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    1. Chẩn đoán lâm sàng *
                  </label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="Ví dụ: Tăng huyết áp độ I - Viêm dạ dày nhẹ"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200/60 dark:border-white/5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>

                {/* Prescription input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Pill className="w-3.5 h-3.5 text-teal-600" />
                      2. Toa thuốc & Liều lượng
                    </label>

                    {/* Quick presets */}
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className="text-slate-400">Gợi ý nhanh:</span>
                      <button
                        type="button"
                        onClick={() => addQuickPrescription('Amlodipine 5mg: 1 viên/ngày buổi sáng')}
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-teal-600 font-mono"
                      >
                        + Amlodipine
                      </button>
                      <button
                        type="button"
                        onClick={() => addQuickPrescription('Paracetamol 500mg: 1 viên khi sốt > 38.5C')}
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-teal-600 font-mono"
                      >
                        + Paracetamol
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={4}
                    value={prescription}
                    onChange={(e) => setPrescription(e.target.value)}
                    placeholder="Nhập tên thuốc, hàm lượng, cách dùng (ví dụ: Amlodipine 5mg x 30 viên, uống 1 viên sáng sau ăn)..."
                    className="w-full font-mono px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200/60 dark:border-white/5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 resize-none"
                  />
                </div>

                {/* Doctor Note & Follow up */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    3. Lời dặn y bác sĩ & Lịch hẹn tái khám
                  </label>
                  <textarea
                    rows={2}
                    value={doctorNote}
                    onChange={(e) => setDoctorNote(e.target.value)}
                    placeholder="Kiêng ăn mặn, tập thể dục nhẹ nhàng. Tái khám sau 14 ngày..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200/60 dark:border-white/5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 resize-none"
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-[#111827] rounded-2xl border border-dashed border-slate-200 dark:border-white/10 text-slate-400">
              Chọn một bệnh nhân trong hàng đợi để bắt đầu khám.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
