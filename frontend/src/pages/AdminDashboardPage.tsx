import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowUpRight,
  Filter,
  Activity,
  Stethoscope,
  Building2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  MOCK_ADMIN_DASHBOARD,
  MOCK_ADMIN_STATISTICS,
  MOCK_APPOINTMENTS,
  MOCK_DOCTORS,
  MOCK_SPECIALTIES,
} from '@/lib/mock-data';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Avatar } from '@/components/ui/Avatar';
import { formatCurrency, formatDate, formatTime, cn } from '@/lib/utils';
import { AppointmentStatus } from '@/types';

export function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');

  // Status chart data
  const statusData = useMemo(() => {
    const stats = MOCK_ADMIN_STATISTICS.appointmentsByStatus;
    return [
      { name: 'Đã hoàn thành', count: stats.COMPLETED || 7, color: '#10B981' },
      { name: 'Đã xác nhận', count: stats.CONFIRMED || 18, color: '#0EA5E9' },
      { name: 'Chờ duyệt', count: stats.PENDING || 15, color: '#F59E0B' },
      { name: 'Đã đến', count: stats.CHECKED_IN || 3, color: '#8B5CF6' },
      { name: 'Đã huỷ', count: stats.CANCELLED || 2, color: '#F43F5E' },
    ];
  }, []);

  const completionRate = Math.round(
    (MOCK_ADMIN_DASHBOARD.completedAppointments /
      (MOCK_ADMIN_DASHBOARD.todayAppointments || 1)) *
      100
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
            Trung tâm điều hành
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Tổng quan hiệu suất hoạt động phòng khám, số liệu lịch khám và tải công việc bác sĩ
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-white dark:bg-[#111827] p-1.5 rounded-xl border border-slate-200/60 dark:border-white/5 text-xs">
          <span className="px-2 text-slate-400 font-medium">Khoảng thời gian:</span>
          <button
            onClick={() => setTimeRange('7d')}
            className={cn(
              'px-2.5 py-1 rounded-lg font-medium transition-colors',
              timeRange === '7d'
                ? 'bg-teal-500/10 text-teal-700 dark:text-teal-400 font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            7 ngày qua
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={cn(
              'px-2.5 py-1 rounded-lg font-medium transition-colors',
              timeRange === '30d'
                ? 'bg-teal-500/10 text-teal-700 dark:text-teal-400 font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            30 ngày qua
          </button>
        </div>
      </div>

      {/* Bento Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today Appointments */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-white/5 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Lịch khám hôm nay
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {MOCK_ADMIN_DASHBOARD.todayAppointments}
            </span>
            <span className="inline-flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +12%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {MOCK_ADMIN_DASHBOARD.pendingAppointments} ca đang chờ duyệt
          </p>
        </div>

        {/* Card 2: Doctors count */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-white/5 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Bác sĩ trực
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {MOCK_ADMIN_DASHBOARD.totalDoctors}
            </span>
            <span className="text-xs font-medium text-slate-400">
              / 8 chuyên khoa
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">100% ca trực đã sẵn sàng</p>
        </div>

        {/* Card 3: Total Patients */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-white/5 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Hồ sơ bệnh nhân
            </span>
            <div className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {MOCK_ADMIN_DASHBOARD.totalPatients.toLocaleString('vi-VN')}
            </span>
            <span className="inline-flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +8.4%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">32 đăng ký mới trong tuần</p>
        </div>

        {/* Card 4: Completion Rate */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-white/5 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Tỷ lệ hoàn thành
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {completionRate}%
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Mục tiêu &gt;80%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Chỉ {MOCK_ADMIN_DASHBOARD.cancelledAppointments} ca huỷ hôm nay</p>
        </div>
      </div>

      {/* Main Charts Section (Bento Master-Visuals) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 7-Day Trend Chart */}
        <div className="lg:col-span-8 p-5 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/60 dark:border-white/5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold font-heading text-slate-900 dark:text-white">
                Biểu đồ diễn biến lịch khám theo ngày
              </h2>
              <p className="text-xs text-slate-400">
                Theo dõi tổng số lượt đặt, hoàn thành và huỷ trong 7 ngày gần nhất
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> Tổng đặt
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Đã hoàn thành
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Đã huỷ
              </span>
            </div>
          </div>

          <div className="h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={MOCK_ADMIN_STATISTICS.lastSevenDays}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(val) => {
                    const parts = val.split('-');
                    return `${parts[2]}/${parts[1]}`;
                  }}
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900/90 text-white p-3 rounded-xl backdrop-blur-md border border-white/10 text-xs font-mono shadow-xl space-y-1">
                          <p className="font-semibold text-slate-300">{label}</p>
                          <p className="text-teal-300">Tổng đặt: {payload[0]?.value}</p>
                          <p className="text-emerald-300">Đã hoàn thành: {payload[1]?.value}</p>
                          <p className="text-rose-300">Đã huỷ: {payload[2]?.value}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#14B8A6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCompleted)"
                />
                <Area
                  type="monotone"
                  dataKey="cancelled"
                  stroke="#F43F5E"
                  strokeWidth={1.5}
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Bar */}
        <div className="lg:col-span-4 p-5 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/60 dark:border-white/5 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold font-heading text-slate-900 dark:text-white">
              Phân bổ theo trạng thái
            </h2>
            <p className="text-xs text-slate-400">Tỷ lệ các trạng thái hồ sơ trong hệ thống</p>
          </div>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  width={90}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900/90 text-white p-2 rounded-lg text-xs font-mono">
                          {data.name}: {data.count} ca
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-1.5 text-xs">
            {statusData.slice(0, 3).map((item) => (
              <div key={item.name} className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="p-5 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/60 dark:border-white/5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold font-heading text-slate-900 dark:text-white">
              Lịch khám đăng ký gần đây
            </h2>
            <p className="text-xs text-slate-400">Cập nhật theo thời gian thực từ cổng bệnh nhân</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Mã</th>
                <th className="pb-3 font-semibold">Bệnh nhân</th>
                <th className="pb-3 font-semibold">Bác sĩ & Chuyên khoa</th>
                <th className="pb-3 font-semibold">Thời gian khám</th>
                <th className="pb-3 font-semibold">Lý do</th>
                <th className="pb-3 font-semibold">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {MOCK_APPOINTMENTS.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 font-mono font-medium text-slate-400">#{apt.id}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={apt.patientName} size="sm" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {apt.patientName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-200">{apt.doctorName}</p>
                      <p className="text-[11px] text-teal-600 dark:text-teal-400">{apt.specialtyName}</p>
                    </div>
                  </td>
                  <td className="py-3 font-mono text-slate-600 dark:text-slate-300">
                    <div>{formatDate(apt.appointmentTime)}</div>
                    <div className="text-[11px] text-slate-400">{formatTime(apt.appointmentTime)}</div>
                  </td>
                  <td className="py-3 max-w-[200px] truncate text-slate-600 dark:text-slate-400">
                    {apt.reason}
                  </td>
                  <td className="py-3">
                    <StatusBadge status={apt.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
