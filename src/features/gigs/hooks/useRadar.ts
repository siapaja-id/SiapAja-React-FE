import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/src/store/main.store';
import { GIGS } from '@/src/shared/data/mock-gigs';
import { Gig } from '@/src/shared/types/gigs.types';

export const useRadar = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | null>(null);
  
  const activeGig = useStore(state => state.activeGig);
  const queuedGigs = useStore(state => state.queuedGigs);
  const setActiveGig = useStore(state => state.setActiveGig);
  const addQueuedGig = useStore(state => state.addQueuedGig);
  const isAutoPilot = useStore(state => state.isAutoPilot);
  const setIsAutoPilot = useStore(state => state.setIsAutoPilot);

  const [matchedGig, setMatchedGig] = useState<Gig | null>(null);
  const [biddingGig, setBiddingGig] = useState<Gig | null>(null);
  const [bidAmount, setBidAmount] = useState(50);
  const [replyText, setReplyText] = useState('');

  const advanceNext = () => {
    setSwipeDirection(null);
    setBiddingGig(null);
    if (currentIndex < GIGS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    setSwipeDirection(direction);
    const currentGig = GIGS[currentIndex];
    
    setTimeout(() => {
      if (direction === 'up') {
        setBidAmount(parseInt(currentGig.price.replace(/[^0-9]/g, '')) || 50);
        setBiddingGig(currentGig);
      } else if (direction === 'right') {
        if (!activeGig) setActiveGig(currentGig);
        else addQueuedGig(currentGig);
        setMatchedGig(currentGig);
      } else {
        advanceNext();
      }
    }, 300);
  };

  const handleBidSubmit = () => {
    setReplyText('');
    advanceNext();
  };

  const handleContinue = () => {
    setMatchedGig(null);
    advanceNext();
  };

  const visibleGigs = GIGS.map((gig, index) => {
    if (index < currentIndex) return null;
    if (index > currentIndex + 1) return null;
    return { gig, index };
  }).filter(Boolean) as { gig: Gig, index: number }[];

  useEffect(() => {
    if (isAutoPilot && currentIndex < GIGS.length) {
      const timer = setTimeout(() => {
        handleSwipe('right');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isAutoPilot, currentIndex]);

  return {
    currentIndex,
    swipeDirection,
    activeGig,
    queuedGigs,
    isAutoPilot,
    setIsAutoPilot,
    matchedGig,
    biddingGig,
    bidAmount,
    setBidAmount,
    replyText,
    setReplyText,
    visibleGigs,
    handleSwipe,
    advanceNext,
    handleBidSubmit,
    handleContinue,
    gigsLength: GIGS.length,
  };
};
