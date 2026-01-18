
import React, { useState, useEffect } from 'react';
import { User, View, Product, Chat as ChatType, Comment, Message, Story } from './types';
import LoginView from './views/LoginView';
import FeedView from './views/FeedView';
import MarketView from './views/MarketView';
import ChatListView from './views/ChatListView';
import ChatDetailView from './views/ChatDetailView';
import UploadView from './views/UploadView';
import ProfileView from './views/ProfileView';
import PaymentView from './views/PaymentView';
import SettingsView from './views/SettingsView';
import ProductListView from './views/ProductListView';
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
  { id: 's1', userId: 'user2', userName: 'Priya', userAvatar: 'https://picsum.photos/seed/Priya/100', image: 'https://picsum.photos/seed/campus/600/1000', timestamp: Date.now() - 3600000 },
  { id: 's2', userId: 'user3', userName: 'Rahul', userAvatar: 'https://picsum.photos/seed/Rahul/100', image: 'https://picsum.photos/seed/library/600/1000', timestamp: Date.now() - 7200000 },
  { id: 's3', userId: 'user4', userName: 'Sana', userAvatar: 'https://picsum.photos/seed/Sana/100', image: 'https://picsum.photos/seed/cafe/600/1000', timestamp: Date.now() - 10800000 },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    sellerId: 'user2',
    sellerName: 'Priya Patel',
    title: 'iPad Pro 2022 - Like New',
    description: 'Barely used iPad Pro, perfect for digital note-taking. Includes Apple Pencil Gen 2.',
    price: 45000,
    image: 'https://picsum.photos/seed/ipad/600/400',
    category: 'Gadget',
    likes: 3,
    likedBy: ['Rahul Varma', 'Sana Khan', 'Vikram Singh'],
    shares: 42,
    comments: [
      { id: 'c1', userId: 'user3', userName: 'Rahul Varma', text: 'Does it have a warranty?', timestamp: Date.now() - 500000 },
      { id: 'c2', userId: 'user4', userName: 'Sana Khan', text: 'This is a great deal! I wish I had the budget.', timestamp: Date.now() - 400000 },
      { id: 'c3', userId: 'user5', userName: 'Vikram Singh', text: 'Is the price negotiable?', timestamp: Date.now() - 300000 }
    ],
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
    image: 'https://picsum.photos/seed/notes/600/400',
    category: 'Notebook',
    likes: 2,
    likedBy: ['Priya Patel', 'Ishaan K.'],
    shares: 112,
    comments: [
      { id: 'cn1', userId: 'user2', userName: 'Priya Patel', text: 'Your handwriting is legendary!', timestamp: Date.now() - 100000 },
      { id: 'cn2', userId: 'user6', userName: 'Ishaan K.', text: 'Can I get a preview of Chapter 4?', timestamp: Date.now() - 80000 }
    ],
    isLiked: true,
    isWishlisted: true,
    isPinned: true
  },
  {
    id: 'p3',
    sellerId: 'user4',
    sellerName: 'Sana Khan',
    title: 'Casio Scientific Calculator FX-991EX',
    description: 'Advanced engineering calculator. Used for one semester only. Perfect for B.Tech students.',
    price: 1100,
    image: 'https://picsum.photos/seed/calculator/600/400',
    category: 'Gadget',
    likes: 0,
    likedBy: [],
    shares: 12,
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
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [checkoutType, setCheckoutType] = useState<'BUY' | 'RENT'>('BUY');
  const [initialOffer, setInitialOffer] = useState<number | undefined>(undefined);
  const [myPurchases, setMyPurchases] = useState<Product[]>([]);
  const [uploadMode, setUploadMode] = useState<'PRODUCT' | 'STORY'>('PRODUCT');

  const handleLogin = (name: string) => {
    setCurrentUser({ ...MOCK_USER, name });
    setCurrentView('FEED');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts([newProduct, ...products]);
    setCurrentView('MARKET');
  };

  const handleAddStory = (newStory: Story) => {
    setStories([newStory, ...stories]);
    setCurrentView('FEED');
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
      // Fallback: Copy to clipboard and suggest WhatsApp
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
      // Fallback: WhatsApp share
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

  const renderView = () => {
    switch (currentView) {
      case 'LOGIN': return <LoginView onLogin={handleLogin} />;
      case 'FEED': return <FeedView 
        products={products} 
        stories={stories} 
        onLike={toggleLike} 
        onComment={handleComment} 
        onShare={handleShare}
        onNavigateToChat={() => setCurrentView('CHAT')}
        onAddStoryClick={() => navigateToUpload('STORY')}
      />;
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
      case 'CHAT': return <ChatListView onSelectChat={(id) => { setSelectedChatId(id); setCurrentView('CHAT_DETAIL'); }} />;
      case 'CHAT_DETAIL': return <ChatDetailView chatId={selectedChatId!} initialOffer={initialOffer} onBack={() => { setCurrentView('CHAT'); setInitialOffer(undefined); }} currentUser={currentUser!} />;
      case 'UPLOAD': return <UploadView onUpload={handleAddProduct} onAddStory={handleAddStory} currentUser={currentUser!} initialType={uploadMode} />;
      case 'PROFILE': return <ProfileView 
        user={currentUser!} 
        myPurchases={myPurchases} 
        onLogout={() => { setCurrentUser(null); setCurrentView('LOGIN'); }} 
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
        onAction={() => {}} // Could add edit logic
        onShare={handleShare}
        actionLabel="Edit"
      />;
      default: return <FeedView products={products} stories={stories} onLike={toggleLike} onComment={handleComment} onShare={handleShare} onNavigateToChat={() => setCurrentView('CHAT')} onAddStoryClick={() => navigateToUpload('STORY')} />;
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
