
import React, { useState, useEffect } from 'react';
import { Product, Comment } from '../types';
import { 
  Search, X, Sparkles, GraduationCap, 
  Bookmark, ArrowUpRight, Volume2, Loader2, 
  Handshake, LayoutGrid, List, Grid3X3, Share2,
  AlertCircle, ShieldCheck, Send, MessageSquare
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
  
  // Comment specific state
  const [commentText, setCommentText] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);

  const categories = ['All', 'Gadget', 'Notebook', 'Stationery', 'Other'];

  const filtered = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  // Track the most updated version of the selected product
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

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Search gear..." className="w-full bg-slate-100 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold outline-none" value={search} onChange={(e) => setSearch(e.target.value)} />
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
               <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); onToggleWishlist(p.id); }} className="p-1.5 bg-white/90 rounded-lg shadow-lg text-slate-400"><Bookmark size={12} fill={p.isWishlisted ? "currentColor" : "none"} className={p.isWishlisted ? 'text-rose-500' : ''} /></button>
               </div>
               <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 rounded-lg text-[8px] font-black text-white">₹{p.price.toLocaleString()}</div>
            </div>
            <div className={`flex flex-col justify-center ${layout === 'LIST' ? 'flex-1' : 'p-3'}`}>
              <h3 className={`font-black text-slate-900 tracking-tight truncate ${layout === 'GRID_3' ? 'text-[10px]' : 'text-xs'}`}>{p.title}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{p.category}</p>
            </div>
          </div>
        ))}
      </div>

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

                {/* INLINE COMMENT SECTION FOR MARKET DETAIL */}
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

                   {/* QUICK CHIPS */}
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

             {/* STICKY INLINE INPUT FOR MODAL */}
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
