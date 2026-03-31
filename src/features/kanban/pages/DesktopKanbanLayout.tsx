import React, { useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/src/store/main.store';
import { FloatingSidebar } from '../components/FloatingSidebar';
import { KanbanColumn } from '../components/KanbanColumn';
import '../kanban.css';

export const DesktopKanbanLayout: React.FC = () => {
  const columns = useStore(state => state.columns);
  const openColumn = useStore(state => state.openColumn);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to newly spawned column
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: containerRef.current.scrollWidth,
        behavior: 'smooth'
      });
    }
  }, [columns.length]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-on-surface relative">
      <FloatingSidebar />
      <div
        ref={containerRef}
        className="kanban-container hide-scrollbar"
      >
        <AnimatePresence initial={false}>
          {columns.map((col, index) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="h-full"
            >
              <KanbanColumn col={col} index={index} total={columns.length} />
            </motion.div>
          ))}
        </AnimatePresence>
        <button
          onClick={() => openColumn('/')}
          className="kanban-add-btn"
          title="Open new feed column"
        >
          <Plus size={24} className="kanban-add-btn-icon" />
        </button>
      </div>
    </div>
  );
};