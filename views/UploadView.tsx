
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Trash2, Sparkles, Send, Check, Eye, Clock, Users, ArrowUpCircle, Upload, AlertCircle, ShieldCheck, MapPin, Scale, Ban, Lock, X, Key, Info, Tag, Smartphone, HardDrive, Shield } from 'lucide-react';
import { analyzeProductImage } from '../services/gemini';
import { Product, User, Story, ProductCondition } from '../types';

interface UploadViewProps {
  onUpload: (product: Product) => void;
  onAddStory: (story: Story) => void;
  currentUser: User;
  initialType?: 'PRODUCT' | 'STORY';
}

interface SafetyModalProps {
  onClose: () => void;
  onConfirmAndUpload: () => void;
  isFormValid: boolean;
  postType: 'PRODUCT' | 'STORY';
}

const SafetyGuidelinesModal: React.FC<SafetyModalProps> = ({ onClose, onConfirmAndUpload, isFormValid, postType }) => {
  const guidelines = [
    {
      icon: <ShieldCheck className="text-indigo-600" size={24} />,
      title: "Verified Peers Only",
      desc: "Nexus is a closed student network. Always verify the seller's college ID or 'Verified' badge before starting a bargain."
    },
    {
      icon: <MapPin className="text-emerald-600" size={24} />,
      title: "Public Meetups",
      desc: "Always meet in crowded campus spots like the Library, Canteen, or Main Gate. Never invite strangers to your hostel room."
    },
    {
      icon: <Scale className="text-amber-600" size={24} />,
      title: "Fair Bargaining",
      desc: "Use the AI Bargain tool for fair prices. Harassment, spamming, or low-balling verified student listings is strictly prohibited."
    },
    {
      icon: <Ban className="text-rose-600" size={24} />,
      title: "Prohibited Items",
      desc: "Do not list alcohol, drugs, exam papers, or unauthorized digital keys. Violations result in immediate campus-wide bans."
    },
    {
      icon: <Lock className="text-indigo-600" size={24} />,
      title: "Secure Payment",
      desc: "Inspect the item thoroughly before finalizing UPI transfers. Nexus recommends using the built-in UPI gateway for records."
    }
  ];

  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-end animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full h-[85vh] rounded-t-[48px] shadow-2xl relative z-10 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-500">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-20">
           <div className="flex items-center space-x-3">
             <div className="p-2 bg-indigo-600 rounded-xl">
               <ShieldCheck className="text-white" size={20} />
             </div>
             <h2 className="text-xl font-black text-slate-900 tracking-tight">Safety Guidelines</h2>
           </div>
           <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
             <X size={20} className="text-slate-900" />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 hide-scrollbar">
           <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-relaxed text-center">
             Ensuring a secure peer-to-peer ecosystem for every student.
           </p>

           <div className="space-y-6">
              {guidelines.map((g, idx) => (
                <div key={idx} className="flex space-x-5 animate-in slide-in-from-right duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
                   <div className="flex-shrink-0 w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                      {g.icon}
                   </div>
                   <div className="space-y-1">
                      <h3 className="text-base font-black text-slate-900">{g.title}</h3>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">{g.desc}</p>
                   </div>
                </div>
              ))}
           </div>

           <div className="bg-indigo-50 p-6 rounded-[32px] border border-indigo-100 flex items-start space-x-4">
              <AlertCircle size={20} className="text-indigo-600 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] font-bold text-indigo-700 leading-relaxed uppercase tracking-wide">
                By clicking "Got it", you agree to the community rules. Your {postType === 'STORY' ? 'story' : 'product'} will be published immediately.
              </p>
           </div>
        </div>

        <div className="p-8 bg-white border-t border-slate-100">
           <button 
            onClick={() => {
              if (isFormValid) {
                onConfirmAndUpload();
              } else {
                onClose();
              }
            }}
            className={`w-full py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs shadow-xl active:scale-[0.98] transition-all flex items-center justify-center space-x-3 ${isFormValid ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-slate-900 text-white shadow-slate-200'}`}
           >
             {isFormValid ? (
               <>
                 <Check size={18} strokeWidth={3} />
                 <span>Got it, I'll be safe (Post Now)</span>
               </>
             ) : (
               <span>Got it, I'll be safe</span>
             )}
           </button>
        </div>
      </div>
    </div>
  );
};

