import { AppointmentStatus } from '@/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: AppointmentStatus;
  className?: string;
}

const statusConfig: Record<AppointmentStatus, { label: string; dotColor: string; badgeClass: string }> = {
  [AppointmentStatus.PENDING]: {
    label: 'Chờ xác nhận',
    dotColor: 'bg-amber-500',
    badgeClass: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  },
  [AppointmentStatus.CONFIRMED]: {
    label: 'Đã xác nhận',
    dotColor: 'bg-emerald-500',
    badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  },
  [AppointmentStatus.CHECKED_IN]: {
    label: 'Đã check-in',
    dotColor: 'bg-sky-500',
    badgeClass: 'bg-sky-500/10 text-sky-700 dark:text-sky-400',
  },
  [AppointmentStatus.COMPLETED]: {
    label: 'Hoàn thành',
    dotColor: 'bg-emerald-500',
    badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  },
  [AppointmentStatus.CANCELLED]: {
    label: 'Đã huỷ',
    dotColor: 'bg-rose-500',
    badgeClass: 'bg-rose-500/10 text-rose-700 dark:text-rose-400',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap',
        config.badgeClass,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dotColor)} />
      {config.label}
    </span>
  );
}
