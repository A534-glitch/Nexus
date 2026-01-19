
import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { Search, TrendingUp, Grid, Play, Heart, Bookmark, Sparkles, Zap, Flame, XCircle } from 'lucide-react';

interface ExploreViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

const ExploreView: React.FC<ExploreViewProps> = ({ products, onSelectProduct }) => {
  const [search, setSearch] = useState('');
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});

  const trendingTags = ['#ExamPrep', '#iPadDeals', '#HostelEssentials', '#DormDecor', '#SecondHandTech'];

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const query = search.toLowerCase().replace('#', '');
    return products.filter(p => 
      p.title.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
  }, [products, search]);

  const handleImageLoad = (id: string) => {
    setImageLoaded(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="flex flex-col h-full bg-[#fafafa]">
      <header className="px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search campus trending..."
            className="w-full bg-slate-100 border-none rounded-2xl py-3.5 pl-11 pr-10 text-sm font-bold focus:ring-4 focus:ring-indigo-600/10 transition-all outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <XCircle size={18} fill="currentColor" className="text-white" />
            </button>
          )}
        </div>
        
        <div className="flex space-x-2 mt-4 overflow-x-auto hide-scrollbar pb-1">
          {trendingTags.map((tag) => (
            <button 
              key={tag} 
              onClick={() => setSearch(tag)}
              className={`px-4 py-1.5 border rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                search === tag 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                  : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-400 hover:text-indigo-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-0.5 hide-scrollbar">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-3 gap-0.5">
            {filteredProducts.map((p, idx) => {
              // Instagram pattern: 1st is large, then standard, then another large offset
              const isLarge = idx === 0 || (idx > 0 && (idx - 1) % 18 === 10);
              
              return (
                <div 
                  key={p.id} 
                  className={`relative group cursor-pointer overflow-hidden bg-slate-200 animate-in fade-in duration-500 ${isLarge ? 'col-span-2 row-span-2' : 'col-span-1'}`}
                  onClick={() => onSelectProduct(p)}
                >
                  {/* Shimmer Placeholder */}
                  {!imageLoaded[p.id] && (
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-shimmer" />
                  )}
                  
                  <img 
                    src={p.image} 
                    className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imageLoaded[p.id] ? 'opacity-100' : 'opacity-0'}`}
                    alt={p.title}
                    onLoad={() => handleImageLoad(p.id)}
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                    <div className="flex items-center space-x-1 text-white scale-90 group-hover:scale-100 transition-transform">
                      <Heart size={20} fill="white" />
                      <span className="text-xs font-black">{p.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-white scale-90 group-hover:scale-100 transition-transform delay-75">
                      <Bookmark size={20} fill={p.isWishlisted ? "white" : "none"} />
                      <span className="text-[10px] font-black uppercase tracking-tighter">Save</span>
                    </div>
                  </div>

                  {/* Icon Indicators */}
                  <div className="absolute top-3 right-3 flex flex-col space-y-2">
                    {idx % 4 === 0 && (
                      <div className="text-white drop-shadow-md">
                        <Play size={16} fill="white" />
                      </div>
                    )}
                    {p.isPinned && (
                      <div className="text-white drop-shadow-md">
                        <Sparkles size={16} className="text-amber-300" fill="currentColor" />
                      </div>
                    )}
                  </div>

                  {/* Trending badge */}
                  {(p.likes > 15 || idx === 0) && (
                    <div className="absolute bottom-3 left-3 bg-rose-500/90 backdrop-blur-md text-white px-2.5 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center shadow-lg animate-in slide-in-from-left duration-500">
                      <Flame size={10} className="mr-1" fill="white" />
                      {idx === 0 ? 'Featured' : 'Hot Deal'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 px-10 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-slate-100 rounded-[40px] flex items-center justify-center mb-6">
              <Search size={40} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-black text-slate-900">No results found</h3>
            <p className="text-sm text-slate-500 font-medium mt-2">
              We couldn't find anything matching "{search}". Try searching for categories like "Gadgets" or "Notebooks".
            </p>
            <button 
              onClick={() => setSearch('')}
              className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 active:scale-95 transition-all"
            >
              Clear Search
            </button>
          </div>
        )}
        
        {/* Personalized Discovery Footer */}
        {filteredProducts.length > 0 && (
          <div className="py-24 flex flex-col items-center justify-center opacity-30 border-t border-slate-100 mt-0.5 bg-white">
            <div className="p-4 bg-slate-50 rounded-full mb-3">
              <TrendingUp size={28} className="text-indigo-600" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Personalized discovery</p>
            <p className="text-[8px] font-bold text-slate-400 mt-1">BASED ON YOUR CAMPUS ACTIVITY</p>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}} />
    </div>
  );
};

export default ExploreView;
