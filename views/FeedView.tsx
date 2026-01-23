
import React, { useState, useEffect } from 'react';
import { Product, Story, User, Comment } from '../types';
import { 
  Heart, MessageCircle, Share2, Plus, GraduationCap, 
  Bell, Send, X, ArrowUpRight, Sparkles, Camera, Loader2, Users, ShoppingCart, Key, ChevronDown, Zap
} from 'lucide-react';
import { generateSmartComment, generateQuickReplies } from '../services/gemini';

interface FeedViewProps {
  currentUser: User;
  products: Product[];
  stories: Story[];
  onLike: (productId: string) => void;
  onLikeStory: (storyId: string) => void;
  onComment: (productId: string, text: string) => void;
  onShare: (productId: string) => void;
  onShareStory: (storyId: string) => void;
  onDeleteProduct: (productId: string) => void;
  onDeleteStory: (storyId: string) => void;
  onNavigateToChat: () => void;
  onNavigateToNotifications: () => void;
  onNavigateToUserProfile: (user: User) => void;
  onNavigateToWallet?: () => void;
  onAddStoryClick: () => void;
  onQuickBuy?: (product: Product) => void;
  onQuickRent?: (product: Product) => void;
}

const StoryViewer = ({ story, onClose, onLike, onShare }: { story: Story, onClose: () => void, onLike: () => void, onShare: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          onClose();
          return 100;
        }
        return prev + 1;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[300] bg-black animate-in fade-in duration-300">
      <div className="absolute top-12 inset-x-4 flex space-x-1 z-20">
        <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="absolute top-16 inset-x-4 flex items-center justify-between z-20">
        <div className="flex items-center space-x-3">
          <img src={story.userAvatar} className="w-10 h-10 rounded-full border-2 border-white" alt="" />
          <div>
            <h4 className="text-white text-sm font-black">{story.userName}</h4>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Campus Story</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={onShare} className="p-2 text-white/80 active:scale-90 transition-all"><Share2 size={24} /></button>
          <button onClick={onClose} className="p-2 text-white/80 active:scale-90 transition-all"><X size={28} /></button>
        </div>
      </div>
      <img src={story.image} className="w-full h-full object-cover" alt="" />
      <div className="absolute bottom-10 inset-x-6 flex items-center space-x-4 z-20">
        <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-4">
          <input type="text" placeholder="Reply..." className="bg-transparent border-none text-white text-sm font-bold outline-none w-full" />
        </div>
        <button onClick={onLike} className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20">
          <Heart size={28} className={story.isLiked ? 'fill-rose-500 text-rose-500' : ''} />
        </button>
      </div>
    </div>
  );
};

