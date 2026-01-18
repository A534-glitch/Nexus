
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Trash2, Sparkles, Send, Check, Eye, Clock, Users } from 'lucide-react';
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
        timestamp: Date.now()
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

  return (
    <div className="flex flex-col h-full bg-slate-50 pb-40">
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

      <div className="p-6 space-y-8">
        {/* Step 1: Media Capture */}
        <div className="space-y-4">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
            {image ? 'Photo Preview' : 'Capture Experience'}
          </label>
          
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
              <p className="text-slate-600 font-bold text-center px-4 leading-tight">Tap to snap or upload</p>
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

        {/* Step 2: Details & Submit (Contextual) */}
        {image && postType === 'STORY' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Story Settings</label>
              <div className="bg-white rounded-[32px] border border-slate-100 p-6 space-y-6 shadow-sm">
                <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                        <Users size={18} />
                      </div>
                      <span className="text-xs font-black text-slate-700">Visibility</span>
                   </div>
                   <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Public Campus</span>
                </div>
                <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slate-50 text-slate-500 rounded-xl">
                        <Clock size={18} />
                      </div>
                      <span className="text-xs font-black text-slate-700">Expires in</span>
                   </div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">24 Hours</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => handleSubmit()}
                className="w-full py-6 bg-indigo-600 text-white font-black rounded-[32px] shadow-2xl shadow-indigo-200 flex items-center justify-center space-x-3 group active:scale-[0.98] transition-all"
              >
                <div className="p-2 bg-white/20 rounded-xl group-hover:rotate-12 transition-transform">
                  <Send size={20} className="-rotate-12" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="uppercase tracking-[0.2em] text-xs leading-none">Post to Campus</span>
                  <span className="text-[9px] font-bold text-indigo-200 mt-1">Ready as {currentUser.name.split(' ')[0]}</span>
                </div>
              </button>
              <p className="text-center text-[10px] text-slate-300 font-black uppercase tracking-[0.3em] mt-6">Nexus Campus Stories • Private & Secure</p>
            </div>
          </div>
        )}

        {postType === 'PRODUCT' && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
            {image && !title && !isAnalyzing && (
              <button
                type="button"
                onClick={handleAIAnalyze}
                className="w-full flex items-center justify-center space-x-2 py-5 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
              >
                <Sparkles size={20} />
                <span>AI Auto-List Item</span>
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
                  placeholder="Mechanical Keyboard, Scientific Calc..."
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
                  rows={4}
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-5 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold resize-none"
                  placeholder="Describe the condition, usage history..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={!image || (!title || !price)}
              className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl shadow-2xl hover:bg-black transition-all active:scale-[0.98] disabled:opacity-30 uppercase tracking-[0.2em] text-xs"
            >
              List Item
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UploadView;
