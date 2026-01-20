
import React, { useState, useMemo, useEffect } from 'react';
import { Product, User } from '../types';
import { 
  Search, Compass, Sparkles, X, Filter, Cpu, BookOpen, 
  PenTool, Hash, Loader2, Command, Users, MessageCircle, 
  UserPlus, Check, UserCheck, ArrowUpRight, Globe, Zap
} from 'lucide-react';

interface ExploreViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onNavigateToUserProfile: (user: User) => void;
  onNavigateToChat: (userId: string) => void;
}

const ExploreView: React.FC<ExploreViewProps> = ({ 
  products, 
  onSelectProduct, 
  onNavigateToUserProfile,
  onNavigateToChat 
}) => {
  const [search, setSearch] = useState('');
  const [activeOrb, setActiveOrb] = useState<string>('All');
  const [isSearching, setIsSearching] = useState(false);
  const [isAiMode, setIsAiMode] = useState(false);
  const [searchTab, setSearchTab] = useState<'ITEMS' | 'PEERS'>('ITEMS');

  // Mock User Registry for searching
  const [peerRegistry, setPeerRegistry] = useState<User[]>(() => {
    const saved = localStorage.getItem('nexus_registry');
    return saved ? JSON.parse(saved) : [
      { id: 'user2', name: 'Priya Patel', avatar: 'https://picsum.photos/seed/Priya/100', college: 'SRCC Delhi', followers: 1200, following: 450, isVerified: true },
      { id: 'user3', name: 'Rahul Varma', avatar: 'https://picsum.photos/seed/Rahul/100', college: 'BITS Pilani', followers: 890, following: 210, isVerified: false },
      { id: 'u104', name: 'Sana Varma', avatar: 'https://picsum.photos/seed/Sana/100', college: 'VIT Vellore', followers: 450, following: 300, isVerified: true },
      { id: 'u106', name: 'Ananya S.', avatar: 'https://picsum.photos/seed/Ananya/100', college: 'IIT Delhi', followers: 2300, following: 120, isVerified: true },
    ];
  });

  const categories = [
    { id: 'All', label: 'Everything', icon: Compass, color: 'from-slate-400 to-slate-600' },
    { id: 'Gadget', label: 'Tech Nodes', icon: Cpu, color: 'from-blue-500 to-indigo-600' },
    { id: 'Notebook', label: 'Scriptures', icon: BookOpen, color: 'from-amber-400 to-orange-600' },
    { id: 'Stationery', label: 'Tools', icon: PenTool, color: 'from-emerald-400 to-teal-600' },
  ];

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeOrb !== 'All') {
      result = result.filter(p => p.category === activeOrb);
    }
    if (search.trim() && searchTab === 'ITEMS') {
      const q = search.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return result;
  }, [products, activeOrb, search, searchTab]);

  const filteredPeers = useMemo(() => {
    if (searchTab !== 'PEERS') return [];
    if (!search.trim()) return peerRegistry;
    const q = search.toLowerCase();
    return peerRegistry.filter(u => u.name.toLowerCase().includes(q) || u.college?.toLowerCase().includes(q));
  }, [peerRegistry, search, searchTab]);

  const toggleFollow = (id: string) => {
    setPeerRegistry(prev => prev.map(u => {
      if (u.id === id) {
        const isCurrentlyFollowing = (u as any).isFollowing;
        return { 
          ...u, 
          isFollowing: !isCurrentlyFollowing,
          followers: (u.followers || 0) + (isCurrentlyFollowing ? -1 : 1)
        };
      }
      return u;
    }));
  };

  return (
    <div className="flex flex-col h-full bg-[#fdfdfd] overflow-hidden select-none">
      {/* Dynamic Glow Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-[-10%] right-[-10%] w-[80%] h-[60%] rounded-full blur-[120px] opacity-20 transition-all duration-1000 ${
          searchTab === 'PEERS' ? 'bg-emerald-500' :
          isAiMode ? 'bg-purple-600' :
          activeOrb === 'Gadget' ? 'bg-blue-500' : 
          activeOrb === 'Notebook' ? 'bg-amber-500' : 
          activeOrb === 'Stationery' ? 'bg-emerald-500' : 'bg-indigo-500'
        }`} />
      </div>

      {/* Header Section */}
      <header className="px-8 pt-12 pb-4 relative z-10">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center space-x-3">
              <div className={`w-2.5 h-2.5 rounded-full ${searchTab === 'PEERS' ? 'bg-emerald-500' : 'bg-indigo-600'} animate-pulse shadow-[0_0_15px_rgba(79,70,229,0.5)]`} />
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Discover</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">Campus Synapse</p>
              </div>
           </div>
           
           <div className="flex items-center space-x-2">
             <button 
              onClick={() => setIsAiMode(!isAiMode)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${isAiMode ? 'bg-purple-600 border-purple-400 shadow-[0_10px_30px_rgba(147,51,234,0.3)] text-white scale-110' : 'bg-white border-slate-100 shadow-xl text-slate-400'}`}
             >
                <Sparkles size={20} className={isAiMode ? 'animate-bounce' : ''} />
             </button>
           </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-100 rounded-2xl mb-8 border border-slate-200 shadow-inner">
           <button 
            onClick={() => setSearchTab('ITEMS')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${searchTab === 'ITEMS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
           >
              <Zap size={14} />
              <span>Nodes</span>
           </button>
           <button 
            onClick={() => setSearchTab('PEERS')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${searchTab === 'PEERS' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
           >
              <Users size={14} />
              <span>Synapse</span>
           </button>
        </div>

        {/* Category Orbs - Only for Items */}
        {searchTab === 'ITEMS' && (
          <div className="flex items-center space-x-6 overflow-x-auto hide-scrollbar py-2 px-2 -mx-2 animate-in fade-in zoom-in duration-500">
            {categories.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setActiveOrb(cat.id)}
                className="flex flex-col items-center space-y-3 flex-shrink-0 group transition-all"
              >
                <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center transition-all duration-500 relative ${
                  activeOrb === cat.id 
                  ? `bg-gradient-to-br ${isAiMode ? 'from-purple-500 to-indigo-600' : cat.color} scale-110 shadow-xl` 
                  : 'bg-white shadow-md border border-slate-50 opacity-60'
                }`}>
                  <cat.icon size={20} className={activeOrb === cat.id ? 'text-white' : 'text-slate-400'} />
                </div>
                <span className={`text-[8px] font-black uppercase tracking-widest transition-colors ${activeOrb === cat.id ? 'text-slate-900' : 'text-slate-400'}`}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-6 pb-48 relative z-10">
        {searchTab === 'ITEMS' ? (
          <div className="columns-2 gap-4 space-y-4 pt-4">
            {filteredProducts.map((p, idx) => (
              <DiscoveryNode 
                key={p.id} 
                product={p} 
                index={idx} 
                isAiActive={isAiMode}
                onClick={() => onSelectProduct(p)} 
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4 pt-4 animate-in slide-in-from-right duration-500">
            {filteredPeers.map((peer, idx) => (
              <PeerNode 
                key={peer.id} 
                peer={peer} 
                index={idx}
                onFollow={() => toggleFollow(peer.id)}
                onChat={() => onNavigateToChat(peer.id)}
                onProfile={() => onNavigateToUserProfile(peer)}
              />
            ))}
          </div>
        )}

        {(searchTab === 'ITEMS' ? filteredProducts.length : filteredPeers.length) === 0 && (
          <div className="py-32 flex flex-col items-center justify-center text-center opacity-30 space-y-4">
             <div className="p-8 bg-slate-100 rounded-[48px]">
                {isAiMode ? <Loader2 size={48} className="animate-spin text-purple-600" /> : <Globe size={48} className="text-slate-400" />}
             </div>
             <p className="text-sm font-black text-slate-900 uppercase tracking-widest leading-loose">
               No Signals Found
             </p>
          </div>
        )}
      </div>

      {/* Sticky Command Capsule */}
      <div className={`fixed bottom-32 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-[150] transition-all duration-500 ${isSearching ? 'bottom-34 scale-105' : 'bottom-28'}`}>
        <div className={`backdrop-blur-3xl rounded-[32px] p-2 flex items-center shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] border transition-all duration-500 ${
          isAiMode ? 'bg-purple-900/80 border-purple-400/30' : 
          searchTab === 'PEERS' ? 'bg-emerald-900/90 border-emerald-400/30' :
          'bg-slate-900/90 border-white/10'
        }`}>
          <div className={`p-4 ${isAiMode ? 'text-purple-400' : searchTab === 'PEERS' ? 'text-emerald-400' : 'text-indigo-400'} flex items-center space-x-2`}>
            {isAiMode ? <Sparkles size={20} className="animate-pulse" /> : <Command size={18} strokeWidth={3} />}
          </div>
          <input 
            type="text" 
            placeholder={searchTab === 'ITEMS' ? (isAiMode ? "Ask AI for gear..." : "Find Nodes...") : "Search Peer Synapse..."}
            className="flex-1 bg-transparent border-none text-white text-sm font-black placeholder:text-slate-500 outline-none py-4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsSearching(true)}
            onBlur={() => setIsSearching(false)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="p-4 text-slate-500 hover:text-white"><X size={18} /></button>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .columns-2 {
          column-count: 2;
          column-gap: 1rem;
        }
        .columns-2 > * {
          break-inside: avoid;
          margin-bottom: 1rem;
        }
      `}} />
    </div>
  );
};

const DiscoveryNode = ({ product, index, onClick, isAiActive }: any) => {
  const isLarge = index % 5 === 0;
  return (
    <div 
      onClick={onClick}
      className={`group relative bg-white border border-slate-100 overflow-hidden cursor-pointer transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl animate-in fade-in zoom-in slide-in-from-bottom-8 ${
        isAiActive ? 'ring-2 ring-purple-500/20 shadow-purple-500/10' : ''
      } ${index % 3 === 0 ? 'rounded-[32px]' : 'rounded-[20px]'}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className={`relative ${isLarge ? 'aspect-[3/4]' : 'aspect-square'} overflow-hidden`}>
        <img src={product.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
        <div className={`absolute inset-0 bg-gradient-to-t opacity-0 group-hover:opacity-100 transition-opacity ${isAiActive ? 'from-purple-900/80' : 'from-black/60'}`} />
        <div className="absolute bottom-4 left-4">
           <span className="text-[10px] font-black text-white italic tracking-tighter drop-shadow-lg">₹{product.price.toLocaleString('en-IN')}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-[11px] font-black text-slate-900 leading-tight truncate">{product.title}</h3>
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{product.category}</p>
      </div>
    </div>
  );
};

const PeerNode = ({ peer, index, onFollow, onChat, onProfile }: any) => {
  return (
    <div 
      className="bg-white rounded-[32px] border border-slate-100 p-5 flex items-center space-x-5 shadow-sm hover:shadow-md transition-all active:scale-[0.98] group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative cursor-pointer" onClick={onProfile}>
        <div className="w-16 h-16 rounded-[24px] p-0.5 bg-gradient-to-tr from-emerald-400 to-indigo-500 shadow-lg">
           <img src={peer.avatar} className="w-full h-full object-cover rounded-[22px] border-2 border-white" alt="" />
        </div>
        {peer.isVerified && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center border-2 border-white text-white">
            <Check size={12} strokeWidth={4} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0" onClick={onProfile}>
        <div className="flex items-center space-x-1">
          <h3 className="text-sm font-black text-slate-900 tracking-tight truncate group-hover:text-indigo-600 transition-colors">{peer.name}</h3>
        </div>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{peer.college}</p>
        <div className="flex items-center space-x-3 mt-2 text-[8px] font-black text-slate-300 uppercase tracking-widest">
           <span>{peer.followers?.toLocaleString() || 0} Synapses</span>
           <div className="w-1 h-1 bg-slate-200 rounded-full" />
           <span>Level {Math.floor(Math.random() * 50) + 1}</span>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
         <button 
          onClick={(e) => { e.stopPropagation(); onFollow(); }}
          className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center justify-center space-x-2 ${
            peer.isFollowing ? 'bg-slate-100 text-slate-500' : 'bg-indigo-600 text-white shadow-indigo-100'
          }`}
         >
           {peer.isFollowing ? <UserCheck size={14} /> : <UserPlus size={14} />}
           <span>{peer.isFollowing ? 'SYNC' : 'FOLLOW'}</span>
         </button>
         <button 
          onClick={(e) => { e.stopPropagation(); onChat(); }}
          className="p-2.5 bg-slate-50 text-indigo-600 rounded-xl hover:bg-indigo-50 active:scale-90 transition-all flex items-center justify-center border border-slate-100"
         >
           <MessageCircle size={18} />
         </button>
      </div>
    </div>
  );
};

export default ExploreView;
