
import React, { useState, useRef } from 'react';
import { User } from '../types';
import { 
  ChevronLeft, Camera, User as UserIcon, Bell, Shield, 
  Lock, Moon, HelpCircle, Save, Wallet, Sparkles, 
  ShieldCheck, Globe, GraduationCap 
} from 'lucide-react';

interface SettingsViewProps {
  user: User;
  onBack: () => void;
  onUpdateUser: (user: User) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, onBack, onUpdateUser }) => {
  const [name, setName] = useState(user.name);
  const [college, setCollege] = useState(user.college || '');
  const [avatar, setAvatar] = useState(user.avatar);
  const [upiId, setUpiId] = useState(user.upiId || '');
  const [aiEnabled, setAiEnabled] = useState(user.aiEnabled ?? true);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      onUpdateUser({
        ...user,
        name,
        college,
        avatar,
        upiId,
        aiEnabled
      });
      setSaving(false);
      onBack();
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="px-4 py-4 bg-white border-b border-slate-100 flex items-center sticky top-0 z-40">
        <button 
          onClick={onBack} 
          className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-900 rounded-full shadow-sm hover:bg-white active:scale-75 transition-all duration-300 ring-4 ring-slate-50 mr-4"
        >
          <ChevronLeft size={24} strokeWidth={3} />
        </button>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Settings</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 pb-32 hide-scrollbar">
        {/* Profile Identity Section */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[42px] bg-white p-1.5 shadow-2xl ring-4 ring-indigo-50 overflow-hidden transition-transform group-hover:scale-105">
              <img src={avatar} className="w-full h-full object-cover rounded-[38px]" alt="Profile" />
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-3.5 rounded-2xl shadow-xl hover:bg-indigo-500 transition-all transform active:scale-90 border-4 border-white"
            >
              <Camera size={20} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange} 
            />
          </div>
          <div className="mt-5 text-center">
             <h2 className="text-lg font-black text-slate-900">{user.name}</h2>
             <div className="flex items-center justify-center space-x-1.5 mt-1">
                <div className="p-0.5 bg-emerald-100 text-emerald-600 rounded-md">
                   <ShieldCheck size={12} fill="currentColor" className="text-emerald-50" />
                </div>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Verified Student Account</span>
             </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Personal Details</h3>
          <div className="space-y-3">
            <div className="group">
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-5 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                />
              </div>
            </div>

            <div className="group">
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-5 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="University / College"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payments Section */}
        <div className="space-y-4">
           <div className="flex items-center justify-between ml-1">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Payments & Payouts</h3>
             <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Secure</span>
           </div>
           <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-4">
              <div className="flex items-center space-x-4">
                 <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Wallet size={20} />
                 </div>
                 <div className="flex-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Your UPI ID</label>
                    <input 
                      className="w-full bg-slate-50/50 border-none p-0 text-sm font-bold text-slate-900 outline-none placeholder:text-slate-300"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@upi"
                    />
                 </div>
              </div>
           </div>
        </div>

        {/* AI & Intelligence Section */}
        <div className="space-y-4">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nexus AI Preferences</h3>
           <div className="bg-slate-900 rounded-[32px] p-6 shadow-xl shadow-indigo-900/10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Sparkles size={80} />
              </div>
              <div className="flex items-start justify-between relative z-10">
                 <div className="space-y-1 max-w-[70%]">
                    <h4 className="text-sm font-black flex items-center">
                       Smart AI Negotiator
                       <div className="ml-2 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></div>
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">Allow Gemini to assist with fair price bargaining suggestions during chats.</p>
                 </div>
                 <button 
                  onClick={() => setAiEnabled(!aiEnabled)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${aiEnabled ? 'bg-indigo-500' : 'bg-slate-700'}`}
                 >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${aiEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                 </button>
              </div>
           </div>
        </div>

        {/* System Settings */}
        <div className="space-y-4">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">System</h3>
           <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
              <div className="flex items-center justify-between p-5 border-b border-slate-50">
                 <div className="flex items-center space-x-4">
                    <div className="p-2.5 bg-slate-50 text-slate-500 rounded-xl"><Bell size={18} /></div>
                    <span className="text-sm font-bold text-slate-700">Push Notifications</span>
                 </div>
                 <button 
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications ? 'bg-indigo-600' : 'bg-slate-200'}`}
                 >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                 </button>
              </div>

              <div className="flex items-center justify-between p-5">
                 <div className="flex items-center space-x-4">
                    <div className="p-2.5 bg-slate-50 text-slate-500 rounded-xl"><Moon size={18} /></div>
                    <span className="text-sm font-bold text-slate-700">Dark Appearance</span>
                 </div>
                 <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${darkMode ? 'bg-indigo-600' : 'bg-slate-200'}`}
                 >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                 </button>
              </div>
           </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col space-y-3">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full py-5 bg-slate-900 text-white font-black rounded-[28px] shadow-2xl flex items-center justify-center space-x-2 active:scale-95 transition-all disabled:opacity-50"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Save size={18} />
                <span className="uppercase tracking-[0.1em] text-xs">Update Profile</span>
              </>
            )}
          </button>
          
          <div className="flex items-center justify-center space-x-6 py-4">
             <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Privacy Policy</button>
             <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
             <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Safety Tips</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
