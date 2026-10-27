import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Plus,
  Filter,
  Search,
  Pill,
  ChevronRight,
  Info,
} from 'lucide-react';
import { MOCK_APPOINTMENTS, MOCK_MEDICAL_NOTES, MOCK_DOCTORS } from '@/lib/mock-data';
import { AppointmentStatus, type AppointmentResponse, type MedicalNoteResponse } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { formatDate, formatTime, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

type FilterTab = 'ALL' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED';

export function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>(MOCK_APPOINTMENTS);
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentResponse | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Medical note lookup
  const getMedicalNote = (appointmentId: number): MedicalNoteResponse | undefined => {
    return MOCK_MEDICAL_NOTES.find((n) => n.appointmentId === appointmentId);
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((item) => {
      // Tab filter
      if (activeTab === 'UPCOMING') {
        if (![AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED, AppointmentStatus.CHECKED_IN].includes(item.status)) {
          return false;
        }
      } else if (activeTab === 'COMPLETED') {
        if (item.status !== AppointmentStatus.COMPLETED) return false;
      } else if (activeTab === 'CANCELLED') {
        if (item.status !== AppointmentStatus.CANCELLED) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.doctorName.toLowerCase().includes(q) ||
          item.specialtyName.toLowerCase().includes(q) ||
          item.reason.toLowerCase().includes(q) ||
          String(item.id).includes(q)
        );
      }

      return true;
    });
  }, [appointments, activeTab, searchQuery]);

  const handleCancelClick = (apt: AppointmentResponse) => {
    setCancellingId(apt.id);
    setCancelReason('');
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (!cancellingId) return;
    setAppointments((prev) =>
      prev.map((a) => (a.id === cancellingId ? { ...a, status: AppointmentStatus.CANCELLED } : a))
    );
    if (selectedAppointment?.id === cancellingId) {
      setSelectedAppointment((prev) => (prev ? { ...prev, status: AppointmentStatus.CANCELLED } : null));
    }
    toast.success(`Đã huỷ lịch khám #${cancellingId} thành công`);
    setIsCancelModalOpen(false);
    setCancellingId(null);
  };

  const activeNote = selectedAppointment ? getMedicalNote(selectedAppointment.id) : undefined;
  const activeDoctor = selectedAppointment
    ? MOCK_DOCTORS.find((d) => d.id === selectedAppointment.doctorId)
    : undefined;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
            Lịch hẹn của tôi
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Theo dõi tình trạng lịch khám, xem hồ sơ bệnh án và đơn thuốc điện tử
          </p>
        </div>

        <Link
          to="/booking"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow shadow-teal-600/20 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Đặt lịch khám mới</span>
        </Link>
      </div>

      {/* Control Bar: Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-2 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/60 dark:border-white/5 shadow-xs">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {(
            [
              { key: 'ALL', label: 'Tất cả' },
              { key: 'UPCOMING', label: 'Sắp tới' },
              { key: 'COMPLETED', label: 'Đã hoàn thành' },
              { key: 'CANCELLED', label: 'Đã huỷ' },
            ] as { key: FilterTab; label: string }[]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'relative px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap',
                activeTab === tab.key
                  ? 'text-teal-700 dark:text-teal-400 bg-teal-500/10'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              )}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="tab-pill"
                  className="absolute inset-0 bg-teal-500/10 rounded-xl -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo bác sĩ, chuyên khoa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200/60 dark:border-white/5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
          />
        </div>
      </div>

      {/* Main Grid: Master List & Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List: Appointments */}
        <div className="lg:col-span-7 space-y-3">
          {filteredAppointments.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/60 dark:border-white/5">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Không tìm thấy lịch hẹn</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Bạn chưa có lịch hẹn nào phù hợp với bộ lọc hiện tại. Nhấn vào "Đặt lịch khám mới" để bắt đầu.
              </p>
            </div>
          ) : (
            filteredAppointments.map((apt) => {
              const isSelected = selectedAppointment?.id === apt.id;
              const hasNote = Boolean(getMedicalNote(apt.id));

              return (
                <motion.div
                  key={apt.id}
                  layout
                  onClick={() => setSelectedAppointment(apt)}
                  className={cn(
                    'group relative p-4 rounded-2xl bg-white dark:bg-[#111827] border transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md',
                    isSelected
                      ? 'border-teal-500 ring-2 ring-teal-500/10'
                      : 'border-slate-200/60 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={apt.doctorName} size="md" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            {apt.doctorName}
                          </h3>
                          <span className="text-[11px] font-mono text-slate-400">#{apt.id}</span>
                        </div>
                        <p className="text-xs font-medium text-teal-600 dark:text-teal-400">
                          {apt.specialtyName}
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={apt.status} />
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(apt.appointmentTime)}
                      </span>
                      <span className="flex items-center gap-1.5 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {formatTime(apt.appointmentTime)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {hasNote && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-700 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-lg">
                          <FileText className="w-3 h-3" />
                          Có bệnh án
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Right Detail Panel */}
        <div className="lg:col-span-5 sticky top-6">
          {selectedAppointment ? (
            <motion.div
              key={selectedAppointment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/60 dark:border-white/5 p-5 shadow-xs space-y-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-white/5">
                <div>
                  <span className="text-[11px] font-mono text-slate-400">Chi tiết lịch hẹn</span>
                  <h2 className="text-base font-bold font-heading text-slate-900 dark:text-white mt-0.5">
                    Mã #{selectedAppointment.id}
                  </h2>
                </div>
                <StatusBadge status={selectedAppointment.status} />
              </div>

              {/* Doctor Details */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 dark:bg-[#1E293B]">
                <Avatar name={selectedAppointment.doctorName} size="lg" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {selectedAppointment.doctorName}
                  </p>
                  <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                    {selectedAppointment.specialtyName}
                  </p>
                  {activeDoctor && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                      {activeDoctor.bio}
                    </p>
                  )}
                </div>
              </div>

              {/* Timing & Reason info */}
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Ngày khám
                  </span>
                  <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                    {formatDate(selectedAppointment.appointmentTime)}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Giờ khám
                  </span>
                  <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                    {formatTime(selectedAppointment.appointmentTime)}
                  </span>
                </div>
                <div className="py-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Lý do khám</span>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-[#1E293B] p-3 rounded-xl border border-slate-200/40 dark:border-white/5">
                    {selectedAppointment.reason}
                  </p>
                </div>
              </div>

              {/* Medical Note (If Completed) */}
              {activeNote ? (
                <div className="p-4 rounded-xl bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 text-xs font-semibold uppercase tracking-wider">
                    <FileText className="w-4 h-4" />
                    <span>Hồ sơ bệnh án & Đơn thuốc</span>
                  </div>

                  <div>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Chẩn đoán:</p>
                    <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                      {activeNote.diagnosis}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Pill className="w-3 h-3 text-teal-600" /> Đơn thuốc điều trị:
                    </p>
                    <p className="text-xs sm:text-sm font-mono text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-[#1E293B]/80 p-2.5 rounded-lg border border-teal-500/20 mt-1">
                      {activeNote.prescription}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Lời dặn của bác sĩ:</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 italic">
                      "{activeNote.note}"
                    </p>
                  </div>
                </div>
              ) : selectedAppointment.status === AppointmentStatus.COMPLETED ? (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1E293B] text-center text-xs text-slate-400">
                  Chưa có ghi chép bệnh án điện tử cho buổi khám này.
                </div>
              ) : null}

              {/* Actions */}
              {[AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED].includes(selectedAppointment.status) && (
                <div className="pt-2">
                  <button
                    onClick={() => handleCancelClick(selectedAppointment)}
                    className="w-full py-2.5 px-4 text-xs sm:text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Huỷ lịch khám này
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-[#111827] rounded-2xl border border-dashed border-slate-200 dark:border-white/10 text-slate-400">
              <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
                Chọn một lịch hẹn để xem chi tiết
              </p>
              <p className="text-[11px] mt-1">
                Xem bác sĩ phụ trách, giờ khám, lý do và toa thuốc điều trị tương ứng.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Xác nhận huỷ lịch khám"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Bạn có chắc chắn muốn huỷ lịch hẹn khám này? Hành động này không thể hoàn tác và slot khám sẽ được mở cho bệnh nhân khác.
          </p>

          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1.5">
              Lý do huỷ (không bắt buộc)
            </label>
            <textarea
              rows={3}
              placeholder="Ví dụ: Bận đột xuất, chuyển lịch sang tuần sau..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200/60 dark:border-white/5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              onClick={() => setIsCancelModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5 transition-colors"
            >
              Giữ lịch khám
            </button>
            <button
              onClick={handleConfirmCancel}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white transition-colors"
            >
              Xác nhận huỷ
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
