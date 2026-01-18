
import React, { useState } from 'react';
import { Product } from '../types';
import { ChevronLeft, Trash2, ShoppingBag, ArrowRight, Share2, AlertCircle } from 'lucide-react';

interface ProductListViewProps {
  title: string;
  products: Product[];
  onBack: () => void;
  onAction: (product: Product) => void;
  onShare: (productId: string) => void;
  onDelete?: (productId: string) => void;
  actionLabel: string;
}

const ProductListView: React.FC<ProductListViewProps> = ({ title, products, onBack, onAction, onShare, onDelete, actionLabel }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    if (window.confirm("Are you sure you want to remove this listing? This cannot be undone.")) {
      onDelete?.(id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="px-4 py-4 bg-white border-b border-slate-100 flex items-center sticky top-0 z-40">
        <button 
          onClick={onBack} 
          className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-900 rounded-full shadow-sm hover:bg-white active:scale-75 transition-all duration-300 ring-4 ring-slate-50 mr-4"
        >
          <ChevronLeft size={24} strokeWidth={3} />
        </button>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">{title}</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 hide-scrollbar">
        {products.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-20">
            <div className="w-20 h-20 bg-slate-200 rounded-[32px] flex items-center justify-center mb-6 text-slate-400">
               <ShoppingBag size={40} />
            </div>
            <h3 className="text-lg font-black text-slate-900">Nothing here yet</h3>
            <p className="text-sm text-slate-500 font-medium max-w-[200px] mt-2">Items you save or list will appear in this section.</p>
          </div>
        ) : (
          products.map(product => (
            <div key={product.id} className="bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm flex items-center space-x-4 animate-in slide-in-from-bottom duration-300">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 shadow-inner">
                 <img src={product.image} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex-1 min-w-0">
                 <h3 className="text-sm font-black text-slate-900 truncate">{product.title}</h3>
                 <p className="text-xs font-bold text-indigo-600 mt-0.5">₹{product.price.toLocaleString('en-IN')}</p>
                 <div className="flex items-center space-x-1 mt-1">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{product.category}</span>
                 </div>
              </div>
              <div className="flex flex-col space-y-2">
                {onDelete ? (
                   <button 
                    onClick={() => handleDeleteClick(product.id)}
                    className="bg-rose-50 text-rose-500 p-2.5 rounded-xl hover:bg-rose-100 active:scale-90 transition-all flex items-center justify-center"
                    title="Delete Listing"
                  >
                    <Trash2 size={16} />
                  </button>
                ) : (
                  <button 
                    onClick={() => onAction(product)}
                    className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-90 transition-all flex items-center space-x-1"
                  >
                    <span>{actionLabel}</span>
                    <ArrowRight size={12} />
                  </button>
                )}
                <button 
                  onClick={() => onShare(product.id)}
                  className="bg-slate-100 text-slate-600 p-2.5 rounded-xl hover:bg-slate-200 active:scale-90 transition-all flex items-center justify-center"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductListView;
