import React, { useContext } from 'react';
import { useRoutes } from 'react-router-dom';
import { RadarPage } from '@/src/features/gigs/pages/Radar.Page';
import { ProfilePage } from '@/src/features/profile/pages/Profile.Page';
import { ReviewOrder } from '@/src/features/gigs/pages/ReviewOrder.Page';
import { PaymentPage } from '@/src/features/gigs/pages/Payment.Page';
import { CreatePostPage } from '@/src/features/feed/pages/CreatePost.Page';
import { PostDetailPage } from '@/src/features/feed/pages/PostDetail.Page';
import { HomePage } from '@/src/features/feed/pages/Home.Page';
import { SettingsPage } from '@/src/features/settings/pages/Settings.Page';
import { InboxPage } from '@/src/features/chat/pages/Inbox.Page';
import { ColumnContext } from '@/src/shared/contexts/column.context';
import { Author } from '@/src/shared/types/auth.types';
import { ColumnRoutesProps } from '@/src/shared/types/kanban.types';

export const ProfileRoute: React.FC = () => {
  const { state } = useContext(ColumnContext);
  const user = state?.user as Author | undefined;
  return <div className="pb-20 h-full overflow-y-auto hide-scrollbar"><ProfilePage user={user} /></div>;
};

export const columnRoutes = [
  { path: '/', element: <HomePage /> },
  { path: '/review-order', element: <ReviewOrder /> },
  { path: '/payment', element: <PaymentPage /> },
  { path: '/create-post', element: <CreatePostPage /> },
  { path: '/profile', element: <ProfileRoute /> },
  { path: '/settings', element: <SettingsPage /> },
  { path: '/post/:id', element: <PostDetailPage /> },
  { path: '/task/:id', element: <PostDetailPage /> },
  { path: '/orders', element: <div className="p-20 text-center text-on-surface-variant font-black uppercase tracking-widest opacity-20">Orders View</div> },
  { path: '/radar', element: <RadarPage /> },
  { path: '/messages', element: <InboxPage /> },
];

export const ColumnRoutes: React.FC<ColumnRoutesProps> = ({ path }) => {
  const routes = useRoutes(columnRoutes, path);
  return routes;
};