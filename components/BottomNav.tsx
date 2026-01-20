
import React from 'react';
import { Home, ShoppingBag, Plus, MessageCircle, User as UserIcon, Search, Zap } from 'lucide-react';
import { View } from '../types';

interface BottomNavProps {
  currentView: View;
  setView: (view: View) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
  const tabs = [
    { id: 'FEED', icon: Home, label: 'Hub' },
    { id: 'EXPLORE', icon: Search, label: 'Discover' },
    { id: 'MARKET', icon: ShoppingBag, label: 'Resources' },
    { id: 'PROFILE', icon: UserIcon, label: 'Identity' },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-sm px-6 z-[100] pointer-events-none">
      <div className="bg-slate-900/90 backdrop-blur-3xl rounded-[40px] p-2 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 pointer-events-auto">
        {tabs.slice(0, 2).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id as View)}
            className={`flex-1 flex flex-col items-center py-2 transition-all duration-500 ${currentView === tab.id ? 'text-indigo-400 scale-110' : 'text-slate-500'}`}
          >
            <tab.icon size={22} strokeWidth={currentView === tab.id ? 2.5 : 2} />
            <span className="text-[8px] font-black uppercase tracking-widest mt-1">{tab.label}</span>
          </button>
        ))}

        {/* The Pulse Node */}
        <button
          onClick={() => setView('UPLOAD')}
          className="relative -top-4 w-16 h-16 rounded-[28px] bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-[0_10px_30px_rgba(79,70,229,0.4)] transform hover:rotate-90 transition-all active:scale-90"
        >
          <Plus size={32} strokeWidth={3} />
          <div className="absolute inset-0 rounded-[28px] bg-white animate-ping opacity-20 pointer-events-none"></div>
        </button>

        {tabs.slice(2).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id as View)}
            className={`flex-1 flex flex-col items-center py-2 transition-all duration-500 ${currentView === tab.id ? 'text-indigo-400 scale-110' : 'text-slate-500'}`}
          >
            <tab.icon size={22} strokeWidth={currentView === tab.id ? 2.5 : 2} />
            <span className="text-[8px] font-black uppercase tracking-widest mt-1">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
