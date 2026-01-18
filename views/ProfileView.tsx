
import React from 'react';
import { User, Product } from '../types';
import { Settings, ShoppingBag, Bookmark, LogOut, ChevronRight, Award, Package, Clock, CheckCircle, Share2, Users } from 'lucide-react';

interface ProfileViewProps {
  user: User;
  myPurchases: Product[];
  onLogout: () => void;
  onSettings: () => void;
  onWishlist: () => void;
  onManageListings: () => void;
  onShareApp: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, myPurchases, onLogout, onSettings, onWishlist, onManageListings, onShareApp }) => {
  const stats = [
    { label: 'Selling', value: '12', icon: ShoppingBag },
    { label: 'Purchased', value: myPurchases.length.toString(), icon: Package },
    { label: 'Rating', value: '4.9', icon: Award },
  ];

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <header className="px-6 py-6 bg-indigo-600 text-white pb-12 rounded-b-[40px] shadow-lg relative">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">My Profile</h2>
          <button 
            onClick={onSettings}
            className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
          >
             <Settings size={20} />
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-3xl bg-white p-1 shadow-2xl overflow-hidden border-2 border-indigo-400">
            <img src={user.avatar} className="w-full h-full object-cover rounded-2xl" alt="" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-indigo-100 text-sm font-medium">{user.college}</p>
          </div>
        </div>
      </header>

      <div className="px-6 -mt-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex justify-around p-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="flex justify-center text-indigo-600 mb-1">
                <stat.icon size={18} />
              </div>
              <p className="text-xl font-extrabold text-slate-900">{stat.value}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Share App Section */}
      <div className="px-6 mt-6">
        <button 
          onClick={onShareApp}
          className="w-full bg-indigo-600 text-white p-5 rounded-[28px] shadow-xl shadow-indigo-200 flex items-center justify-between group active:scale-[0.98] transition-all"
        >
          <div className="flex items-center space-x-4">
            <div className="p-2.5 bg-white/20 rounded-2xl">
              <Users size={20} />
            </div>
            <div className="text-left">
              <span className="block font-black text-sm tracking-tight">Invite Campus Friends</span>
              <span className="block text-[10px] font-bold text-indigo-100 uppercase tracking-widest">Share Nexus Link</span>
            </div>
          </div>
          <Share2 size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="px-6 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">My Collection</h3>
          <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">Account Assets</span>
        </div>
        
        {myPurchases.length === 0 ? (
          <div className="bg-white rounded-[32px] p-10 text-center border border-dashed border-slate-200 shadow-sm">
            <div className="bg-slate-50 w-16 h-16 rounded-[24px] flex items-center justify-center mx-auto mb-4 text-slate-300">
              <ShoppingBag size={32} />
            </div>
            <p className="text-sm font-black text-slate-400 leading-tight">No items in your account yet.<br/><span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Buy or rent essentials to see them here.</span></p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {myPurchases.map((product) => (
              <div key={product.id} className="bg-white rounded-[28px] p-4 border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-500">
                <div className="aspect-square rounded-2xl overflow-hidden mb-3 relative shadow-inner bg-slate-50">
                  <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg ${product.purchaseType === 'BOUGHT' ? 'bg-indigo-600 text-white' : 'bg-emerald-500 text-white'}`}>
                    {product.purchaseType}
                  </div>
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md text-emerald-600 p-1 rounded-lg shadow-sm">
                    <CheckCircle size={14} />
                  </div>
                </div>
                <h4 className="text-[11px] font-black text-slate-900 truncate mb-1">{product.title}</h4>
                <div className="flex items-center space-x-1.5 opacity-60">
                  <Clock size={10} className="text-slate-400" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Verified Owner</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-6 py-8 space-y-4">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Account Control</h3>
        
        <button 
          onClick={onManageListings}
          className="w-full bg-white p-5 rounded-[28px] border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-all group active:scale-[0.98] shadow-sm"
        >
          <div className="flex items-center space-x-4">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
              <ShoppingBag size={20} />
            </div>
            <span className="font-black text-slate-700 tracking-tight">Manage Listings</span>
          </div>
          <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
        </button>

        <button 
          onClick={onWishlist}
          className="w-full bg-white p-5 rounded-[28px] border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-all group active:scale-[0.98] shadow-sm"
        >
          <div className="flex items-center space-x-4">
            <div className="p-2.5 bg-rose-50 text-rose-500 rounded-2xl">
              <Bookmark size={20} />
            </div>
            <span className="font-black text-slate-700 tracking-tight">Wishlist</span>
          </div>
          <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
        </button>

        <button 
          onClick={onLogout}
          className="w-full bg-rose-50 p-5 rounded-[28px] border border-rose-100 flex items-center space-x-4 text-rose-600 font-black hover:bg-rose-100 transition-colors mt-8 active:scale-[0.98] shadow-sm"
        >
          <LogOut size={20} />
          <span className="uppercase tracking-widest text-xs">Logout from Nexus</span>
        </button>
      </div>

      <div className="mt-auto px-6 pb-6 text-center">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Nexus Digital Ecosystem v1.0.0</p>
      </div>
    </div>
  );
};

export default ProfileView;
