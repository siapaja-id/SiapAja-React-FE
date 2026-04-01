To create an amazing wallet experience, we'll design a beautifully crafted, glassmorphic **Wallet Page** with a stunning credit card/balance widget, quick action buttons, and a smooth transaction history. 

We will make it accessible in two intuitive ways:
1. **Desktop:** A dedicated `Wallet` icon in the left floating sidebar.
2. **Mobile (and Desktop):** A sleek, tappable "Balance Card" inside the user's `Profile` page.

Here is the step-by-step implementation.

### 1. Add `balance` to the Author Type
We'll update the user type to support an optional balance field.

```typescript // "src/shared/types/auth.types.ts" standard-diff
--- src/shared/types/auth.types.ts
+++ src/shared/types/auth.types.ts
@@ -5,4 +5,5 @@
   verified?: boolean;
   karma?: number;
   isOnline?: boolean;
+  balance?: number;
 }
```

### 2. Create the Wallet Page
Let's build a visually stunning Wallet page using Framer Motion for entrance animations, glassmorphic panels, and Lucide icons for a cohesive feel.

```typescript // "src/features/wallet/pages/Wallet.Page.tsx"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  History, 
  CreditCard, 
  ShieldCheck,
  TrendingUp,
  Landmark,
  ArrowRight
} from 'lucide-react';
import { DetailHeader, Button, UserAvatar } from '@/src/shared/ui/SharedUI.Component';
import { useStore } from '@/src/store/main.store';

// Mock Transactions
const TRANSACTIONS = [
  { id: 1, type: 'in', title: 'Payment for Logo Design', user: 'bobjones', amount: '+$150.00', date: 'Today, 14:30', status: 'completed' },
  { id: 2, type: 'out', title: 'Withdrawal to Bank', user: 'Bank Account', amount: '-$500.00', date: 'Yesterday, 09:15', status: 'completed' },
  { id: 3, type: 'escrow', title: 'Escrow: Airport Transfer', user: 'System', amount: '-$45.00', date: 'Mon, 18:20', status: 'pending' },
  { id: 4, type: 'in', title: 'Refund: Canceled Order', user: 'charlie_day', amount: '+$30.00', date: 'Sun, 11:10', status: 'completed' },
  { id: 5, type: 'in', title: 'Tip Received', user: 'diana', amount: '+$15.00', date: 'Sat, 16:45', status: 'completed' },
];

export const WalletPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useStore(state => state.currentUser);
  const [activeTab, setActiveTab] = useState<'all' | 'in' | 'out'>('all');

  const filteredTransactions = TRANSACTIONS.filter(tx => {
    if (activeTab === 'all') return true;
    if (activeTab === 'in') return tx.type === 'in';
    return tx.type === 'out' || tx.type === 'escrow';
  });

  return (
    <div className="h-full flex flex-col bg-background relative overflow-y-auto hide-scrollbar pb-24">
      <DetailHeader title="My Wallet" subtitle="Manage your funds securely" />
      
      <div className="px-4 mt-6 space-y-6">
        
        {/* Main Balance Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative p-6 sm:p-8 rounded-[32px] overflow-hidden group shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-primary/10 to-surface-container-high z-0" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 mix-blend-overlay" />
          
          {/* Animated Glow */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/30 blur-[60px] rounded-full z-0" 
          />

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span className="text-2xs font-bold uppercase tracking-widest text-emerald-400">Secured</span>
              </div>
              <CreditCard size={24} className="text-white/40" />
            </div>

            <div>
              <p className="text-sm font-medium text-white/60 mb-1">Total Available Balance</p>
              <h2 className="text-5xl font-black text-white tracking-tighter flex items-center gap-2">
                $1,240<span className="text-2xl text-white/50">.50</span>
              </h2>
            </div>

            <div className="mt-8 flex items-center gap-6 pt-6 border-t border-white/10">
              <div>
                <p className="text-2xs font-bold uppercase tracking-widest text-white/40 mb-1">In Escrow</p>
                <p className="text-sm font-bold text-white">$45.00</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <p className="text-2xs font-bold uppercase tracking-widest text-white/40 mb-1">Monthly Earned</p>
                <p className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                  <TrendingUp size={12} /> $890.00
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: 'topup', icon: Plus, label: 'Top Up', color: 'text-primary', bg: 'bg-primary/10' },
            { id: 'withdraw', icon: Landmark, label: 'Withdraw', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { id: 'transfer', icon: ArrowUpRight, label: 'Transfer', color: 'text-blue-400', bg: 'bg-blue-500/10' },
          ].map((action, idx) => (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + (idx * 0.05) }}
              className="flex flex-col items-center justify-center gap-3 p-4 rounded-3xl glass hover:bg-white/5 active:scale-95 transition-all"
            >
              <div className={`w-12 h-12 rounded-full ${action.bg} ${action.color} flex items-center justify-center`}>
                <action.icon size={20} strokeWidth={2.5} />
              </div>
              <span className="text-xs font-bold text-on-surface-variant">{action.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Transactions Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black text-on-surface flex items-center gap-2">
              <History size={18} className="text-primary" />
              Recent Activity
            </h3>
            <div className="flex bg-surface-container-high p-1 rounded-full border border-white/5">
              {['all', 'in', 'out'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                  className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full transition-colors ${
                    activeTab === tab 
                      ? 'bg-white/10 text-on-surface' 
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredTransactions.map((tx, idx) => (
                <motion.div
                  key={tx.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 rounded-2xl glass hover:bg-white/5 transition-colors flex items-center gap-4 cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    tx.type === 'in' ? 'bg-emerald-500/10 text-emerald-400' : 
                    tx.type === 'escrow' ? 'bg-amber-500/10 text-amber-400' : 
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {tx.type === 'in' ? <ArrowDownLeft size={18} /> : 
                     tx.type === 'escrow' ? <ShieldCheck size={18} /> : 
                     <ArrowUpRight size={18} />}
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-bold text-on-surface truncate">{tx.title}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5 truncate">{tx.date} • {tx.user}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className={`text-sm font-black ${
                      tx.type === 'in' ? 'text-emerald-400' : 'text-on-surface'
                    }`}>{tx.amount}</p>
                    <p className="text-2xs font-bold uppercase tracking-widest text-on-surface-variant mt-1">
                      {tx.status}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredTransactions.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="py-12 text-center text-on-surface-variant/50"
              >
                <Wallet size={32} className="mx-auto mb-3 opacity-50" />
                <p className="text-sm font-medium">No transactions found</p>
              </motion.div>
            )}
          </div>
          
          <div className="mt-4 pt-4 pb-12 text-center">
            <Button variant="ghost" className="w-full text-xs" size="sm">
              View All History <ArrowRight size={14} />
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
```

