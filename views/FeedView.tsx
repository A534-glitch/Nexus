
import React, { useState, useEffect, useRef } from 'react';
import { Product, Story, Comment, User } from '../types';
import { Heart, MessageCircle, Share2, Send, MoreHorizontal, X, Link as LinkIcon, Sparkles, Plus, GraduationCap, User as UserIcon, Bell, Smile, Copy, Check, Search, ChevronRight } from 'lucide-react';

interface FeedViewProps {
  products: Product[];
  stories: Story[];
  onLike: (productId: string) => void;
  onLikeStory: (storyId: string) => void;
  onComment: (productId: string, text: string) => void;
  onShare: (productId: string) => void;
  onNavigateToChat: () => void;
  onAddStoryClick: () => void;
}

// Mock database of students for the search feature
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
    },
    { 
      name: 'X', 
      color: '#000000', 
      icon: <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z"/>,
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
    },
    { 
      name: 'Facebook', 
      color: '#1877F2', 
      icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>,
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
    },
    { 
      name: 'LinkedIn', 
      color: '#0A66C2', 
      icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>,
      action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')
    },
    { 
      name: 'Telegram', 
      color: '#0088CC', 
      icon: <path d="M20.665 3.717l-17.73 6.837c-1.213.486-1.205 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.703-.331 4.96c.488 0 .704-.223.977-.488l2.345-2.28 4.873 3.6c.898.495 1.543.239 1.767-.83l3.2-15.085c.328-1.314-.499-1.908-1.462-1.426z"/>,
      action: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank')
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

        <div className="grid grid-cols-3 gap-y-8 px-6 py-4">
          {platforms.map((p) => (
            <button 
              key={p.name}
              onClick={() => { p.action(); if (p.name !== 'Instagram') onClose(); }}
              className="flex flex-col items-center space-y-2 group active:scale-90 transition-transform"
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all"
                style={{ backgroundColor: p.color + '15' }}
              >
                <svg viewBox="0 0 24 24" className="w-8 h-8" style={{ fill: p.color }}>
                  {p.icon}
                </svg>
              </div>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{p.name}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 px-8">
           <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3 overflow-hidden">
                <LinkIcon size={18} className="text-slate-400 flex-shrink-0" />
                <span className="text-xs font-bold text-slate-500 truncate">{shareUrl}</span>
              </div>
              <button 
                onClick={platforms[1].action}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white'}`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span className="text-[10px] font-black uppercase tracking-widest">{copied ? 'Copied' : 'Copy'}</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const CommentSheet = ({ product, onClose, onAddComment }: { product: Product, onClose: () => void, onAddComment: (text: string) => void }) => {
  const [newComment, setNewComment] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
        {/* Drag Handle */}
        <div className="flex justify-center py-3">
          <div className="w-10 h-1.5 bg-slate-200 rounded-full" />
        </div>
        
        {/* Header */}
        <div className="px-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900">Comments</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} className="text-slate-900" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 hide-scrollbar">
          {product.comments.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-40 text-center px-10">
              <MessageCircle size={48} className="mb-4 text-slate-300" />
              <p className="font-black text-slate-900">No comments yet</p>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Start the conversation</p>
            </div>
          ) : (
            product.comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3 group">
                <img src={`https://picsum.photos/seed/${comment.userName}/100`} className="w-9 h-9 rounded-full object-cover flex-shrink-0" alt="" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-black text-slate-900">{comment.userName}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                      {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 mt-1 leading-relaxed font-medium">{comment.text}</p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-300 hover:text-rose-500">
                  <Heart size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Input Bar */}
        <div className="px-6 pt-4 pb-10 border-t border-slate-100 bg-white">
          <form onSubmit={handleSubmit} className="flex items-center space-x-4">
            <img src="https://picsum.photos/seed/arjun/100" className="w-9 h-9 rounded-full object-cover" alt="" />
            <div className="flex-1 bg-slate-50 rounded-full px-4 py-2.5 flex items-center border border-slate-100 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <input
                ref={inputRef}
                type="text"
                placeholder={`Add a comment for ${product.sellerName.split(' ')[0]}...`}
                className="flex-1 bg-transparent border-none text-sm font-medium focus:outline-none placeholder:text-slate-400"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Smile size={20} className="text-slate-300 ml-2" />
            </div>
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="text-indigo-600 font-black text-sm uppercase tracking-widest disabled:opacity-30 disabled:pointer-events-none hover:text-indigo-700 transition-colors"
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const StoryViewer = ({ stories, initialIndex, onClose, onLikeStory }: { stories: Story[], initialIndex: number, onClose: () => void, onLikeStory: (id: string) => void }) => {
  const [index, setIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const story = stories[index];

  useEffect(() => {
    setProgress(0);
    const duration = 5000;
    const interval = 50;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          if (index < stories.length - 1) {
            setIndex(index + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return oldProgress + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [index, stories.length, onClose]);

  const nextStory = () => {
    if (index < stories.length - 1) {
      setIndex(index + 1);
    } else {
      onClose();
    }
  };

  const prevStory = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center animate-in fade-in duration-300">
      <div className="absolute top-0 left-0 right-0 p-4 z-[210] bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex space-x-1 mb-4">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-[2px] bg-white/30 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-white transition-all ease-linear"
                 style={{ width: `${i < index ? 100 : i === index ? progress : 0}%` }}
               />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <img src={story.userAvatar} className="w-9 h-9 rounded-full border border-white/50 p-0.5" alt="" />
             <div className="flex flex-col">
               <span className="text-white font-bold text-sm tracking-tight">{story.userName}</span>
               <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Campus Story</span>
             </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/80 hover:text-white transition-colors">
            <X size={28} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <img src={story.image} className="w-full h-full object-cover" alt="" />

      <div className="absolute inset-y-0 left-0 w-1/3 z-[205]" onClick={prevStory}></div>
      <div className="absolute inset-y-0 right-0 w-1/3 z-[205]" onClick={nextStory}></div>

      <div className="absolute bottom-10 left-0 right-0 px-6 z-[210] flex items-center space-x-4">
        <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-3 flex items-center">
          <input 
            type="text" 
            placeholder="Send message..." 
            className="bg-transparent border-none text-white text-sm w-full focus:outline-none placeholder:text-white/50 font-medium" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onLikeStory(story.id); }}
          className={`p-2 transition-all active:scale-150 ${story.isLiked ? 'text-rose-500' : 'text-white'}`}
        >
           <Heart size={28} className={story.isLiked ? 'fill-current' : ''} />
        </button>
        <button className="text-white p-2">
           <Send size={28} className="-rotate-12" />
        </button>
      </div>
    </div>
  );
};

const StoriesBar = ({ stories, onSelectStory, onAddStoryClick }: { stories: Story[], onSelectStory: (index: number) => void, onAddStoryClick: () => void }) => {
  return (
    <div className="flex space-x-4 px-4 py-4 overflow-x-auto hide-scrollbar bg-white border-b border-slate-50">
      <div 
        onClick={onAddStoryClick}
        className="flex flex-col items-center space-y-1.5 flex-shrink-0 group cursor-pointer"
      >
        <div className="w-[68px] h-[68px] rounded-full border-2 border-slate-200 border-dashed flex items-center justify-center p-0.5 group-active:scale-95 transition-transform bg-slate-50">
          <div className="w-full h-full rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Plus size={24} strokeWidth={3} />
          </div>
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">My Story</span>
      </div>
      {stories.map((s, index) => (
        <div 
          key={s.id} 
          className="flex flex-col items-center space-y-1.5 flex-shrink-0 cursor-pointer group"
          onClick={() => onSelectStory(index)}
        >
          <div className="w-[68px] h-[68px] rounded-full p-[2.5px] bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] group-active:scale-95 transition-transform shadow-lg shadow-rose-500/10">
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

const FeedView: React.FC<FeedViewProps> = ({ products, stories, onLike, onLikeStory, onComment, onShare, onNavigateToChat, onAddStoryClick }) => {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [activeCommentProductId, setActiveCommentProductId] = useState<string | null>(null);
  const [activeShareProductId, setActiveShareProductId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const activeCommentProduct = products.find(p => p.id === activeCommentProductId);
  const activeShareProduct = products.find(p => p.id === activeShareProductId);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
    } else {
      const filtered = MOCK_ACCOUNTS.filter(acc => 
        acc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        acc.college?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    }
  }, [searchQuery]);

  const handleUserSelect = (userId: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    onNavigateToChat();
  };

  return (
    <div className="flex flex-col bg-[#fafafa] min-h-full pb-32">
      {/* Search Overlay Backdrop */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 bg-white/60 backdrop-blur-xl z-[150] animate-in fade-in duration-300"
          onClick={() => setIsSearchOpen(false)}
        />
      )}

      {/* Story Viewer Overlay */}
      {activeStoryIndex !== null && (
        <StoryViewer 
          stories={stories} 
          initialIndex={activeStoryIndex} 
          onClose={() => setActiveStoryIndex(null)} 
          onLikeStory={onLikeStory}
        />
      )}

      {/* Comment Sheet Overlay */}
      {activeCommentProductId && activeCommentProduct && (
        <CommentSheet 
          product={activeCommentProduct} 
          onClose={() => setActiveCommentProductId(null)}
          onAddComment={(text) => onComment(activeCommentProductId, text)}
        />
      )}

      {/* Share Sheet Overlay */}
      {activeShareProductId && activeShareProduct && (
        <ShareSheet 
          product={activeShareProduct} 
          onClose={() => setActiveShareProductId(null)}
        />
      )}

      {/* Premium Social Header */}
      <header className="sticky top-0 z-[160] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-4 py-4">
        <div className="flex items-center justify-between">
          {!isSearchOpen ? (
            <>
              <div className="flex items-center space-x-3 animate-in slide-in-from-left duration-300">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-xl shadow-slate-200">
                  <GraduationCap size={22} className="text-white" strokeWidth={2.5} />
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tighter italic">Nexus</h1>
              </div>
              <div className="flex items-center space-x-1 animate-in slide-in-from-right duration-300">
                <button 
                  className="p-2.5 hover:bg-slate-100 rounded-full transition-all active:scale-90 relative"
                >
                  <Bell size={24} className="text-slate-900" strokeWidth={2} />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
                </button>
                <button 
                  onClick={onNavigateToChat}
                  className="p-2.5 hover:bg-slate-100 rounded-full transition-all active:scale-90 relative"
                >
                  <MessageCircle size={24} className="text-slate-900" strokeWidth={2} />
                  <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-indigo-600 rounded-full ring-2 ring-white flex items-center justify-center">
                    <span className="text-[8px] font-black text-white">3</span>
                  </span>
                </button>
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 hover:bg-slate-100 rounded-full transition-all active:scale-90"
                >
                  <Search size={24} className="text-slate-900" strokeWidth={2.5} />
                </button>
              </div>
            </>
          ) : (
            <div className="w-full flex items-center space-x-3 animate-in slide-in-from-right duration-300">
               <div className="flex-1 relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                   autoFocus
                   type="text" 
                   placeholder="Search for students..." 
                   className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-11 pr-10 text-sm font-bold focus:ring-4 focus:ring-indigo-600/10 transition-all outline-none"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
                 {searchQuery && (
                   <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400"
                   >
                     <X size={16} />
                   </button>
                 )}
               </div>
               <button 
                onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                className="text-xs font-black text-indigo-600 uppercase tracking-widest px-2"
               >
                 Cancel
               </button>
            </div>
          )}
        </div>

        {/* Real-time Search Results */}
        {isSearchOpen && searchQuery.trim() !== '' && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-2xl animate-in slide-in-from-top duration-300 max-h-[60vh] overflow-y-auto">
            {searchResults.length > 0 ? (
              <div className="py-2">
                {searchResults.map((user) => (
                  <button 
                    key={user.id}
                    onClick={() => handleUserSelect(user.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img src={user.avatar} className="w-12 h-12 rounded-2xl object-cover shadow-sm" alt="" />
                        {user.isVerified && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center ring-2 ring-white">
                            <Check size={10} className="text-white" strokeWidth={4} />
                          </div>
                        )}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-black text-slate-900 leading-none">{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{user.college}</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-300" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-3">
                 <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                    <UserIcon size={24} />
                 </div>
                 <p className="text-sm font-black text-slate-400">No students found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}
      </header>

      <StoriesBar stories={stories} onSelectStory={setActiveStoryIndex} onAddStoryClick={onAddStoryClick} />

      <div className="space-y-4 pt-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white border-y border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Post Header */}
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
                      <svg viewBox="0 0 24 24" className="w-2 h-2 text-white fill-current"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                    </div>
                  </div>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{product.category} • Campus Verified</p>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Media Content */}
            <div className="aspect-square bg-slate-50 relative group overflow-hidden">
              <img 
                src={product.image} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                alt={product.title} 
                onDoubleClick={() => onLike(product.id)}
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-xl border border-white/50">
                 <span className="text-sm font-black text-slate-900 tracking-tighter">₹{product.price.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Social Actions */}
            <div className="px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-5">
                  <button 
                    onClick={() => onLike(product.id)} 
                    className="transition-transform active:scale-150 focus:outline-none group"
                  >
                    <Heart 
                      size={28} 
                      className={`${product.isLiked ? "fill-rose-500 text-rose-500" : "text-slate-900 group-hover:text-slate-600"}`} 
                      strokeWidth={2} 
                    />
                  </button>
                  <button 
                    onClick={() => setActiveCommentProductId(product.id)}
                    className="transition-transform active:scale-125 focus:outline-none hover:text-slate-600"
                  >
                    <MessageCircle size={28} className="text-slate-900" strokeWidth={2} />
                  </button>
                  <button 
                    onClick={() => setActiveShareProductId(product.id)}
                    className="transition-transform active:scale-125 focus:outline-none hover:text-slate-600"
                  >
                    <Share2 size={28} className="text-slate-900" strokeWidth={2} />
                  </button>
                </div>
                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <LinkIcon size={24} className="text-slate-900" strokeWidth={2} />
                </button>
              </div>

              <div className="space-y-1.5">
                <p className="text-sm font-black text-slate-900 tracking-tight">{product.likes.toLocaleString()} likes</p>
                <p className="text-sm text-slate-800 leading-relaxed">
                  <span className="font-black mr-2 text-slate-900">{product.sellerName.split(' ')[0]}</span>
                  <span className="font-medium text-slate-600">{product.description}</span>
                </p>
                
                {product.comments.length > 0 && (
                  <button 
                    onClick={() => setActiveCommentProductId(product.id)}
                    className="text-sm text-slate-400 font-bold block pt-1"
                  >
                    View all {product.comments.length} comments
                  </button>
                )}
                
                <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest pt-1">2 hours ago</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedView;
