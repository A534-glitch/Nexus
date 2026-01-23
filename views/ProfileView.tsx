
import React, { useState, useRef } from 'react';
import { User, Product } from '../types';
import { 
  Settings, ShoppingBag, Bookmark, LogOut, ChevronRight, 
  Award, Package, Clock, CheckCircle, Share2, Users, 
  ShieldCheck, Info, X, MapPin, Scale, Lock, Ban, Heart, Zap,
  GraduationCap, Camera, Loader2
} from 'lucide-react';

interface ProfileViewProps {
  user: User;
  myPurchases: Product[];
  onLogout: () => void;
  onSettings: () => void;
  onWishlist: () => void;
  onManageListings: () => void;
  onWallet: () => void;
  onShareApp: () => void;
  onUpdateUser: (user: User) => void;
}

const LegalModal = ({ title, type, onClose }: { title: string, type: 'SAFETY' | 'PRIVACY', onClose: () => void }) => {
  const safetyTips = [
    {
      icon: <MapPin className="text-indigo-600" size={24} />,
      title: "Public Campus Meetups",
      desc: "Always trade in high-traffic campus zones like the Central Library, Canteen, or Main Gate. Avoid meeting in private hostel rooms."
    },
    {
      icon: <ShieldCheck className="text-emerald-600" size={24} />,
      title: "ID Verification",
      desc: "Nexus verifies college IDs, but it's good practice to double-check the 'Verified' badge on the student's profile before meeting."
    },
    {
      icon: <Lock className="text-amber-600" size={24} />,
      title: "Secure Payments",
      desc: "Inspect the notebook or gadget thoroughly before authorizing UPI transfers. Use the Nexus 'Buy' button for digital records."
    },
    {
      icon: <Ban className="text-rose-600" size={24} />,
      title: "Report Suspicious Activity",
      desc: "If a deal feels too good to be true or a student asks for personal info outside of campus, use the 'Report' button immediately."
    }
  ];

  const privacyPoints = [
    {
      icon: <ShieldCheck className="text-indigo-600" size={24} />,
      title: "Data Ownership",
      desc: "You own your listings and profile data. We only use your information to facilitate campus trades and verify student status."
    },
    {
      icon: <Lock className="text-indigo-600" size={24} />,
      title: "Encrypted Chats",
      desc: "Conversations on Nexus are secure. We do not read your private messages except when a safety violation is reported for moderation."
    },
    {
      icon: <Info className="text-indigo-600" size={24} />,
      title: "Third-Party Sharing",
      desc: "We never sell your student data to advertisers. Your information stays within the Nexus campus ecosystem."
    }
  ];

  return (
    <div className="fixed inset-0 z-[300] flex flex-col justify-end animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full h-[85vh] rounded-t-[48px] shadow-2xl relative z-10 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-500">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-20">
           <div className="flex items-center space-x-3">
             <div className="p-2 bg-indigo-600 rounded-xl">
               <ShieldCheck className="text-white" size={20} />
             </div>
             <h2 className="text-xl font-black text-slate-900 tracking-tight">{title}</h2>
           </div>
           <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
             <X size={20} className="text-slate-900" />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 hide-scrollbar pb-20">
           {type === 'SAFETY' ? (
             <>
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-relaxed text-center">
                 Your security is our campus priority.
               </p>
               <div className="space-y-8">
                  {safetyTips.map((tip, idx) => (
                    <div key={idx} className="flex space-x-5">
                       <div className="flex-shrink-0 w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                          {tip.icon}
                       </div>
                       <div className="space-y-1">
                          <h3 className="text-base font-black text-slate-900">{tip.title}</h3>
                          <p className="text-sm text-slate-500 font-medium leading-relaxed">{tip.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
             </>
           ) : (
             <>
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-relaxed text-center">
                 Student privacy built by design.
               </p>
               <div className="space-y-8">
                  {privacyPoints.map((point, idx) => (
                    <div key={idx} className="flex space-x-5">
                       <div className="flex-shrink-0 w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-sm">
                          {point.icon}
                       </div>
                       <div className="space-y-1">
                          <h3 className="text-base font-black text-slate-900">{point.title}</h3>
                          <p className="text-sm text-slate-500 font-medium leading-relaxed">{point.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    By using Nexus, you agree to our Terms of Service. We process data under the guidelines of student privacy laws and campus digital policies.
                  </p>
               </div>
             </>
           )}
        </div>

        <div className="p-8 bg-white border-t border-slate-100">
           <button 
            onClick={onClose}
            className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-xs shadow-xl active:scale-[0.98] transition-all"
           >
             Close
           </button>
        </div>
      </div>
    </div>
  );
};

const ProfileView: React.FC<ProfileViewProps> = ({ user, myPurchases, onLogout, onSettings, onWishlist, onManageListings, onWallet, onShareApp, onUpdateUser }) => {
  const [modalContent, setModalContent] = useState<{ title: string, type: 'SAFETY' | 'PRIVACY' } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = [
    { label: 'Selling', value: '12', icon: ShoppingBag },
    { label: 'Purchased', value: myPurchases.length.toString(), icon: Package },
    { label: 'Rating', value: '4.9', icon: Award },
  ];

  const menuItems = [
    { label: 'My Listings', icon: ShoppingBag, onClick: onManageListings, color: 'text-indigo-600' },
    { label: 'My Wishlist', icon: Bookmark, onClick: onWishlist, color: 'text-rose-500' },
    { label: 'Change Institution', icon: GraduationCap, onClick: onSettings, color: 'text-amber-600' },
    { label: 'Payments', icon: CheckCircle, onClick: onWallet, color: 'text-emerald-500' },
    { label: 'Invite Peers', icon: Share2, onClick: onShareApp, color: 'text-sky-500' },
  ];

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatar = reader.result as string;
        onUpdateUser({ ...user, avatar: newAvatar });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] pb-32">
      {modalContent && (
        <LegalModal 
          title={modalContent.title} 
          type={modalContent.type} 
          onClose={() => setModalContent(null)} 
        />
      )}

      {/* Profile Header */}
      <div className="bg-white px-8 pt-16 pb-10 rounded-b-[56px] shadow-sm border-b border-slate-100">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Status: Active</span>
           </div>
           <button onClick={onSettings} className="p-2.5 bg-slate-50 text-slate-900 rounded-2xl hover:bg-slate-100 transition-all active:scale-90">
             <Settings size={22} />
           </button>
        </div>

        <div className="flex flex-col items-center text-center">
           <div className="relative mb-6 group cursor-pointer" onClick={handlePhotoClick}>
              <div className="w-32 h-32 rounded-[42px] p-1.5 bg-gradient-to-tr from-indigo-500 via-purple-500 to-rose-500 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                 <div className="w-full h-full rounded-[38px] bg-white p-1 relative overflow-hidden">
                    <img src={user.avatar} className="w-full h-full rounded-[34px] object-cover" alt="" />
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-[34px]">
                        <Loader2 className="text-white animate-spin" size={24} />
                      </div>
                    )}
                 </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-2.5 rounded-xl shadow-xl border-4 border-white group-hover:bg-indigo-700 transition-colors">
                 <Camera size={16} />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
              <div className="absolute -top-2 -left-2 bg-emerald-500 text-white p-1.5 rounded-lg shadow-lg border-2 border-white scale-0 group-hover:scale-100 transition-transform">
                 <ShieldCheck size={12} strokeWidth={3} />
              </div>
           </div>

           <h2 className="text-2xl font-black text-slate-900 tracking-tighter">{user.name}</h2>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{user.college || 'Nexus Member'}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-10">
           {stats.map((stat, i) => (
             <div key={i} className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
                <stat.icon size={18} className="text-slate-400 mb-2" />
                <span className="text-lg font-black text-slate-900 leading-none">{stat.value}</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{stat.label}</span>
             </div>
           ))}
        </div>
      </div>

      {/* Profile Sections */}
      <div className="px-6 py-8 space-y-10">
        
        {/* Main Menu */}
        <div className="space-y-4">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">General</h3>
           <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
              {menuItems.map((item, i) => (
                <button 
                  key={i} 
                  onClick={item.onClick}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-b-0"
                >
                   <div className="flex items-center space-x-4">
                      <div className={`p-2.5 rounded-2xl bg-slate-50 ${item.color}`}>
                         <item.icon size={20} />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{item.label}</span>
                   </div>
                   <ChevronRight size={18} className="text-slate-300" />
                </button>
              ))}
           </div>
        </div>

        {/* Support & Legal Section */}
        <div className="space-y-4">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Support & Legal</h3>
           <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
              <button 
                onClick={() => setModalContent({ title: 'Safety Tips', type: 'SAFETY' })}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-50"
              >
                 <div className="flex items-center space-x-4">
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                       <Zap size={20} />
                    </div>
                    <span className="text-sm font-bold text-slate-900">Safety Tips</span>
                 </div>
                 <ChevronRight size={18} className="text-slate-300" />
              </button>
              <button 
                onClick={() => setModalContent({ title: 'Privacy Policy', type: 'PRIVACY' })}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                 <div className="flex items-center space-x-4">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
                       <ShieldCheck size={20} />
                    </div>
                    <span className="text-sm font-bold text-slate-900">Privacy Policy</span>
                 </div>
                 <ChevronRight size={18} className="text-slate-300" />
              </button>
           </div>
        </div>

        {/* Logout */}
        <button 
          onClick={onLogout}
          className="w-full py-5 bg-white border border-rose-100 text-rose-500 rounded-[32px] font-black uppercase text-xs tracking-[0.2em] shadow-sm flex items-center justify-center space-x-3 active:scale-95 transition-all"
        >
          <LogOut size={20} />
          <span>Exit Campus Network</span>
        </button>

        <div className="text-center space-y-2 opacity-30 pb-10">
           <div className="flex items-center justify-center space-x-2">
             <div className="w-8 h-[1px] bg-slate-400"></div>
             <p className="text-[10px] font-black uppercase tracking-[0.5em]">Nexus v1.0.4</p>
             <div className="w-8 h-[1px] bg-slate-400"></div>
           </div>
           <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Built for university students by Nexus Digital</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
