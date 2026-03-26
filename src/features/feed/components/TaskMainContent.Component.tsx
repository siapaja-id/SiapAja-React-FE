import React, { useState } from 'react';
import { BadgeCheck, MapPin, Clock, ShieldCheck, Star, Navigation, ExternalLink } from 'lucide-react';
import Markdown from 'react-markdown';
import { MediaCarousel } from '@/src/features/feed/components/FeedItems.Component';
import { UserAvatar, TagBadge, ExpandableText } from '@/src/shared/ui/SharedUI.Component';
import { PostActions } from '@/src/shared/ui/PostActions.Component';
import { TaskData } from '@/src/shared/types/domain.type';

export const TaskMainContent: React.FC<{ task: TaskData }> = ({ task }) => {
  const [isDescExpanded, setIsDescExpanded] = useState(false);

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
    <div className="relative pb-4">
      {/* Depth background gradient */}
      <div className="absolute top-0 inset-x-0 h-64 bg-primary/5 blur-[80px] pointer-events-none" />

      <div className="px-5 pt-6 pb-2 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <UserAvatar src={task.author.avatar} alt={task.author.name} size="xl" className="ring-2 ring-white/10 shadow-2xl" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-[16px] text-on-surface tracking-tight">{task.author.name}</span>
                {task.author.verified && <BadgeCheck size={16} className="text-primary fill-primary" />}
              </div>
              <div className="text-on-surface-variant text-[13px] font-medium">@{task.author.handle}</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-3xl font-black text-on-surface tracking-tighter drop-shadow-md">{task.price}</div>
            {task.status && (
              <TagBadge variant="primary" className="mt-1 shadow-sm px-2 py-0.5 text-[10px]">
                {task.status}
              </TagBadge>
            )}
          </div>
        </div>

        {/* Info Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-5">
          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <div className="scale-[0.6]">{task.icon}</div>
          </div>
          <div className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant font-black">{task.category}</div>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <div className="text-[11px] text-on-surface-variant font-bold flex items-center gap-1"><Clock size={12} />{task.timestamp}</div>
        </div>

        <h2 className="text-[26px] font-black text-on-surface leading-[1.15] tracking-tight mb-6 drop-shadow-sm">{task.title}</h2>

        {/* Trust Card */}
        <div className="relative overflow-hidden rounded-[24px] p-5 mb-6 glass shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <div className="flex gap-4 relative z-10">
            <div className="flex-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 font-black mb-1.5 block">Requester Rating</span>
              <div className="flex items-center gap-1.5 text-yellow-500">
                <Star size={18} className="fill-yellow-500" />
                <span className="text-lg font-black text-on-surface tracking-tight">4.9</span>
                <span className="text-[11px] text-on-surface-variant font-bold">(124)</span>
              </div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="flex-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 font-black mb-1.5 block">Payment</span>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck size={18} />
                <span className="text-sm font-black tracking-wide">Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="mb-8">
          <div className="prose prose-invert prose-sm max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary prose-strong:text-on-surface prose-p:leading-relaxed prose-p:text-on-surface-variant/90 prose-li:text-on-surface-variant/90">
            {task.description.length > 500 && !isDescExpanded ? (
              <>
                <Markdown>{task.description.substring(0, 500) + '...'}</Markdown>
                <button 
                  onClick={() => setIsDescExpanded(true)}
                  className="mt-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] hover:underline"
                >
                  Show Full Description
                </button>
              </>
            ) : (
              <>
                <Markdown>{markdownBody}</Markdown>
                {task.description.length > 500 && (
                  <button 
                    onClick={() => setIsDescExpanded(false)}
                    className="mt-4 text-on-surface-variant font-black uppercase tracking-[0.2em] text-[10px] hover:underline"
                  >
                    Show Less
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Media Modules */}
        {(task.mapUrl || (task.images && task.images.length > 0) || task.video || task.voiceNote) && (
          <div className="flex flex-col gap-4 mb-8">
            {task.mapUrl && (
              <div className="relative w-full rounded-[24px] overflow-hidden border border-white/10 shadow-lg bg-surface-container-high flex flex-col group">
                <div className="relative h-40 w-full bg-black">
                  <img src={task.mapUrl} alt="Static Map Route" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity grayscale-[0.2]" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface-container-high" />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-white tracking-widest uppercase">OSRM Routed</span>
                  </div>
                </div>
                
                <div className="p-5 flex flex-col gap-4 relative z-10 -mt-4">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center mt-1.5">
                      <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-background" />
                      <div className="w-0.5 h-8 bg-white/10 rounded-full my-1" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                    <div className="flex-1 flex flex-col gap-3">
                      <div>
                        <div className="text-[9px] text-on-surface-variant/70 uppercase tracking-widest font-black mb-0.5">Pickup Point</div>
                        <div className="text-sm text-on-surface font-bold leading-none">Downtown Hub (37.7749° N, 122.4194° W)</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-on-surface-variant/70 uppercase tracking-widest font-black mb-0.5">Dropoff Point</div>
                        <div className="text-sm text-on-surface font-bold leading-none">Midtown Square (37.7833° N, 122.4167° W)</div>
                      </div>
                    </div>
                  </div>

                  <a 
                    href="https://maps.google.com/?q=Midtown+Square" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary py-3.5 px-4 rounded-xl font-black text-sm transition-colors border border-primary/20 mt-2"
                  >
                    <Navigation size={16} />
                    Navigate via Google Maps
                    <ExternalLink size={14} className="ml-auto opacity-50" />
                  </a>
                </div>
              </div>
            )}
            {task.images && task.images.length > 0 && (
              <MediaCarousel images={task.images} className="rounded-[24px] overflow-hidden border border-white/10 shadow-lg" />
            )}
            {task.video && (
              <div className="relative w-full rounded-[24px] overflow-hidden border border-white/10 bg-black shadow-lg">
                <video src={task.video} controls className="w-full h-auto max-h-80" />
              </div>
            )}
            {task.voiceNote && (
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-surface-container-high to-surface-container rounded-[24px] border border-white/5 shadow-lg">
                <button className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:scale-105 active:scale-95 transition-all">
                  <div className="w-0 h-0 border-t-[7px] border-t-transparent border-l-[12px] border-l-current border-b-[7px] border-b-transparent ml-1" />
                </button>
                <div className="flex-grow">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-1.5">
                    <div className="h-full bg-primary w-1/3 rounded-full relative">
                       <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-md" />
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-on-surface-variant font-bold tracking-wider">
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
              <TagBadge key={tag} variant="default" className="px-2.5 py-1 text-[10px] rounded-full">{tag}</TagBadge>
            ))}
          </div>
        )}

        <div className="text-center text-[11px] text-on-surface-variant/60 font-bold tracking-widest uppercase mb-4">{task.meta}</div>

        <div className="pt-4 border-t border-white/5">
          <PostActions votes={task.votes} replies={task.replies} reposts={task.reposts} shares={task.shares} className="py-1" />
        </div>
      </div>
    </div>
  );
};