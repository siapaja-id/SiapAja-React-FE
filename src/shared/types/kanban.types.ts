import { AppColumn } from './app.types';

export interface KanbanColumnProps {
  col: AppColumn;
  index: number;
  total: number;
}

export interface ColumnRoutesProps {
  path: string;
}
