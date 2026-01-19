
import React, { useState, useEffect } from 'react';
import { User, View, Product, Chat as ChatType, Comment, Message, Story } from './types';
import LoginView from './views/LoginView';
import FeedView from './views/FeedView';
import ExploreView from './views/ExploreView';
import MarketView from './views/MarketView';
import ChatListView from './views/ChatListView';
import ChatDetailView from './views/ChatDetailView';
import UploadView from './views/UploadView';
import ProfileView from './views/ProfileView';
import PaymentView from './views/PaymentView';
import SettingsView from './views/SettingsView';
import ProductListView from './views/ProductListView';
import NotificationView from './views/NotificationView';
import UserProfileView from './views/UserProfileView';
import BottomNav from './components/BottomNav';

const MOCK_USER: User = {
  id: 'user1',
  name: 'Arjun Sharma',
  avatar: 'https://picsum.photos/seed/arjun/200',
  college: 'IIT Delhi',
  isVerified: true,
  upiId: 'arjun.nexus@upi',
  aiEnabled: true
};

const INITIAL_STORIES: Story[] = [
  { id: 's1', userId: 'user2', userName: 'Priya', userAvatar: 'https://picsum.photos/seed/Priya/100', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop', timestamp: Date.now() - 3600000, isLiked: false, likes: 12 },
  { id: 's2', userId: 'user3', userName: 'Rahul', userAvatar: 'https://picsum.photos/seed/Rahul/100', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop', timestamp: Date.now() - 7200000, isLiked: false, likes: 8 },
  { id: 's3', userId: 'u104', userName: 'Sana', userAvatar: 'https://picsum.photos/seed/sanav/100', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop', timestamp: Date.now() - 10800000, isLiked: false, likes: 15 },
  { id: 's4', userId: 'u106', userName: 'Ananya', userAvatar: 'https://picsum.photos/seed/ananya/100', image: 'https://images.unsplash.com/photo-1541339907198-e08756eaa58f?q=80&w=600&auto=format&fit=crop', timestamp: Date.now() - 14400000, isLiked: true, likes: 45 },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    sellerId: 'user2',
    sellerName: 'Priya Patel',
    title: 'iPad Pro 2022 - Like New',
    description: 'Barely used iPad Pro, perfect for digital note-taking. Includes Apple Pencil Gen 2.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop',
    category: 'Gadget',
    likedBy: ['Rahul Varma', 'Sana Khan', 'Vikram Singh'],
    likes: 3,
    shares: 42,
    comments: [],
    isLiked: false,
    isWishlisted: false,
    isPinned: false
  },
  {
    id: 'p2',
    sellerId: 'user3',
    sellerName: 'Rahul Varma',
    title: 'Organic Chemistry Hand-written Notes',
    description: 'Complete notes for Semester 3. Very detailed with diagrams.',
    price: 500,
    image: 'https://images.unsplash.com/photo-1453749024858-4bca89bd9edc?q=80&w=800&auto=format&fit=crop',
    category: 'Notebook',
    likedBy: ['Priya Patel', 'Ishaan K.'],
    likes: 2,
    shares: 112,
    comments: [],
    isLiked: true,
    isWishlisted: true,
    isPinned: true
  },
  {
    id: 'p3',
    sellerId: 'u104',
    sellerName: 'Sana Varma',
    title: 'Kindle Paperwhite (10th Gen)',
    description: '8GB version. Waterproof. Great for reading textbooks on the go.',
    price: 7500,
    image: 'https://images.unsplash.com/photo-1594980596870-8cb524b89927?q=80&w=800&auto=format&fit=crop',
    category: 'Gadget',
    likedBy: [],
    likes: 12,
    shares: 5,
    comments: [],
    isLiked: false,
    isWishlisted: false,
    isPinned: false
  },
  {
    id: 'p4',
    sellerId: 'u107',
    sellerName: 'Vikram Singh',
    title: 'Scientific Calculator Casio fx-991EX',
    description: 'Essential for engineering students. In perfect working condition.',
    price: 900,
    image: 'https://images.unsplash.com/photo-1574607383476-f517f220d35b?q=80&w=800&auto=format&fit=crop',
    category: 'Gadget',
    likedBy: [],
    likes: 8,
    shares: 2,
    comments: [],
    isLiked: false,
    isWishlisted: false,
    isPinned: false
  },
  {
    id: 'p5',
    sellerId: 'u108',
    sellerName: 'Megha Rao',
    title: 'Engineering Drawing Set',
    description: 'Complete set with compass, dividers, and various scales. Used for one semester.',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop',
    category: 'Stationery',
    likedBy: [],
    likes: 5,
    shares: 1,
    comments: [],
    isLiked: false,
    isWishlisted: false,
    isPinned: false
  },
  {
    id: 'p6',
    sellerId: 'u109',
    sellerName: 'Karthik S.',
    title: 'Data Structures & Algorithms Notes',
    description: 'Handwritten notes focusing on Big O, Trees, and Graphs. Very helpful for placements.',
    price: 300,
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=800&auto=format&fit=crop',
    category: 'Notebook',
    likedBy: [],
    likes: 45,
    shares: 89,
    comments: [],
    isLiked: false,
    isWishlisted: false,
    isPinned: false
  },
  {
    id: 'p7',
    sellerId: 'u110',
    sellerName: 'Sneha Kapur',
    title: 'Dorm Electric Kettle (1.5L)',
    description: 'Heats water in 2 minutes. Perfect for late-night Maggi or tea.',
    price: 600,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3ecc50f6?q=80&w=800&auto=format&fit=crop',
    category: 'Other',
    likedBy: [],
    likes: 21,
    shares: 12,
    comments: [],
    isLiked: false,
    isWishlisted: false,
    isPinned: false
  },
  {
    id: 'p8',
    sellerId: 'u111',
    sellerName: 'Rohan Das',
    title: 'Sony WH-1000XM4 Headphones',
    description: 'Industry-leading noise canceling. Perfect for studying in noisy libraries.',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1618366712277-7bcba203088a?q=80&w=800&auto=format&fit=crop',
    category: 'Gadget',
    likedBy: [],
    likes: 67,
    shares: 34,
    comments: [],
    isLiked: false,
    isWishlisted: false,
    isPinned: false
  },
  {
    id: 'p9',
    sellerId: 'u112',
    sellerName: 'Zoya Ahmed',
    title: 'Calculus Solved Papers (Last 5 Years)',
    description: 'Previous year question papers with detailed step-by-step solutions.',
    price: 250,
    image: 'https://images.unsplash.com/photo-1543004629-142a7a5f679a?q=80&w=800&auto=format&fit=crop',
    category: 'Notebook',
    likedBy: [],
    likes: 18,
    shares: 56,
    comments: [],
    isLiked: false,
    isWishlisted: false,
    isPinned: false
  },
  {
    id: 'p10',
    sellerId: 'u113',
    sellerName: 'Abhishek J.',
    title: 'Campus Cycle - Atlas Gold',
    description: 'Smooth riding cycle. Good for getting between departments quickly.',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=800&auto=format&fit=crop',
    category: 'Other',
    likedBy: [],
    likes: 9,
    shares: 4,
    comments: [],
    isLiked: false,
    isWishlisted: false,
    isPinned: false
  }
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('LOGIN');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [viewedUser, setViewedUser] = useState<User | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [checkoutType, setCheckoutType] = useState<'BUY' | 'RENT'>('BUY');
  const [initialOffer, setInitialOffer] = useState<number | undefined>(undefined);
  const [myPurchases, setMyPurchases] = useState<Product[]>([]);
  const [uploadMode, setUploadMode] = useState<'PRODUCT' | 'STORY'>('PRODUCT');

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('nexus_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setCurrentView('FEED');
    }
  }, []);

  const handleLogin = (name: string) => {
    const newUser = { ...MOCK_USER, name };
    setCurrentUser(newUser);
    localStorage.setItem('nexus_user', JSON.stringify(newUser));
    setCurrentView('FEED');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('nexus_user');
    setCurrentView('LOGIN');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('nexus_user', JSON.stringify(updatedUser));
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts([newProduct, ...products]);
    setCurrentView('MARKET');
  };

  const handleAddStory = (newStory: Story) => {
    setStories([newStory, ...stories]);
    setCurrentView('FEED');
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleDeleteStory = (storyId: string) => {
    setStories(prev => prev.filter(s => s.id !== storyId));
  };

  const toggleLike = (productId: string) => {
    if (!currentUser) return;
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const isLiked = p.likedBy.includes(currentUser.name);
        const newLikedBy = isLiked 
          ? p.likedBy.filter(name => name !== currentUser.name)
          : [...p.likedBy, currentUser.name];
        
        return { 
          ...p, 
          isLiked: !isLiked, 
          likes: newLikedBy.length, 
          likedBy: newLikedBy 
        };
      }
      return p;
    }));
  };

  const toggleLikeStory = (storyId: string) => {
    setStories(prev => prev.map(s => {
      if (s.id === storyId) {
        return { ...s, isLiked: !s.isLiked, likes: (s.likes || 0) + (s.isLiked ? -1 : 1) };
      }
      return s;
    }));
  };

  const toggleWishlist = (productId: string) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, isWishlisted: !p.isWishlisted } : p));
  };

  const togglePin = (productId: string) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, isPinned: !p.isPinned } : p));
  };

  const handleComment = (productId: string, text: string) => {
    if (!currentUser) return;
    const newComment: Comment = { id: Math.random().toString(36).substr(2, 9), userId: currentUser.id, userName: currentUser.name, text, timestamp: Date.now() };
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, comments: [...p.comments, newComment] } : p));
  };

  const handleShareApp = async () => {
    const shareData = {
      title: 'Nexus - The Student Ecosystem',
      text: 'Join Nexus! The ultimate campus marketplace to buy, sell, and share notebooks or gadgets with fellow students. 🚀',
      url: window.location.origin
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing app:", err);
      }
    } else {
      const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareData.text + " " + shareData.url)}`;
      window.open(shareUrl, '_blank');
    }
  };

  const handleShare = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const shareData = {
      title: `Nexus: ${product.title}`,
      text: `Hey! Check out this ${product.title} (${product.category}) on Nexus for ₹${product.price.toLocaleString('en-IN')}. It's a great deal! ✨`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, shares: p.shares + 1 } : p));
      } catch (err) {
        console.log("Error sharing product:", err);
      }
    } else {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(shareData.text + " View it here: " + shareData.url)}`;
      window.open(waUrl, '_blank');
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, shares: p.shares + 1 } : p));
    }
  };

  const handlePurchaseComplete = () => {
    if (checkoutProduct) {
      const itemToCollect = { 
        ...checkoutProduct, 
        purchaseType: checkoutType === 'BUY' ? 'BOUGHT' as const : 'RENTED' as const 
      };
      setMyPurchases(prev => [itemToCollect, ...prev]);
      setProducts(prev => prev.filter(p => p.id !== checkoutProduct.id));
    }
    setCurrentView('PROFILE');
  };

  const navigateToUpload = (mode: 'PRODUCT' | 'STORY') => {
    setUploadMode(mode);
    setCurrentView('UPLOAD');
  };

  const navigateToUserProfile = (user: User) => {
    setViewedUser(user);
    setCurrentView('USER_PROFILE');
  };

  const renderView = () => {
    switch (currentView) {
      case 'LOGIN': return <LoginView onLogin={handleLogin} />;
      case 'FEED': return <FeedView 
        currentUser={currentUser!}
        products={products} 
        stories={stories} 
        onLike={toggleLike} 
        onLikeStory={toggleLikeStory}
        onComment={handleComment} 
        onShare={handleShare}
        onDeleteProduct={handleDeleteProduct}
        onDeleteStory={handleDeleteStory}
        onNavigateToChat={() => setCurrentView('CHAT')}
        onNavigateToNotifications={() => setCurrentView('NOTIFICATIONS')}
        onNavigateToUserProfile={navigateToUserProfile}
        onAddStoryClick={() => navigateToUpload('STORY')}
      />;
      case 'EXPLORE': return <ExploreView products={products} onSelectProduct={(p) => { setCheckoutProduct(p); setCurrentView('MARKET'); }} />;
      case 'MARKET': return <MarketView 
        products={products} 
        onToggleWishlist={toggleWishlist}
        onTogglePin={togglePin}
        onShare={handleShare}
        onBargain={(product, offer) => {
          setSelectedChatId('chat_with_' + product.sellerId);
          setInitialOffer(offer);
          setCurrentView('CHAT_DETAIL');
        }} 
        onBuyNow={(product) => {
          setCheckoutProduct(product);
          setCheckoutType('BUY');
          setCurrentView('PAYMENT');
        }} 
        onRentNow={(product) => {
          setCheckoutProduct(product);
          setCheckoutType('RENT');
          setCurrentView('PAYMENT');
        }}
      />;
      case 'CHAT': return <ChatListView onSelectChat={(id) => { setSelectedChatId(id); setCurrentView('CHAT_DETAIL'); }} onNavigateToUserProfile={navigateToUserProfile} />;
      case 'CHAT_DETAIL': return <ChatDetailView chatId={selectedChatId!} initialOffer={initialOffer} onBack={() => { setCurrentView('CHAT'); setInitialOffer(undefined); }} currentUser={currentUser!} onNavigateToUserProfile={navigateToUserProfile} />;
      case 'UPLOAD': return <UploadView onUpload={handleAddProduct} onAddStory={handleAddStory} currentUser={currentUser!} initialType={uploadMode} />;
      case 'PROFILE': return <ProfileView 
        user={currentUser!} 
        myPurchases={myPurchases} 
        onLogout={handleLogout} 
        onSettings={() => setCurrentView('SETTINGS')} 
        onWishlist={() => setCurrentView('WISHLIST')}
        onManageListings={() => setCurrentView('MY_LISTINGS')}
        onShareApp={handleShareApp}
      />;
      case 'SETTINGS': return <SettingsView user={currentUser!} onBack={() => setCurrentView('PROFILE')} onUpdateUser={handleUpdateUser} />;
      case 'PAYMENT': return <PaymentView product={checkoutProduct!} type={checkoutType} onBack={() => setCurrentView('MARKET')} onComplete={handlePurchaseComplete} />;
      case 'WISHLIST': return <ProductListView 
        title="My Wishlist" 
        products={products.filter(p => p.isWishlisted)} 
        onBack={() => setCurrentView('PROFILE')} 
        onAction={(p) => { setCheckoutProduct(p); setCheckoutType('BUY'); setCurrentView('PAYMENT'); }}
        onShare={handleShare}
        actionLabel="Buy"
      />;
      case 'MY_LISTINGS': return <ProductListView 
        title="My Listings" 
        products={products.filter(p => p.sellerId === currentUser?.id)} 
        onBack={() => setCurrentView('PROFILE')} 
        onAction={() => {}} 
        onDelete={handleDeleteProduct}
        onShare={handleShare}
        actionLabel="Edit"
      />;
      case 'NOTIFICATIONS': return <NotificationView onBack={() => setCurrentView('FEED')} />;
      case 'USER_PROFILE': return <UserProfileView user={viewedUser!} products={products} onBack={() => setCurrentView('FEED')} onNavigateToChat={() => setCurrentView('CHAT')} />;
      default: return <FeedView currentUser={currentUser!} products={products} stories={stories} onLike={toggleLike} onLikeStory={toggleLikeStory} onComment={handleComment} onShare={handleShare} onDeleteProduct={handleDeleteProduct} onDeleteStory={handleDeleteStory} onNavigateToChat={() => setCurrentView('CHAT')} onNavigateToNotifications={() => setCurrentView('NOTIFICATIONS')} onNavigateToUserProfile={navigateToUserProfile} onAddStoryClick={() => navigateToUpload('STORY')} />;
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-white shadow-xl flex flex-col relative overflow-hidden">
      <main className="flex-1 overflow-y-auto hide-scrollbar pb-20">
        {renderView()}
      </main>
      {currentUser && currentView !== 'LOGIN' && currentView !== 'PAYMENT' && currentView !== 'SETTINGS' && (
        <BottomNav currentView={currentView} setView={setCurrentView} />
      )}
    </div>
  );
};

export default App;
