
import React, { useState } from 'react';
import { User, Product } from '../types';
import { ChevronLeft, MoreHorizontal, Check, MessageCircle, Grid, ShoppingBag, Pin } from 'lucide-react';

interface UserProfileViewProps {
  user: User;
  products: Product[];
  onBack: () => void;
  onNavigateToChat: () => void;
}

const UserProfileView: React.FC<UserProfileViewProps> = ({ user, products, onBack, onNavigateToChat }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'GRID' | 'SHOP'>('GRID');

  const userProducts = products.filter(p => p.sellerId === user.id);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Navigation Header */}
      <header className="px-4 py-4 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-xl z-50">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>
          <div className="flex items-center space-x-1">
            <h1 className="text-sm font-black text-slate-900 lowercase tracking-tight">{user.name.replace(/\s/g, '').toLowerCase()}</h1>
            {user.isVerified && <div className="w-3 h-3 bg-indigo-500 rounded-full flex items-center justify-center"><Check size={8} className="text-white" strokeWidth={4} /></div>}
          </div>
        </div>
        <button className="p-2">
          <MoreHorizontal size={20} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pb-20">
        {/* Profile Info */}
        <section className="px-6 pt-6 pb-4">
          <div className="flex items-center space-x-8 mb-6">
            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-emerald-400">
              <div className="w-full h-full rounded-full bg-white p-0.5">
                <img src={user.avatar} className="w-full h-full rounded-full object-cover" alt="" />
              </div>
            </div>
            <div className="flex flex-1 justify-around">
              <div className="text-center">
                <p className="text-base font-black text-slate-900 leading-none">{userProducts.length}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-base font-black text-slate-900 leading-none">{user.followers || 240}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-base font-black text-slate-900 leading-none">{user.following || 182}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Following</p>
              </div>
            </div>
          </div>

          <div className="space-y-1 mb-6">
            <h2 className="text-sm font-black text-slate-900">{user.name}</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{user.college}</p>
            <p className="text-xs font-medium text-slate-600 leading-relaxed mt-2">
              {user.bio || "Sharing resources to help fellow students excel! ✨ Always open for a fair bargain."}
            </p>
          </div>

          <div className="flex space-x-2">
            <button 
              onClick={() => setIsFollowing(!isFollowing)}
              className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 ${isFollowing ? 'bg-slate-100 text-slate-900' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'}`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
            <button 
              onClick={onNavigateToChat}
              className="flex-1 py-2.5 bg-slate-100 text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
            >
              Message
            </button>
          </div>
        </section>

        {/* Tab Switcher */}
        <div className="flex border-t border-slate-100 mt-4">
          <button 
            onClick={() => setActiveTab('GRID')}
            className={`flex-1 py-3 flex justify-center transition-all ${activeTab === 'GRID' ? 'text-indigo-600 border-t-2 border-indigo-600' : 'text-slate-300'}`}
          >
            <Grid size={24} />
          </button>
          <button 
            onClick={() => setActiveTab('SHOP')}
            className={`flex-1 py-3 flex justify-center transition-all ${activeTab === 'SHOP' ? 'text-indigo-600 border-t-2 border-indigo-600' : 'text-slate-300'}`}
          >
            <ShoppingBag size={24} />
          </button>
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-3 gap-0.5 pt-0.5">
          {userProducts.length > 0 ? (
            userProducts.map((p) => (
              <div key={p.id} className="aspect-square bg-slate-50 relative group">
                <img src={p.image} className="w-full h-full object-cover" alt="" />
                {p.isPinned && <div className="absolute top-2 right-2"><Pin size={12} className="text-white fill-white rotate-45" /></div>}
              </div>
            ))
          ) : (
            <div className="col-span-3 py-20 text-center opacity-30 flex flex-col items-center">
              <ShoppingBag size={48} className="mb-2" />
              <p className="text-xs font-black uppercase tracking-widest">No listings yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileView;
