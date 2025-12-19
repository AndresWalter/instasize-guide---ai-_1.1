export interface SizeSpec {
  id: string;
  title: string;
  category: 'profile' | 'feed' | 'story' | 'reels' | 'video' | 'ads';
  dimensions: string;
  width: number;
  height: number;
  aspectRatio: string;
  description: string;
  iconName: string;
  tips: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}