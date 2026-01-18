
export interface User {
  id: string;
  name: string;
  avatar: string;
  college?: string;
  isVerified?: boolean;
  upiId?: string;
  aiEnabled?: boolean;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  price: number;
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
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  image: string;
  timestamp: number;
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

export type View = 'LOGIN' | 'FEED' | 'MARKET' | 'CHAT' | 'UPLOAD' | 'PROFILE' | 'CHAT_DETAIL' | 'PAYMENT' | 'SETTINGS' | 'WISHLIST' | 'MY_LISTINGS';
