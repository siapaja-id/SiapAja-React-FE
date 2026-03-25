import React from 'react';
import { BadgeCheck, MapPin, Clock, ShieldCheck, Star } from 'lucide-react';
import { TaskData, MediaCarousel } from './FeedItems.Component';
import Markdown from 'react-markdown';
import { UserAvatar, TagBadge, Button } from './SharedUI.Component';
import { PostActions } from './PostActions.Component';

export const TaskMainContent: React.FC<{ task: TaskData }> = ({ task }) => {
  const markdownBody = task.description.length < 100 ? `
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
  ` : task.description;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <UserAvatar src={task.author.avatar} alt={task.author.name} size="xl" className="ring-2" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[16px] text-on-surface">{task.author.name}</span>
              {task.author.verified && <BadgeCheck size={16} className="text-primary fill-primary" />}
            </div>
            <div className="text-on-surface-variant text-[13px]">@{task.author.handle}</div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-2xl font-black text-primary tracking-tight">{task.price}</div>
          {task.status && (
            <TagBadge variant="primary" className="mt-1">
              {task.status}
            </TagBadge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center border border-white/10 text-primary shadow-inner">
          <div className="scale-75">{task.icon}</div>
        </div>
        <div className="text-[11px] uppercase tracking-[0.15em] text-on-surface-variant/80 font-black">{task.category}</div>
        <div className="w-1 h-1 rounded-full bg-white/20 mx-1" />
        <div className="text-[12px] text-on-surface-variant font-medium flex items-center gap-1"><Clock size={12} />{task.timestamp}</div>
      </div>

      <h2 className="text-2xl font-black text-on-surface leading-tight mb-4">{task.title}</h2>

      <div className="flex gap-4 p-4 bg-surface-container-low/50 rounded-2xl border border-white/5 mb-6">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold mb-1">Requester Rating</span>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star size={14} className="fill-yellow-500" />
            <span className="text-[13px] font-bold text-on-surface">4.9</span>
            <span className="text-[11px] text-on-surface-variant">(124)</span>
          </div>
        </div>
        <div className="w-px bg-white/10" />
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold mb-1">Payment</span>
          <div className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck size={14} />
            <span className="text-[13px] font-bold">Verified</span>
          </div>
        </div>
      </div>

      <div className="prose prose-invert prose-sm max-w-none mb-6 prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary prose-strong:text-on-surface">
        <Markdown>{markdownBody}</Markdown>
      </div>

      {(task.mapUrl || (task.images && task.images.length > 0) || task.video || task.voiceNote) && (
        <div className="flex flex-col gap-3 mb-6">
          {task.mapUrl && (
            <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-white/10 group">
              <img src={task.mapUrl} alt="Location map" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex flex-col justify-end p-4">
                <div className="flex items-center gap-2 text-on-surface">
                  <MapPin size={16} className="text-primary" />
                  <span className="text-sm font-bold">View full route</span>
                </div>
              </div>
            </div>
          )}
          {task.images && task.images.length > 0 && (
            <div className="-mx-6 sm:mx-0">
              <MediaCarousel images={task.images} className="rounded-2xl overflow-hidden border border-white/10" />
            </div>
          )}
          {task.video && (
            <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
              <video src={task.video} controls className="w-full h-auto max-h-80" />
            </div>
          )}
          {task.voiceNote && (
            <div className="flex items-center gap-3 p-3 bg-surface-container-high rounded-2xl border border-white/5">
              <button className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 hover:scale-105 active:scale-95 transition-transform">
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-current border-b-[6px] border-b-transparent ml-1" />
              </button>
              <div className="flex-grow">
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-1/3 rounded-full" />
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-on-surface-variant font-medium">
                  <span>0:12</span><span>0:45</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {task.tags && (
        <div className="flex flex-wrap gap-2 mb-6">
          {task.tags.map(tag => (
            <TagBadge key={tag} variant="default">{tag}</TagBadge>
          ))}
        </div>
      )}

      <Button fullWidth className="mb-4">
        {task.category === 'Repair Needed' ? 'Submit Bid' : task.category === 'Grocery Run' ? 'Claim Task' : 'Accept Task'}
      </Button>
      <div className="text-center text-[12px] text-on-surface-variant/70 font-medium mb-2">{task.meta}</div>

      <div className="mt-6 pt-4 border-t border-white/5">
        <PostActions votes={task.votes} replies={task.replies} reposts={task.reposts} shares={task.shares} className="py-1" />
      </div>
    </div>
  );
};