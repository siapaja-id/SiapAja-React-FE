import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/src/store/main.store';

export const useReviewOrder = () => {
  const order = useStore(state => state.orderToReview);
  const navigate = useNavigate();

  const onBack = () => navigate('/');
  const onProceed = () => navigate('/payment');

  React.useEffect(() => {
    if (!order) navigate('/');
  }, [order, navigate]);

  return { order, onBack, onProceed };
};
