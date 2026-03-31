import React from 'react';
import { Maximize2, CheckCircle2, Sparkles } from 'lucide-react';
import { AutoResizeTextarea, Button } from '@/src/shared/ui/SharedUI.Component';
import { TASK_STATUS } from '@/src/shared/constants/domain.constant';
import { TaskActionFooterProps } from '@/src/features/feed/types/feed.types';

const StatusIndicator: React.FC<{ icon: React.ElementType; children: React.ReactNode; variant?: 'default' | 'emerald' }> = ({ 
  icon: Icon, 
  children, 
  variant = 'default' 
}) => (
  <div className={`text-1sm font-black w-full text-center py-2 uppercase tracking-[0.2em] flex items-center justify-center gap-2 rounded-xl border ${
    variant === 'emerald' 
      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
      : 'text-on-surface-variant'
  }`}>
    <Icon size={14} />
    {children}
  </div>
);

export const TaskActionFooter: React.FC<TaskActionFooterProps> = ({
  task,
  isCreator,
  isAssignedToMe,
  isNegotiable,
  replyText,
  onReplyTextChange,
  onSendMessage,
  onBid,
  onAccept,
  onStartTask,
  onShowComplete,
  onShowReview,
  onFullscreenReply,
}) => {
  const tStatus = task.taskStatus || TASK_STATUS.OPEN;
  const showInput = tStatus === TASK_STATUS.OPEN || tStatus === TASK_STATUS.ASSIGNED || tStatus === TASK_STATUS.IN_PROGRESS;

  const ActionUI = (() => {
    if (isCreator) {
      switch (tStatus) {
        case TASK_STATUS.OPEN:
          return <div className="text-1sm font-black text-on-surface-variant w-full text-center py-2 uppercase tracking-[0.2em]">Waiting for bids...</div>;
        case TASK_STATUS.ASSIGNED:
          return <StatusIndicator icon={CheckCircle2} variant="emerald">Awaiting Worker to Start</StatusIndicator>;
        case TASK_STATUS.IN_PROGRESS:
          return <StatusIndicator icon={Sparkles} variant="emerald">Task in Progress</StatusIndicator>;
        case TASK_STATUS.COMPLETED:
          return <Button fullWidth onClick={onShowReview} className="shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-emerald-500 hover:bg-emerald-400 text-black">Review & Release Payment</Button>;
        case TASK_STATUS.FINISHED:
          return <div className="text-1sm font-black text-on-surface-variant w-full text-center py-2 uppercase tracking-[0.2em]">Task Finished</div>;
      }
    } else {
      switch (tStatus) {
        case TASK_STATUS.OPEN:
          if (!isNegotiable) {
            return (
              <div className="flex gap-2 w-full">
                <Button variant="ghost" onClick={onBid} className="flex-1">Bid</Button>
                <Button onClick={onAccept} className="flex-1 shadow-[0_0_20px_rgba(var(--primary),0.3)] bg-primary text-white hover:bg-primary/90">Accept Instantly</Button>
              </div>
            );
          }
          return <Button onClick={onBid} fullWidth className="shadow-[0_0_20px_rgba(var(--primary),0.3)] bg-primary text-white hover:bg-primary/90">Submit Bid</Button>;
        case TASK_STATUS.ASSIGNED:
          if (isAssignedToMe) return <Button fullWidth onClick={onStartTask} className="shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-emerald-500 text-black hover:bg-emerald-400">Start Task</Button>;
          return <div className="text-1sm font-black text-on-surface-variant w-full text-center py-2 uppercase tracking-[0.2em]">Assigned to someone else</div>;
        case TASK_STATUS.IN_PROGRESS:
          if (isAssignedToMe) return <Button fullWidth onClick={onShowComplete} className="shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-emerald-500 text-black hover:bg-emerald-400">Mark as Completed</Button>;
          return <div className="text-1sm font-black text-on-surface-variant w-full text-center py-2 uppercase tracking-[0.2em]">In progress by another worker</div>;
        case TASK_STATUS.COMPLETED:
          if (isAssignedToMe) return <div className="text-1sm font-black text-on-surface-variant w-full text-center py-2 uppercase tracking-[0.2em] bg-white/5 rounded-xl border border-white/10">Waiting for Review...</div>;
          return <div className="text-1sm font-black text-on-surface-variant w-full text-center py-2 uppercase tracking-[0.2em]">Completed</div>;
        case TASK_STATUS.FINISHED:
          if (isAssignedToMe) return <StatusIndicator icon={CheckCircle2} variant="emerald">Payment Received</StatusIndicator>;
          return <div className="text-1sm font-black text-on-surface-variant w-full text-center py-2 uppercase tracking-[0.2em]">Task Finished</div>;
      }
    }
    return null;
  })();

  return (
    <div className="fixed bottom-0 w-full max-w-2xl glass p-3 z-20 flex flex-col gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/5">
      {showInput && (
        <div className="flex-grow relative bg-white/5 border border-white/10 rounded-2xl flex items-end focus-within:border-primary/50 focus-within:bg-white/10 transition-colors">
          <AutoResizeTextarea
            value={replyText}
            onChange={(e) => onReplyTextChange(e.target.value)}
            placeholder="Message or ask a question..."
            className="w-full bg-transparent border-none py-3 px-4 text-base text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0"
            minHeight={44}
            maxHeight={120}
            rows={1}
          />
          {replyText.trim() ? (
            <Button onClick={onSendMessage} className="mb-1 mr-1 px-4 py-2 shrink-0">Send</Button>
          ) : (
            <button onClick={onFullscreenReply} className="p-2.5 mb-0.5 mr-0.5 text-on-surface-variant hover:text-primary transition-colors shrink-0">
              <Maximize2 size={18} />
            </button>
          )}
        </div>
      )}
      <div className="w-full">{ActionUI}</div>
    </div>
  );
};