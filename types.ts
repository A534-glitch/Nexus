
export interface User {
  id: string;
  name: string;
  avatar: string;
  college?: string;
  isVerified?: boolean;
  upiId?: string;
  aiEnabled?: boolean;
  theme?: 'light' | 'dark';
  bio?: string;
  followers?: number;
  following?: number;
  postsCount?: number;
  notificationPrefs?: {
    messages: boolean;
    bargains: boolean;
    likes: boolean;
    comments: boolean;
    campusAlerts: boolean;
  };
}

export type ProductCondition = 'Brand New' | 'Like New' | 'Good' | 'Fair';

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  price: number;
  rentPrice?: number;
  canRent?: boolean;
  image: string;
  category: 'Notebook' | 'Gadget' | 'Stationery' | 'Other';
  likes: number;
  likedBy: string[];
  shares: number;
  comments: Comment[];
  isLiked?: boolean;
  isWishlisted?: boolean;
  isPinned?: boolean;
  purchaseType?: 'BOUGHT' | 'RENTED';
  condition: ProductCondition;
  // Advanced Gadget Specs
  specs?: {
    brand?: string;
    connectivity?: 'Wireless' | 'Wired' | 'Bluetooth' | 'USB-C' | 'Lightning';
    compatibility?: string[]; // e.g., ["iOS", "Android", "Mac", "Windows"]
    storage?: string; // e.g., "128GB", "512GB"
    warranty?: boolean;
  };
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  image: string;
  timestamp: number;
  isLiked?: boolean;
  likes?: number;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text?: string;
  image?: string;
  timestamp: number;
  offerAmount?: number;
  isAi?: boolean;
  replyTo?: {
    text: string;
    senderName: string;
  };
}

export interface Chat {
  id: string;
  participants: User[];
  lastMessage: string;
  messages: Message[];
  isPinned?: boolean;
}

export interface Collection {
  id: string;
  name: string;
  productIds: string[];
  coverImage: string;
}

export type View = 'LOGIN' | 'FEED' | 'EXPLORE' | 'MARKET' | 'CHAT' | 'UPLOAD' | 'PROFILE' | 'CHAT_DETAIL' | 'PAYMENT' | 'SETTINGS' | 'WISHLIST' | 'MY_LISTINGS' | 'NOTIFICATIONS' | 'USER_PROFILE' | 'AI_CHAT' | 'WALLET';
