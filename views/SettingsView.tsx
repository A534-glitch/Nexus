
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { 
  ChevronLeft, Camera, User as UserIcon, Bell, Shield, 
  Lock, Moon, HelpCircle, Save, Wallet, Sparkles, 
  ShieldCheck, Globe, GraduationCap, MessageSquare, 
  Tag, Heart, Info, Megaphone, CheckCircle, Database, Download, Upload, AlertTriangle
} from 'lucide-react';
import { downloadDatabaseFile, importDatabaseFile, getDbSize } from '../services/database';

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
  const [theme, setTheme] = useState<'light' | 'dark'>(user.theme as any || 'light');
  
  const [notifs, setNotifs] = useState(user.notificationPrefs || {
    messages: true,
    bargains: true,
    likes: true,
    comments: true,
    campusAlerts: true
  });

  const [saving, setSaving] = useState(false);
  const [dbSize, setDbSize] = useState(getDbSize());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dbInputRef = useRef<HTMLInputElement>(null);

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

  const handleDbImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && window.confirm("This will overwrite your current local database and restart the app. Continue?")) {
      await importDatabaseFile(file);
    }
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      onUpdateUser({
        ...user,
        name,
        college,
        avatar,
        upiId,
        aiEnabled,
        theme,
        notificationPrefs: notifs
      });
      setSaving(false);
      onBack();
    }, 1000);
  };

  const toggleNotif = (key: keyof typeof notifs) => {
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const NotifToggle = ({ label, icon: Icon, active, onToggle, color }: any) => (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all active:scale-[0.98]">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-xl bg-slate-50 dark:bg-slate-800 ${active ? color : 'text-slate-300 dark:text-slate-600'}`}>
          <Icon size={18} />
        </div>
        <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{label}</span>
      </div>
      <button 
        onClick={onToggle}
        className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${active ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
      >
        <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <header className="px-6 py-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl active:scale-90 transition-all text-slate-900 dark:text-slate-100">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Settings</h1>
        </div>
        <div className="flex items-center space-x-2">
           <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-800">Live Sync</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 pb-32 hide-scrollbar">
        {/* Profile Identity Section */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-28 h-28 rounded-[38px] bg-white dark:bg-slate-800 p-1.5 shadow-2xl ring-4 ring-indigo-50 dark:ring-indigo-900/20 overflow-hidden">
              <img src={avatar} className="w-full h-full object-cover rounded-[34px]" alt="Profile" />
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-3 rounded-xl shadow-xl border-4 border-white dark:border-slate-900"
            >
              <Camera size={16} />
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>
          <div className="mt-4 text-center">
             <h2 className="text-base font-black text-slate-900 dark:text-slate-100 tracking-tight">{name}</h2>
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Campus ID: {user.id.slice(-6)}</p>
          </div>
        </div>

        {/* Data & Development Hub */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Data & Development</h3>
            <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">SQLite Node Management</span>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-6">
             <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                   <div className="p-2 bg-indigo-50 dark:bg-indigo-950 rounded-xl text-indigo-600">
                      <Database size={20} />
                   </div>
                   <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">Local SQLite File</h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Node Size: {dbSize} KB</p>
                   </div>
                </div>
                <div className="flex items-center space-x-2">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                   <span className="text-[8px] font-black text-emerald-500 uppercase">Active</span>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={downloadDatabaseFile}
                  className="flex flex-col items-center justify-center p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:bg-slate-100 transition-all group"
                >
                   <Download size={18} className="text-indigo-600 mb-2 group-hover:translate-y-0.5 transition-transform" />
                   <span className="text-[9px] font-black uppercase tracking-widest">Export .sqlite</span>
                </button>
                <button 
                  onClick={() => dbInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:bg-slate-100 transition-all group"
                >
                   <Upload size={18} className="text-emerald-600 mb-2 group-hover:-translate-y-0.5 transition-transform" />
                   <span className="text-[9px] font-black uppercase tracking-widest">Import .sqlite</span>
                </button>
                <input type="file" ref={dbInputRef} className="hidden" accept=".sqlite,.db" onChange={handleDbImport} />
             </div>

             <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900/30 flex items-start space-x-3">
                <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-[9px] font-bold text-amber-700 dark:text-amber-500 uppercase leading-relaxed tracking-wide">
                   Developers: Use "Export" to inspect the database file in external SQLite viewers during development.
                </p>
             </div>
          </div>
        </div>

        {/* Notifications Console */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Notification Channels</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <NotifToggle label="Bargains & Deals" icon={Tag} active={notifs.bargains} onToggle={() => toggleNotif('bargains')} color="text-amber-500" />
            <NotifToggle label="Direct Messages" icon={MessageSquare} active={notifs.messages} onToggle={() => toggleNotif('messages')} color="text-indigo-600" />
            <NotifToggle label="Social Likes" icon={Heart} active={notifs.likes} onToggle={() => toggleNotif('likes')} color="text-rose-500" />
            <NotifToggle label="New Comments" icon={Megaphone} active={notifs.comments} onToggle={() => toggleNotif('comments')} color="text-sky-500" />
            <NotifToggle label="Campus Alerts" icon={Info} active={notifs.campusAlerts} onToggle={() => toggleNotif('campusAlerts')} color="text-emerald-500" />
          </div>
        </div>

        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Identity Details</h3>
          <div className="space-y-3">
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={18} />
              <input
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-5 text-sm outline-none transition-all font-bold placeholder:text-slate-300 dark:text-slate-100"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Profile Name"
              />
            </div>
            <div className="relative">
              <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={18} />
              <input
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-5 text-sm outline-none transition-all font-bold placeholder:text-slate-300 dark:text-slate-100"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="University Institution"
              />
            </div>
          </div>
        </div>

        {/* AI Control Center */}
        <div className="space-y-4">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">AI Intelligence</h3>
           <div className="bg-slate-900 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 shadow-xl relative overflow-hidden group">
              <div className="absolute -top-6 -right-6 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                 <Sparkles size={120} />
              </div>
              <div className="flex items-start justify-between relative z-10">
                 <div className="space-y-2 max-w-[75%]">
                    <h4 className="text-white text-sm font-black flex items-center uppercase tracking-wider">
                       Nexus Gemini Pilot
                       <div className="ml-2 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-wide">
                      Enables real-time price negotiation assistant & smart listing analysis.
                    </p>
                 </div>
                 <button 
                  onClick={() => setAiEnabled(!aiEnabled)}
                  className={`w-12 h-6 rounded-full p-1 transition-all duration-500 ${aiEnabled ? 'bg-indigo-500' : 'bg-slate-700'}`}
                 >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-500 ${aiEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                 </button>
              </div>
           </div>
        </div>

        {/* Appearance & More */}
        <div className="space-y-4">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">System Preferences</h3>
           <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm divide-y divide-slate-50 dark:divide-slate-800">
              <div className="flex items-center justify-between p-5">
                 <div className="flex items-center space-x-4">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl"><Moon size={18} /></div>
                    <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Dark Experience</span>
                 </div>
                 <button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className={`w-12 h-6 rounded-full p-1 transition-all ${theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                 >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
                 </button>
              </div>
              <div className="flex items-center justify-between p-5">
                 <div className="flex items-center space-x-4">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl"><Globe size={18} /></div>
                    <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Public Directory</span>
                 </div>
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              </div>
           </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleSave}
          disabled={saving}
          className="w-full py-5 bg-indigo-600 text-white font-black rounded-[28px] shadow-[0_15px_40px_-5px_rgba(79,70,229,0.4)] flex items-center justify-center space-x-3 active:scale-95 transition-all disabled:opacity-50"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <CheckCircle size={20} />
              <span className="uppercase tracking-[0.2em] text-xs">Save Environment</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SettingsView;
