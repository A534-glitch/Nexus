
import React, { useState, useRef } from 'react';
import { Product } from '../types';
import { Search, X, MessageSquare, CreditCard, Sparkles, GraduationCap, Zap, Filter, Heart, Bookmark, ArrowUpRight, Volume2, Loader2, DollarSign, Handshake, Info, CheckCircle2, ShieldCheck, ChevronRight, HelpCircle } from 'lucide-react';
import { getBargainAdvice, generateSpeech, decodeAudio } from '../services/gemini';

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
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [bargainPrice, setBargainPrice] = useState('');
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showBargainGuide, setShowBargainGuide] = useState(true);

  const categories = [
    { label: 'All', value: 'All' },
    { label: 'Gadgets', value: 'Gadget' },
    { label: 'Notebooks', value: 'Notebook' },
    { label: 'Stationery', value: 'Stationery' },
    { label: 'Other', value: 'Other' }
  ];

  const filtered = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSpeakDescription = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    const audioData = await generateSpeech(text);
    if (audioData) {
      const buffer = await decodeAudio(audioData);
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => setIsSpeaking(false);
      source.start();
    } else {
      setIsSpeaking(false);
    }
  };

  const handleGetBargainAdvice = async () => {
    if (!selectedProduct || !bargainPrice) return;
    setLoadingAdvice(true);
    const advice = await getBargainAdvice(selectedProduct.title, selectedProduct.price, Number(bargainPrice));
    setAiAdvice(advice);
    setLoadingAdvice(false);
  };

  const calculateFairness = () => {
    if (!selectedProduct || !bargainPrice) return 0;
    const offer = Number(bargainPrice);
    const original = selectedProduct.price;
    const ratio = offer / original;
    if (ratio < 0.4) return 20; // Offensive
    if (ratio < 0.6) return 40; // Low
    if (ratio < 0.8) return 70; // Good
    return 95; // Excellent
  };

  const getFairnessColor = () => {
    const score = calculateFairness();
    if (score < 30) return 'bg-rose-500';
    if (score < 60) return 'bg-amber-500';
    if (score < 80) return 'bg-indigo-500';
    return 'bg-emerald-500';
  };

  const getFairnessText = () => {
    const score = calculateFairness();
    if (score < 30) return 'Too Low';
    if (score < 60) return 'A bit low';
    if (score < 80) return 'Fair Offer';
    return 'Great Offer';
  };

  return (
    <div className="flex flex-col h-full bg-[#fcfcfc] pb-32">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-100 px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100">
              <GraduationCap size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Nexus Store</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">The Campus Market</p>
            </div>
          </div>
          <button className="p-3 bg-slate-50 text-slate-900 rounded-2xl hover:bg-slate-100 transition-all">
            <Filter size={22} />
          </button>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full bg-slate-100 border-none rounded-[20px] py-4 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-indigo-600/10 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="flex space-x-3 px-6 py-4 overflow-x-auto hide-scrollbar">
        {categories.map((cat) => (
          <button 
            key={cat.value} 
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black tracking-tight whitespace-nowrap transition-all ${selectedCategory === cat.value ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border border-slate-100 text-slate-500 hover:border-indigo-200'}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="p-6 grid grid-cols-2 gap-5">
        {filtered.map(product => (
          <div 
            key={product.id} 
            className="bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-sm transition-all hover:shadow-2xl cursor-pointer group flex flex-col"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="aspect-[4/5] relative overflow-hidden">
               <img src={product.image} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt="" />
               <div className="absolute top-3 right-3">
                  <button onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }} className={`p-2 rounded-xl shadow-lg bg-white/90 backdrop-blur-md ${product.isWishlisted ? 'text-rose-500' : 'text-slate-400'}`}>
                    <Bookmark size={14} fill={product.isWishlisted ? "currentColor" : "none"} />
                  </button>
               </div>
               <div className="absolute bottom-3 left-3 right-3 flex space-x-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onBargain(product); }}
                    className="flex-1 py-2 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center"
                  >
                    Bargain
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onBuyNow(product); }}
                    className="flex-1 py-2 bg-white text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center"
                  >
                    Buy
                  </button>
               </div>
            </div>
            <div className="p-4">
              <h3 className="text-[13px] font-black text-slate-900 tracking-tight truncate">{product.title}</h3>
              <p className="text-[11px] font-black text-indigo-600 mt-1 italic">₹{product.price.toLocaleString('en-IN')}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-[250] bg-black/70 backdrop-blur-md flex items-end">
          <div className="bg-white w-full h-[95vh] rounded-t-[56px] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-500 shadow-2xl">
            <div className="relative aspect-video w-full">
               <img src={selectedProduct.image} className="w-full h-full object-cover" alt="" />
               <button onClick={() => setSelectedProduct(null)} className="absolute top-8 right-8 bg-black/40 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/60 transition-colors"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pt-10 pb-32 hide-scrollbar">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{selectedProduct.title}</h2>
                  <p className="text-xs font-bold text-indigo-600 mt-2 uppercase tracking-widest">Verified {selectedProduct.category}</p>
                </div>
                <button 
                  onClick={() => handleSpeakDescription(selectedProduct.description)}
                  className={`p-4 rounded-[28px] transition-all relative group ${isSpeaking ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-indigo-600 hover:bg-indigo-50'}`}
                >
                  {isSpeaking ? <Loader2 className="animate-spin" size={24} /> : <Volume2 size={24} />}
                </button>
              </div>

              <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 flex items-center justify-between mb-10 shadow-inner">
                <div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Asking Price</span>
                   <p className="text-4xl font-black text-slate-900 tracking-tighter">₹{selectedProduct.price.toLocaleString('en-IN')}</p>
                </div>
                <button onClick={() => onBuyNow(selectedProduct)} className="bg-slate-900 text-white px-8 py-4 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 active:scale-95 transition-all">Buy Now</button>
              </div>

              {/* AI BARGAIN CENTER - FIRST TIME USER FRIENDLY */}
              <div className="bg-indigo-600 p-8 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                   <div className="flex items-center justify-between mb-8">
                     <h4 className="text-xl font-black flex items-center">
                        <Handshake size={28} className="mr-3 text-indigo-300" />
                        Bargain Lab
                     </h4>
                     <button onClick={() => setShowBargainGuide(!showBargainGuide)} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all">
                       <HelpCircle size={20} />
                     </button>
                   </div>
                   
                   {showBargainGuide && (
                     <div className="bg-white/10 rounded-[32px] p-6 border border-white/20 mb-8 animate-in zoom-in duration-300">
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-3">New to bargaining?</p>
                        <ul className="space-y-3 text-xs font-medium">
                           <li className="flex items-center space-x-2">
                             <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full" />
                             <span>Enter your offer in the box below.</span>
                           </li>
                           <li className="flex items-center space-x-2">
                             <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full" />
                             <span>Check the <strong>Fairness Meter</strong> for student pricing.</span>
                           </li>
                           <li className="flex items-center space-x-2">
                             <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full" />
                             <span>Send to seller and start chatting!</span>
                           </li>
                        </ul>
                        <button onClick={() => setShowBargainGuide(false)} className="mt-5 w-full py-3 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest">I Understood!</button>
                     </div>
                   )}

                   <div className="flex space-x-4 mb-4">
                      <div className="relative flex-1">
                         <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 font-black text-xl">₹</span>
                         <input 
                          type="number"
                          placeholder="Your Offer"
                          className="w-full bg-white/10 border border-white/20 rounded-[28px] py-6 pl-12 pr-6 text-lg font-black outline-none placeholder:text-white/30 focus:bg-white/20 transition-all"
                          value={bargainPrice}
                          onChange={(e) => setBargainPrice(e.target.value)}
                         />
                      </div>
                      <button 
                        onClick={handleGetBargainAdvice}
                        className="bg-white text-indigo-700 px-8 rounded-[28px] font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all disabled:opacity-50"
                        disabled={loadingAdvice || !bargainPrice}
                      >
                        {loadingAdvice ? <Loader2 className="animate-spin" size={20} /> : 'Advise'}
                      </button>
                   </div>

                   {bargainPrice && (
                     <div className="mb-8 px-4">
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Fairness Meter</span>
                           <span className="text-[9px] font-black uppercase tracking-widest">{getFairnessText()}</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                           <div 
                            className={`h-full transition-all duration-700 ${getFairnessColor()}`}
                            style={{ width: `${calculateFairness()}%` }}
                           />
                        </div>
                     </div>
                   )}
                   
                   {aiAdvice && (
                     <div className="bg-white/10 backdrop-blur-md p-6 rounded-[32px] border border-white/10 text-xs font-bold leading-relaxed mb-6 animate-in zoom-in duration-300 italic">
                       <Sparkles size={16} className="text-amber-300 mb-2" />
                       "{aiAdvice}"
                     </div>
                   )}
                   
                   <button 
                    onClick={() => onBargain(selectedProduct, Number(bargainPrice))}
                    className="w-full py-6 bg-white/20 border-2 border-white/30 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:bg-white/30 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
                   >
                     <span>Start Negotiation</span>
                     <Handshake size={20} />
                   </button>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-3 text-slate-300 mt-10">
                 <ShieldCheck size={16} />
                 <span className="text-[9px] font-black uppercase tracking-widest">End-to-End Secure Campus P2P</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketView;