const UploadView: React.FC<UploadViewProps> = ({ onUpload, onAddStory, currentUser, initialType = 'PRODUCT' }) => {
  const [postType, setPostType] = useState<'PRODUCT' | 'STORY'>(initialType);
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [rentPrice, setRentPrice] = useState('');
  const [canRent, setCanRent] = useState(false);
  const [category, setCategory] = useState<'Notebook' | 'Gadget' | 'Stationery' | 'Other'>('Gadget');
  const [condition, setCondition] = useState<ProductCondition>('Like New');
  
  // Gadget Specific Specs
  const [brand, setBrand] = useState('');
  const [connectivity, setConnectivity] = useState<'Wireless' | 'Wired' | 'Bluetooth' | 'USB-C' | 'Lightning' | undefined>(undefined);
  const [compatibility, setCompatibility] = useState<string[]>([]);
  const [storage, setStorage] = useState('');
  const [hasWarranty, setHasWarranty] = useState(false);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const platforms = ['iOS', 'Android', 'Mac', 'Windows', 'Linux'];
  const connections: Array<'Wireless' | 'Wired' | 'Bluetooth' | 'USB-C' | 'Lightning'> = ['Wireless', 'Wired', 'Bluetooth', 'USB-C', 'Lightning'];
  const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB', '2TB'];

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
      setRentPrice(Math.floor((result.suggestedPrice || 0) * 0.15).toString());
      
      if (result.category === 'Gadget') {
          setCategory('Gadget');
      }
    }
    setIsAnalyzing(false);
  };

  const togglePlatform = (p: string) => {
    setCompatibility(prev => prev.includes(p) ? prev.filter(item => item !== p) : [...prev, p]);
  };

  const handleSubmit = () => {
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
        rentPrice: canRent ? Number(rentPrice) : undefined,
        canRent,
        image,
        category,
        condition,
        likes: 0,
        likedBy: [],
        shares: 0,
        comments: [],
        isLiked: false,
        specs: category === 'Gadget' ? {
          brand: brand || undefined,
          connectivity: connectivity,
          compatibility: compatibility.length > 0 ? compatibility : undefined,
          storage: storage || undefined,
          warranty: hasWarranty
        } : undefined
      };
      onUpload(newProduct);
    }
    setIsSafetyModalOpen(false);
  };

  const isFormValid = postType === 'STORY' ? !!image : (!!image && !!title && !!price && (!canRent || !!rentPrice));

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {isSafetyModalOpen && (
        <SafetyGuidelinesModal 
          postType={postType}
          isFormValid={isFormValid}
          onConfirmAndUpload={handleSubmit} 
          onClose={() => setIsSafetyModalOpen(false)} 
        />
      )}

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

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-48 hide-scrollbar">
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
          <form className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500" onSubmit={(e) => e.preventDefault()}>
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
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2">Condition</label>
                  <select
                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-5 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold appearance-none"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
              </div>

              {/* Gadget Specific Advanced Fields */}
              {category === 'Gadget' && (
                <div className="space-y-6 p-5 bg-indigo-50/50 rounded-[32px] border border-indigo-100 animate-in slide-in-from-right duration-300">
                    <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] flex items-center">
                        <Smartphone size={12} className="mr-2" /> Technical Specification
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="group">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2">Brand</label>
                                <input
                                className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs outline-none transition-all font-bold"
                                placeholder="Apple, Sony..."
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                />
                            </div>
                            <div className="group">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2">Storage</label>
                                <select
                                className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs outline-none transition-all font-bold appearance-none"
                                value={storage}
                                onChange={(e) => setStorage(e.target.value)}
                                >
                                    <option value="">None</option>
                                    {storageOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2">Link Type</label>
                            <div className="flex flex-wrap gap-2">
                                {connections.map(c => (
                                    <button 
                                        key={c}
                                        onClick={() => setConnectivity(connectivity === c ? undefined : c)}
                                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${connectivity === c ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500'}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2">Platform Support</label>
                            <div className="flex flex-wrap gap-2">
                                {platforms.map(p => (
                                    <button 
                                        key={p}
                                        onClick={() => togglePlatform(p)}
                                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${compatibility.includes(p) ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button 
                          onClick={() => setHasWarranty(!hasWarranty)}
                          className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between ${hasWarranty ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100'}`}
                        >
                           <div className="flex items-center space-x-3">
                              <Shield size={18} className={hasWarranty ? 'text-emerald-500' : 'text-slate-300'} />
                              <span className={`text-[10px] font-black uppercase tracking-widest ${hasWarranty ? 'text-emerald-600' : 'text-slate-500'}`}>Under Warranty</span>
                           </div>
                           <div className={`w-10 h-5 rounded-full p-1 transition-all ${hasWarranty ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                              <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${hasWarranty ? 'translate-x-5' : 'translate-x-0'}`} />
                           </div>
                        </button>
                    </div>
                </div>
              )}

              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2">Sale Price</label>
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

              {/* Rental Toggle Section */}
              <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                       <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                          <Key size={18} />
                       </div>
                       <div>
                          <p className="text-xs font-black text-slate-900">Enable Campus Rental</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Allow students to rent per sem</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => setCanRent(!canRent)}
                      className={`w-12 h-6 rounded-full p-1 transition-all ${canRent ? 'bg-emerald-500' : 'bg-slate-200'}`}
                    >
                       <div className={`w-4 h-4 bg-white rounded-full transition-transform ${canRent ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                 </div>
                 {canRent && (
                   <div className="animate-in slide-in-from-top-2 duration-300 pt-2 border-t border-slate-50">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2">Rent Price (Per Sem)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-black">₹</span>
                        <input
                          required
                          type="number"
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-8 pr-5 text-sm focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold"
                          placeholder="Suggested: ₹500"
                          value={rentPrice}
                          onChange={(e) => setRentPrice(e.target.value)}
                        />
                      </div>
                   </div>
                 )}
              </div>

              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2">Description</label>
                <textarea
                  required
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-5 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold resize-none"
                  placeholder="Condition, usage, why you're selling/renting..."
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

      {/* FIXED ACTION BAR */}
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
              onClick={() => setIsSafetyModalOpen(true)}
              className={`w-full py-5 rounded-2xl flex items-center justify-center space-x-3 transition-all active:scale-95 shadow-xl ${
                isFormValid 
                  ? 'bg-indigo-600 text-white shadow-indigo-600/30' 
                  : 'bg-slate-200 text-slate-400 shadow-none grayscale cursor-not-allowed'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${isFormValid ? 'bg-white/20' : 'bg-slate-300'}`}>
                {isFormValid ? <Check size={20} strokeWidth={3} /> : <Upload size={20} />}
              </div>
              <span className="text-sm font-black uppercase tracking-[0.2em]">
                {isFormValid ? 'Review & Post' : 'Finalize Details'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadView;
