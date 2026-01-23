
import React, { useState, useEffect } from 'react';
import { User, View, Product, Comment, Story } from './types';
import { api } from './services/api';
import { initSQLite } from './services/database';
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
import NotificationView from './views/NotificationView';
import UserProfileView from './views/UserProfileView';
import WalletView from './views/WalletView';
import BottomNav from './components/BottomNav';
import { CheckCircle, GraduationCap } from 'lucide-react';

const DEFAULT_STORIES: Story[] = [
  { id: 's1', userId: 'user2', userName: 'Priya', userAvatar: 'https://picsum.photos/seed/Priya/100', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop', timestamp: Date.now() - 3600000, isLiked: false, likes: 12 },
];

const DEFAULT_PRODUCTS: Product[] = [
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
    condition: 'Like New',
    likedBy: [],
    likes: 5,
    shares: 42,
    comments: [],
    isLiked: false,
    isWishlisted: false,
    isPinned: false,
    specs: {
      brand: 'Apple',
      connectivity: 'Wireless',
      compatibility: ['iOS', 'Mac'],
      storage: '256GB',
      warranty: true
    }
  }
];

const App: React.FC = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('LOGIN');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [stories, setStories] = useState<Story[]>([]);

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [viewedUser, setViewedUser] = useState<User | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [checkoutType, setCheckoutType] = useState<'BUY' | 'RENT'>('BUY');
  const [initialOffer, setInitialOffer] = useState<number | undefined>(undefined);
  const [myPurchases, setMyPurchases] = useState<Product[]>([]);
  const [uploadMode, setUploadMode] = useState<'PRODUCT' | 'STORY'>('PRODUCT');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const initData = async () => {
      // 1. Initialize Client-Side SQLite engine
      await initSQLite();
      
      // 2. Fetch data (API handles failover to SQLite internally)
      const backendProducts = await api.getProducts();
      setProducts(backendProducts.length > 0 ? backendProducts : DEFAULT_PRODUCTS);
      
      const savedStories = localStorage.getItem('nexus_global_stories');
      setStories(savedStories ? JSON.parse(savedStories) : DEFAULT_STORIES);

      const savedUser = localStorage.getItem('nexus_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        if (user.theme) setTheme(user.theme);
        setCurrentView('FEED');
      }

      setIsBooting(false);
    };
    initData();
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

  const handleLogin = async (name: string) => {
    const user = await api.login(name);
    if (user) {
      setCurrentUser(user);
      if (user.theme) setTheme(user.theme);
      localStorage.setItem('nexus_user', JSON.stringify(user));
      setCurrentView('FEED');
      showToast(`Synchronized via SQLite ✨`);
    }
  };

  const handleAddProduct = async (newProduct: Product) => {
    const saved = await api.createProduct(newProduct);
    if (saved) {
      setProducts(prev => [saved, ...prev]);
    } else {
      setProducts(prev => [newProduct, ...prev]);
    }
    setCurrentView('FEED');
    showToast("SQL Node synchronized! 🚀");
  };

  const handleAddStory = (newStory: Story) => {
    setStories(prev => [newStory, ...prev]);
    localStorage.setItem('nexus_global_stories', JSON.stringify([newStory, ...stories]));
    setCurrentView('FEED');
    showToast("Story updated to hub! 📸");
  };

  const updateUserInfo = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    if (updatedUser.theme) setTheme(updatedUser.theme);
    localStorage.setItem('nexus_user', JSON.stringify(updatedUser));
  };

  const renderView = () => {
    if (!currentUser && currentView !== 'LOGIN') return <LoginView onLogin={handleLogin} />;

    switch (currentView) {
      case 'LOGIN': return <LoginView onLogin={handleLogin} />;
      case 'FEED': return (
        <FeedView 
          currentUser={currentUser!}
          products={products}
          stories={stories}
          onLike={id => setProducts(p => p.map(prod => prod.id === id ? {...prod, isLiked: !prod.isLiked, likes: prod.likes + (prod.isLiked ? -1 : 1)} : prod))}
          onLikeStory={id => setStories(s => s.map(st => st.id === id ? {...st, isLiked: !st.isLiked} : st))}
          onComment={(pid, txt) => {
            const newComment = { id: Math.random().toString(), userId: currentUser!.id, userName: currentUser!.name, text: txt, timestamp: Date.now() };
            setProducts(prev => prev.map(p => p.id === pid ? { ...p, comments: [...p.comments, newComment] } : p));
          }}
          onShare={() => showToast("Invite link copied! 🔗")}
          onShareStory={() => {}}
          onDeleteProduct={() => {}}
          onDeleteStory={() => {}}
          onNavigateToChat={() => setCurrentView('CHAT')}
          onNavigateToNotifications={() => setCurrentView('NOTIFICATIONS')}
          onNavigateToUserProfile={u => { setViewedUser(u); setCurrentView('USER_PROFILE'); }}
          onNavigateToWallet={() => setCurrentView('WALLET')}
          onAddStoryClick={() => { setUploadMode('STORY'); setCurrentView('UPLOAD'); }}
          onQuickBuy={p => { setCheckoutProduct(p); setCheckoutType('BUY'); setCurrentView('PAYMENT'); }}
          onQuickRent={p => { setCheckoutProduct(p); setCheckoutType('RENT'); setCurrentView('PAYMENT'); }}
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
          onBargain={p => { setSelectedChatId(p.sellerId); setInitialOffer(p.price * 0.8); setCurrentView('CHAT_DETAIL'); }}
          onBuyNow={p => { setCheckoutProduct(p); setCheckoutType('BUY'); setCurrentView('PAYMENT'); }}
          onRentNow={p => { setCheckoutProduct(p); setCheckoutType('RENT'); setCurrentView('PAYMENT'); }}
          onToggleWishlist={id => setProducts(p => p.map(prod => prod.id === id ? {...prod, isWishlisted: !prod.isWishlisted} : prod))}
          onTogglePin={id => setProducts(p => p.map(prod => prod.id === id ? {...prod, isPinned: !prod.isPinned} : prod))}
          onComment={(pid, txt) => {
            const newComment = { id: Math.random().toString(), userId: currentUser!.id, userName: currentUser!.name, text: txt, timestamp: Date.now() };
            setProducts(prev => prev.map(p => p.id === pid ? { ...p, comments: [...p.comments, newComment] } : p));
          }}
          onShare={() => {}}
        />
      );
      case 'CHAT': return <ChatListView onSelectChat={id => { setSelectedChatId(id); setCurrentView('CHAT_DETAIL'); }} onSelectAiChat={() => setCurrentView('AI_CHAT')} onNavigateToUserProfile={u => { setViewedUser(u); setCurrentView('USER_PROFILE'); }} />;
      case 'CHAT_DETAIL': return <ChatDetailView chatId={selectedChatId!} onBack={() => setCurrentView('CHAT')} currentUser={currentUser!} onNavigateToUserProfile={u => { setViewedUser(u); setCurrentView('USER_PROFILE'); }} initialOffer={initialOffer} />;
      case 'AI_CHAT': return <AiChatView currentUser={currentUser!} products={products} onBack={() => setCurrentView('CHAT')} />;
      case 'WALLET': return <WalletView onBack={() => setCurrentView('PROFILE')} myPurchases={myPurchases} onAddFunds={() => { setCheckoutProduct({ title: 'Campus Credits', price: 1000, image: '', category: 'Other', comments: [] } as any); setCheckoutType('BUY'); setCurrentView('PAYMENT'); }} />;
      case 'PAYMENT': return checkoutProduct ? <PaymentView product={checkoutProduct} type={checkoutType} onBack={() => setCurrentView('MARKET')} onComplete={() => { if(checkoutProduct) setMyPurchases(p => [...p, checkoutProduct]); setCurrentView('FEED'); showToast("Payment processed! ✅"); }} /> : null;
      case 'UPLOAD': return <UploadView onUpload={handleAddProduct} onAddStory={handleAddStory} currentUser={currentUser!} initialType={uploadMode} />;
      case 'PROFILE': return <ProfileView user={currentUser!} myPurchases={myPurchases} onLogout={() => { setCurrentUser(null); localStorage.removeItem('nexus_user'); setCurrentView('LOGIN'); }} onSettings={() => setCurrentView('SETTINGS')} onWishlist={() => setCurrentView('WISHLIST')} onManageListings={() => setCurrentView('MY_LISTINGS')} onWallet={() => setCurrentView('WALLET')} onShareApp={() => {}} onUpdateUser={updateUserInfo} />;
      case 'USER_PROFILE': return viewedUser ? <UserProfileView user={viewedUser} products={products} onBack={() => setCurrentView('EXPLORE')} onNavigateToChat={() => { setSelectedChatId(viewedUser.id); setCurrentView('CHAT_DETAIL'); }} /> : null;
      case 'SETTINGS': return <SettingsView user={currentUser!} onBack={() => setCurrentView('PROFILE')} onUpdateUser={updateUserInfo} onInstantThemeToggle={setTheme} />;
      case 'NOTIFICATIONS': return <NotificationView onBack={() => setCurrentView('FEED')} />;
      default: return <LoginView onLogin={handleLogin} />;
    }
  };

  if (isBooting) {
    return (
      <div className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center z-[9999]">
        <div className="w-24 h-24 bg-indigo-600 rounded-[36px] flex items-center justify-center animate-pulse-slow shadow-[0_0_80px_rgba(79,70,229,0.3)]">
          <GraduationCap size={48} className="text-white" />
        </div>
        <h1 className="text-white text-5xl font-[900] italic tracking-tighter mt-10">Nexus</h1>
        <div className="mt-6 flex flex-col items-center space-y-2">
           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.6em]">Initializing SQL Engine</p>
           <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 animate-[loading_2s_ease-in-out_infinite]" />
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <div className="max-w-md mx-auto h-screen relative shadow-2xl overflow-hidden bg-white dark:bg-slate-900">
        {renderView()}
        {currentView !== 'LOGIN' && currentView !== 'PAYMENT' && currentView !== 'CHAT_DETAIL' && currentView !== 'AI_CHAT' && <BottomNav currentView={currentView} setView={setCurrentView} />}
        {toast && (
          <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[1000] glass dark:bg-slate-900/80 text-slate-900 dark:text-white px-6 py-4 rounded-[24px] shadow-2xl flex items-center space-x-3 border border-indigo-500/20 animate-in slide-in-from-top-4">
            <CheckCircle size={18} className="text-emerald-500" />
            <span className="text-xs font-black uppercase tracking-widest">{toast}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
