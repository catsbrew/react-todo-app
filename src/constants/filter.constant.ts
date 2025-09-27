import type { FilterType } from '@/types/todo.type';

export const FILTER_LABELS: Record<FilterType, string> = {
  All: '모든 일정',
  Active: '진행 중인 일정',
  Completed: '완료된 일정',
};
