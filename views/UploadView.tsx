
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Trash2, Sparkles, Send, Check, Eye, Clock, Users, ArrowUpCircle, Upload, AlertCircle } from 'lucide-react';
import { analyzeProductImage } from '../services/gemini';
import { Product, User, Story } from '../types';

interface UploadViewProps {
  onUpload: (product: Product) => void;
  onAddStory: (story: Story) => void;
  currentUser: User;
  initialType?: 'PRODUCT' | 'STORY';
}

const UploadView: React.FC<UploadViewProps> = ({ onUpload, onAddStory, currentUser, initialType = 'PRODUCT' }) => {
  const [postType, setPostType] = useState<'PRODUCT' | 'STORY'>(initialType);
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<'Notebook' | 'Gadget' | 'Stationery' | 'Other'>('Gadget');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPostType(initialType);
  }, [initialType]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIAnalyze = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    const result = await analyzeProductImage(image);
    if (result) {
      setTitle(result.title || '');
      setDescription(result.description || '');
      setPrice(result.suggestedPrice?.toString() || '');
    }
    setIsAnalyzing(false);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!image) return;

    if (postType === 'STORY') {
      const newStory: Story = {
        id: Date.now().toString(),
        userId: currentUser.id,
        userName: currentUser.name.split(' ')[0],
        userAvatar: currentUser.avatar,
        image,
        timestamp: Date.now(),
        isLiked: false,
        likes: 0
      };
      onAddStory(newStory);
    } else {
      if (!title || !price) return;
      const newProduct: Product = {
        id: Date.now().toString(),
        sellerId: currentUser.id,
        sellerName: currentUser.name,
        title,
        description,
        price: Number(price),
        image,
        category,
        likes: 0,
        likedBy: [],
        shares: 0,
        comments: [],
        isLiked: false
      };
      onUpload(newProduct);
    }
  };

  const isFormValid = postType === 'STORY' ? !!image : (!!image && !!title && !!price);

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <header className="px-6 py-4 bg-white border-b border-slate-100 flex flex-col space-y-4 sticky top-0 z-30">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Create Post</h1>
        <div className="flex bg-slate-100 p-1 rounded-2xl">
           <button 
            onClick={() => { setPostType('PRODUCT'); setImage(null); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${postType === 'PRODUCT' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
           >
             Marketplace
           </button>
           <button 
            onClick={() => { setPostType('STORY'); setImage(null); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${postType === 'STORY' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
           >
             Campus Story
           </button>
        </div>
      </header>

      <div className="p-6 space-y-8 pb-48">
        {/* Step 1: Media Capture */}
        <div className="space-y-4">
          <div className="flex items-center justify-between ml-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {image ? 'Finalize Photo' : 'Capture Experience'}
            </label>
            {image && (
              <div className="flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Image Loaded</span>
              </div>
            )}
          </div>
          
          {image ? (
            <div className={`relative group overflow-hidden shadow-2xl bg-slate-200 transition-all duration-500 ${postType === 'STORY' ? 'aspect-[9/16] rounded-[40px]' : 'aspect-video rounded-3xl'}`}>
              <img src={image} className="w-full h-full object-cover animate-in fade-in zoom-in duration-500" alt="Preview" />
              <button 
                type="button"
                onClick={() => setImage(null)}
                className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white p-3 rounded-full shadow-lg hover:bg-black/60 transition-colors z-10"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed border-slate-200 bg-white flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/10 transition-all group ${postType === 'STORY' ? 'aspect-[9/16] rounded-[40px]' : 'aspect-video rounded-3xl'}`}
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Camera size={32} />
              </div>
              <p className="text-slate-600 font-bold text-center px-4 leading-tight text-sm">Tap to snap or upload</p>
              <p className="text-[10px] text-slate-400 mt-2 uppercase font-black tracking-widest">{postType === 'STORY' ? 'Vertical Story' : 'Product Shot'}</p>
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleImageChange}
              />
            </div>
          )}
        </div>

        {postType === 'PRODUCT' && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
            {image && !title && !isAnalyzing && (
              <button
                type="button"
                onClick={handleAIAnalyze}
                className="w-full flex items-center justify-center space-x-2 py-5 bg-indigo-600/10 text-indigo-600 border-2 border-dashed border-indigo-200 font-black rounded-3xl hover:bg-indigo-50 transition-all"
              >
                <Sparkles size={20} />
                <span>AI Auto-Fill Details</span>
              </button>
            )}

            {isAnalyzing && (
              <div className="py-8 text-center space-y-3 glass rounded-3xl animate-pulse">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">Nexus AI is analyzing details...</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2">Item Name</label>
                <input
                  required
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-5 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold"
                  placeholder="e.g. Mechanical Keyboard"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2">Section</label>
                  <select
                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-5 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold appearance-none"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                  >
                    <option value="Gadget">Gadget</option>
                    <option value="Notebook">Notebook</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2">Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900 font-black">₹</span>
                    <input
                      required
                      type="number"
                      className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-8 pr-5 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold"
                      placeholder="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2">Why sell this?</label>
                <textarea
                  required
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-5 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold resize-none"
                  placeholder="Condition, usage, why you're selling..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </form>
        )}

        {image && postType === 'STORY' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-[32px] border border-slate-100 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                      <Users size={18} />
                    </div>
                    <span className="text-xs font-black text-slate-700">Campus Visibility</span>
                 </div>
                 <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Public</span>
              </div>
              <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-50 text-slate-500 rounded-xl">
                      <Clock size={18} />
                    </div>
                    <span className="text-xs font-black text-slate-700">Duration</span>
                 </div>
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">24h Only</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FIXED SUBMIT BAR - This is what you were looking for! */}
      {image && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-[110] animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-white/90 backdrop-blur-2xl rounded-[32px] p-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/50 flex flex-col space-y-3">
            {!isFormValid && postType === 'PRODUCT' && (
              <div className="flex items-center justify-center space-x-2 text-rose-500 mb-1">
                <AlertCircle size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Incomplete Details</span>
              </div>
            )}
            
            <button
              onClick={() => handleSubmit()}
              disabled={!isFormValid}
              className={`w-full py-5 rounded-2xl flex items-center justify-center space-x-3 transition-all active:scale-95 shadow-xl ${
                isFormValid 
                  ? 'bg-indigo-600 text-white shadow-indigo-600/30' 
                  : 'bg-slate-200 text-slate-400 shadow-none grayscale cursor-not-allowed'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${isFormValid ? 'bg-white/20' : 'bg-slate-300'}`}>
                <Upload size={20} strokeWidth={3} />
              </div>
              <span className="text-sm font-black uppercase tracking-[0.2em]">
                {postType === 'STORY' ? 'Submit Story' : (isFormValid ? 'Submit Listing' : 'Finalize Details')}
              </span>
            </button>
            
            <p className="text-center text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">
              By submitting, you agree to Campus Safety Guidelines
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadView;
