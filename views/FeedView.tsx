
import React, { useState, useEffect, useRef } from 'react';
import { Product, Story, Comment, User } from '../types';
import { Heart, MessageCircle, Share2, Send, MoreHorizontal, X, Link as LinkIcon, Sparkles, Plus, GraduationCap, User as UserIcon, Bell, Smile, Copy, Check, Search, ChevronRight, Trash2, AlertTriangle, UserPlus } from 'lucide-react';

interface FeedViewProps {
  currentUser: User;
  products: Product[];
  stories: Story[];
  onLike: (productId: string) => void;
  onLikeStory: (storyId: string) => void;
  onComment: (productId: string, text: string) => void;
  onShare: (productId: string) => void;
  onDeleteProduct: (id: string) => void;
  onDeleteStory: (id: string) => void;
  onNavigateToChat: () => void;
  onNavigateToNotifications: () => void;
  onAddStoryClick: () => void;
}

const MOCK_ACCOUNTS: User[] = [
  { id: 'u101', name: 'Arjun Mehra', avatar: 'https://picsum.photos/seed/arjunm/100', college: 'IIT Delhi', isVerified: true },
  { id: 'u102', name: 'Priya Sharma', avatar: 'https://picsum.photos/seed/priyas/100', college: 'SRCC Delhi', isVerified: true },
  { id: 'u103', name: 'Rohan Gupta', avatar: 'https://picsum.photos/seed/rohang/100', college: 'BITS Pilani', isVerified: false },
  { id: 'u104', name: 'Sana Varma', avatar: 'https://picsum.photos/seed/sanav/100', college: 'VIT Vellore', isVerified: true },
  { id: 'u105', name: 'Ishaan Khattar', avatar: 'https://picsum.photos/seed/ishaan/100', college: 'Delhi University', isVerified: false },
  { id: 'u106', name: 'Ananya Pandey', avatar: 'https://picsum.photos/seed/ananya/100', college: 'NIFT Mumbai', isVerified: true },
];

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
    }
  ];

  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full rounded-t-[40px] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300 relative z-10 pb-12">
        <div className="flex justify-center py-4">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
        </div>
        <div className="px-8 pb-6 text-center">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Share to Campus</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Spread the word about this deal</p>
        </div>
        <div className="grid grid-cols-2 gap-y-8 px-6 py-4">
          {platforms.map((p) => (
            <button 
              key={p.name}
              onClick={() => { p.action(); onClose(); }}
              className="flex flex-col items-center space-y-2 group active:scale-90 transition-transform"
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all" style={{ backgroundColor: p.color + '15' }}>
                <svg viewBox="0 0 24 24" className="w-8 h-8" style={{ fill: p.color }}>{p.icon}</svg>
              </div>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{p.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const CommentSheet = ({ product, onClose, onAddComment }: { product: Product, onClose: () => void, onAddComment: (text: string) => void }) => {
  const [newComment, setNewComment] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };
  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full h-[70vh] rounded-t-[32px] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300 relative z-10">
        <div className="flex justify-center py-3"><div className="w-10 h-1.5 bg-slate-200 rounded-full" /></div>
        <div className="px-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900">Comments</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors"><X size={24} className="text-slate-900" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 hide-scrollbar">
          {product.comments.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-40 text-center px-10">
              <MessageCircle size={48} className="mb-4 text-slate-300" />
              <p className="font-black text-slate-900">No comments yet</p>
            </div>
          ) : (
            product.comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3 group">
                <img src={`https://picsum.photos/seed/${comment.userName}/100`} className="w-9 h-9 rounded-full object-cover flex-shrink-0" alt="" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-black text-slate-900">{comment.userName}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-sm text-slate-700 mt-1 leading-relaxed font-medium">{comment.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="px-6 pt-4 pb-10 border-t border-slate-100 bg-white">
          <form onSubmit={handleSubmit} className="flex items-center space-x-4">
            <img src="https://picsum.photos/seed/arjun/100" className="w-9 h-9 rounded-full object-cover" alt="" />
            <div className="flex-1 bg-slate-50 rounded-full px-4 py-2.5 flex items-center border border-slate-100 focus-within:border-indigo-500 transition-all">
              <input ref={inputRef} type="text" placeholder="Add a comment..." className="flex-1 bg-transparent border-none text-sm font-medium focus:outline-none" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
            </div>
            <button type="submit" disabled={!newComment.trim()} className="text-indigo-600 font-black text-sm uppercase tracking-widest disabled:opacity-30">Post</button>
          </form>
        </div>
      </div>
    </div>
  );
};

const ContextMenu = ({ isOwner, onDelete, onClose }: { isOwner: boolean, onDelete: () => void, onClose: () => void }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="absolute top-12 right-4 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
      {!confirmDelete ? (
        <div className="flex flex-col py-2">
          {isOwner && (
            <button 
              onClick={() => setConfirmDelete(true)}
              className="px-4 py-3 flex items-center space-x-3 text-rose-500 hover:bg-rose-50 transition-colors"
            >
              <Trash2 size={16} />
              <span className="text-xs font-black uppercase tracking-widest">Delete Post</span>
            </button>
          )}
          <button className="px-4 py-3 flex items-center space-x-3 text-slate-600 hover:bg-slate-50 transition-colors">
            <AlertTriangle size={16} />
            <span className="text-xs font-black uppercase tracking-widest">Report</span>
          </button>
        </div>
      ) : (
        <div className="p-4 space-y-3 bg-rose-50">
          <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest leading-tight">Permanently delete this post from campus?</p>
          <div className="flex space-x-2">
            <button onClick={onDelete} className="flex-1 py-2 bg-rose-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">Yes</button>
            <button onClick={() => setConfirmDelete(false)} className="flex-1 py-2 bg-white text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-rose-100">No</button>
          </div>
        </div>
      )}
    </div>
  );
};

const StoriesBar = ({ stories, onSelectStory, onAddStoryClick }: { stories: Story[], onSelectStory: (index: number) => void, onAddStoryClick: () => void }) => {
  return (
    <div className="flex space-x-4 px-4 py-4 overflow-x-auto hide-scrollbar bg-white border-b border-slate-50">
      <div onClick={onAddStoryClick} className="flex flex-col items-center space-y-1.5 flex-shrink-0 cursor-pointer group">
        <div className="w-[68px] h-[68px] rounded-full border-2 border-slate-200 border-dashed flex items-center justify-center p-0.5 group-active:scale-95 transition-transform bg-slate-50">
          <div className="w-full h-full rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600"><Plus size={24} strokeWidth={3} /></div>
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">My Story</span>
      </div>
      {stories.map((s, index) => (
        <div key={s.id} className="flex flex-col items-center space-y-1.5 flex-shrink-0 cursor-pointer group" onClick={() => onSelectStory(index)}>
          <div className="w-[68px] h-[68px] rounded-full p-[2.5px] bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] group-active:scale-95 transition-transform">
            <div className="w-full h-full rounded-full bg-white p-[2px]">
              <img src={s.userAvatar} className="w-full h-full rounded-full object-cover border border-slate-100" alt="" />
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-700 max-w-[64px] truncate">{s.userName}</span>
        </div>
      ))}
    </div>
  );
};

const FeedView: React.FC<FeedViewProps> = ({ currentUser, products, stories, onLike, onLikeStory, onComment, onShare, onDeleteProduct, onDeleteStory, onNavigateToChat, onNavigateToNotifications, onAddStoryClick }) => {
  const [activeCommentProductId, setActiveCommentProductId] = useState<string | null>(null);
  const [activeShareProductId, setActiveShareProductId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeCommentProduct = products.find(p => p.id === activeCommentProductId);
  const activeShareProduct = products.find(p => p.id === activeShareProductId);

  // Search logic for Students and Products
  const filteredStudents = searchQuery.trim() === '' 
    ? [] 
    : MOCK_ACCOUNTS.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()));
  
  const filteredProducts = searchQuery.trim() === ''
    ? products
    : products.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="flex flex-col bg-[#fafafa] min-h-full pb-32">
      {activeCommentProductId && activeCommentProduct && <CommentSheet product={activeCommentProduct} onClose={() => setActiveCommentProductId(null)} onAddComment={(text) => onComment(activeCommentProductId, text)} />}
      {activeShareProductId && activeShareProduct && <ShareSheet product={activeShareProduct} onClose={() => setActiveShareProductId(null)} />}

      <header className="sticky top-0 z-[160] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-4 py-4">
        <div className="flex items-center justify-between">
          {!isSearchOpen ? (
            <>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-xl shadow-slate-200"><GraduationCap size={22} className="text-white" strokeWidth={2.5} /></div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tighter italic">Nexus</h1>
              </div>
              <div className="flex items-center space-x-1">
                <button 
                  onClick={onNavigateToNotifications}
                  className="p-2.5 hover:bg-slate-100 rounded-full relative"
                >
                  <Bell size={24} className="text-slate-900" />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
                </button>
                <button onClick={onNavigateToChat} className="p-2.5 hover:bg-slate-100 rounded-full relative"><MessageCircle size={24} className="text-slate-900" /></button>
                <button onClick={() => setIsSearchOpen(true)} className="p-2.5 hover:bg-slate-100 rounded-full"><Search size={24} className="text-slate-900" strokeWidth={2.5} /></button>
              </div>
            </>
          ) : (
            <div className="w-full flex items-center space-x-3">
               <div className="flex-1 relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input autoFocus type="text" placeholder="Search campus..." className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-11 pr-10 text-sm font-bold outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
               </div>
               <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="text-xs font-black text-indigo-600 uppercase tracking-widest">Cancel</button>
            </div>
          )}
        </div>
      </header>

      {/* Default Feed View (Stories + Full List) */}
      {!isSearchOpen && (
        <>
          <StoriesBar stories={stories} onSelectStory={() => {}} onAddStoryClick={onAddStoryClick} />
          <div className="space-y-4 pt-4">
            {products.map((product) => (
              <PostCard 
                key={product.id} 
                product={product} 
                currentUser={currentUser} 
                onLike={onLike} 
                onComment={setActiveCommentProductId} 
                onShare={setActiveShareProductId} 
                onDelete={onDeleteProduct}
                activeMenuId={activeMenuId}
                setActiveMenuId={setActiveMenuId}
              />
            ))}
          </div>
        </>
      )}

      {/* Search Overlay View */}
      {isSearchOpen && (
        <div className="flex-1 animate-in fade-in duration-300 px-4 pt-6 space-y-8">
          {/* Students Results */}
          {searchQuery.trim() !== '' && (
            <section className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Found Students</h3>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{filteredStudents.length} results</span>
              </div>
              <div className="space-y-3">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map(student => (
                    <div key={student.id} className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm">
                           <img src={student.avatar} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div>
                           <div className="flex items-center space-x-1">
                              <h4 className="text-sm font-black text-slate-900 leading-tight">{student.name}</h4>
                              {student.isVerified && <div className="w-3 h-3 bg-indigo-500 rounded-full flex items-center justify-center"><Check size={8} className="text-white" strokeWidth={4} /></div>}
                           </div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{student.college}</p>
                        </div>
                      </div>
                      <button onClick={onNavigateToChat} className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors">
                        <MessageCircle size={18} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-xs font-bold text-slate-300 italic">No students found with that name.</p>
                )}
              </div>
            </section>
          )}

          {/* Products Results */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{searchQuery.trim() === '' ? 'Discover Latest' : 'Product Results'}</h3>
              {searchQuery.trim() !== '' && <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{filteredProducts.length} items</span>}
            </div>
            <div className="space-y-4 pb-32">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <PostCard 
                    key={product.id} 
                    product={product} 
                    currentUser={currentUser} 
                    onLike={onLike} 
                    onComment={setActiveCommentProductId} 
                    onShare={setActiveShareProductId} 
                    onDelete={onDeleteProduct}
                    activeMenuId={activeMenuId}
                    setActiveMenuId={setActiveMenuId}
                  />
                ))
              ) : (
                <div className="py-20 text-center flex flex-col items-center opacity-30">
                   <div className="p-6 bg-slate-50 rounded-[32px] mb-4">
                      <Search size={40} />
                   </div>
                   <p className="text-sm font-black text-slate-900">No items found</p>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

// Extracted Subcomponent for cleaner code
const PostCard = ({ product, currentUser, onLike, onComment, onShare, onDelete, activeMenuId, setActiveMenuId }: any) => {
  return (
    <div className="bg-white border-y border-slate-100 shadow-sm relative overflow-visible animate-in fade-in duration-500">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full p-[1.5px] bg-gradient-to-tr from-indigo-500 to-emerald-400">
            <div className="w-full h-full rounded-full bg-white p-[1px]">
              <img src={`https://picsum.photos/seed/${product.sellerName}/100`} className="w-full h-full rounded-full object-cover" alt="" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <p className="text-[13px] font-black text-slate-900 leading-none">{product.sellerName}</p>
              <div className="w-3 h-3 bg-indigo-500 rounded-full flex items-center justify-center">
                <Check size={8} className="text-white" strokeWidth={4} />
              </div>
            </div>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{product.category} • Campus Verified</p>
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setActiveMenuId(activeMenuId === product.id ? null : product.id)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <MoreHorizontal size={20} />
          </button>
          {activeMenuId === product.id && (
            <ContextMenu 
              isOwner={product.sellerId === currentUser.id} 
              onDelete={() => { onDelete(product.id); setActiveMenuId(null); }} 
              onClose={() => setActiveMenuId(null)} 
            />
          )}
        </div>
      </div>

      <div className="aspect-square bg-slate-50 relative overflow-hidden">
        <img src={product.image} className="w-full h-full object-cover" alt={product.title} onDoubleClick={() => onLike(product.id)} />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-xl border border-white/50">
           <span className="text-sm font-black text-slate-900 tracking-tighter">₹{product.price.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-5">
            <button onClick={() => onLike(product.id)} className="transition-transform active:scale-150"><Heart size={28} className={`${product.isLiked ? "fill-rose-500 text-rose-500" : "text-slate-900"}`} strokeWidth={2} /></button>
            <button onClick={() => onComment(product.id)} className="transition-transform active:scale-125"><MessageCircle size={28} className="text-slate-900" strokeWidth={2} /></button>
            <button onClick={() => onShare(product.id)} className="transition-transform active:scale-125"><Share2 size={28} className="text-slate-900" strokeWidth={2} /></button>
          </div>
          <button className="p-2"><LinkIcon size={24} className="text-slate-900" strokeWidth={2} /></button>
        </div>
        <div className="space-y-1.5">
          <p className="text-sm font-black text-slate-900 tracking-tight">{product.likes.toLocaleString()} likes</p>
          <p className="text-sm text-slate-800 leading-relaxed"><span className="font-black mr-2 text-slate-900">{product.sellerName.split(' ')[0]}</span><span className="font-medium text-slate-600">{product.description}</span></p>
          {product.comments.length > 0 && <button onClick={() => onComment(product.id)} className="text-sm text-slate-400 font-bold block pt-1">View all {product.comments.length} comments</button>}
          <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest pt-1">2 hours ago</p>
        </div>
      </div>
    </div>
  );
};

export default FeedView;
