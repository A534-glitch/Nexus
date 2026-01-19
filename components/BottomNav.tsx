
import React from 'react';
import { Home, ShoppingBag, PlusSquare, MessageCircle, User as UserIcon, Search } from 'lucide-react';
import { View } from '../types';

interface BottomNavProps {
  currentView: View;
  setView: (view: View) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
  const tabs = [
    { id: 'FEED', icon: Home, label: 'Feed' },
    { id: 'EXPLORE', icon: Search, label: 'Explore' },
    { id: 'UPLOAD', icon: PlusSquare, label: 'Post', special: true },
    { id: 'MARKET', icon: ShoppingBag, label: 'Shop' },
    { id: 'PROFILE', icon: UserIcon, label: 'Me' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-[100]">
      <nav className="glass bg-white/80 backdrop-blur-2xl squircle border border-white/50 flex justify-around items-center py-3 px-4 shadow-2xl shadow-indigo-900/10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id || (tab.id === 'CHAT' && currentView === 'CHAT_DETAIL');
          
          if (tab.special) {
            return (
              <button
                key={tab.id}
                onClick={() => setView(tab.id as View)}
                className={`relative -top-8 w-16 h-16 rounded-[24px] bg-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-600/40 transform transition-all active:scale-90 active:rotate-45 ${
                  isActive ? 'ring-4 ring-indigo-100' : ''
                }`}
              >
                <PlusSquare size={32} strokeWidth={2.5} />
                <div className="absolute -top-1 -right-1 p-1 bg-rose-500 rounded-full text-[8px] font-black ring-2 ring-white animate-pulse">AI</div>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as View)}
              className={`flex flex-col items-center space-y-1 transition-all duration-300 relative ${
                isActive ? 'text-indigo-600 scale-110' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 3 : 2} />
              <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute -top-2 w-1 h-1 bg-indigo-600 rounded-full animate-bounce"></div>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
