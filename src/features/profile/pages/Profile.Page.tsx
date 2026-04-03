import React from 'react';
import { motion, AnimatePresence, useMotionTemplate } from 'framer-motion';
import { ArrowLeft, BadgeCheck, MapPin, Link as LinkIcon, Calendar, Edit3, Share2, MessageCircle, Star, Settings, Wallet, ArrowRight } from 'lucide-react';
import { UserAvatar, Button, FollowButton } from '@/src/shared/ui/SharedUI.Component';
import { ProfilePageProps } from '@/src/shared/types/profile.types';
import { FeedItemRenderer } from '@/src/features/feed/components/FeedItems.Component';
import { useProfile } from '@/src/features/profile/hooks/useProfile';

export const ProfilePage: React.FC<ProfilePageProps> = (props) => {
  const {
    user,
    isMe,
    activeTab,
    setActiveTab,
    onBack,
    goToSettings,
    goToWallet,
    displayItems,
    scrollRef,
    heroY,
    heroOpacity,
    heroScale,
    headerOpacity,
    headerBg,
    headerBlur,
    shouldUseContainerScroll,
  } = useProfile(props);

  return (
    <div 
      ref={shouldUseContainerScroll ? scrollRef : undefined}
      className={`min-h-screen bg-background relative ${shouldUseContainerScroll ? 'overflow-y-auto hide-scrollbar h-[100dvh]' : 'pb-24'}`}
    >
      {shouldUseContainerScroll && (
        <motion.div 
          className="sticky top-0 left-0 right-0 z-50 flex items-center h-16 px-4 gap-3 border-b border-transparent bg-header-bg"
          style={{ backdropFilter: headerBlur, WebkitBackdropFilter: headerBlur }}
        >
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-on-header hover:bg-white/20 transition-colors shrink-0">
            <ArrowLeft size={20} />
          </button>
          <motion.div style={{ opacity: headerOpacity }} className="flex flex-col">
            <span className="text-15 font-bold text-on-header tracking-tight leading-tight">{user.name}</span>
            <span className="text-1sm text-on-header-secondary font-medium leading-tight">{displayItems.length} posts</span>
          </motion.div>
        </motion.div>
      )}
      
      <motion.div 
        className={`w-full relative origin-top ${shouldUseContainerScroll ? '-mt-16 h-56 sm:h-64' : 'h-48 sm:h-56'}`}
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-surface-container-high to-emerald-500/20" />
        <img src={`https://picsum.photos/seed/${user.handle}/800/400`} alt="Cover" className="w-full h-full object-cover mix-blend-overlay opacity-50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        {isMe && (
          <button
            onClick={goToSettings}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-outline-variant flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            <Settings size={20} />
          </button>
        )}
      </motion.div>

      <div className="px-4 relative z-10 -mt-20 sm:-mt-24 mb-4">
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
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full"><Share2 size={20} /></Button>
                <Button variant="outline" size="sm" className="rounded-full px-4"><Edit3 size={20} className="mr-1" /> Edit Profile</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full"><MessageCircle size={20} /></Button>
                <FollowButton handle={user.handle} variant="profile" />
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
            <span className="text-2sm uppercase tracking-widest text-on-surface-variant font-bold">Followers</span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg text-emerald-400 flex items-center gap-1">{user.karma || '98'} <Star size={14} className="fill-emerald-400" /></span>
            <span className="text-2sm uppercase tracking-widest text-on-surface-variant font-bold">Karma</span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg text-on-surface">42</span>
            <span className="text-2sm uppercase tracking-widest text-on-surface-variant font-bold">Tasks Done</span>
          </div>
        </div>

        {isMe && (
          <motion.div 
            onClick={goToWallet}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="mb-8 p-4 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-primary/5 to-surface-container-high border border-outline-variant hover:border-emerald-500/30 transition-all cursor-pointer relative overflow-hidden group shadow-lg"
          >
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-black/40 shadow-inner flex items-center justify-center text-emerald-400 border border-outline-variant">
                  <Wallet size={24} />
                </div>
                <div>
                  <p className="text-2xs text-on-surface-variant font-bold uppercase tracking-widest mb-0.5">Available Balance</p>
                  <p className="text-xl font-black text-on-surface tracking-tight">$1,240.50</p>
                </div>
              </div>
              <div className="bg-on-surface/5 w-8 h-8 rounded-full flex items-center justify-center text-on-surface hover:bg-on-surface/10 transition-colors">
                <ArrowRight size={16} />
              </div>
            </div>
          </motion.div>
        )}
        
        <div className="flex w-full border-b border-on-surface/5 mb-4 overflow-x-auto hide-scrollbar">
          {['posts', 'replies', 'tasks', 'media'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab as typeof activeTab)} 
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
                {idx < displayItems.length - 1 && <div className="h-px bg-on-surface/5 mx-4 my-2" />}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