### 3. Add Wallet Route
Register the new route in the Kanban system.

```typescript // "src/features/kanban/routes.tsx" standard-diff
--- src/features/kanban/routes.tsx
+++ src/features/kanban/routes.tsx
@@ -7,6 +7,7 @@
 import { CreatePostPage } from '@/src/features/feed/pages/CreatePost.Page';
 import { PostDetailPage } from '@/src/features/feed/pages/PostDetail.Page';
 import { HomePage } from '@/src/features/feed/pages/Home.Page';
+import { WalletPage } from '@/src/features/wallet/pages/Wallet.Page';
 import { SettingsPage } from '@/src/features/settings/pages/Settings.Page';
 import { InboxPage } from '@/src/features/chat/pages/Inbox.Page';
 import { ColumnContext } from '@/src/shared/contexts/column.context';
@@ -28,6 +29,7 @@
   { path: '/task/:id', element: <PostDetailPage /> },
   { path: '/orders', element: <div className="p-20 text-center text-on-surface-variant font-black uppercase tracking-widest opacity-20">Orders View</div> },
   { path: '/radar', element: <RadarPage /> },
+  { path: '/wallet', element: <WalletPage /> },
   { path: '/messages', element: <InboxPage /> },
 ];
 
```

### 4. Add Wallet to Floating Sidebar (Desktop Nav)
Place it right before Profile for easy access.

```typescript // "src/features/kanban/components/FloatingSidebar.tsx" standard-diff
--- src/features/kanban/components/FloatingSidebar.tsx
+++ src/features/kanban/components/FloatingSidebar.tsx
@@ -9,6 +9,7 @@
   PanelLeftOpen,
   Zap,
   ClipboardList,
+  Wallet,
 } from 'lucide-react';
 import { motion, AnimatePresence } from 'framer-motion';
 import { UserAvatar } from '@/src/shared/ui/SharedUI.Component';
@@ -25,6 +26,7 @@
     { id: 'create', icon: Plus, label: 'Create', action: () => setShowCreateModal(true), isPrimary: true },
     { id: '/messages', icon: MessageCircle, label: 'Messages' },
     { id: '/orders', icon: ClipboardList, label: 'Orders' },
+    { id: '/wallet', icon: Wallet, label: 'Wallet' },
     { id: '/profile', icon: User, label: 'Profile' }
   ];
 
```

