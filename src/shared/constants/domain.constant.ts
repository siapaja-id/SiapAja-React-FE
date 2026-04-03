import { ThemeColor, TextSize, ZoomLevel } from '@/src/shared/types/app.types';

// ============================================================================
// TASK LIFECYCLE STATUS CONSTANTS
// ============================================================================

export const TASK_STATUS = {
  OPEN: 'Open' as const,
  ASSIGNED: 'Assigned' as const,
  IN_PROGRESS: 'In Progress' as const,
  COMPLETED: 'Completed' as const,
  FINISHED: 'Finished' as const,
} as const;

// ============================================================================
// APP SETTINGS CONSTANTS
// ============================================================================

export const STORAGE_KEY = 'siapaja-settings';

export const VALID_THEME_COLORS: ThemeColor[] = ['red', 'blue', 'emerald', 'violet', 'amber'];
export const VALID_TEXT_SIZES: TextSize[] = ['sm', 'md', 'lg'];
export const VALID_ZOOM_LEVELS: ZoomLevel[] = [90, 100, 110, 120];

export const TASK_STATUS_COLORS: Record<string, string> = {
  [TASK_STATUS.OPEN]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  [TASK_STATUS.ASSIGNED]: 'bg-blue-100 text-blue-700 border-blue-200',
  [TASK_STATUS.IN_PROGRESS]: 'bg-amber-100 text-amber-700 border-amber-200',
  [TASK_STATUS.COMPLETED]: 'bg-purple-100 text-purple-700 border-purple-200',
  [TASK_STATUS.FINISHED]: 'bg-slate-100 text-slate-700 border-slate-200',
};

export const TASK_STATUS_ORDER: string[] = [
  TASK_STATUS.OPEN,
  TASK_STATUS.ASSIGNED,
  TASK_STATUS.IN_PROGRESS,
  TASK_STATUS.COMPLETED,
  TASK_STATUS.FINISHED,
];
