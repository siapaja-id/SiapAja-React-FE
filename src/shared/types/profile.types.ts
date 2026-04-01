import { Author } from './auth.types';

export interface ProfilePageProps {
  user?: Author;
  onBack?: () => void;
}
