import React from 'react';
import { X } from 'lucide-react';
import { ColumnContext } from '@/src/shared/contexts/column.context';
import { KanbanColumnProps } from '@/src/shared/types/kanban.types';
import { useStore } from '@/src/store/main.store';
import { getColumnMeta } from '../utils';
import { ColumnRoutes } from '../routes';
import { useKanbanColumn } from '../hooks/useKanbanColumn';
import { Author } from '@/src/shared/types/auth.types';
import '../kanban.css';

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ col, index, total }) => {
  const closeColumn = useStore(state => state.closeColumn);
  const meta = getColumnMeta(col.path);
  const Icon = meta.icon;
  const isFirst = index === 0;
  const canClose = !isFirst;
  const title = (col.state?.user as Author | undefined)?.name || meta.label;

  const { colRef, isResizing, startResize } = useKanbanColumn({ col, index, total });

  return (
    <ColumnContext.Provider value={{ id: col.id, path: col.path, state: col.state }}>
      <div
        ref={colRef}
        className="kanban-column-wrapper"
        style={{ width: col.width }}
      >
        <div className={`kanban-column-content ${isResizing ? 'pointer-events-none opacity-80 scale-[0.98]' : ''} transition-transform`}>

          <div className="kanban-col-header">
            <div className="kanban-col-header-left">
              <div className="kanban-col-header-icon">
                <Icon size={14} />
              </div>
              <span className="kanban-col-header-title">{title}</span>
            </div>
            <div className="kanban-col-header-right">
              {total > 1 && (
                <span className="kanban-col-header-badge">{index + 1}/{total}</span>
              )}
              {canClose && (
                <button onClick={() => closeColumn(col.id)} className="kanban-col-close-btn">
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto hide-scrollbar relative">
            <ColumnRoutes path={col.path} />
          </div>
        </div>

        <div className="kanban-resizer" onMouseDown={startResize} />
      </div>
    </ColumnContext.Provider>
  );
};
