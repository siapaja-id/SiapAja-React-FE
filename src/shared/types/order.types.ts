export interface OrderData {
  title: string;
  summary: string;
  amount: string;
  type: string;
  matchType?: 'swipe' | 'bidding';
  autoAccept?: boolean;
  locations?: string[];
}
