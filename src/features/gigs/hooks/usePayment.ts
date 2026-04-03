import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/src/store/main.store';

type PaymentStatus = 'selecting' | 'processing' | 'success';

export const usePayment = () => {
  const order = useStore(state => state.orderToReview);
  const setOrderToReview = useStore(state => state.setOrderToReview);
  const navigate = useNavigate();
  const [status, setStatus] = useState<PaymentStatus>('selecting');

  const onBack = useCallback(() => navigate(-1), [navigate]);

  const onSuccess = useCallback(() => {
    navigate('/');
    setOrderToReview(null);
  }, [navigate, setOrderToReview]);

  const handlePayment = useCallback(() => {
    if (!order) return;
    setStatus('processing');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 3000);
  }, [order, onSuccess]);

  useEffect(() => {
    if (!order) navigate('/');
  }, [order, navigate]);

  return {
    order,
    status,
    onBack,
    handlePayment,
    shouldRender: !!order,
  };
};