const ProductCard = ({ product, onLike, onShare, onComment, onUserClick, onQuickBuy, onQuickRent }: any) => {
  const [commentText, setCommentText] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);

  useEffect(() => {
    const fetchReplies = async () => {
      const replies = await generateQuickReplies(product.title, product.description);
      setQuickReplies(replies);
    };
    fetchReplies();
  }, [product.id]);

  const handlePostComment = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!commentText.trim()) return;
    onComment(product.id, commentText);
    setCommentText('');
  };

  const handleSmartComment = async () => {
    setIsSuggesting(true);
    const suggestion = await generateSmartComment(product.title, product.description);
    setCommentText(suggestion);
    setIsSuggesting(false);
  };

  const handleQuickReply = (text: string) => {
    onComment(product.id, text);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-4 flex items-center justify-between">
        <div onClick={onUserClick} className="flex items-center space-x-3 cursor-pointer group">
          <img src={`https://picsum.photos/seed/${product.sellerName}/100`} className="w-8 h-8 rounded-full border border-slate-100 dark:border-slate-800" alt="" />
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">{product.sellerName}</h4>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Student Merchant</p>
          </div>
        </div>
        <div className="px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 dark:border-slate-700">
          {product.category}
        </div>
      </div>

      <div className="aspect-square bg-slate-100 dark:bg-slate-800 relative group overflow-hidden">
        <img src={product.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
           {product.canRent && (
             <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl flex items-center">
                <Key size={10} className="mr-1" /> Rent Available
             </div>
           )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button onClick={onLike} className="flex items-center space-x-2 group">
              <Heart size={24} className={`transition-all ${product.isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-400 group-hover:text-rose-400'}`} />
              <span className="text-xs font-black text-slate-900 dark:text-slate-100">{product.likes}</span>
            </button>
            <button onClick={() => setShowAllComments(!showAllComments)} className="flex items-center space-x-2 group">
              <MessageCircle size={24} className={`transition-all ${showAllComments ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-400'}`} />
              <span className="text-xs font-black text-slate-900 dark:text-slate-100">{product.comments.length}</span>
            </button>
            <button onClick={onShare} className="flex items-center space-x-2 group active:scale-90 transition-transform">
              <Share2 size={24} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
              <span className="text-xs font-black text-slate-900 dark:text-slate-100 transition-all group-hover:text-indigo-600">{product.shares || 0}</span>
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight">{product.title}</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">{product.description}</p>
        </div>

        {/* RECENT COMMENTS PREVIEW (Inline) */}
        {product.comments.length > 0 && !showAllComments && (
          <div className="space-y-2 pt-2 border-t border-slate-50 dark:border-slate-800">
             {product.comments.slice(0, 2).map((c: Comment) => (
               <div key={c.id} className="flex items-start space-x-2">
                 <span className="text-[10px] font-black text-slate-900 dark:text-slate-100 flex-shrink-0">{c.userName}</span>
                 <p className="text-[10px] text-slate-500 font-medium line-clamp-1">{c.text}</p>
               </div>
             ))}
             {product.comments.length > 2 && (
               <button onClick={() => setShowAllComments(true)} className="text-[9px] font-black text-indigo-600 uppercase tracking-widest pt-1">
                 View all {product.comments.length} comments
               </button>
             )}
          </div>
        )}

        {/* EXPANDED COMMENTS */}
        {showAllComments && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-in slide-in-from-top-2 duration-300">
            <div className="max-h-48 overflow-y-auto hide-scrollbar space-y-3">
              {product.comments.map((c: Comment) => (
                <div key={c.id} className="flex items-start space-x-3">
                  <img src={`https://picsum.photos/seed/${c.userName}/100`} className="w-6 h-6 rounded-full" alt="" />
                  <div className="flex-1 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <p className="text-[10px] font-black text-slate-900 dark:text-slate-100 leading-none mb-1">{c.userName}</p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QUICK REPLY CHIPS */}
        <div className="flex space-x-2 overflow-x-auto hide-scrollbar py-1">
           {quickReplies.map((reply, i) => (
             <button 
              key={i}
              onClick={() => handleQuickReply(reply)}
              className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-full whitespace-nowrap text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest active:scale-95 transition-all"
             >
                {reply}
             </button>
           ))}
        </div>

        {/* INLINE COMMENT INPUT */}
        <div className="space-y-3">
          <form onSubmit={handlePostComment} className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-1.5 border border-slate-100 dark:border-slate-700">
             <input 
              type="text" 
              placeholder="Add a comment..."
              className="flex-1 bg-transparent border-none py-2 text-[11px] font-bold outline-none placeholder:text-slate-400 dark:text-slate-100"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
             />
             <button 
              type="button" 
              onClick={handleSmartComment}
              className={`p-1.5 rounded-lg transition-all ${isSuggesting ? 'animate-spin text-indigo-400' : 'text-indigo-600 hover:bg-indigo-50'}`}
             >
               <Sparkles size={14} fill={commentText ? "none" : "currentColor"} />
             </button>
             <button type="submit" disabled={!commentText.trim()} className="text-slate-900 dark:text-white disabled:opacity-20 ml-1">
               <Send size={16} />
             </button>
          </form>
        </div>

        {/* TRANSACTION BUTTONS */}
        <div className="flex space-x-3 pt-2">
           <button 
            onClick={() => onQuickBuy(product)}
            className="flex-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 active:scale-95 transition-all shadow-lg shadow-slate-200 dark:shadow-none"
           >
              <ShoppingCart size={14} />
              <span>Buy ₹{product.price.toLocaleString('en-IN')}</span>
           </button>
           {product.canRent && (
             <button 
              onClick={() => onQuickRent(product)}
              className="flex-1 bg-white dark:bg-slate-900 border-2 border-emerald-500 text-emerald-600 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 active:scale-95 transition-all"
             >
                <Key size={14} />
                <span>Rent ₹{(product.rentPrice || Math.floor(product.price * 0.1)).toLocaleString('en-IN')}</span>
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

const FeedView: React.FC<FeedViewProps> = ({ 
  products, stories, onLike, onLikeStory, onShare, onShareStory, onComment, 
  onNavigateToChat, onNavigateToNotifications, onNavigateToUserProfile, onNavigateToWallet, onAddStoryClick,
  onQuickBuy = () => {}, onQuickRent = () => {}
}) => {
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 flex flex-col pb-32 transition-colors duration-300">
      {activeStory && (
        <StoryViewer 
          story={activeStory} 
          onClose={() => setActiveStory(null)} 
          onLike={() => onLikeStory(activeStory.id)} 
          onShare={() => onShareStory(activeStory.id)}
        />
      )}

      <header className="px-6 pt-12 pb-6 flex flex-col space-y-4 sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 z-[90] transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={onAddStoryClick} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-400"><Camera size={22} /></button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg"><GraduationCap /></div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Nexus</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={onNavigateToWallet} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-indigo-600 shadow-sm active:scale-90 transition-all">
              <Zap size={20} fill="currentColor" />
            </button>
            <button onClick={onNavigateToNotifications} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl relative transition-colors"><Bell size={20} className="text-slate-900 dark:text-white" /><div className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" /></button>
            <button onClick={onNavigateToChat} className="p-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl shadow-xl transition-all"><MessageCircle size={20}/></button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 bg-indigo-50/50 dark:bg-indigo-900/20 py-1.5 px-4 rounded-full self-start">
           <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700" />
              ))}
           </div>
           <span className="text-[8px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center">
             <Users size={10} className="mr-1" /> Campus Network Online
           </span>
        </div>
      </header>

      <div className="px-6 py-6 flex items-center space-x-4 overflow-x-auto hide-scrollbar">
        <div className="flex flex-col items-center space-y-1.5">
          <button onClick={onAddStoryClick} className="w-16 h-16 rounded-[24px] border-2 border-dashed border-indigo-400 bg-indigo-50 dark:bg-indigo-900/10 flex items-center justify-center text-indigo-600"><Plus size={24} /></button>
          <p className="text-[9px] font-black uppercase text-indigo-600">Your Story</p>
        </div>
        {stories.map(s => (
          <div key={s.id} onClick={() => setActiveStory(s)} className="flex-shrink-0 text-center space-y-1.5 cursor-pointer">
            <div className={`w-16 h-16 rounded-[24px] p-0.5 bg-gradient-to-tr ${s.isLiked ? 'from-rose-400 to-rose-600' : 'from-indigo-400 to-indigo-600'}`}>
              <img src={s.userAvatar} className="w-full h-full object-cover rounded-[22px] border-2 border-white dark:border-slate-900" alt="" />
            </div>
            <p className="text-[9px] font-black uppercase text-slate-400 w-16 truncate">{s.userName}</p>
          </div>
        ))}
      </div>

      <div className="px-6 space-y-8 mt-4">
        {products.map(p => (
          <ProductCard 
            key={p.id} 
            product={p} 
            onLike={() => onLike(p.id)} 
            onShare={() => onShare(p.id)}
            onComment={onComment}
            onQuickBuy={onQuickBuy}
            onQuickRent={onQuickRent}
            onUserClick={() => onNavigateToUserProfile({ id: p.sellerId, name: p.sellerName, avatar: '', college: '' } as User)}
          />
        ))}
      </div>
    </div>
  );
};

export default FeedView;
