
import React, { useState, useEffect, useMemo } from 'react';
import { Product, Comment, ProductCondition } from '../types';
import { 
  Search, X, Sparkles, GraduationCap, 
  Bookmark, ArrowUpRight, Volume2, Loader2, 
  Handshake, LayoutGrid, List, Grid3X3, Share2,
  AlertCircle, ShieldCheck, Send, MessageSquare,
  SlidersHorizontal, Check, Tag, HardDrive, Cpu, Zap, Shield
} from 'lucide-react';
import { generateSpeech, decodeAudio, generateSmartComment, generateQuickReplies } from '../services/gemini';

interface MarketViewProps {
  products: Product[];
  onBargain: (product: Product, offer?: number) => void;
  onBuyNow: (product: Product) => void;
  onRentNow: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onTogglePin: (productId: string) => void;
  onShare: (productId: string) => void;
  onComment: (productId: string, text: string) => void;
}

type GridType = 'LIST' | 'GRID_2' | 'GRID_3';

const MarketView: React.FC<MarketViewProps> = ({ 
  products, onBargain, onBuyNow, onRentNow, onToggleWishlist, onTogglePin, onShare, onComment 
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [layout, setLayout] = useState<GridType>('GRID_2');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Advanced Filters
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedConnectivity, setSelectedConnectivity] = useState<string | null>(null);
  const [selectedCompatibility, setSelectedCompatibility] = useState<string | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<ProductCondition | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);
  const [warrantyOnly, setWarrantyOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(100000);

  // Comment specific state
  const [commentText, setCommentText] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);

  const categories = ['All', 'Gadget', 'Notebook', 'Stationery', 'Other'];
  const brands = ['Apple', 'Samsung', 'Sony', 'Logitech', 'Bose', 'Dell', 'HP'];
  const connections = ['Wireless', 'Wired', 'Bluetooth', 'USB-C', 'Lightning'];
  const platforms = ['iOS', 'Android', 'Mac', 'Windows', 'Linux'];
  const storages = ['64GB', '128GB', '256GB', '512GB', '1TB', '2TB'];
  const conditions: ProductCondition[] = ['Brand New', 'Like New', 'Good', 'Fair'];

  const filtered = useMemo(() => products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const matchesPrice = p.price <= maxPrice;
    const matchesCondition = !selectedCondition || p.condition === selectedCondition;
    
    // Gadget Specific Advanced Filtering
    if (activeCategory === 'Gadget') {
      const matchesBrand = !selectedBrand || p.specs?.brand === selectedBrand;
      const matchesConn = !selectedConnectivity || p.specs?.connectivity === selectedConnectivity;
      const matchesComp = !selectedCompatibility || p.specs?.compatibility?.includes(selectedCompatibility);
      const matchesStorage = !selectedStorage || p.specs?.storage === selectedStorage;
      const matchesWarranty = !warrantyOnly || p.specs?.warranty === true;
      return matchesSearch && matchesCat && matchesPrice && matchesCondition && matchesBrand && matchesConn && matchesComp && matchesStorage && matchesWarranty;
    }

    return matchesSearch && matchesCat && matchesPrice && matchesCondition;
  }), [products, search, activeCategory, selectedBrand, selectedConnectivity, selectedCompatibility, selectedCondition, selectedStorage, warrantyOnly, maxPrice]);

  const currentSelectedProduct = selectedProduct ? products.find(p => p.id === selectedProduct.id) : null;

  useEffect(() => {
    if (currentSelectedProduct) {
      const fetchReplies = async () => {
        const replies = await generateQuickReplies(currentSelectedProduct.title, currentSelectedProduct.description);
        setQuickReplies(replies);
      };
      fetchReplies();
    }
  }, [currentSelectedProduct?.id]);

  const handleSpeech = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    const audioData = await generateSpeech(text);
    if (audioData) {
      const buffer = await decodeAudio(audioData);
      const ctx = new AudioContext();
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => setIsSpeaking(false);
      source.start();
    } else {
      setIsSpeaking(false);
    }
  };

  const handlePostComment = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!commentText.trim() || !currentSelectedProduct) return;
    onComment(currentSelectedProduct.id, commentText);
    setCommentText('');
  };

  const handleSmartComment = async () => {
    if (!currentSelectedProduct) return;
    setIsSuggesting(true);
    const suggestion = await generateSmartComment(currentSelectedProduct.title, currentSelectedProduct.description);
    setCommentText(suggestion);
    setIsSuggesting(false);
  };

  const clearFilters = () => {
    setSelectedBrand(null);
    setSelectedConnectivity(null);
    setSelectedCompatibility(null);
    setSelectedCondition(null);
    setSelectedStorage(null);
    setWarrantyOnly(false);
    setMaxPrice(100000);
  };

  const hasActiveFilters = selectedBrand || selectedConnectivity || selectedCompatibility || selectedCondition || selectedStorage || warrantyOnly || maxPrice < 100000;

  return (
    <div className="flex flex-col h-full bg-slate-50 pb-32">
      <header className="bg-white px-6 pt-12 pb-6 sticky top-0 z-50 border-b border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg">
              <GraduationCap className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Market</h1>
          </div>
          
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button onClick={() => setLayout('LIST')} className={`p-2 rounded-xl transition-all ${layout === 'LIST' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}><List size={18} /></button>
            <button onClick={() => setLayout('GRID_2')} className={`p-2 rounded-xl transition-all ${layout === 'GRID_2' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}><LayoutGrid size={18} /></button>
            <button onClick={() => setLayout('GRID_3')} className={`p-2 rounded-xl transition-all ${layout === 'GRID_3' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}><Grid3X3 size={18} /></button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search gear..." className="w-full bg-slate-100 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold outline-none" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button 
            onClick={() => setShowFilters(true)}
            className={`p-3.5 rounded-2xl border transition-all relative ${hasActiveFilters ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-500'}`}
          >
            <SlidersHorizontal size={20} />
            {hasActiveFilters && <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white animate-pulse" />}
          </button>
        </div>
      </header>

      <div className="flex space-x-3 px-6 py-4 overflow-x-auto hide-scrollbar">
        {categories.map(c => (
          <button key={c} onClick={() => setActiveCategory(c)} className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === c ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-500'}`}>{c}</button>
        ))}
      </div>

      <div className={`p-6 ${layout === 'LIST' ? 'space-y-4' : layout === 'GRID_2' ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-3 gap-2'}`}>
        {filtered.map(p => (
          <div key={p.id} className={`bg-white rounded-[28px] overflow-hidden border border-slate-200 shadow-sm transition-all hover:shadow-lg cursor-pointer group flex flex-col ${layout === 'LIST' ? 'flex-row h-32 p-3 space-x-4' : ''}`} onClick={() => setSelectedProduct(p)}>
            <div className={`relative flex-shrink-0 bg-slate-100 ${layout === 'LIST' ? 'w-24 h-full rounded-2xl' : 'aspect-square'}`}>
               <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
               <div className="absolute top-2 right-2 flex flex-col space-y-1 items-end">
                  <button onClick={(e) => { e.stopPropagation(); onToggleWishlist(p.id); }} className="p-1.5 bg-white/90 rounded-lg shadow-lg text-slate-400"><Bookmark size={12} fill={p.isWishlisted ? "currentColor" : "none"} className={p.isWishlisted ? 'text-rose-500' : ''} /></button>
                  <div className="px-1.5 py-0.5 bg-indigo-600 text-white text-[7px] font-black uppercase rounded-md shadow-sm">
                    {p.condition}
                  </div>
               </div>
               <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 rounded-lg text-[8px] font-black text-white">₹{p.price.toLocaleString()}</div>
            </div>
            <div className={`flex flex-col justify-center ${layout === 'LIST' ? 'flex-1' : 'p-3'}`}>
              <h3 className={`font-black text-slate-900 tracking-tight truncate ${layout === 'GRID_3' ? 'text-[10px]' : 'text-xs'}`}>{p.title}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 truncate">{p.specs?.brand || p.category}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-[200] flex flex-col justify-end">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
           <div className="bg-white w-full h-[85vh] rounded-t-[48px] shadow-2xl relative z-10 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-500">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-20">
                 <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase tracking-widest">Refine Search</h2>
                 <button onClick={() => setShowFilters(false)} className="p-3 bg-slate-100 rounded-2xl"><X size={20}/></button>
              </div>

              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-10 hide-scrollbar pb-32">
                 {/* Max Budget */}
                 <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                       <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Max Budget</h3>
                       <span className="text-sm font-black text-slate-900 italic">₹{maxPrice.toLocaleString()}</span>
                    </div>
                    <input type="range" min="0" max="100000" step="1000" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                 </div>

                 {activeCategory === 'Gadget' && (
                   <>
                     {/* Brand Selection */}
                     <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center"><Cpu size={14} className="mr-2" /> Device Brand</h3>
                        <div className="flex flex-wrap gap-2">
                           {brands.map(b => (
                             <button 
                              key={b} 
                              onClick={() => setSelectedBrand(selectedBrand === b ? null : b)}
                              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedBrand === b ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}
                             >
                               {b}
                             </button>
                           ))}
                        </div>
                     </div>

                     {/* Storage Capacity */}
                     <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center"><HardDrive size={14} className="mr-2" /> Storage Hub</h3>
                        <div className="flex flex-wrap gap-2">
                           {storages.map(s => (
                             <button 
                              key={s} 
                              onClick={() => setSelectedStorage(selectedStorage === s ? null : s)}
                              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedStorage === s ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}
                             >
                               {s}
                             </button>
                           ))}
                        </div>
                     </div>

                     {/* Connectivity */}
                     <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center"><Zap size={14} className="mr-2" /> Link Interface</h3>
                        <div className="flex flex-wrap gap-2">
                           {connections.map(c => (
                             <button 
                              key={c} 
                              onClick={() => setSelectedConnectivity(selectedConnectivity === c ? null : c)}
                              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedConnectivity === c ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}
                             >
                               {c}
                             </button>
                           ))}
                        </div>
                     </div>

                     {/* Platform Support */}
                     <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">System Support</h3>
                        <div className="flex flex-wrap gap-2">
                           {platforms.map(p => (
                             <button 
                              key={p} 
                              onClick={() => setSelectedCompatibility(selectedCompatibility === p ? null : p)}
                              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCompatibility === p ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}
                             >
                               {p} Ready
                             </button>
                           ))}
                        </div>
                     </div>

                     {/* Warranty Status */}
                     <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center"><Shield size={14} className="mr-2" /> Protection</h3>
                        <button 
                          onClick={() => setWarrantyOnly(!warrantyOnly)}
                          className={`w-full p-5 rounded-[28px] border transition-all flex items-center justify-between ${warrantyOnly ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100'}`}
                        >
                           <div className="flex items-center space-x-3">
                              <Shield size={20} className={warrantyOnly ? 'text-emerald-500' : 'text-slate-300'} />
                              <span className={`text-xs font-black uppercase tracking-widest ${warrantyOnly ? 'text-emerald-600' : 'text-slate-500'}`}>Under Warranty Only</span>
                           </div>
                           <div className={`w-12 h-6 rounded-full p-1 transition-all ${warrantyOnly ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${warrantyOnly ? 'translate-x-6' : 'translate-x-0'}`} />
                           </div>
                        </button>
                     </div>
                   </>
                 )}
              </div>

              <div className="p-8 bg-white border-t border-slate-100 flex space-x-4 absolute bottom-0 left-0 right-0 z-30">
                 <button 
                  onClick={clearFilters}
                  className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest"
                 >
                   Reset
                 </button>
                 <button 
                  onClick={() => setShowFilters(false)}
                  className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center space-x-2 shadow-2xl"
                 >
                   <span>View {filtered.length} Items</span>
                   <Check size={16} strokeWidth={3} />
                 </button>
              </div>
           </div>
        </div>
      )}

      {currentSelectedProduct && (
        <div className="fixed inset-0 z-[100] bg-black/70 flex items-end">
          <div className="bg-white w-full h-[95vh] rounded-t-[48px] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-500">
             <div className="relative aspect-video flex-shrink-0">
                <img src={currentSelectedProduct.image} className="w-full h-full object-cover" alt="" />
                <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 p-3 bg-black/40 backdrop-blur-md text-white rounded-full"><X size={24}/></button>
                <button onClick={() => onShare(currentSelectedProduct.id)} className="absolute top-6 left-6 p-3 bg-black/40 backdrop-blur-md text-white rounded-full"><Share2 size={24}/></button>
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md px-5 py-2 rounded-2xl shadow-xl">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Owner Verified</p>
                   <p className="text-xs font-black text-slate-900 leading-none">{currentSelectedProduct.sellerName}</p>
                </div>
                {currentSelectedProduct.specs?.warranty && (
                  <div className="absolute bottom-6 right-6 bg-emerald-500 text-white px-4 py-2 rounded-xl shadow-xl flex items-center space-x-2">
                     <Shield size={14} />
                     <span className="text-[9px] font-black uppercase tracking-widest">Protected</span>
                  </div>
                )}
             </div>
             
             <div className="flex-1 overflow-y-auto p-8 pb-48 space-y-8 hide-scrollbar">
                <div className="flex justify-between items-start">
                   <div className="space-y-2">
                      <h2 className="text-3xl font-black text-slate-900 leading-tight tracking-tighter">{currentSelectedProduct.title}</h2>
                      <div className="flex items-center space-x-3">
                         <span className="text-indigo-600 font-black uppercase text-[10px] tracking-widest px-3 py-1 bg-indigo-50 rounded-lg">{currentSelectedProduct.category} Resource</span>
                         <div className="flex items-center text-emerald-600 text-[10px] font-black uppercase">
                            <ShieldCheck size={14} className="mr-1" /> Campus Protected
                         </div>
                      </div>
                   </div>
                   <button onClick={() => handleSpeech(currentSelectedProduct.description)} className="p-4 bg-slate-100 rounded-2xl text-indigo-600 hover:bg-indigo-50 transition-colors">
                     {isSpeaking ? <Loader2 className="animate-spin" /> : <Volume2 />}
                   </button>
                </div>

                {/* Technical Specs Badge Area */}
                {currentSelectedProduct.category === 'Gadget' && currentSelectedProduct.specs && (
                  <div className="flex flex-wrap gap-2">
                     {currentSelectedProduct.specs.brand && <div className="px-3 py-1.5 bg-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600">Brand: {currentSelectedProduct.specs.brand}</div>}
                     {currentSelectedProduct.specs.storage && <div className="px-3 py-1.5 bg-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 flex items-center"><HardDrive size={10} className="mr-1" /> {currentSelectedProduct.specs.storage}</div>}
                     {currentSelectedProduct.specs.connectivity && <div className="px-3 py-1.5 bg-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600">Port: {currentSelectedProduct.specs.connectivity}</div>}
                     {currentSelectedProduct.specs.compatibility?.map(p => (
                       <div key={p} className="px-3 py-1.5 bg-indigo-50 rounded-xl text-[9px] font-black uppercase tracking-widest text-indigo-600 border border-indigo-100">{p} Ready</div>
                     ))}
                  </div>
                )}

                <div className="space-y-4">
                   <p className="text-sm font-medium text-slate-500 leading-relaxed italic border-l-4 border-slate-100 pl-4">
                     "{currentSelectedProduct.description}"
                   </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Buy Ownership</p>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tighter mb-4">₹{currentSelectedProduct.price.toLocaleString()}</h4>
                      <button onClick={() => onBuyNow(currentSelectedProduct)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200 active:scale-95 transition-all">Buy Now</button>
                   </div>
                   <div className="bg-indigo-50 p-6 rounded-[32px] border border-indigo-100">
                      <p className="text-[9px] font-black text-indigo-400 uppercase mb-2">Rent (Per Sem)</p>
                      <h4 className="text-2xl font-black text-indigo-900 tracking-tighter mb-4">₹{(currentSelectedProduct.rentPrice || Math.floor(currentSelectedProduct.price * 0.1)).toLocaleString()}</h4>
                      <button onClick={() => onRentNow(currentSelectedProduct)} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-100 active:scale-95 transition-all">Rent Node</button>
                   </div>
                </div>

                <button onClick={() => onBargain(currentSelectedProduct)} className="w-full py-6 bg-white border-2 border-slate-900 text-slate-900 rounded-[32px] font-black uppercase text-[11px] tracking-[0.2em] flex items-center justify-center space-x-3 active:scale-[0.98] transition-all">
                   <Handshake size={20} />
                   <span>Negotiate with Seller</span>
                </button>

                <div className="space-y-6 pt-4 border-t border-slate-100">
                   <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center">
                        <MessageSquare size={16} className="mr-2 text-indigo-600" /> Peer Discussions
                      </h4>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{currentSelectedProduct.comments.length} Comments</span>
                   </div>

                   {currentSelectedProduct.comments.length > 0 ? (
                     <div className="space-y-4">
                        {currentSelectedProduct.comments.map((c: Comment) => (
                           <div key={c.id} className="flex items-start space-x-3 group">
                              <img src={`https://picsum.photos/seed/${c.userName}/100`} className="w-8 h-8 rounded-full border border-slate-100" alt="" />
                              <div className="flex-1 bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100">
                                 <div className="flex items-center justify-between mb-1">
                                    <p className="text-[10px] font-black text-slate-900 leading-none">{c.userName}</p>
                                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">{new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                 </div>
                                 <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{c.text}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                   ) : (
                     <div className="py-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center px-6">
                        <MessageSquare size={32} className="text-slate-200 mb-2" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No questions yet. Be the first!</p>
                     </div>
                   )}

                   <div className="flex space-x-2 overflow-x-auto hide-scrollbar pt-2">
                      {quickReplies.map((reply, i) => (
                        <button 
                          key={i}
                          onClick={() => onComment(currentSelectedProduct.id, reply)}
                          className="px-4 py-2 bg-white border border-slate-200 rounded-full whitespace-nowrap text-[9px] font-black text-slate-600 uppercase tracking-widest active:scale-95 transition-all shadow-sm"
                        >
                           {reply}
                        </button>
                      ))}
                   </div>
                </div>
             </div>

             <div className="absolute bottom-0 inset-x-0 p-6 bg-white/90 backdrop-blur-xl border-t border-slate-100">
                <form onSubmit={handlePostComment} className="flex items-center space-x-2 bg-slate-100 rounded-2xl px-5 py-1.5 border border-slate-200">
                   <input 
                    type="text" 
                    placeholder="Ask a question about this item..."
                    className="flex-1 bg-transparent border-none py-3 text-[11px] font-black outline-none placeholder:text-slate-400 text-slate-900"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                   />
                   <button 
                    type="button" 
                    onClick={handleSmartComment}
                    className={`p-2 rounded-xl transition-all ${isSuggesting ? 'animate-spin text-indigo-400' : 'text-indigo-600 hover:bg-white active:scale-90 shadow-sm transition-all'}`}
                   >
                     <Sparkles size={16} fill={commentText ? "none" : "currentColor"} />
                   </button>
                   <button 
                    type="submit" 
                    disabled={!commentText.trim()} 
                    className="p-3 bg-slate-900 text-white rounded-xl disabled:opacity-20 ml-1 active:scale-90 transition-transform"
                   >
                     <Send size={16} />
                   </button>
                </form>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketView;
