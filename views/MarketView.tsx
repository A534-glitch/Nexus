
import React, { useState, useRef } from 'react';
import { Product } from '../types';
import { Search, X, MessageSquare, CreditCard, Sparkles, TrendingUp, GraduationCap, Calendar, Zap, Filter, MessageCircle, Send, Plus, Heart, Bookmark, Pin, Share2 } from 'lucide-react';
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

const MarketView: React.FC<MarketViewProps> = ({ products, onBargain, onBuyNow, onRentNow, onToggleWishlist, onTogglePin, onShare }) => {
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [bargainPrice, setBargainPrice] = useState('');
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
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

  return (
    <div className="flex flex-col h-full bg-[#fcfcfc] pb-32">
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
                  onClick={(e) => { e.stopPropagation(); onShare(product.id); }}
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
                    onClick={() => { onShare(selectedProduct.id); }}
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
