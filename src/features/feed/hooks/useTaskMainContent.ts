import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/src/store/main.store';
import { TaskData, TaskStatus } from '@/src/shared/types/feed.types';

export const useTaskMainContent = (task: TaskData) => {
  const navigate = useNavigate();
  const updateFeedItem = useStore(state => state.updateFeedItem);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const handleClaim = useCallback(() => {
    updateFeedItem<TaskData>(task.id, { status: 'Claimed' as TaskStatus });
  }, [task.id, updateFeedItem]);

  const markdownBody = useMemo(() => {
    if (task.description.length < 100) {
      return `
### Task Overview
${task.description}

### Requirements
- Must have own transportation
- Previous experience preferred
- Available during business hours

### Location Details
**Pickup:** Downtown Hub
**Dropoff:** Midtown Square
*Distance: ~2.4 miles*

> Please ensure all items are handled with care. Fragile items are included in this request.
  `;
    }
    return task.description;
  }, [task.description]);

  const statuses = [
    { id: 'open', label: 'Open' },
    { id: 'assigned', label: 'Assigned' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Reviewing' },
    { id: 'finished', label: 'Finished' }
  ];
  const currentIndex = statuses.findIndex(s => s.id === task.status);

  return {
    isDescExpanded,
    setIsDescExpanded,
    handleClaim,
    markdownBody,
    statuses,
    currentIndex,
  };
};
