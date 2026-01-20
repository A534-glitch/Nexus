
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
      setCurrentUser(JSON.parse(savedUser));
      setCurrentView('FEED');
    }
  }, []);

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
        notificationPrefs: {
          messages: true, bargains: true, likes: true, comments: true, campusAlerts: true
        }
      };
      localStorage.setItem('nexus_registry', JSON.stringify([...existingUsers, user]));
    }
    
    setCurrentUser(user);
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
    const newComment: Comment = { id: Math.random().toString(36).substr(2, 9), userId: currentUser.id, userName: currentUser.name, text, timestamp: Date.now() };
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, comments: [newComment, ...p.comments] } : p));
  };

  const handleShare = async (id: string, type: 'PRODUCT' | 'STORY' = 'PRODUCT') => {
    const item = type === 'PRODUCT' ? products.find(p => p.id === id) : stories.find(s => s.id === id);
    if (!item) return;

    const shareData = {
      title: `Nexus: ${type === 'PRODUCT' ? (item as Product).title : (item as Story).userName + "'s Story"}`,
      text: type === 'PRODUCT' 
        ? `Check out this ${(item as Product).title} on Nexus for ₹${(item as Product).price.toLocaleString('en-IN')}. Great campus deal! 🚀`
        : `Check out ${(item as Story).userName}'s new story on Nexus! Campus life updates. ✨`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        if (type === 'PRODUCT') {
          setProducts(prev => prev.map(p => p.id === id ? { ...p, shares: (p.shares || 0) + 1 } : p));
        }
        showToast("Link shared successfully!");
      } catch (err) { console.log(err); }
    } else {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(shareData.text + " " + shareData.url)}`;
      window.open(waUrl, '_blank');
      showToast("Redirecting to WhatsApp...");
    }
  };

  const handleShareApp = async () => {
    const shareData = {
      title: "Join Nexus",
      text: "Join me on Nexus! The professional peer-to-peer ecosystem for students to share notebooks and gadgets. 🎓🚀",
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast("Invitation sent!");
      } catch (err) { console.log(err); }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + " " + shareData.url)}`, '_blank');
    }
  };

  const handlePurchaseComplete = () => {
    if (checkoutProduct) {
      const itemToCollect = { ...checkoutProduct, purchaseType: checkoutType === 'BUY' ? 'BOUGHT' as const : 'RENTED' as const };
      setMyPurchases(prev => [itemToCollect, ...prev]);
      setProducts(prev => prev.filter(p => p.id !== checkoutProduct.id));
    }
    setCurrentView('PROFILE');
    showToast("Payment Successful! Contact seller for pickup.");
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
        onShare={(id) => handleShare(id, 'PRODUCT')}
        onShareStory={(id) => handleShare(id, 'STORY')}
        onDeleteProduct={handleDeleteProduct}
        onDeleteStory={handleDeleteStory}
        onNavigateToChat={() => setCurrentView('CHAT')}
        onNavigateToNotifications={() => setCurrentView('NOTIFICATIONS')}
        onNavigateToUserProfile={(user) => { setViewedUser(user); setCurrentView('USER_PROFILE'); }}
        onAddStoryClick={() => { setUploadMode('STORY'); setCurrentView('UPLOAD'); }}
        onQuickBuy={(product) => { setCheckoutProduct(product); setCheckoutType('BUY'); setCurrentView('PAYMENT'); }}
        onQuickRent={(product) => { setCheckoutProduct(product); setCheckoutType('RENT'); setCurrentView('PAYMENT'); }}
      />;
      case 'EXPLORE': return <ExploreView 
        products={products} 
        onSelectProduct={(p) => { setCheckoutProduct(p); setCurrentView('MARKET'); }}
        onNavigateToUserProfile={(user) => { setViewedUser(user); setCurrentView('USER_PROFILE'); }}
        onNavigateToChat={(userId) => { setSelectedChatId(userId); setCurrentView('CHAT_DETAIL'); }}
      />;
      case 'MARKET': return <MarketView 
        products={products} 
        onToggleWishlist={toggleWishlist}
        onTogglePin={togglePin}
        onShare={(id) => handleShare(id, 'PRODUCT')}
        onBargain={(product, offer) => { setSelectedChatId(product.sellerId); setInitialOffer(offer); setCurrentView('CHAT_DETAIL'); }} 
        onBuyNow={(product) => { setCheckoutProduct(product); setCheckoutType('BUY'); setCurrentView('PAYMENT'); }} 
        onRentNow={(product) => { setCheckoutProduct(product); setCheckoutType('RENT'); setCurrentView('PAYMENT'); }}
      />;
      case 'CHAT': return <ChatListView onSelectChat={(id) => { setSelectedChatId(id); setCurrentView('CHAT_DETAIL'); }} onSelectAiChat={() => setCurrentView('AI_CHAT')} onNavigateToUserProfile={(user) => { setViewedUser(user); setCurrentView('USER_PROFILE'); }} />;
      case 'CHAT_DETAIL': return <ChatDetailView chatId={selectedChatId!} initialOffer={initialOffer} onBack={() => { setCurrentView('CHAT'); setInitialOffer(undefined); }} currentUser={currentUser!} onNavigateToUserProfile={(user) => { setViewedUser(user); setCurrentView('USER_PROFILE'); }} />;
      case 'AI_CHAT': return <AiChatView currentUser={currentUser!} onBack={() => setCurrentView('CHAT')} />;
      case 'UPLOAD': return <UploadView onUpload={handleAddProduct} onAddStory={handleAddStory} currentUser={currentUser!} initialType={uploadMode} />;
      case 'PROFILE': return <ProfileView user={currentUser!} myPurchases={myPurchases} onLogout={handleLogout} onSettings={() => setCurrentView('SETTINGS')} onWishlist={() => setCurrentView('WISHLIST')} onManageListings={() => setCurrentView('MY_LISTINGS')} onShareApp={handleShareApp} onUpdateUser={handleUpdateUser} />;
      case 'SETTINGS': return <SettingsView user={currentUser!} onBack={() => setCurrentView('PROFILE')} onUpdateUser={handleUpdateUser} />;
      case 'PAYMENT': return <PaymentView product={checkoutProduct!} type={checkoutType} onBack={() => setCurrentView('MARKET')} onComplete={handlePurchaseComplete} />;
      case 'WISHLIST': return <ProductListView title="My Wishlist" products={products.filter(p => p.isWishlisted)} onBack={() => setCurrentView('PROFILE')} onAction={(p) => { setCheckoutProduct(p); setCheckoutType('BUY'); setCurrentView('PAYMENT'); }} onShare={(id) => handleShare(id, 'PRODUCT')} actionLabel="Buy" />;
      case 'MY_LISTINGS': return <ProductListView title="My Listings" products={products.filter(p => p.sellerId === currentUser?.id)} onBack={() => setCurrentView('PROFILE')} onAction={() => {}} onDelete={handleDeleteProduct} onShare={(id) => handleShare(id, 'PRODUCT')} actionLabel="Edit" />;
      case 'NOTIFICATIONS': return <NotificationView onBack={() => setCurrentView('FEED')} />;
      case 'USER_PROFILE': return <UserProfileView user={viewedUser!} products={products} onBack={() => setCurrentView('FEED')} onNavigateToChat={() => setCurrentView('CHAT')} />;
      default: return <FeedView currentUser={currentUser!} products={products} stories={stories} onLike={toggleLike} onLikeStory={toggleLikeStory} onComment={handleComment} onShare={(id) => handleShare(id, 'PRODUCT')} onShareStory={(id) => handleShare(id, 'STORY')} onDeleteProduct={handleDeleteProduct} onDeleteStory={handleDeleteStory} onNavigateToChat={() => setCurrentView('CHAT')} onNavigateToNotifications={() => setCurrentView('NOTIFICATIONS')} onNavigateToUserProfile={(user) => { setViewedUser(user); setCurrentView('USER_PROFILE'); }} onAddStoryClick={() => { setUploadMode('STORY'); setCurrentView('UPLOAD'); }} />;
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-white shadow-xl flex flex-col relative overflow-hidden">
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[500] bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-2 animate-in slide-in-from-top duration-300">
           <CheckCircle size={18} className="text-emerald-400" />
           <span className="text-xs font-black uppercase tracking-widest">{toast}</span>
        </div>
      )}
      
      <main className="flex-1 overflow-y-auto hide-scrollbar pb-20">
        {renderView()}
      </main>
      {currentUser && currentView !== 'LOGIN' && currentView !== 'PAYMENT' && currentView !== 'SETTINGS' && (
        <BottomNav currentView={currentView} setView={(v) => { if(v === 'UPLOAD') setUploadMode('PRODUCT'); setCurrentView(v); }} />
      )}
    </div>
  );
};

export default App;
