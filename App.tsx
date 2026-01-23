
import React, { useState, useEffect } from 'react';
import { User, View, Product, Chat as ChatType, Comment, Message, Story } from './types';
import LoginView from './views/LoginView';
import FeedView from './views/FeedView';
import ExploreView from './views/ExploreView';
import MarketView from './views/MarketView';
import ChatListView from './views/ChatListView';
import ChatDetailView from './views/ChatDetailView';
import AiChatView from './views/AiChatView';
import UploadView from './views/UploadView';
import ProfileView from './views/ProfileView';
import PaymentView from './views/PaymentView';
import SettingsView from './views/SettingsView';
import ProductListView from './views/ProductListView';
import NotificationView from './views/NotificationView';
import UserProfileView from './views/UserProfileView';
import WalletView from './views/WalletView';
import BottomNav from './components/BottomNav';
import { Share2, CheckCircle } from 'lucide-react';

const INITIAL_STORIES: Story[] = [
  { id: 's1', userId: 'user2', userName: 'Priya', userAvatar: 'https://picsum.photos/seed/Priya/100', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop', timestamp: Date.now() - 3600000, isLiked: false, likes: 12 },
  { id: 's2', userId: 'user3', userName: 'Rahul', userAvatar: 'https://picsum.photos/seed/Rahul/100', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop', timestamp: Date.now() - 7200000, isLiked: false, likes: 8 },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    sellerId: 'user2',
    sellerName: 'Priya Patel',
    title: 'iPad Pro 2022 - Like New',
    description: 'Barely used iPad Pro, perfect for digital note-taking. Includes Apple Pencil Gen 2.',
    price: 45000,
    rentPrice: 4500,
    canRent: true,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop',
    category: 'Gadget',
    likedBy: ['Rahul Varma'],
    likes: 1,
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
    title: 'Organic Chemistry Notes',
    description: 'Complete Semester 3 notes. Hand-written with color coding.',
    price: 500,
    rentPrice: 100,
    canRent: true,
    image: 'https://images.unsplash.com/photo-1453749024858-4bca89bd9edc?q=80&w=800&auto=format&fit=crop',
    category: 'Notebook',
    likedBy: ['Priya Patel'],
    likes: 1,
    shares: 112,
    comments: [],
    isLiked: true,
    isWishlisted: true,
    isPinned: true
  }
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('LOGIN');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('nexus_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch { return INITIAL_PRODUCTS; }
  });
  
  const [stories, setStories] = useState<Story[]>(() => {
    try {
      const saved = localStorage.getItem('nexus_stories');
      return saved ? JSON.parse(saved) : INITIAL_STORIES;
    } catch { return INITIAL_STORIES; }
  });

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [viewedUser, setViewedUser] = useState<User | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [checkoutType, setCheckoutType] = useState<'BUY' | 'RENT'>('BUY');
  const [initialOffer, setInitialOffer] = useState<number | undefined>(undefined);
  const [myPurchases, setMyPurchases] = useState<Product[]>([]);
  const [uploadMode, setUploadMode] = useState<'PRODUCT' | 'STORY'>('PRODUCT');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('nexus_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('nexus_stories', JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    const savedUser = localStorage.getItem('nexus_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      if (user.theme) {
        setTheme(user.theme);
      }
      setCurrentView('FEED');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = (name: string) => {
    const existingUsers = JSON.parse(localStorage.getItem('nexus_registry') || '[]');
    let user = existingUsers.find((u: User) => u.name.toLowerCase() === name.toLowerCase());
    
    if (!user) {
      user = {
        id: `user_${Date.now()}`,
        name,
        avatar: `https://picsum.photos/seed/${name}/200`,
        college: 'Nexus University',
        isVerified: true,
        upiId: `${name.toLowerCase()}.nexus@upi`,
        aiEnabled: true,
        followers: Math.floor(Math.random() * 500),
        following: Math.floor(Math.random() * 200),
        postsCount: 0,
        theme: 'light',
        notificationPrefs: {
          messages: true, bargains: true, likes: true, comments: true, campusAlerts: true
        }
      };
      localStorage.setItem('nexus_registry', JSON.stringify([...existingUsers, user]));
    }
    
    setCurrentUser(user);
    if (user.theme) setTheme(user.theme);
    localStorage.setItem('nexus_user', JSON.stringify(user));
    setCurrentView('FEED');
    showToast(`Welcome to Campus, ${name}! 👋`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('nexus_user');
    setCurrentView('LOGIN');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    if (updatedUser.theme) setTheme(updatedUser.theme as any);
    localStorage.setItem('nexus_user', JSON.stringify(updatedUser));
    const registry = JSON.parse(localStorage.getItem('nexus_registry') || '[]');
    localStorage.setItem('nexus_registry', JSON.stringify(registry.map((u: User) => u.id === updatedUser.id ? updatedUser : u)));
    showToast("Identity updated successfully! ✨");
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    setCurrentView('MARKET');
    showToast("Listing published to all peers! 🚀");
  };

  const handleAddStory = (newStory: Story) => {
    setStories(prev => [newStory, ...prev]);
    setCurrentView('FEED');
    showToast("Story shared with the campus! ✨");
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
        return { ...p, isLiked: !isLiked, likes: newLikedBy.length, likedBy: newLikedBy };
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
    const newComment: Comment = { 
      id: Math.random().toString(), 
      userId: currentUser.id, 
      userName: currentUser.name, 
      text, 
      timestamp: Date.now() 
    };
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, comments: [...p.comments, newComment] } : p));
  };

  const renderView = () => {
    if (!currentUser && currentView !== 'LOGIN') {
       return <LoginView onLogin={handleLogin} />;
    }

    switch (currentView) {
      case 'LOGIN': return <LoginView onLogin={handleLogin} />;
      case 'FEED': return (
        <FeedView 
          currentUser={currentUser!}
          products={products}
          stories={stories}
          onLike={toggleLike}
          onLikeStory={toggleLikeStory}
          onComment={handleComment}
          onShare={() => showToast("Resource link copied! 🔗")}
          onShareStory={() => showToast("Story link shared! ✨")}
          onDeleteProduct={handleDeleteProduct}
          onDeleteStory={handleDeleteStory}
          onNavigateToChat={() => setCurrentView('CHAT')}
          onNavigateToNotifications={() => setCurrentView('NOTIFICATIONS')}
          onNavigateToUserProfile={(user) => { setViewedUser(user); setCurrentView('USER_PROFILE'); }}
          onNavigateToWallet={() => setCurrentView('WALLET')}
          onAddStoryClick={() => { setUploadMode('STORY'); setCurrentView('UPLOAD'); }}
          onQuickBuy={(p) => { setCheckoutProduct(p); setCheckoutType('BUY'); setCurrentView('PAYMENT'); }}
          onQuickRent={(p) => { setCheckoutProduct(p); setCheckoutType('RENT'); setCurrentView('PAYMENT'); }}
        />
      );
      case 'EXPLORE': return (
        <ExploreView 
          products={products}
          onSelectProduct={(p) => { setCheckoutProduct(p); setCheckoutType('BUY'); setCurrentView('PAYMENT'); }}
          onNavigateToUserProfile={(user) => { setViewedUser(user); setCurrentView('USER_PROFILE'); }}
          onNavigateToChat={(userId) => { setSelectedChatId(userId); setCurrentView('CHAT_DETAIL'); }}
        />
      );
      case 'MARKET': return (
        <MarketView 
          products={products}
          onBargain={(p) => { setSelectedChatId(p.sellerId); setCurrentView('CHAT_DETAIL'); }}
          onBuyNow={(p) => { setCheckoutProduct(p); setCheckoutType('BUY'); setCurrentView('PAYMENT'); }}
          onRentNow={(p) => { setCheckoutProduct(p); setCheckoutType('RENT'); setCurrentView('PAYMENT'); }}
          onToggleWishlist={toggleWishlist}
          onTogglePin={togglePin}
          onComment={handleComment}
          onShare={() => showToast("Resource link shared! 🚀")}
        />
      );
      case 'CHAT': return (
        <ChatListView 
          onSelectChat={(id) => { setSelectedChatId(id); setCurrentView('CHAT_DETAIL'); }}
          onSelectAiChat={() => setCurrentView('AI_CHAT')}
          onNavigateToUserProfile={(user) => { setViewedUser(user); setCurrentView('USER_PROFILE'); }}
        />
      );
      case 'CHAT_DETAIL': return (
        <ChatDetailView 
          chatId={selectedChatId!}
          onBack={() => setCurrentView('CHAT')}
          currentUser={currentUser!}
          onNavigateToUserProfile={(user) => { setViewedUser(user); setCurrentView('USER_PROFILE'); }}
          initialOffer={initialOffer}
        />
      );
      case 'AI_CHAT': return <AiChatView currentUser={currentUser!} onBack={() => setCurrentView('CHAT')} />;
      case 'UPLOAD': return (
        <UploadView 
          onUpload={handleAddProduct}
          onAddStory={handleAddStory}
          currentUser={currentUser!}
          initialType={uploadMode}
        />
      );
      case 'PROFILE': return (
        <ProfileView 
          user={currentUser!}
          myPurchases={myPurchases}
          onLogout={handleLogout}
          onSettings={() => setCurrentView('SETTINGS')}
          onWishlist={() => setCurrentView('WISHLIST')}
          onManageListings={() => setCurrentView('MY_LISTINGS')}
          onWallet={() => setCurrentView('WALLET')}
          onShareApp={() => showToast("App link shared with peers! 🤝")}
          onUpdateUser={handleUpdateUser}
        />
      );
      case 'WALLET': return (
        <WalletView 
          onBack={() => setCurrentView('PROFILE')}
          myPurchases={myPurchases}
          onAddFunds={() => {
            // Simulate adding funds via gateway
            setCheckoutProduct({ title: 'Campus Wallet Credits', price: 1000, image: '', category: 'Other' } as any);
            setCheckoutType('BUY');
            setCurrentView('PAYMENT');
          }}
        />
      );
      case 'PAYMENT': return (
        <PaymentView 
          product={checkoutProduct!}
          type={checkoutType}
          onBack={() => setCurrentView('MARKET')}
          onComplete={() => {
             setMyPurchases(prev => [...prev, { ...checkoutProduct!, purchaseType: checkoutType === 'BUY' ? 'BOUGHT' : 'RENTED' } as Product]);
             setCurrentView('FEED');
             showToast("Transaction successful! Check Identity. ✅");
          }}
        />
      );
      case 'SETTINGS': return <SettingsView user={currentUser!} onBack={() => setCurrentView('PROFILE')} onUpdateUser={handleUpdateUser} />;
      case 'WISHLIST': return (
        <ProductListView 
          title="My Wishlist"
          products={products.filter(p => p.isWishlisted)}
          onBack={() => setCurrentView('PROFILE')}
          onAction={(p) => { setCheckoutProduct(p); setCheckoutType('BUY'); setCurrentView('PAYMENT'); }}
          onShare={() => showToast("Wishlist item shared! 💖")}
          actionLabel="Buy Now"
        />
      );
      case 'MY_LISTINGS': return (
        <ProductListView 
          title="My Listings"
          products={products.filter(p => p.sellerId === currentUser?.id)}
          onBack={() => setCurrentView('PROFILE')}
          onAction={() => {}}
          onShare={() => showToast("Listing shared! 📣")}
          onDelete={handleDeleteProduct}
          actionLabel="Manage"
        />
      );
      case 'NOTIFICATIONS': return <NotificationView onBack={() => setCurrentView('FEED')} />;
      case 'USER_PROFILE': return (
        <UserProfileView 
          user={viewedUser!}
          products={products}
          onBack={() => setCurrentView('FEED')}
          onNavigateToChat={() => { setSelectedChatId(viewedUser!.id); setCurrentView('CHAT_DETAIL'); }}
        />
      );
      default: return <LoginView onLogin={handleLogin} />;
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      {renderView()}
      
      {currentView !== 'LOGIN' && currentView !== 'PAYMENT' && currentView !== 'CHAT_DETAIL' && currentView !== 'AI_CHAT' && (
        <BottomNav currentView={currentView} setView={setCurrentView} />
      )}
      
      {toast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[1000] animate-in slide-in-from-top-10 duration-500">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center space-x-3">
            <CheckCircle size={18} className="text-emerald-400" />
            <span className="text-sm font-bold">{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
