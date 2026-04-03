import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/src/store/main.store';

const TRANSACTIONS = [
  { id: 1, type: 'in', title: 'Payment for Logo Design', user: 'bobjones', amount: '+$150.00', date: 'Today, 14:30', status: 'completed' },
  { id: 2, type: 'out', title: 'Withdrawal to Bank', user: 'Bank Account', amount: '-$500.00', date: 'Yesterday, 09:15', status: 'completed' },
  { id: 3, type: 'escrow', title: 'Escrow: Airport Transfer', user: 'System', amount: '-$45.00', date: 'Mon, 18:20', status: 'pending' },
  { id: 4, type: 'in', title: 'Refund: Canceled Order', user: 'charlie_day', amount: '+$30.00', date: 'Sun, 11:10', status: 'completed' },
  { id: 5, type: 'in', title: 'Tip Received', user: 'diana', amount: '+$15.00', date: 'Sat, 16:45', status: 'completed' },
];

type TabFilter = 'all' | 'in' | 'out';

export const useWallet = () => {
  const navigate = useNavigate();
  const currentUser = useStore(state => state.currentUser);
  const [activeTab, setActiveTab] = useState<TabFilter>('all');

  const filteredTransactions = useMemo(() => {
    return TRANSACTIONS.filter(tx => {
      if (activeTab === 'all') return true;
      if (activeTab === 'in') return tx.type === 'in';
      return tx.type === 'out' || tx.type === 'escrow';
    });
  }, [activeTab]);

  return {
    currentUser,
    activeTab,
    setActiveTab,
    filteredTransactions,
  };
};
