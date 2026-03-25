export type VideoType = 'video' | 'short';

export interface Channel {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  subscribers: number;
  verified: boolean;
  description: string;
  banner?: string;
}

export interface Comment {
  id: string;
  videoId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  likes: number;
  createdAt: string;
  type: 'positive' | 'neutral' | 'hate';
  replies?: Comment[];
}

export interface Video {
  id: string;
  type: VideoType;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  channel: Channel;
  views: number;
  likes: number;
  dislikes: number;
  comments: Comment[];
  duration: string;
  uploadedAt: string;
  tags: string[];
  category: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin';
  subscribedChannels: string[];
  watchHistory: string[];
  likedVideos: string[];
  createdAt: string;
}

export type AdminTab = 'analytics' | 'boost' | 'moderation' | 'users' | 'content';
export type BoostType = 'subscribers' | 'likes' | 'views' | 'comments';
export type CommentSentiment = 'positive' | 'neutral' | 'hate';
export type AppPage = 'home' | 'shorts' | 'video' | 'channel' | 'upload' | 'admin' | 'login' | 'trending' | 'subscriptions' | 'library';
