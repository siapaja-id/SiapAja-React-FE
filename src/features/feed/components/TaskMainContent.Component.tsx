import React from 'react';
import { BadgeCheck, MapPin, Clock, ShieldCheck, Star, Navigation, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import { MediaCarousel } from '@/src/features/feed/components/FeedItems.Component';
import { UserAvatar, TagBadge, ExpandableText, FirstPostBadge, FirstTaskBadge } from '@/src/shared/ui/SharedUI.Component';
import { PostActions } from '@/src/shared/ui/PostActions.Component';
import { TaskMainContentProps, TaskData } from '@/src/shared/types/feed.types';
import { useTaskMainContent } from '@/src/features/feed/hooks/useTaskMainContent';

export const TaskMainContent: React.FC<TaskMainContentProps> = ({ task }) => {
  const navigate = useNavigate();
  const {
    isDescExpanded,
    setIsDescExpanded,
    handleClaim,
    markdownBody,
    statuses,
    currentIndex,
  } = useTaskMainContent(task);

  return (
    <div className="relative pb-4">
      <div className="absolute top-0 inset-x-0 h-64 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-transparent pointer-events-none" />

      <div className="px-5 pt-6 pb-2 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <UserAvatar src={task.author.avatar} alt={task.author.name} size="xl" className="ring-2 ring-on-surface/10 shadow-2xl" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg text-on-surface tracking-tight">{task.author.name}</span>
                {task.author.verified && <BadgeCheck size={16} className="text-primary fill-primary" />}
              </div>
              <div className="text-on-surface-variant text-13 font-medium">@{task.author.handle}</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-3xl font-black text-on-surface tracking-tighter">{task.price}</div>
            {task.status && (
              <TagBadge variant="primary" className="mt-1 shadow-sm px-2 py-0.5 text-2sm">
                {task.status}
              </TagBadge>
            )}
          </div>
        </div>

        {task.isFirstPost && <div className="mb-4"><FirstPostBadge /></div>}

        {task.isFirstTask && <div className="mb-4"><FirstTaskBadge /></div>}

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-5">
          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <div className="scale-[0.6]">{task.icon}</div>
          </div>
          <div className="text-2sm uppercase tracking-[0.15em] text-on-surface-variant font-black">{task.category}</div>
          <div className="w-1 h-1 rounded-full bg-on-surface/20" />
          <div className="text-1sm text-on-surface-variant font-bold flex items-center gap-1"><Clock size={12} />{task.timestamp}</div>
        </div>

        <h2 className="text-26 font-black text-on-surface leading-[1.15] tracking-tight mb-6">{task.title}</h2>

        <div className="relative overflow-hidden rounded-[24px] p-5 mb-6 glass shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 to-transparent -mr-10 -mt-10 pointer-events-none" />
          <div className="flex gap-4 relative z-10">
            <div className="flex-1">
              <span className="text-2sm uppercase tracking-[0.2em] text-on-surface-variant/60 font-black mb-1.5 block">Requester Rating</span>
              <div className="flex items-center gap-1.5 text-yellow-500">
                <Star size={18} className="fill-yellow-500" />
                <span className="text-lg font-black text-on-surface tracking-tight">4.9</span>
                <span className="text-1sm text-on-surface-variant font-bold">(124)</span>
              </div>
            </div>
            <div className="w-px bg-on-surface/10" />
            <div className="flex-1">
              <span className="text-2sm uppercase tracking-[0.2em] text-on-surface-variant/60 font-black mb-1.5 block">Payment</span>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck size={18} />
                <span className="text-sm font-black tracking-wide">Verified</span>
              </div>
            </div>
          </div>
        </div>

        {task.status && (
          <div className="mb-6 bg-surface-container border border-outline-variant rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 to-transparent -mr-10 -mt-10 pointer-events-none" />
            <div className="flex justify-between items-center relative mb-8 mt-2">
               <div className="absolute top-1/2 left-0 W-full h-1 bg-on-surface/10 -translate-y-1/2 rounded-full" />
               <div className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 rounded-full transition-all duration-700 ease-out" style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }} />
               {statuses.map((s, i) => (
                  <div key={s.id} className="relative flex flex-col items-center gap-2 z-10">
                     <div className={`w-3.5 h-3.5 rounded-full border-[2.5px] transition-colors duration-500 ${i <= currentIndex ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-surface-container border-outline-variant'}`} />
                     <span className={`text-2xs font-black uppercase tracking-widest absolute -bottom-5 whitespace-nowrap ${i <= currentIndex ? 'text-emerald-400' : 'text-on-surface-variant/40'}`}>{s.label}</span>
                  </div>
               ))}
            </div>
            {task.assignedWorker && (
               <div className="mt-8 pt-4 border-t border-on-surface/5 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                     <UserAvatar src={task.assignedWorker.avatar} size="md" className="ring-2 ring-emerald-500/20" />
                     <div>
                        <div className="text-2xs uppercase tracking-[0.2em] font-black text-on-surface-variant/60">Assigned To</div>
                        <div className="text-sm font-bold text-on-surface">@{task.assignedWorker.handle}</div>
                     </div>
                  </div>
                  <div className="text-right">
                     <div className="text-2xs uppercase tracking-[0.2em] font-black text-on-surface-variant/60">Agreed Price</div>
                     <div className="text-lg font-black text-emerald-400 tracking-tight">{task.acceptedBidAmount || task.price}</div>
                  </div>
               </div>
            )}
          </div>
        )}

        <div className="mb-8">
          <div className="prose prose-invert prose-sm max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary prose-strong:text-on-surface prose-p:leading-relaxed prose-p:text-on-surface-variant/90 prose-li:text-on-surface-variant/90">
            {task.description.length > 500 && !isDescExpanded ? (
              <>
                <Markdown>{task.description.substring(0, 500) + '...'}</Markdown>
                <button 
                  onClick={() => setIsDescExpanded(true)}
                  className="mt-2 text-primary font-black uppercase tracking-[0.2em] text-2sm hover:underline"
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
                    className="mt-4 text-on-surface-variant font-black uppercase tracking-[0.2em] text-2sm hover:underline"
                  >
                    Show Less
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {(task.mapUrl || (task.media?.images && task.media.images.length > 0) || task.media?.video || task.media?.voiceNote) && (
          <div className="flex flex-col gap-4 mb-8">
            {task.mapUrl && (
              <div className="relative w-full rounded-[24px] overflow-hidden border border-outline-variant shadow-lg bg-surface-container-high flex flex-col group">
                <div className="relative h-40 w-full bg-black">
                  <img src={task.mapUrl} alt="Static Map Route" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface-container-high" />
                  <div className="absolute top-4 right-4 bg-black/80 px-2.5 py-1 rounded-full border border-outline-variant flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-2xs font-black text-white tracking-widest uppercase">OSRM Routed</span>
                  </div>
                </div>
                
                <div className="p-5 flex flex-col gap-4 relative z-10 -mt-4">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center mt-1.5">
                      <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-background" />
                      <div className="w-0.5 h-8 bg-on-surface/10 rounded-full my-1" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                    <div className="flex-1 flex flex-col gap-3">
                      <div>
                        <div className="text-2xs text-on-surface-variant/70 uppercase tracking-widest font-black mb-0.5">Pickup Point</div>
                        <div className="text-sm text-on-surface font-bold leading-none">Downtown Hub (37.7749° N, 122.4194° W)</div>
                      </div>
                      <div>
                        <div className="text-2xs text-on-surface-variant/70 uppercase tracking-widest font-black mb-0.5">Dropoff Point</div>
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
            {task.media?.images && task.media.images.length > 0 && (
              <MediaCarousel images={task.media.images} className="rounded-[24px] overflow-hidden border border-outline-variant shadow-lg" />
            )}
            {task.media?.video && (
              <div className="relative w-full rounded-[24px] overflow-hidden border border-outline-variant bg-black shadow-lg">
                <video src={task.media.video} controls className="w-full h-auto max-h-80" />
              </div>
            )}
            {task.media?.voiceNote && (
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-surface-container-high to-surface-container rounded-[24px] border border-outline-variant shadow-lg">
                <button className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:scale-105 active:scale-95 transition-all">
                  <div className="w-0 h-0 border-t-[7px] border-t-transparent border-l-[12px] border-l-current border-b-[7px] border-b-transparent ml-1" />
                </button>
                <div className="flex-grow">
                  <div className="h-2 bg-on-surface/10 rounded-full overflow-hidden mb-1.5">
                    <div className="h-full bg-primary w-1/3 rounded-full relative">
                       <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-md" />
                    </div>
                  </div>
                  <div className="flex justify-between text-2sm text-on-surface-variant font-bold tracking-wider">
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
              <TagBadge key={tag} variant="default" className="px-2.5 py-1 text-2sm rounded-full">{tag}</TagBadge>
            ))}
          </div>
        )}

        <div className="text-center text-1sm text-on-surface-variant/60 font-bold tracking-widest uppercase mb-4">{task.meta}</div>

        <div className="pt-4 border-t border-on-surface/5">
          <PostActions id={task.id} votes={task.engagement.votes} replies={task.engagement.replies} reposts={task.engagement.reposts} shares={task.engagement.shares} className="py-1" />
        </div>
      </div>
    </div>
  );
};
