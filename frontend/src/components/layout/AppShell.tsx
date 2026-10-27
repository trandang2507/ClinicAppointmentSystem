import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Stethoscope,
  Users,
  Settings,
  ChevronLeft,
  Moon,
  Sun,
  Activity,
  ClipboardList,
  UserCog,
  Building2,
  Menu,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { NotificationCenter } from './NotificationCenter';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types';

interface NavItem {
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { label: 'Tổng quan', path: '/', icon: LayoutDashboard, roles: ['ADMIN'] },
  { label: 'Đặt lịch khám', path: '/booking', icon: Calendar, roles: ['USER'] },
  { label: 'Lịch hẹn của tôi', path: '/my-appointments', icon: ClipboardList, roles: ['USER'] },
  { label: 'Lịch khám hôm nay', path: '/doctor', icon: Stethoscope, roles: ['DOCTOR'] },
  { label: 'Dashboard', path: '/admin', icon: Activity, roles: ['ADMIN'] },
  { label: 'Quản lý bác sĩ', path: '/admin/doctors', icon: UserCog, roles: ['ADMIN'] },
  { label: 'Chuyên khoa', path: '/admin/specialties', icon: Building2, roles: ['ADMIN'] },
  { label: 'Tất cả lịch hẹn', path: '/admin/appointments', icon: Calendar, roles: ['ADMIN'] },
];

const roleLabels: Record<UserRole, { label: string; color: string }> = {
  USER: { label: 'Bệnh nhân', color: 'bg-sky-500/10 text-sky-700 dark:text-sky-400' },
  DOCTOR: { label: 'Bác sĩ', color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' },
  ADMIN: { label: 'Quản trị', color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400' },
};

export function AppShell({ children }: { children: ReactNode }) {
  const { activeRole, setActiveRole, isDark, toggleTheme } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const filtered = navItems.filter((item) => item.roles.includes(activeRole));

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className={cn('flex items-center gap-3 px-5 py-5', collapsed && 'justify-center px-3')}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shrink-0">
          <Stethoscope className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <h1 className="text-lg font-bold font-heading text-slate-900 dark:text-white tracking-tight">
                Medi<span className="text-teal-600">Flow</span>
              </h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {filtered.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                collapsed && 'justify-center px-2',
                isActive
                  ? 'bg-teal-500/10 text-teal-700 dark:text-teal-400'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5'
              )}
            >
              <item.icon className={cn('w-5 h-5 shrink-0', isActive && 'text-teal-600 dark:text-teal-400')} />
              {!collapsed && <span>{item.label}</span>}
              {isActive && !collapsed && (
                <motion.div
                  layoutId="nav-indicator"
                  className="ml-auto w-1 h-5 bg-teal-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Role Switcher */}
      <div className={cn('px-3 pb-4 space-y-2', collapsed && 'px-2')}>
        {!collapsed && (
          <p className="px-3 text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Chế độ xem
          </p>
        )}
        {(['USER', 'DOCTOR', 'ADMIN'] as UserRole[]).map((role) => (
          <button
            key={role}
            onClick={() => setActiveRole(role)}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200',
              collapsed && 'justify-center',
              activeRole === role
                ? roleLabels[role].color
                : 'text-slate-500 hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-white/5'
            )}
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            {!collapsed && <span>{roleLabels[role].label}</span>}
          </button>
        ))}
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F6F8] dark:bg-[#0B0F17]">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="hidden lg:flex flex-col bg-white dark:bg-[#111827] border-r border-slate-200/60 dark:border-white/5 h-full relative shrink-0"
      >
        {sidebarContent}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white shadow-sm transition-colors z-10"
        >
          <ChevronLeft className={cn('w-3.5 h-3.5 transition-transform', collapsed && 'rotate-180')} />
        </button>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-[260px] bg-white dark:bg-[#111827] border-r border-slate-200/60 dark:border-white/5 z-50 flex flex-col lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/5 flex items-center justify-between px-4 lg:px-6 shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white font-heading">
                {filtered.find((i) => i.path === location.pathname)?.label || 'MediFlow'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5 transition-all duration-200"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <NotificationCenter />

            {/* User avatar */}
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200/60 dark:border-white/5">
              <Avatar name="Nguyễn Minh Khôi" size="sm" />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Minh Khôi</p>
                <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded', roleLabels[activeRole].color)}>
                  {roleLabels[activeRole].label}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="p-4 lg:p-6 max-w-[1440px]"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
