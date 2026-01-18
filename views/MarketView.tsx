
import React, { useState, useRef } from 'react';
import { Product } from '../types';
import { Search, X, MessageSquare, CreditCard, Sparkles, TrendingUp, GraduationCap, Calendar, Zap, Filter, MessageCircle, Send, Plus, Heart, Bookmark, Pin, Share2, Link as LinkIcon, Copy, Check } from 'lucide-react';
import { getBargainAdvice } from '../services/gemini';

interface MarketViewProps {
  products: Product[];
  onBargain: (product: Product, offer?: number) => void;
  onBuyNow: (product: Product) => void;
  onRentNow: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onTogglePin: (productId: string) => void;
  onShare: (productId: string) => void;
}

const ShareSheet = ({ product, onClose }: { product: Product, onClose: () => void }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.origin;
  const shareText = `Check out this ${product.title} for ₹${product.price} on Nexus! 🚀`;

  const platforms = [
    { 
      name: 'WhatsApp', 
      color: '#25D366', 
      icon: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>,
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank')
    },
    { 
      name: 'Instagram', 
      color: '#E4405F', 
      icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4.162 4.162 0 110-8.324A4.162 4.162 0 0112 16zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>,
      action: () => { navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    },
    { 
      name: 'X', 
      color: '#000000', 
      icon: <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z"/>,
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
    },
    { 
      name: 'Facebook', 
      color: '#1877F2', 
      icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>,
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
    },
    { 
      name: 'LinkedIn', 
      color: '#0A66C2', 
      icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>,
      action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')
    },
    { 
      name: 'Telegram', 
      color: '#0088CC', 
      icon: <path d="M20.665 3.717l-17.73 6.837c-1.213.486-1.205 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.703-.331 4.96c.488 0 .704-.223.977-.488l2.345-2.28 4.873 3.6c.898.495 1.543.239 1.767-.83l3.2-15.085c.328-1.314-.499-1.908-1.462-1.426z"/>,
      action: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank')
    }
  ];

  return (
    <div className="fixed inset-0 z-[250] flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full rounded-t-[40px] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300 relative z-10 pb-12">
        <div className="flex justify-center py-4">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
        </div>
        
        <div className="px-8 pb-6 text-center">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Spread the Word</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Share this find with your friends</p>
        </div>

        <div className="grid grid-cols-3 gap-y-8 px-6 py-4">
          {platforms.map((p) => (
            <button 
              key={p.name}
              onClick={() => { p.action(); if (p.name !== 'Instagram') onClose(); }}
              className="flex flex-col items-center space-y-2 group active:scale-90 transition-transform"
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all"
                style={{ backgroundColor: p.color + '15' }}
              >
                <svg viewBox="0 0 24 24" className="w-8 h-8" style={{ fill: p.color }}>
                  {p.icon}
                </svg>
              </div>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{p.name}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 px-8">
           <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3 overflow-hidden">
                <LinkIcon size={18} className="text-slate-400 flex-shrink-0" />
                <span className="text-xs font-bold text-slate-500 truncate">{shareUrl}</span>
              </div>
              <button 
                onClick={platforms[1].action}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white'}`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span className="text-[10px] font-black uppercase tracking-widest">{copied ? 'Copied' : 'Copy'}</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const MarketView: React.FC<MarketViewProps> = ({ products, onBargain, onBuyNow, onRentNow, onToggleWishlist, onTogglePin, onShare }) => {
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [bargainPrice, setBargainPrice] = useState('');
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [activeShareProductId, setActiveShareProductId] = useState<string | null>(null);
  
  const aiSectionRef = useRef<HTMLDivElement>(null);

  const filtered = products.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  const handleGetBargainAdvice = async () => {
    if (!selectedProduct || !bargainPrice) return;
    setLoadingAdvice(true);
    setAiAdvice(null);
    const advice = await getBargainAdvice(selectedProduct.title, selectedProduct.price, Number(bargainPrice));
    setAiAdvice(advice);
    setLoadingAdvice(false);
  };

  const handleSendOffer = () => {
    if (selectedProduct) {
      onBargain(selectedProduct, bargainPrice ? Number(bargainPrice) : undefined);
      setSelectedProduct(null);
    }
  };

  const shareProduct = products.find(p => p.id === activeShareProductId);

  return (
    <div className="flex flex-col h-full bg-[#fcfcfc] pb-32">
      {/* Share Sheet Overlay */}
      {activeShareProductId && shareProduct && (
        <ShareSheet 
          product={shareProduct} 
          onClose={() => setActiveShareProductId(null)}
        />
      )}

      {/* Functional Premium Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-slate-100 px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100">
              <GraduationCap size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Shop</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Nexus Marketplace</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => onBargain(products[0])} 
              className="p-3 bg-slate-50 text-slate-900 rounded-2xl hover:bg-slate-100 transition-all active:scale-90"
            >
              <MessageCircle size={22} />
            </button>
            <button className="p-3 bg-slate-50 text-slate-900 rounded-2xl hover:bg-slate-100 transition-all active:scale-90">
              <Filter size={22} />
            </button>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600" size={20} />
          <input
            type="text"
            placeholder="Search essentials..."
            className="w-full bg-slate-100 border-none rounded-[20px] py-4 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-indigo-600/10 transition-all outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {/* Categories Horizontal Scroll */}
      <div className="flex space-x-3 px-6 py-4 overflow-x-auto hide-scrollbar">
        {['All', 'Gadgets', 'Notebooks', 'Stationery', 'Furniture'].map((cat, i) => (
          <button key={cat} className={`px-5 py-2.5 rounded-2xl text-xs font-black tracking-tight whitespace-nowrap transition-all ${i === 0 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50'}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="p-6 grid grid-cols-2 gap-4">
        {filtered.map(product => (
          <div 
            key={product.id} 
            className={`bg-white rounded-[32px] overflow-hidden border transition-all duration-500 cursor-pointer relative ${product.isPinned ? 'border-indigo-500 shadow-indigo-100 shadow-xl' : 'border-slate-100 shadow-sm'}`}
            onClick={() => setSelectedProduct(product)}
          >
            <div className="aspect-[1/1] bg-slate-50 relative overflow-hidden">
               <img src={product.image} className="w-full h-full object-cover" alt={product.title} />
               <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-md px-2 py-1 rounded-xl shadow-sm">
                 <span className="text-[11px] font-black text-slate-900 tracking-tighter">₹{product.price.toLocaleString('en-IN')}</span>
               </div>
               
               <div className="absolute top-3 right-3 flex flex-col space-y-2">
                 <button 
                  onClick={(e) => { e.stopPropagation(); onTogglePin(product.id); }}
                  className={`p-2 rounded-xl shadow-lg transition-all active:scale-75 ${product.isPinned ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400'}`}
                 >
                    <Pin size={16} className={product.isPinned ? 'rotate-45' : ''} fill={product.isPinned ? "currentColor" : "none"} />
                 </button>
                 <button 
                  onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
                  className={`p-2 rounded-xl shadow-lg transition-all active:scale-75 ${product.isWishlisted ? 'bg-rose-500 text-white' : 'bg-white text-slate-400'}`}
                 >
                    <Bookmark size={16} fill={product.isWishlisted ? "currentColor" : "none"} />
                 </button>
                 <button 
                  onClick={(e) => { e.stopPropagation(); setActiveShareProductId(product.id); }}
                  className={`p-2 rounded-xl shadow-lg transition-all active:scale-75 bg-white text-slate-400`}
                 >
                    <Share2 size={16} />
                 </button>
               </div>
               
               {product.isPinned && (
                 <div className="absolute bottom-3 left-3 bg-indigo-600 text-white px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg">
                   Pinned
                 </div>
               )}
               
               <button className="absolute bottom-3 right-3 bg-white text-slate-900 p-2 rounded-xl shadow-lg hover:scale-110 transition-transform">
                  <Plus size={16} strokeWidth={3} />
               </button>
            </div>
            <div className="p-4">
              <h3 className="text-[13px] font-black text-slate-900 leading-tight truncate mb-1">{product.title}</h3>
              <div className="flex items-center space-x-1">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.sellerName.split(' ')[0]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-xl flex items-end animate-in fade-in duration-300">
          <div className="bg-white w-full h-[94vh] rounded-t-[56px] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-700 overflow-hidden">
            <div className="relative aspect-[4/3] w-full bg-slate-100">
               <img src={selectedProduct.image} className="w-full h-full object-cover" alt="" />
               <div className="absolute top-8 left-8 flex space-x-3">
                  <button 
                    onClick={() => { onTogglePin(selectedProduct.id); }}
                    className={`p-3 rounded-full backdrop-blur-lg shadow-lg transition-all active:scale-75 ${selectedProduct.isPinned ? 'bg-indigo-600 text-white' : 'bg-white/20 text-white'}`}
                  >
                    <Pin size={24} className={selectedProduct.isPinned ? 'rotate-45' : ''} fill={selectedProduct.isPinned ? "currentColor" : "none"} />
                  </button>
                  <button 
                    onClick={() => { onToggleWishlist(selectedProduct.id); }}
                    className={`p-3 rounded-full backdrop-blur-lg shadow-lg transition-all active:scale-75 ${selectedProduct.isWishlisted ? 'bg-rose-500 text-white' : 'bg-white/20 text-white'}`}
                  >
                    <Bookmark size={24} fill={selectedProduct.isWishlisted ? "currentColor" : "none"} />
                  </button>
                  <button 
                    onClick={() => { setActiveShareProductId(selectedProduct.id); }}
                    className={`p-3 rounded-full backdrop-blur-lg shadow-lg transition-all active:scale-75 bg-white/20 text-white`}
                  >
                    <Share2 size={24} />
                  </button>
               </div>
               <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-8 right-8 bg-black/20 backdrop-blur-lg text-white p-3 rounded-full hover:bg-black/40 transition-all"
               >
                 <X size={24} strokeWidth={2.5} />
               </button>
               <div className="absolute -bottom-8 left-10 w-20 h-20 rounded-3xl bg-white p-1.5 shadow-2xl">
                 <img src={`https://picsum.photos/seed/${selectedProduct.sellerName}/100`} className="w-full h-full rounded-[22px] object-cover" alt="" />
               </div>
            </div>

            <div className="flex-1 overflow-y-auto px-10 pt-14 pb-32 hide-scrollbar space-y-8">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{selectedProduct.title}</h2>
                    {selectedProduct.isPinned && <Pin size={20} className="text-indigo-600 rotate-45" />}
                  </div>
                  <div className="flex items-center space-x-1 bg-rose-50 px-3 py-1 rounded-full">
                     <Heart size={14} className="text-rose-500 fill-rose-500" />
                     <span className="text-[11px] font-black text-rose-600">{selectedProduct.likes}</span>
                  </div>
                </div>
                <p className="text-sm font-black text-indigo-600 uppercase tracking-[0.2em]">Verified Seller: {selectedProduct.sellerName}</p>
              </div>

              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Listing Price</span>
                  <span className="text-3xl font-black text-slate-900">₹{selectedProduct.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex space-x-2">
                   <button onClick={() => onRentNow(selectedProduct)} className="bg-white px-5 py-3 rounded-2xl border border-slate-200 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-colors">Rent</button>
                   <button onClick={() => onBuyNow(selectedProduct)} className="bg-slate-900 text-white px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200">Buy Now</button>
                </div>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Item Story</h4>
                 <p className="text-slate-600 font-medium leading-relaxed">{selectedProduct.description}</p>
              </div>

              {/* Advanced Bargain UI */}
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[40px] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-20"><Sparkles size={120} /></div>
                <div className="relative z-10">
                   <div className="flex items-center justify-between mb-8">
                      <h4 className="text-lg font-black flex items-center">
                        <Zap size={20} className="mr-2 text-indigo-300" />
                        AI Price Bargain
                      </h4>
                      <div className="bg-white/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Gemini 3.0</div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex space-x-3">
                         <div className="relative flex-1">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50 font-black">₹</span>
                            <input 
                              type="number"
                              className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-10 pr-4 text-sm font-black outline-none focus:ring-4 focus:ring-white/20 transition-all placeholder:text-white/30"
                              placeholder="Your offer..."
                              value={bargainPrice}
                              onChange={(e) => setBargainPrice(e.target.value)}
                            />
                         </div>
                         <button 
                          onClick={handleGetBargainAdvice}
                          className="bg-white text-indigo-700 px-6 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                         >
                            {loadingAdvice ? 'Thinking...' : 'Advise Me'}
                         </button>
                      </div>

                      {aiAdvice && (
                        <div className="bg-black/10 backdrop-blur-md p-5 rounded-2xl border border-white/5 border-l-4 border-l-white text-xs leading-relaxed font-medium italic animate-in zoom-in duration-300">
                          "{aiAdvice}"
                        </div>
                      )}

                      <button 
                        onClick={handleSendOffer}
                        className="w-full py-4 bg-white/10 border border-white/20 hover:bg-white/20 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all"
                      >
                        Start Negotiation
                      </button>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketView;