### 5. Add Balance Card to Profile Page (Mobile / Alternative Entry Point)
We will insert a beautifully styled inline wallet summary card on the user's profile, providing direct access to the Wallet page.

```typescript // "src/features/profile/pages/Profile.Page.tsx" standard-diff
--- src/features/profile/pages/Profile.Page.tsx
+++ src/features/profile/pages/Profile.Page.tsx
@@ -1,7 +1,7 @@
 import React, { useState, useRef, useContext } from 'react';
 import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
 import { useNavigate } from 'react-router-dom';
-import { ArrowLeft, BadgeCheck, MapPin, Link as LinkIcon, Calendar, Edit3, Share2, MessageCircle, Star, Settings } from 'lucide-react';
+import { ArrowLeft, BadgeCheck, MapPin, Link as LinkIcon, Calendar, Edit3, Share2, MessageCircle, Star, Settings, Wallet, ArrowRight } from 'lucide-react';
 import { UserAvatar, Button, FollowButton } from '@/src/shared/ui/SharedUI.Component';
 import { Author } from '@/src/shared/types/auth.types';
 import { ProfilePageProps } from '@/src/shared/types/profile.types';
@@ -25,6 +25,11 @@
     if (isDesktop) openColumn('/settings');
     else navigate('/settings');
   };
+  
+  const goToWallet = () => {
+    if (isDesktop) openColumn('/wallet');
+    else navigate('/wallet');
+  };
 
   const userItems = feedItems.filter(item => item.author.handle === user.handle);
   const displayItems = userItems.length > 0 ? userItems : feedItems.slice(0, 3).map(i => ({...i, author: user}));
@@ -107,6 +112,28 @@
             <span className="text-2sm uppercase tracking-widest text-on-surface-variant font-bold">Tasks Done</span>
           </div>
         </div>
+
+        {/* Wallet / Balance Quick Link (Visible mainly if it's the current user) */}
+        {isMe && (
+          <motion.div 
+            onClick={goToWallet}
+            whileHover={{ scale: 1.01 }}
+            whileTap={{ scale: 0.98 }}
+            className="mb-8 p-4 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-primary/5 to-surface-container-high border border-white/10 hover:border-emerald-500/30 transition-all cursor-pointer relative overflow-hidden group shadow-lg"
+          >
+            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
+            <div className="flex justify-between items-center relative z-10">
+              <div className="flex items-center gap-4">
+                <div className="w-12 h-12 rounded-2xl bg-black/40 shadow-inner flex items-center justify-center text-emerald-400 border border-white/5">
+                  <Wallet size={24} />
+                </div>
+                <div>
+                  <p className="text-2xs text-on-surface-variant font-bold uppercase tracking-widest mb-0.5">Available Balance</p>
+                  <p className="text-xl font-black text-on-surface tracking-tight">$1,240.50</p>
+                </div>
+              </div>
+              <div className="bg-white/5 w-8 h-8 rounded-full flex items-center justify-center text-on-surface hover:bg-white/10 transition-colors">
+                <ArrowRight size={16} />
+              </div>
+            </div>
+          </motion.div>
+        )}
         
         {/* Tabs */}
         <div className="flex w-full border-b border-white/10 mb-4 overflow-x-auto hide-scrollbar">
```

### Summary of what we just implemented:
1. **Wallet Page (`/wallet`)**: Added a beautifully styled screen featuring an animated, glowing credit-card-like balance view, prominent quick action buttons (Top up, Withdraw, Transfer), and an animated transaction history list with filtering capabilities.
2. **Global Access Point**: Added a `Wallet` button to the main desktop floating sidebar.
3. **Profile Access Point**: Added a visually stunning inline Balance Card widget on the user's `Profile` page if `isMe` is true. This elegantly solves the "Where to access it on mobile?" problem without cluttering the 5-item mobile bottom navigation bar.

```yaml
projectId: react-example
uuid: 4f1a239b-8d65-4f71-a9c1-48e0fc6b26d1
changeSummary:
  - edit: src/shared/types/auth.types.ts
  - new: src/features/wallet/pages/Wallet.Page.tsx
  - edit: src/features/kanban/routes.tsx
  - edit: src/features/kanban/components/FloatingSidebar.tsx
  - edit: src/features/profile/pages/Profile.Page.tsx
promptSummary: Create a beautiful Wallet page and integrate it intuitively into the UI (sidebar and profile).
gitCommitMsg: >-
  feat: add beautiful wallet page with profile and sidebar integration
  
  Created a glassmorphic Wallet page featuring a glowing balance card, quick actions, and transaction history. Integrated access via the desktop floating sidebar and a sleek summary widget on the user's Profile page.
```