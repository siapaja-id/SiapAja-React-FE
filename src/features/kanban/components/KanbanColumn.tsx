import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { ColumnContext } from '@/src/shared/contexts/column.context';
import { AppColumn, Author } from '@/src/shared/types/domain.type';
import { useStore } from '@/src/store/main.store';
import { getColumnMeta } from '../utils';
import { ColumnRoutes } from '../routes';
import '../kanban.css';

export const KanbanColumn: React.FC<{ col: AppColumn; index: number; total: number }> = ({ col, index, total }) => {
  const closeColumn = useStore(state => state.closeColumn);
  const setColumnWidth = useStore(state => state.setColumnWidth);
  const [isResizing, setIsResizing] = useState(false);
  const colRef = useRef<HTMLDivElement>(null);

  const meta = getColumnMeta(col.path);
  const Icon = meta.icon;
  const isFirst = index === 0;
  const canClose = !isFirst;
  const title = (col.state?.user as Author | undefined)?.name || meta.label;

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !colRef.current) return;
      const newWidth = e.clientX - colRef.current.getBoundingClientRect().left;
      if (newWidth > 320 && newWidth < 800) {
        setColumnWidth(col.id, newWidth);
      }
    };
    const handleMouseUp = () => setIsResizing(false);

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, col.id, setColumnWidth]);

  return (
    <ColumnContext.Provider value={{ id: col.id, path: col.path, state: col.state }}>
      <div
        ref={colRef}
        className="kanban-column-wrapper"
        style={{ width: col.width }}
      >
        <div className={`kanban-column-content ${isResizing ? 'pointer-events-none opacity-80 scale-[0.98]' : ''} transition-transform`}>

          {/* Column Header Bar */}
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

          {/* Column Routes */}
          <div className="flex-1 overflow-y-auto hide-scrollbar relative">
            <ColumnRoutes path={col.path} />
          </div>
        </div>

        {/* Resizer Handle */}
        <div className="kanban-resizer" onMouseDown={startResize} />
      </div>
    </ColumnContext.Provider>
  );
};