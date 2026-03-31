import { createContext } from 'react';

export const ColumnContext = createContext<{ id: string; path: string; state?: Record<string, unknown> }>({ id: 'main-col', path: '/' });
