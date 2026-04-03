import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '@/src/store/main.store';
import { ThemeMode } from '@/src/shared/types/app.types';

export const useApp = () => {
  const isDesktop = useStore(state => state.isDesktop);
  const setIsDesktop = useStore(state => state.setIsDesktop);
  const showCreateModal = useStore(state => state.showCreateModal);
  const showChatRoom = useStore(state => state.showChatRoom);
  const themeColor = useStore(state => state.themeColor);
  const textSize = useStore(state => state.textSize);
  const zoomLevel = useStore(state => state.zoomLevel);
  const themeMode = useStore(state => state.themeMode);

  useEffect(() => {
    const root = document.documentElement;
    const colors = { red: '#DC2626', blue: '#3B82F6', emerald: '#10B981', violet: '#8B5CF6', amber: '#F59E0B' };
    const sizes = { sm: '12px', md: '14px', lg: '16px' };
    root.style.setProperty('--app-primary', colors[themeColor] || colors.red);
    root.style.setProperty('--app-text-base', sizes[textSize] || sizes.md);
  }, [themeColor, textSize]);

  useEffect(() => {
    const root = document.documentElement;
    
    const applyTheme = (mode: ThemeMode) => {
      let isDark = true;
      if (mode === 'auto') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else if (mode === 'light') {
        isDark = false;
      }
      root.classList.toggle('light', !isDark);
    };

    applyTheme(themeMode);

    if (themeMode === 'auto') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme('auto');
      media.addEventListener('change', handler);
      return () => media.removeEventListener('change', handler);
    }
  }, [themeMode]);

  useEffect(() => {
    const unsub = useStore.subscribe((state) => {
      localStorage.setItem('siapaja-settings', JSON.stringify({
        themeMode: state.themeMode,
        themeColor: state.themeColor,
        textSize: state.textSize,
        zoomLevel: state.zoomLevel,
      }));
    });
    return unsub;
  }, []);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsDesktop]);

  return {
    isDesktop,
    showCreateModal,
    showChatRoom,
    zoomLevel,
  };
};

export const useMobileLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const setShowCreateModal = useStore(state => state.setShowCreateModal);

  return {
    location,
    navigate,
    setShowCreateModal,
    showNav: ['/', '/radar', '/messages', '/profile', '/orders'].includes(location.pathname),
  };
};
