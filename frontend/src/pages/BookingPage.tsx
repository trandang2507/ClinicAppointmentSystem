import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Calendar,
  Clock,
  ChevronRight,
  Check,
  ArrowLeft,
  Heart,
  Brain,
  Baby,
  Eye,
  Ear,
  Bone,
  Stethoscope,
  Sparkles,
  Send,
} from 'lucide-react';
import { MOCK_SPECIALTIES, MOCK_DOCTORS, MOCK_TIME_SLOTS } from '@/lib/mock-data';
import { Avatar } from '@/components/ui/Avatar';
import { formatCurrency, cn } from '@/lib/utils';

const specialtyIcons: Record<string, typeof Heart> = {
  'Tim Mạch': Heart,
  'Da Liễu': Sparkles,
  'Nhi Khoa': Baby,
  'Thần Kinh': Brain,
  'Nội Tổng Quát': Stethoscope,
  'Mắt': Eye,
  'Tai Mũi Họng': Ear,
  'Chỉnh Hình': Bone,
};

const specialtyColors: Record<string, string> = {
  'Tim Mạch': 'from-rose-500/10 to-rose-500/5 text-rose-600 dark:text-rose-400',
  'Da Liễu': 'from-violet-500/10 to-violet-500/5 text-violet-600 dark:text-violet-400',
  'Nhi Khoa': 'from-sky-500/10 to-sky-500/5 text-sky-600 dark:text-sky-400',
  'Thần Kinh': 'from-indigo-500/10 to-indigo-500/5 text-indigo-600 dark:text-indigo-400',
  'Nội Tổng Quát': 'from-teal-500/10 to-teal-500/5 text-teal-600 dark:text-teal-400',
  'Mắt': 'from-amber-500/10 to-amber-500/5 text-amber-600 dark:text-amber-400',
  'Tai Mũi Họng': 'from-emerald-500/10 to-emerald-500/5 text-emerald-600 dark:text-emerald-400',
  'Chỉnh Hình': 'from-orange-500/10 to-orange-500/5 text-orange-600 dark:text-orange-400',
};

type Step = 'specialty' | 'doctor' | 'schedule' | 'confirm';

