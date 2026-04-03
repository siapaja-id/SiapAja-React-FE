import { useContext } from 'react';
import { ColumnContext } from '@/src/shared/contexts/column.context';
import { Author } from '@/src/shared/types/auth.types';

export const useProfileRoute = () => {
  const { state } = useContext(ColumnContext);
  const user = state?.user as Author | undefined;
  return { user };
};
