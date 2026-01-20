
import React, { useState } from 'react';
import { Product } from '../types';
import { 
  Search, X, Sparkles, GraduationCap, 
  Bookmark, ArrowUpRight, Volume2, Loader2, 
  Handshake, LayoutGrid, List, Grid3X3, Share2 
} from 'lucide-react';
import { generateSpeech, decodeAudio } from '../services/gemini';

interface MarketViewProps {
  products: Product[];
  onBargain: (product: Product, offer?: number) => void;
  onBuyNow: (product: Product) => void;
  onRentNow: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onTogglePin: (productId: string) => void;
  onShare: (productId: string) => void;
}

type GridType = 'LIST' | 'GRID_2' | 'GRID_3';

const MarketView: React.FC<MarketViewProps> = ({ products, onBargain, onBuyNow, onRentNow, onToggleWishlist, onTogglePin, onShare }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [layout, setLayout] = useState<GridType>('GRID_2');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const categories = ['All', 'Gadget', 'Notebook', 'Stationery', 'Other'];

  const filtered = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCat;
  });

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

      {selectedProduct && (
        <div className="fixed inset-0 z-[100] bg-black/70 flex items-end">
          <div className="bg-white w-full h-[90vh] rounded-t-[48px] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-500">
             <div className="relative aspect-video">
                <img src={selectedProduct.image} className="w-full h-full object-cover" alt="" />
                <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 p-3 bg-black/40 text-white rounded-full"><X size={24}/></button>
                <button onClick={() => onShare(selectedProduct.id)} className="absolute top-6 left-6 p-3 bg-black/40 text-white rounded-full"><Share2 size={24}/></button>
             </div>
             <div className="flex-1 overflow-y-auto p-8 pb-32 space-y-8">
                <div className="flex justify-between items-start">
                   <div className="space-y-2">
                      <h2 className="text-3xl font-black text-slate-900 leading-tight">{selectedProduct.title}</h2>
                      <p className="text-indigo-600 font-bold uppercase text-[10px] tracking-widest">{selectedProduct.category} Resources</p>
                   </div>
                   <button onClick={() => handleSpeech(selectedProduct.description)} className="p-4 bg-slate-100 rounded-2xl text-indigo-600">
                     {isSpeaking ? <Loader2 className="animate-spin" /> : <Volume2 />}
                   </button>
                </div>
                <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-200 flex items-center justify-between">
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Asking Price</p>
                     <h4 className="text-4xl font-black text-slate-900">₹{selectedProduct.price.toLocaleString()}</h4>
                   </div>
                   <button onClick={() => onBuyNow(selectedProduct)} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs">Buy Now</button>
                </div>
                <button onClick={() => onBargain(selectedProduct)} className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black uppercase text-xs tracking-widest flex items-center justify-center space-x-2">
                   <Handshake size={20} />
                   <span>Start Real-time Negotiation</span>
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketView;
