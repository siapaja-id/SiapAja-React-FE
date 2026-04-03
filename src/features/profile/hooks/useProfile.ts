import { useState, useRef, useContext, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/src/store/main.store';
import { Author } from '@/src/shared/types/auth.types';
import { ProfilePageProps } from '@/src/shared/types/profile.types';
import { ColumnContext } from '@/src/shared/contexts/column.context';

export const useProfile = ({ user: userProp, onBack: onBackProp }: ProfilePageProps) => {
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

  const userItems = useMemo(
    () => feedItems.filter(item => item.author.handle === user.handle),
    [feedItems, user.handle]
  );
  const displayItems = userItems.length > 0 ? userItems : feedItems.slice(0, 3).map(i => ({...i, author: user}));

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

  return {
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
    shouldUseContainerScroll: !!onBackProp,
  };
};
