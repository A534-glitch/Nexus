
import React, { useState, useMemo, useEffect } from 'react';
import { Product, Story, User } from '../types';
import { Heart, MessageCircle, Share2, Plus, GraduationCap, Bell, Search, Zap, ArrowUpRight, Sparkles, Filter, Layers, X, Flame, Play } from 'lucide-react';

interface FeedViewProps {
  currentUser: User;
  products: Product[];
  stories: Story[];
  onLike: (productId: string) => void;
  onLikeStory: (storyId: string) => void;
  onComment: (productId: string, text: string) => void;
  onShare: (productId: string) => void;
  // Added missing delete props to resolve TS error in App.tsx
  onDeleteProduct: (productId: string) => void;
  onDeleteStory: (storyId: string) => void;
  onNavigateToChat: () => void;
  onNavigateToNotifications: () => void;
  onNavigateToUserProfile: (user: User) => void;
  onAddStoryClick: () => void;
}

const StoryViewer = ({ story, onClose, onLike }: { story: Story, onClose: () => void, onLike: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          onClose();
          return 100;
        }
        return prev + 1;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[300] bg-black flex flex-col animate-in fade-in duration-300">
      {/* Background Image with Blur for aspect fill */}
      <div className="absolute inset-0 opacity-40">
        <img src={story.image} className="w-full h-full object-cover blur-3xl scale-110" alt="" />
      </div>

      <div className="relative flex-1 flex flex-col max-w-md mx-auto w-full bg-slate-900 overflow-hidden md:rounded-[40px] shadow-2xl">
        <img src={story.image} className="w-full h-full object-cover" alt="" />

        {/* Top Controls */}
        <div className="absolute top-0 inset-x-0 p-6 pt-10 bg-gradient-to-b from-black/60 to-transparent">
          {/* Progress Bar */}
          <div className="flex space-x-1 mb-6">
            <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-white/50 p-0.5">
                <img src={story.userAvatar} className="w-full h-full rounded-full object-cover" alt="" />
              </div>
              <div>
                <h4 className="text-white text-sm font-black">{story.userName}</h4>
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Campus Story</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Bottom Interactions */}
        <div className="absolute bottom-0 inset-x-0 p-8 pb-12 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4">
              <p className="text-white/60 text-xs font-medium">Reply to {story.userName}...</p>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onLike(); }}
              className={`p-4 rounded-2xl transition-all active:scale-75 ${story.isLiked ? 'bg-rose-500 text-white' : 'bg-white/10 text-white backdrop-blur-md'}`}
            >
              <Heart size={24} fill={story.isLiked ? 'white' : 'none'} />
            </button>
            <button className="p-4 bg-white/10 backdrop-blur-md rounded-2xl text-white">
              <Share2 size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeedView: React.FC<FeedViewProps> = ({ 
  currentUser, products, stories, onLike, onLikeStory, onShare, 
  // Added missing delete props to resolve TS error in App.tsx
  onDeleteProduct, onDeleteStory,
  onNavigateToChat, onNavigateToNotifications, 
  onNavigateToUserProfile, onAddStoryClick 
}) => {
  const [focalMode, setFocalMode] = useState<'STUDY' | 'LIFE' | 'VIBE'>('STUDY');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const filteredItems = useMemo(() => {
    if (focalMode === 'VIBE') return []; // Vibe mode focuses purely on the Story Hub experience
    return products.filter(p => 
      focalMode === 'STUDY' 
        ? (p.category === 'Notebook' || p.category === 'Stationery')
        : (p.category === 'Gadget' || p.category === 'Other')
    );
  }, [products, focalMode]);

  return (
    <div className="min-h-full bg-slate-50 flex flex-col pb-32">
      {selectedStory && (
        <StoryViewer 
          story={selectedStory} 
          onClose={() => setSelectedStory(null)} 
          onLike={() => onLikeStory(selectedStory.id)} 
        />
      )}

      {/* Nexus Aurora Header */}
      <div className={`fixed top-0 inset-x-0 h-40 bg-gradient-to-b pointer-events-none z-0 transition-colors duration-1000 ${
        focalMode === 'STUDY' ? 'from-emerald-500/10' : 
        focalMode === 'LIFE' ? 'from-indigo-500/10' : 'from-rose-500/10'
      }`} />
      
      <header className="sticky top-0 z-[110] px-6 py-8 flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl rotate-3">
                <GraduationCap className="text-white" size={24} />
             </div>
             <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tighter">Nexus</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">The Campus Hub</p>
             </div>
          </div>
          <div className="flex items-center space-x-2">
             <button onClick={onNavigateToNotifications} className="p-3 bg-white rounded-2xl shadow-sm relative group active:scale-95 transition-all">
                <Bell size={20} className="text-slate-600 group-hover:text-indigo-600" />
                <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
             </button>
             <button onClick={onNavigateToChat} className="p-3 bg-slate-900 text-white rounded-2xl shadow-xl active:scale-95 transition-all">
                <MessageCircle size={20} />
             </button>
          </div>
        </div>

        {/* The Unique Nexus Focal Switcher */}
        <div className="flex bg-white/50 backdrop-blur-xl p-1.5 rounded-[32px] border border-white shadow-sm self-center">
           <button 
            onClick={() => setFocalMode('STUDY')}
            className={`px-6 py-2.5 rounded-[24px] text-[9px] font-black uppercase tracking-widest transition-all ${focalMode === 'STUDY' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Study
           </button>
           <button 
            onClick={() => setFocalMode('LIFE')}
            className={`px-6 py-2.5 rounded-[24px] text-[9px] font-black uppercase tracking-widest transition-all ${focalMode === 'LIFE' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Life
           </button>
           <button 
            onClick={() => setFocalMode('VIBE')}
            className={`px-6 py-2.5 rounded-[24px] text-[9px] font-black uppercase tracking-widest transition-all ${focalMode === 'VIBE' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Vibe
           </button>
        </div>
      </header>

      {/* Stories Node Bar */}
      <div className="px-6 mb-8">
        <div className="flex items-center space-x-4 overflow-x-auto hide-scrollbar py-2">
          <button 
            onClick={onAddStoryClick}
            className="w-16 h-16 rounded-[24px] bg-white border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 flex-shrink-0 active:scale-90 transition-all hover:border-indigo-400 hover:text-indigo-600"
          >
            <Plus size={24} strokeWidth={3} />
          </button>
          {stories.map(story => (
            <div 
              key={story.id} 
              onClick={() => setSelectedStory(story)}
              className="relative flex-shrink-0 group cursor-pointer active:scale-90 transition-all"
            >
               <div className={`w-16 h-16 rounded-[24px] p-0.5 bg-gradient-to-tr ${story.isLiked ? 'from-rose-400 to-rose-600' : 'from-indigo-500 to-purple-500'} animate-in zoom-in duration-300`}>
                  <div className="w-full h-full rounded-[22px] bg-white p-0.5 overflow-hidden">
                     <img src={story.userAvatar} className="w-full h-full object-cover rounded-[20px]" alt="" />
                  </div>
               </div>
               <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-lg border-2 border-slate-50 flex items-center justify-center shadow-md">
                  <Zap size={10} className="text-indigo-600 fill-indigo-600" />
               </div>
               <p className="text-[8px] font-black text-slate-400 text-center mt-1.5 uppercase tracking-tighter truncate w-16">{story.userName}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fluid Resource Flow (The Main Unique Feed) */}
      <div className="px-6 space-y-12 pb-20 relative z-10">
        {focalMode === 'VIBE' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
               <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Campus Vibe</h2>
               <div className="flex items-center text-rose-500 bg-rose-50 px-3 py-1.5 rounded-full animate-pulse">
                  <Flame size={12} className="mr-1.5" /> <span className="text-[9px] font-black uppercase">Live Updates</span>
               </div>
            </div>
            {stories.map((s, idx) => (
              <div 
                key={s.id} 
                onClick={() => setSelectedStory(s)}
                className="relative aspect-[4/5] rounded-[48px] overflow-hidden bg-slate-200 group shadow-2xl animate-in slide-in-from-bottom-10 duration-700"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <img src={s.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl border-2 border-white/30 p-0.5">
                    <img src={s.userAvatar} className="w-full h-full rounded-2xl object-cover" alt="" />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-lg">{s.userName}</h3>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Shared a moment</p>
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20">
                    <Play size={24} className="text-white ml-1" fill="white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
               <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Campus Resources</h2>
               <button className="text-[10px] font-black text-indigo-600 flex items-center bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors">
                  <Filter size={12} className="mr-1.5" /> Filter
               </button>
            </div>

            {filteredItems.map((item, idx) => (
              <ResourcePebble 
                key={item.id} 
                item={item} 
                index={idx} 
                onLike={() => onLike(item.id)}
                onShare={() => onShare(item.id)}
                onUserClick={() => onNavigateToUserProfile({ id: item.sellerId, name: item.sellerName, avatar: '', college: '' } as User)}
              />
            ))}

            {filteredItems.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center opacity-40 text-center space-y-4">
                 <Layers size={48} className="text-slate-300" />
                 <p className="text-sm font-black text-slate-900 uppercase tracking-widest leading-loose">No {focalMode.toLowerCase()} <br/>resources near you</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Unique Pebble Card Component
const ResourcePebble = ({ item, index, onLike, onShare, onUserClick }: any) => {
  const isOdd = index % 2 !== 0;

  return (
    <div className={`relative animate-in fade-in slide-in-from-bottom-10 duration-700`}>
      <div 
        className={`bg-white p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] border border-slate-100 relative group overflow-hidden ${isOdd ? 'rounded-[48px] rounded-br-[80px]' : 'rounded-[48px] rounded-tl-[80px]'}`}
      >
        {/* Haptic Object Preview */}
        <div className="relative mb-6">
           <div 
            className={`aspect-video w-full overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-105 ${isOdd ? 'rounded-[32px]' : 'rounded-[32px] rotate-1'}`}
           >
              <img src={item.image} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
           </div>
           
           <div className="absolute -bottom-4 right-4 bg-slate-900 text-white px-5 py-2.5 rounded-2xl shadow-xl flex items-center space-x-2 active:scale-95 transition-transform">
              <span className="text-sm font-black tracking-tighter italic">₹{item.price.toLocaleString('en-IN')}</span>
              <div className="w-[1px] h-3 bg-white/20" />
              <ArrowUpRight size={14} className="text-indigo-400" />
           </div>
        </div>

        {/* Identity & Content */}
        <div className="flex flex-col space-y-4">
           <div className="flex items-center justify-between">
              <div onClick={onUserClick} className="flex items-center space-x-2 cursor-pointer group/user">
                 <img src={`https://picsum.photos/seed/${item.sellerName}/100`} className="w-8 h-8 rounded-full ring-2 ring-indigo-50 group-hover/user:ring-indigo-200 transition-all" alt="" />
                 <span className="text-[11px] font-black text-slate-900 group-hover/user:text-indigo-600">{item.sellerName.split(' ')[0]}</span>
              </div>
              <div className="flex items-center space-x-1 px-2 py-1 bg-slate-50 rounded-lg">
                 <Sparkles size={10} className="text-amber-500" />
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.category}</span>
              </div>
           </div>

           <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
             {item.title}
           </h3>
           <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
             {item.description}
           </p>

           <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center space-x-6">
                 <button onClick={onLike} className="flex items-center space-x-2 group/btn">
                    <Heart size={20} className={`transition-all ${item.isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-300 group-hover/btn:text-rose-400'}`} />
                    <span className={`text-[10px] font-black ${item.isLiked ? 'text-rose-500' : 'text-slate-400'}`}>{item.likes}</span>
                 </button>
                 <button className="flex items-center space-x-2 group/btn">
                    <MessageCircle size={20} className="text-slate-300 group-hover/btn:text-indigo-400 transition-colors" />
                    <span className="text-[10px] font-black text-slate-400">{item.comments.length}</span>
                 </button>
              </div>
              <button onClick={onShare} className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                 <Share2 size={18} />
              </button>
           </div>
        </div>

        {/* Background Haptic Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[60px] rounded-full pointer-events-none" />
      </div>
    </div>
  );
};

export default FeedView;
