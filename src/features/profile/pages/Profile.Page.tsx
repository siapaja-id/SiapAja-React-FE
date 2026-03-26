import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, MapPin, Link as LinkIcon, Calendar, Edit3, Share2, MessageCircle, Star, UserPlus } from 'lucide-react';
import { UserAvatar, Button } from '@/src/shared/ui/SharedUI.Component';
import { Author } from '@/src/shared/types/domain.type';
import { useStore } from '@/src/store/main.store';
import { FeedItemRenderer } from '@/src/features/feed/components/FeedItems.Component';

export const ProfilePage: React.FC<{
  user: Author;
  onBack?: () => void;
}> = ({ user, onBack: onBackProp }) => {
  const navigate = useNavigate();
  const { currentUser, feedItems } = useStore();
  const isMe = currentUser.handle === user.handle;
  const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'tasks' | 'media'>('posts');

  const onBack = onBackProp || (() => navigate(-1));

  const userItems = feedItems.filter(item => item.author.handle === user.handle);
  const displayItems = userItems.length > 0 ? userItems : feedItems.slice(0, 3).map(i => ({...i, author: user}));

  return (
    <div className="min-h-screen bg-background pb-24">
      {onBack && (
         <div className="absolute top-4 left-4 z-50">
           <button onClick={onBack} className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition-colors">
             <ArrowLeft size={20} />
           </button>
         </div>
      )}
      
      {/* Cover Photo */}
      <div className="h-48 w-full bg-gradient-to-br from-primary/40 via-surface-container-high to-emerald-500/20 relative">
        <img src={`https://picsum.photos/seed/${user.handle}/800/400`} alt="Cover" className="w-full h-full object-cover mix-blend-overlay opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="px-4 relative -mt-16 sm:-mt-20 mb-4">
        <div className="flex justify-between items-end mb-4">
          <div className="relative">
            <UserAvatar 
              src={user.avatar} 
              size="xl" 
              isOnline={true}
              className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-background ring-0" 
            />
          </div>
          
          <div className="flex items-center gap-2 pb-2">
            {isMe ? (
              <>
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full"><Share2 size={16} /></Button>
                <Button variant="outline" size="sm" className="rounded-full px-4"><Edit3 size={16} className="mr-1" /> Edit Profile</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full"><MessageCircle size={16} /></Button>
                <Button variant="primary" size="sm" className="rounded-full px-5"><UserPlus size={16} className="mr-1" /> Follow</Button>
              </>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h1 className="text-2xl font-black text-on-surface flex items-center gap-2">
            {user.name}
            {user.verified && <BadgeCheck size={20} className="text-primary fill-primary/20" />}
          </h1>
          <p className="text-on-surface-variant font-medium text-sm">@{user.handle}</p>
        </div>

        <p className="text-sm text-on-surface/90 mb-4 leading-relaxed whitespace-pre-wrap">
          {isMe 
            ? "Building tools for the future. Digital nomad, tech enthusiast, and freelance problem solver. 🚀" 
            : "Exploring the decentralised web. Always open for new tasks and exciting projects! 💡"}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-on-surface-variant mb-5 font-medium">
          <span className="flex items-center gap-1"><MapPin size={14} /> Jakarta, ID</span>
          <span className="flex items-center gap-1"><LinkIcon size={14} /> <a href="#" className="text-primary hover:underline">siapaja.com</a></span>
          <span className="flex items-center gap-1"><Calendar size={14} /> Joined March 2024</span>
        </div>

        <div className="flex items-center gap-6 mb-6">
          <div className="flex flex-col">
            <span className="font-black text-lg text-on-surface">8.4k</span>
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Followers</span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg text-emerald-400 flex items-center gap-1">{user.karma || '98'} <Star size={14} className="fill-emerald-400" /></span>
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Karma</span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg text-on-surface">42</span>
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Tasks Done</span>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex w-full border-b border-white/10 mb-4 overflow-x-auto hide-scrollbar">
          {['posts', 'replies', 'tasks', 'media'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab as any)} 
              className={`flex-1 min-w-[72px] pb-3 text-sm font-bold uppercase tracking-wider relative transition-colors ${activeTab === tab ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="profileTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex flex-col gap-0 pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {displayItems.map((item, idx) => (
              <div key={item.id}>
                <FeedItemRenderer data={item} />
                {idx < displayItems.length - 1 && <div className="h-px bg-white/5 mx-4 my-2" />}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};