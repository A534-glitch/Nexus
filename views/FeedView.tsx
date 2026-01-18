
import React, { useState, useEffect } from 'react';
import { Product, Story } from '../types';
import { Heart, MessageCircle, Share2, Send, MoreHorizontal, X, Link as LinkIcon, Sparkles, Plus, GraduationCap, User as UserIcon, Bell } from 'lucide-react';

interface FeedViewProps {
  products: Product[];
  stories: Story[];
  onLike: (productId: string) => void;
  onComment: (productId: string, text: string) => void;
  onShare: (productId: string) => void;
  onNavigateToChat: () => void;
  onAddStoryClick: () => void;
}

const StoryViewer = ({ stories, initialIndex, onClose }: { stories: Story[], initialIndex: number, onClose: () => void }) => {
  const [index, setIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const story = stories[index];

  useEffect(() => {
    setProgress(0);
    const duration = 5000; // 5 seconds per story
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

      {/* Navigation Controls */}
      <div className="absolute inset-y-0 left-0 w-1/3 z-[205]" onClick={prevStory}></div>
      <div className="absolute inset-y-0 right-0 w-1/3 z-[205]" onClick={nextStory}></div>

      {/* Bottom Actions */}
      <div className="absolute bottom-10 left-0 right-0 px-6 z-[210] flex items-center space-x-4">
        <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-3 flex items-center">
          <input 
            type="text" 
            placeholder="Send message..." 
            className="bg-transparent border-none text-white text-sm w-full focus:outline-none placeholder:text-white/50 font-medium" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <button className="text-white p-2">
           <Heart size={28} />
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

const FeedView: React.FC<FeedViewProps> = ({ products, stories, onLike, onComment, onShare, onNavigateToChat, onAddStoryClick }) => {
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  const submitComment = (productId: string) => {
    if (!commentText.trim()) return;
    onComment(productId, commentText);
    setCommentText('');
    setCommentingPostId(null);
  };

  return (
    <div className="flex flex-col bg-[#fafafa] min-h-full pb-32">
      {/* Story Viewer Overlay */}
      {activeStoryIndex !== null && (
        <StoryViewer 
          stories={stories} 
          initialIndex={activeStoryIndex} 
          onClose={() => setActiveStoryIndex(null)} 
        />
      )}

      {/* Premium Social Header */}
      <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-xl shadow-slate-200">
            <GraduationCap size={22} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter italic">Nexus</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={onNavigateToChat}
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
            onClick={onNavigateToChat}
            className="p-2.5 hover:bg-slate-100 rounded-full transition-all active:scale-90"
          >
            <Send size={24} className="text-slate-900 -rotate-12" strokeWidth={2} />
          </button>
        </div>
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
                    onClick={() => setCommentingPostId(commentingPostId === product.id ? null : product.id)}
                    className="transition-transform active:scale-125 focus:outline-none hover:text-slate-600"
                  >
                    <MessageCircle size={28} className="text-slate-900" strokeWidth={2} />
                  </button>
                  <button 
                    onClick={() => onShare(product.id)}
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
                    onClick={() => setCommentingPostId(product.id)}
                    className="text-sm text-slate-400 font-bold mt-1 hover:text-indigo-600 transition-colors"
                  >
                    View all {product.comments.length} comments
                  </button>
                )}
                
                <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest pt-1">2 hours ago</p>

                {commentingPostId === product.id && (
                  <div className="mt-4 flex items-center space-x-3 bg-slate-50 p-2 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-slate-200">
                      <img src="https://picsum.photos/seed/current/100" alt="" />
                    </div>
                    <div className="flex-1 relative">
                      <input 
                        autoFocus
                        type="text"
                        placeholder="Add a comment..."
                        className="w-full bg-transparent border-none py-2 px-1 text-sm focus:outline-none font-medium"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && submitComment(product.id)}
                      />
                      <button 
                        onClick={() => submitComment(product.id)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-indigo-600 font-black text-[11px] uppercase tracking-widest disabled:opacity-30"
                        disabled={!commentText.trim()}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedView;
