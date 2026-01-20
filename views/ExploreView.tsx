
import React, { useState, useMemo, useEffect } from 'react';
import { Product } from '../types';
import { Search, TrendingUp, Compass, Sparkles, Zap, Flame, X, Filter, Layers, ZapOff, ArrowUpRight, Cpu, BookOpen, PenTool, Hash } from 'lucide-react';

interface ExploreViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

const ExploreView: React.FC<ExploreViewProps> = ({ products, onSelectProduct }) => {
  const [search, setSearch] = useState('');
  const [activeOrb, setActiveOrb] = useState<string>('All');
  const [isSearching, setIsSearching] = useState(false);

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
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return result;
  }, [products, activeOrb, search]);

  return (
    <div className="flex flex-col h-full bg-[#fdfdfd] overflow-hidden select-none">
      {/* Background Dimensional Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-[-10%] right-[-10%] w-[80%] h-[60%] rounded-full blur-[120px] opacity-20 transition-colors duration-1000 ${
          activeOrb === 'Gadget' ? 'bg-blue-500' : 
          activeOrb === 'Notebook' ? 'bg-amber-500' : 
          activeOrb === 'Stationery' ? 'bg-emerald-500' : 'bg-indigo-500'
        }`} />
      </div>

      {/* Discovery Header */}
      <header className="px-8 pt-12 pb-6 relative z-10">
        <div className="flex items-center justify-between mb-8">
           <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Discover</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">Campus Dimension</p>
           </div>
           <div className="relative">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-slate-100">
                 <Sparkles className="text-indigo-600 animate-pulse" size={20} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white" />
           </div>
        </div>

        {/* Floating Category Orbs */}
        <div className="flex items-center space-x-6 overflow-x-auto hide-scrollbar py-4 px-2 -mx-2">
          {categories.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => setActiveOrb(cat.id)}
              className="flex flex-col items-center space-y-3 flex-shrink-0 group transition-all"
            >
              <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all duration-500 relative ${
                activeOrb === cat.id 
                ? `bg-gradient-to-br ${cat.color} scale-110 shadow-2xl rotate-3` 
                : 'bg-white shadow-lg border border-slate-50 grayscale opacity-60'
              }`}>
                <cat.icon size={24} className={activeOrb === cat.id ? 'text-white' : 'text-slate-400'} />
                {activeOrb === cat.id && (
                  <div className="absolute inset-0 rounded-[24px] bg-white/20 animate-ping pointer-events-none" />
                )}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${activeOrb === cat.id ? 'text-slate-900' : 'text-slate-400'}`}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </header>

      {/* Dimensional Feed */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-6 pb-48">
        <div className="columns-2 gap-4 space-y-4">
          {filteredProducts.map((p, idx) => (
            <DiscoveryNode 
              key={p.id} 
              product={p} 
              index={idx} 
              onClick={() => onSelectProduct(p)} 
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center text-center opacity-30 space-y-4">
             <div className="p-8 bg-slate-100 rounded-[48px]">
                <ZapOff size={48} className="text-slate-400" />
             </div>
             <p className="text-sm font-black text-slate-900 uppercase tracking-widest leading-loose">Dimension Empty</p>
          </div>
        )}
      </div>

      {/* The Command Capsule (Search) */}
      <div className={`fixed bottom-32 left-1/2 -translate-x-1/2 w-[85%] max-w-sm z-[150] transition-all duration-500 ${isSearching ? 'bottom-32' : 'bottom-28'}`}>
        <div className="bg-slate-900/90 backdrop-blur-3xl rounded-[32px] p-2 flex items-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/10 group focus-within:ring-4 focus-within:ring-indigo-500/20">
          <div className="p-4 text-indigo-400">
            <Search size={20} strokeWidth={3} />
          </div>
          <input 
            type="text" 
            placeholder="Search campus orbs..."
            className="flex-1 bg-transparent border-none text-white text-sm font-bold placeholder:text-slate-500 outline-none py-4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsSearching(true)}
            onBlur={() => setIsSearching(false)}
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="p-4 text-slate-500 hover:text-white"
            >
              <X size={18} />
            </button>
          )}
          <button className="p-4 bg-white/10 rounded-2xl text-white mr-1 active:scale-90 transition-all">
            <Filter size={18} />
          </button>
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

// Unique Discovery Card
const DiscoveryNode = ({ product, index, onClick }: any) => {
  // Variations in visuals to avoid standard grid look
  const isAlt = index % 3 === 0;
  const isLarge = index % 5 === 0;

  return (
    <div 
      onClick={onClick}
      className={`group relative bg-white border border-slate-100 overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl animate-in fade-in zoom-in slide-in-from-bottom-8 ${
        isAlt ? 'rounded-[40px]' : 'rounded-[24px]'
      }`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Media Layer */}
      <div className={`relative ${isLarge ? 'aspect-[3/4]' : 'aspect-square'} overflow-hidden`}>
        <img 
          src={product.image} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
          alt="" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Floating Tag Stickers */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
           {index % 4 === 0 && (
             <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center shadow-lg transform -rotate-3">
               <Zap size={10} className="mr-1 fill-white" /> Trending
             </div>
           )}
           {product.price < 500 && (
             <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center shadow-lg transform rotate-2">
               <Flame size={10} className="mr-1 fill-white" /> Deal
             </div>
           )}
        </div>
      </div>

      {/* Content Layer */}
      <div className="p-5">
        <div className="flex items-center space-x-1.5 mb-2">
          <Hash size={10} className="text-indigo-400" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{product.category}</span>
        </div>
        <h3 className="text-sm font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
          {product.title}
        </h3>
        <div className="mt-4 flex items-center justify-between">
           <span className="text-xs font-black text-slate-900 italic tracking-tighter">₹{product.price.toLocaleString('en-IN')}</span>
           <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
             <ArrowUpRight size={14} strokeWidth={3} />
           </div>
        </div>
      </div>

      {/* Haptic Glow Edge */}
      <div className="absolute inset-0 border-[3px] border-indigo-500/0 group-hover:border-indigo-500/10 rounded-[inherit] transition-all pointer-events-none" />
    </div>
  );
};

export default ExploreView;
