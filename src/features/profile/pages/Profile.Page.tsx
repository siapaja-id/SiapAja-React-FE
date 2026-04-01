import React, { useState, useRef, useContext } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, MapPin, Link as LinkIcon, Calendar, Edit3, Share2, MessageCircle, Star, Settings, Wallet, ArrowRight } from 'lucide-react';
import { UserAvatar, Button, FollowButton } from '@/src/shared/ui/SharedUI.Component';
import { Author } from '@/src/shared/types/auth.types';
import { ProfilePageProps } from '@/src/shared/types/profile.types';
import { useStore } from '@/src/store/main.store';
import { FeedItemRenderer } from '@/src/features/feed/components/FeedItems.Component';
import { ColumnContext } from '@/src/shared/contexts/column.context';

export const ProfilePage: React.FC<ProfilePageProps> = ({ user: userProp, onBack: onBackProp }) => {
  const navigate = useNavigate();
  const currentUser = useStore(state => state.currentUser);
  const feedItems = useStore(state => state.feedItems);
  const isDesktop = useStore(state => state.isDesktop);
  const openColumn = useStore(state => state.openColumn);
  const user = userProp || currentUser;
  const isMe = currentUser.handle === user.handle;
  const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'tasks' | 'media'>('posts');

  const onBack = onBackProp || (() => navigate(-1));

  const goToSettings = () => {
    if (isDesktop) openColumn('/settings');
    else navigate('/settings');
  };
  
  const goToWallet = () => {
    if (isDesktop) openColumn('/wallet');
    else navigate('/wallet');
  };

  const userItems = feedItems.filter(item => item.author.handle === user.handle);
  const displayItems = userItems.length > 0 ? userItems : feedItems.slice(0, 3).map(i => ({...i, author: user}));

  // Handle scrolling contexts (App main window vs internal container when nested)
  const { scrollY: windowScrollY } = useScroll();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY: containerScrollY } = useScroll({ container: onBackProp ? scrollRef : undefined });
  const scrollY = onBackProp ? containerScrollY : windowScrollY;

  const heroY = useTransform(scrollY, [0, 300], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 250], [1, 0.3]);
  const heroScale = useTransform(scrollY, [-100, 0], [1.5, 1]);
  
  const headerOpacity = useTransform(scrollY, [80, 140], [0, 1]);
  const blurValue = useTransform(scrollY, [80, 140], [0, 12]);
  const headerBg = useMotionTemplate`rgba(0, 0, 0, ${headerOpacity})`;
  const headerBlur = useMotionTemplate`blur(${blurValue}px)`;

  return (
    <div 
      ref={onBackProp ? scrollRef : undefined}
      className={`min-h-screen bg-background relative ${onBackProp ? 'overflow-y-auto hide-scrollbar h-[100dvh]' : 'pb-24'}`}
    >
      {onBackProp && (
        <motion.div 
          className="sticky top-0 left-0 right-0 z-50 flex items-center h-16 px-4 gap-3 border-b border-transparent"
          style={{ backgroundColor: headerBg, backdropFilter: headerBlur, WebkitBackdropFilter: headerBlur, borderBottomColor: useMotionTemplate`rgba(255,255,255, ${useTransform(scrollY, [140, 160], [0, 0.05])})` }}
        >
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-colors shrink-0">
            <ArrowLeft size={20} />
          </button>
          <motion.div style={{ opacity: headerOpacity }} className="flex flex-col">
            <span className="text-15 font-bold text-on-surface tracking-tight leading-tight">{user.name}</span>
            <span className="text-1sm text-on-surface-variant font-medium leading-tight">{displayItems.length} posts</span>
          </motion.div>
        </motion.div>
      )}
      
      {/* Cover Photo */}
      <motion.div 
        className={`w-full relative origin-top ${onBackProp ? '-mt-16 h-56 sm:h-64' : 'h-48 sm:h-56'}`}
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-surface-container-high to-emerald-500/20" />
        <img src={`https://picsum.photos/seed/${user.handle}/800/400`} alt="Cover" className="w-full h-full object-cover mix-blend-overlay opacity-50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        {isMe && (
          <button
            onClick={goToSettings}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
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

        {/* Wallet / Balance Quick Link (Visible mainly if it's the current user) */}
        {isMe && (
          <motion.div 
            onClick={goToWallet}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="mb-8 p-4 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-primary/5 to-surface-container-high border border-white/10 hover:border-emerald-500/30 transition-all cursor-pointer relative overflow-hidden group shadow-lg"
          >
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-black/40 shadow-inner flex items-center justify-center text-emerald-400 border border-white/5">
                  <Wallet size={24} />
                </div>
                <div>
                  <p className="text-2xs text-on-surface-variant font-bold uppercase tracking-widest mb-0.5">Available Balance</p>
                  <p className="text-xl font-black text-on-surface tracking-tight">$1,240.50</p>
                </div>
              </div>
              <div className="bg-white/5 w-8 h-8 rounded-full flex items-center justify-center text-on-surface hover:bg-white/10 transition-colors">
                <ArrowRight size={16} />
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Tabs */}
        <div className="flex w-full border-b border-white/10 mb-4 overflow-x-auto hide-scrollbar">
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