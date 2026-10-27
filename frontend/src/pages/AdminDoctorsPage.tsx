import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCog,
  Building2,
  Calendar,
  Search,
  Plus,
  Filter,
  Check,
  X,
  Sparkles,
  Heart,
  Stethoscope,
  Briefcase,
  DollarSign,
  AlertCircle,
  Clock,
  MoreVertical,
} from 'lucide-react';
import { MOCK_DOCTORS, MOCK_SPECIALTIES, MOCK_APPOINTMENTS } from '@/lib/mock-data';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, formatDate, formatTime, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Props {
  defaultTab?: 'doctors' | 'specialties' | 'appointments';
}

export function AdminDoctorsPage({ defaultTab = 'doctors' }: Props) {
  const [activeTab, setActiveTab] = useState<'doctors' | 'specialties' | 'appointments'>(defaultTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [doctors, setDoctors] = useState(MOCK_DOCTORS);
  const [specialties, setSpecialties] = useState(MOCK_SPECIALTIES);

  // New Doctor Modal state
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [docName, setDocName] = useState('');
  const [docSpecialtyId, setDocSpecialtyId] = useState<number>(specialties[0]?.id || 1);
  const [docExperience, setDocExperience] = useState<number>(5);
  const [docFees, setDocFees] = useState<number>(350000);
  const [docBio, setDocBio] = useState('');

  // New Specialty Modal state
  const [isSpecialtyModalOpen, setIsSpecialtyModalOpen] = useState(false);
  const [specName, setSpecName] = useState('');
  const [specDesc, setSpecDesc] = useState('');

  // Handle Add Doctor
  const handleCreateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) {
      toast.error('Vui lòng nhập họ tên bác sĩ');
      return;
    }
    const spec = specialties.find((s) => s.id === docSpecialtyId);
    const newDoc = {
      id: Date.now(),
      fullName: docName,
      specialtyName: spec?.name || 'Đa Khoa',
      experienceYears: docExperience,
      consultationFees: docFees,
      bio: docBio || 'Bác sĩ chuyên khoa tại MediFlow.',
    };

    setDoctors((prev) => [newDoc, ...prev]);
    toast.success(`Đã thêm bác sĩ ${docName} vào hệ thống`);
    setIsDoctorModalOpen(false);
    setDocName('');
    setDocBio('');
  };

  // Handle Add Specialty
  const handleCreateSpecialty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!specName.trim()) {
      toast.error('Vui lòng nhập tên chuyên khoa');
      return;
    }
    const newSpec = {
      id: Date.now(),
      name: specName,
      description: specDesc || 'Chuyên khoa điều trị và chăm sóc sức khỏe chuyên sâu.',
    };
    setSpecialties((prev) => [...prev, newSpec]);
    toast.success(`Đã tạo chuyên khoa ${specName}`);
    setIsSpecialtyModalOpen(false);
    setSpecName('');
    setSpecDesc('');
  };

  // Filtered Doctors
  const filteredDoctors = useMemo(() => {
    if (!searchQuery.trim()) return doctors;
    const q = searchQuery.toLowerCase();
    return doctors.filter(
      (d) => d.fullName.toLowerCase().includes(q) || d.specialtyName.toLowerCase().includes(q)
    );
  }, [doctors, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
            Quản trị Y tế
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Quản lý đội ngũ bác sĩ, danh mục chuyên khoa và giám sát lịch hẹn toàn viện
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'doctors' && (
            <button
              onClick={() => setIsDoctorModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-medium transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Bác sĩ mới</span>
            </button>
          )}

          {activeTab === 'specialties' && (
            <button
              onClick={() => setIsSpecialtyModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-medium transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Chuyên khoa</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs & Search Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-2 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/60 dark:border-white/5 shadow-xs">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('doctors')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors',
              activeTab === 'doctors'
                ? 'bg-teal-500/10 text-teal-700 dark:text-teal-400 font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            <UserCog className="w-4 h-4" />
            <span>Bác sĩ ({doctors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('specialties')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors',
              activeTab === 'specialties'
                ? 'bg-teal-500/10 text-teal-700 dark:text-teal-400 font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            <Building2 className="w-4 h-4" />
            <span>Chuyên khoa ({specialties.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors',
              activeTab === 'appointments'
                ? 'bg-teal-500/10 text-teal-700 dark:text-teal-400 font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            <Calendar className="w-4 h-4" />
            <span>Tất cả lịch hẹn ({MOCK_APPOINTMENTS.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm nhanh..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200/60 dark:border-white/5 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
          />
        </div>
      </div>

      {/* Tab 1: Doctors Directory Table */}
      {activeTab === 'doctors' && (
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/60 dark:border-white/5 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01] text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Bác sĩ</th>
                  <th className="py-3 px-4 font-semibold">Chuyên khoa</th>
                  <th className="py-3 px-4 font-semibold">Kinh nghiệm</th>
                  <th className="py-3 px-4 font-semibold">Phí khám</th>
                  <th className="py-3 px-4 font-semibold">Tiểu sử</th>
                  <th className="py-3 px-4 font-semibold text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredDoctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={doc.fullName} size="md" />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white text-sm">
                            {doc.fullName}
                          </p>
                          <span className="text-[10px] font-mono text-slate-400">ID #{doc.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-400 font-medium">
                        {doc.specialtyName}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                      {doc.experienceYears} năm
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-teal-700 dark:text-teal-400">
                      {formatCurrency(doc.consultationFees)}
                    </td>
                    <td className="py-3 px-4 max-w-[260px] truncate text-slate-500 dark:text-slate-400">
                      {doc.bio}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Đang làm việc
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Specialties Grid */}
      {activeTab === 'specialties' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {specialties.map((spec) => {
            const docCount = doctors.filter((d) => d.specialtyName === spec.name).length;
            return (
              <motion.div
                key={spec.id}
                layout
                className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-white/5 shadow-xs hover:border-teal-500/40 transition-colors space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300">
                    {docCount} bác sĩ
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">
                    {spec.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {spec.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-teal-600 dark:text-teal-400 font-medium">
                  <span>Mã chuyên khoa: #{spec.id}</span>
                  <button
                    onClick={() => toast.success(`Đang mở quản lý khoa ${spec.name}`)}
                    className="hover:underline"
                  >
                    Xem chi tiết →
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Tab 3: All Appointments Table */}
      {activeTab === 'appointments' && (
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/60 dark:border-white/5 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01] text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Mã</th>
                  <th className="py-3 px-4 font-semibold">Bệnh nhân</th>
                  <th className="py-3 px-4 font-semibold">Bác sĩ</th>
                  <th className="py-3 px-4 font-semibold">Khoa</th>
                  <th className="py-3 px-4 font-semibold">Ngày & Giờ</th>
                  <th className="py-3 px-4 font-semibold">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {MOCK_APPOINTMENTS.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-400">#{apt.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {apt.patientName}
                    </td>
                    <td className="py-3 px-4 text-slate-800 dark:text-slate-200">{apt.doctorName}</td>
                    <td className="py-3 px-4 text-teal-600 dark:text-teal-400">{apt.specialtyName}</td>
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                      {formatDate(apt.appointmentTime)} {formatTime(apt.appointmentTime)}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={apt.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add Doctor */}
      <Modal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        title="Đăng ký hồ sơ Bác sĩ mới"
      >
        <form onSubmit={handleCreateDoctor} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Họ và tên bác sĩ *
            </label>
            <input
              type="text"
              required
              placeholder="Ví dụ: BS. CKI Lê Hoàng Nam"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200/60 dark:border-white/5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Chuyên khoa *
              </label>
              <select
                value={docSpecialtyId}
                onChange={(e) => setDocSpecialtyId(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200/60 dark:border-white/5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
              >
                {specialties.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Số năm kinh nghiệm
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={docExperience}
                onChange={(e) => setDocExperience(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200/60 dark:border-white/5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Phí khám tư vấn (VND)
            </label>
            <input
              type="number"
              step={50000}
              value={docFees}
              onChange={(e) => setDocFees(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200/60 dark:border-white/5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/40 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Tiểu sử & Trình độ chuyên môn
            </label>
            <textarea
              rows={3}
              placeholder="Giới thiệu về học vị, bệnh viện từng công tác, thế mạnh lâm sàng..."
              value={docBio}
              onChange={(e) => setDocBio(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200/60 dark:border-white/5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsDoctorModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-teal-600 hover:bg-teal-700 text-white"
            >
              Lưu bác sĩ
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Specialty */}
      <Modal
        isOpen={isSpecialtyModalOpen}
        onClose={() => setIsSpecialtyModalOpen(false)}
        title="Thêm Chuyên khoa mới"
      >
        <form onSubmit={handleCreateSpecialty} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Tên chuyên khoa *
            </label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Răng Hàm Mặt, Ung Bướu..."
              value={specName}
              onChange={(e) => setSpecName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200/60 dark:border-white/5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Mô tả chuyên khoa
            </label>
            <textarea
              rows={3}
              placeholder="Mô tả phạm vi điều trị và trang thiết bị chuyên biệt..."
              value={specDesc}
              onChange={(e) => setSpecDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200/60 dark:border-white/5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsSpecialtyModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-teal-600 hover:bg-teal-700 text-white"
            >
              Tạo chuyên khoa
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