export function BookingPage() {
  const [step, setStep] = useState<Step>('specialty');
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<number | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const specialty = MOCK_SPECIALTIES.find((s) => s.id === selectedSpecialty);
  const doctor = MOCK_DOCTORS.find((d) => d.id === selectedDoctor);

  const filteredDoctors = useMemo(() => {
    let docs = MOCK_DOCTORS;
    if (selectedSpecialty) {
      const spec = MOCK_SPECIALTIES.find((s) => s.id === selectedSpecialty);
      if (spec) docs = docs.filter((d) => d.specialtyName === spec.name);
    }
    if (search) {
      const q = search.toLowerCase();
      docs = docs.filter(
        (d) => d.fullName.toLowerCase().includes(q) || d.specialtyName.toLowerCase().includes(q)
      );
    }
    return docs;
  }, [selectedSpecialty, search]);

  // Generate next 7 days
  const dates = useMemo(() => {
    const result: { date: string; label: string; day: string }[] = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date(Date.now() + i * 86400000);
      result.push({
        date: d.toISOString().split('T')[0],
        label: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        day: d.toLocaleDateString('vi-VN', { weekday: 'short' }),
      });
    }
    return result;
  }, []);

  // Randomly exclude some time slots to simulate booked ones
  const availableSlots = useMemo(() => {
    if (!selectedDate) return MOCK_TIME_SLOTS;
    const seed = selectedDate.split('-').reduce((a, b) => a + Number(b), 0) + (selectedDoctor || 0);
    return MOCK_TIME_SLOTS.filter((_, i) => (seed + i * 7) % 5 !== 0);
  }, [selectedDate, selectedDoctor]);

  const steps: { key: Step; label: string; num: number }[] = [
    { key: 'specialty', label: 'Chuyên khoa', num: 1 },
    { key: 'doctor', label: 'Bác sĩ', num: 2 },
    { key: 'schedule', label: 'Lịch khám', num: 3 },
    { key: 'confirm', label: 'Xác nhận', num: 4 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsBooked(true);
    }, 1500);
  };

  const reset = () => {
    setStep('specialty');
    setSelectedSpecialty(null);
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTime('');
    setReason('');
    setIsBooked(false);
    setSearch('');
  };

  if (isBooked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
          className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6"
        >
          <Check className="w-10 h-10 text-emerald-600" />
        </motion.div>
        <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mb-2">
          Đặt lịch thành công!
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-2 max-w-md">
          Lịch khám với <span className="font-semibold text-slate-700 dark:text-slate-200">{doctor?.fullName}</span> đã được gửi.
          Bạn sẽ nhận thông báo khi bác sĩ xác nhận.
        </p>
        <div className="card p-4 mt-4 text-left space-y-2 w-full max-w-sm">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Chuyên khoa</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">{specialty?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Ngày khám</span>
            <span className="font-mono text-slate-800 dark:text-slate-200">{selectedDate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Giờ khám</span>
            <span className="font-mono text-slate-800 dark:text-slate-200">{selectedTime}</span>
          </div>
        </div>
        <button
          onClick={reset}
          className="mt-6 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium transition-colors"
        >
          Đặt lịch mới
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="card p-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <motion.div
                animate={{
                  backgroundColor: i <= currentStepIndex ? '#0D9488' : 'transparent',
                  borderColor: i <= currentStepIndex ? '#0D9488' : '#CBD5E1',
                  color: i <= currentStepIndex ? '#FFFFFF' : '#94A3B8',
                }}
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0"
              >
                {i < currentStepIndex ? <Check className="w-4 h-4" /> : s.num}
              </motion.div>
              <span
                className={cn(
                  'text-sm font-medium hidden sm:inline',
                  i <= currentStepIndex ? 'text-teal-700 dark:text-teal-400' : 'text-slate-400'
                )}
              >
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    'hidden sm:block w-12 lg:w-20 h-px mx-2',
                    i < currentStepIndex ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-700'
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Specialty */}
        {step === 'specialty' && (
          <motion.div
            key="specialty"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-1">
              Chọn chuyên khoa
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
              Chọn chuyên khoa phù hợp với nhu cầu khám bệnh của bạn
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {MOCK_SPECIALTIES.map((spec, i) => {
                const Icon = specialtyIcons[spec.name] || Stethoscope;
                const colors = specialtyColors[spec.name] || 'from-slate-500/10 to-slate-500/5 text-slate-600';
                const isSelected = selectedSpecialty === spec.id;

                return (
                  <motion.button
                    key={spec.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedSpecialty(spec.id);
                      setSelectedDoctor(null);
                      setStep('doctor');
                    }}
                    className={cn(
                      'card p-4 text-left group cursor-pointer transition-all duration-200',
                      isSelected && 'ring-2 ring-teal-500'
                    )}
                  >
                    <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3', colors)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-1">{spec.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{spec.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {MOCK_DOCTORS.filter((d) => d.specialtyName === spec.name).length} bác sĩ
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500 transition-colors" />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Step 2: Doctor */}
        {step === 'doctor' && (
          <motion.div
            key="doctor"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            <button
              onClick={() => setStep('specialty')}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>

            <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-1">
              Chọn bác sĩ — {specialty?.name}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
              Chọn bác sĩ bạn muốn đặt lịch khám
            </p>

            {/* Search */}
            <div className="relative mb-5 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm bác sĩ theo tên..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200/60 dark:border-white/5 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 transition-shadow"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredDoctors.map((doc, i) => (
                <motion.button
                  key={doc.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedDoctor(doc.id);
                    setStep('schedule');
                  }}
                  className={cn(
                    'card p-5 text-left group cursor-pointer transition-all duration-200',
                    selectedDoctor === doc.id && 'ring-2 ring-teal-500'
                  )}
                >
                  <div className="flex gap-4">
                    <Avatar name={doc.fullName} size="lg" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{doc.fullName}</h3>
                      <p className="text-xs text-teal-600 dark:text-teal-400 font-medium mt-0.5">{doc.specialtyName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{doc.bio}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {doc.experienceYears} năm KN
                        </span>
                        <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 font-mono">
                          {formatCurrency(doc.consultationFees)}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-teal-500 transition-colors shrink-0 mt-1" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Schedule */}
        {step === 'schedule' && (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            <button
              onClick={() => setStep('doctor')}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>

            <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-1">
              Chọn ngày & giờ khám
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
              Bác sĩ: {doctor?.fullName}
            </p>

            {/* Date picker */}
            <div className="mb-6">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Chọn ngày
              </label>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mt-2">
                {dates.map((d) => (
                  <motion.button
                    key={d.date}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedDate(d.date);
                      setSelectedTime('');
                    }}
                    className={cn(
                      'flex flex-col items-center min-w-[72px] px-4 py-3 rounded-xl border text-sm transition-all duration-200',
                      selectedDate === d.date
                        ? 'bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-500/20'
                        : 'bg-white dark:bg-[#1E293B] border-slate-200/60 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:border-teal-300 dark:hover:border-teal-600'
                    )}
                  >
                    <span className="text-[11px] font-medium opacity-70">{d.day}</span>
                    <span className="font-bold font-mono mt-0.5">{d.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Time slots */}
            <AnimatePresence mode="wait">
              {selectedDate && (
                <motion.div
                  key={selectedDate}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Chọn giờ khám
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-2 mt-2">
                    {MOCK_TIME_SLOTS.map((time) => {
                      const isAvailable = availableSlots.includes(time);
                      const isSelected = selectedTime === time;

                      return (
                        <motion.button
                          key={time}
                          whileTap={isAvailable ? { scale: 0.95 } : undefined}
                          disabled={!isAvailable}
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            'relative px-3 py-2.5 rounded-xl text-sm font-mono font-medium transition-all duration-200 border',
                            isSelected
                              ? 'bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-500/20'
                              : isAvailable
                              ? 'bg-white dark:bg-[#1E293B] border-slate-200/60 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:border-teal-300 dark:hover:border-teal-600 cursor-pointer'
                              : 'bg-slate-100 dark:bg-[#1E293B]/50 border-slate-200/40 dark:border-white/5 text-slate-300 dark:text-slate-600 cursor-not-allowed line-through'
                          )}
                        >
                          {time}
                          {isSelected && (
                            <motion.div
                              layoutId="time-selected"
                              className="absolute inset-0 bg-teal-600 rounded-xl -z-10"
                              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Reason */}
            <div className="mt-6">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Lý do khám
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Mô tả triệu chứng hoặc lý do khám..."
                className="w-full max-w-lg px-4 py-3 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200/60 dark:border-white/5 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 transition-shadow resize-none"
              />
            </div>

            <button
              disabled={!selectedDate || !selectedTime || !reason.trim()}
              onClick={() => setStep('confirm')}
              className="mt-5 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
            >
              Tiếp tục <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Step 4: Confirm */}
        {step === 'confirm' && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            <button
              onClick={() => setStep('schedule')}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>

            <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-5">
              Xác nhận lịch khám
            </h2>

            <div className="card p-6 max-w-lg space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-white/5">
                <Avatar name={doctor?.fullName || ''} size="lg" />
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{doctor?.fullName}</p>
                  <p className="text-sm text-teal-600 dark:text-teal-400">{specialty?.name}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Ngày khám</span>
                  <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Giờ khám</span>
                  <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phí khám</span>
                  <span className="font-mono font-semibold text-teal-700 dark:text-teal-400">{formatCurrency(doctor?.consultationFees || 0)}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-white/5">
                <p className="text-xs text-slate-500 mb-1">Lý do khám</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{reason}</p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full mt-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-70 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Xác nhận đặt lịch
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
