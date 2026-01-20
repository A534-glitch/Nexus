
import React, { useState } from 'react';
import { Search, Edit, Trash2, MoreHorizontal, GraduationCap, Pin, Zap, MessageSquare, Sparkles, Filter, Bot } from 'lucide-react';
import { User } from '../types';

interface ChatListViewProps {
  onSelectChat: (id: string) => void;
  onSelectAiChat: () => void;
  onNavigateToUserProfile: (user: User) => void;
}

const ChatListView: React.FC<ChatListViewProps> = ({ onSelectChat, onSelectAiChat, onNavigateToUserProfile }) => {
  const [chats, setChats] = useState([
    { id: 'user2', name: 'Priya Patel', last: 'Is the iPad still available?', time: '10:45 AM', unread: 2, isPinned: true, college: 'SRCC Delhi', heat: 0.9, type: 'DEAL' },
    { id: 'user3', name: 'Rahul Varma', last: 'Okay, lets meet at the library.', time: 'Yesterday', unread: 0, isPinned: false, college: 'BITS Pilani', heat: 0.6, type: 'FRIEND' },
    { id: 'u104', name: 'Sana Varma', last: 'The notes are really helpful!', time: 'Monday', unread: 0, isPinned: false, college: 'VIT Vellore', heat: 0.4, type: 'STUDY' },
    { id: 'u106', name: 'Ananya S.', last: 'Can you share the Lab Manual?', time: 'Just now', unread: 1, isPinned: false, college: 'IIT Delhi', heat: 0.8, type: 'STUDY' },
  ]);

  const [filter, setFilter] = useState<'ALL' | 'DEAL' | 'STUDY'>('ALL');

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-white">
      {/* Nexus Aurora Header */}
      <div className="fixed top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-500/20 to-transparent pointer-events-none z-0" />

      <header className="px-8 pt-12 pb-8 relative z-10">
        <div className="flex items-center justify-between mb-10">
           <div>
              <h2 className="text-3xl font-black tracking-tighter">Resonance</h2>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mt-1">Active Synchrony</p>
           </div>
           <button className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all">
              <Edit size={20} className="text-white" />
           </button>
        </div>

        <div className="flex bg-white/5 backdrop-blur-3xl p-1 rounded-2xl border border-white/5 mb-8">
           {['ALL', 'DEAL', 'STUDY'].map((f) => (
             <button 
              key={f}
              onClick={() => setFilter(f as any)}
              className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
             >
               {f}
             </button>
           ))}
        </div>
      </header>

      {/* Floating Frequency Canvas */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-6 relative z-10">
        <div className="flex flex-col space-y-4 pb-48">
          
          {/* NEXUS AI ASSISTANT NODE */}
          <div 
            onClick={onSelectAiChat}
            className="w-full animate-in zoom-in fade-in duration-700 cursor-pointer group"
          >
            <div className="relative p-6 rounded-[40px] border bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border-indigo-500/50 shadow-[0_0_40px_rgba(99,102,241,0.3)] transition-all duration-500 hover:scale-[1.02]">
              <div className="flex items-start justify-between mb-4">
                 <div className="relative active:scale-90 transition-all">
                    <div className="w-16 h-16 rounded-2xl p-0.5 bg-gradient-to-tr from-cyan-400 to-indigo-500 overflow-hidden shadow-2xl">
                       <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                          <Bot size={32} className="text-indigo-400" />
                       </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0f172a] animate-pulse" />
                 </div>
                 <div className="px-3 py-1 bg-white/10 rounded-full flex items-center space-x-2">
                    <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">Nexus AI Concierge</span>
                    <Sparkles size={10} className="text-indigo-400 fill-indigo-400" />
                 </div>
              </div>
              <div className="space-y-1">
                 <h3 className="text-xl font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors">Nexus Assistant</h3>
                 <p className="text-xs text-indigo-200 font-medium opacity-80">Online. Ask me anything about Nexus or Campus life!</p>
              </div>
              {/* Dynamic Aura */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[40px] rounded-full pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {chats.filter(c => filter === 'ALL' || c.type === filter).map((chat, idx) => (
              <FrequencyNode 
                key={chat.id}
                chat={chat}
                index={idx}
                onClick={() => onSelectChat(chat.id)}
                onUserClick={(e) => {
                  e.stopPropagation();
                  onNavigateToUserProfile({ id: chat.id, name: chat.name, avatar: '', college: chat.college } as User);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Persistent Command Bar */}
      <div className="fixed bottom-32 left-1/2 -translate-x-1/2 w-[85%] max-w-sm z-[150]">
        <div className="bg-white/10 backdrop-blur-3xl rounded-[32px] p-2 flex items-center border border-white/10 shadow-2xl">
          <div className="p-4 text-indigo-400">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search resonance..."
            className="flex-1 bg-transparent border-none text-white text-sm font-bold placeholder:text-slate-500 outline-none"
          />
          <button className="p-4 bg-indigo-600 rounded-2xl text-white mr-1 shadow-lg active:scale-90 transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Unique Staggered Node Component
const FrequencyNode = ({ chat, index, onClick, onUserClick }: any) => {
  // Sizing based on "heat" (priority/unread/frequency)
  const sizeClass = chat.heat > 0.8 ? 'w-full' : 'w-[calc(50%-8px)]';
  
  return (
    <div 
      onClick={onClick}
      className={`${sizeClass} animate-in zoom-in fade-in duration-700 cursor-pointer group`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className={`relative p-6 rounded-[40px] border transition-all duration-500 hover:scale-[1.02] ${
        chat.unread > 0 
          ? 'bg-indigo-600/20 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.2)]' 
          : 'bg-white/5 border-white/10'
      }`}>
        <div className="flex items-start justify-between mb-4">
           <div onClick={onUserClick} className="relative active:scale-90 transition-all">
              <div className="w-14 h-14 rounded-2xl p-0.5 bg-gradient-to-tr from-indigo-500 to-purple-500 overflow-hidden shadow-xl">
                 <img src={`https://picsum.photos/seed/${chat.name}/100`} className="w-full h-full object-cover rounded-[14px]" alt="" />
              </div>
              {chat.unread > 0 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 rounded-full border-4 border-[#0f172a] flex items-center justify-center">
                   <span className="text-[10px] font-black">{chat.unread}</span>
                </div>
              )}
           </div>
           <div className={`p-2 rounded-xl bg-white/5 ${chat.type === 'DEAL' ? 'text-emerald-400' : 'text-indigo-400'}`}>
              {chat.type === 'DEAL' ? <Zap size={18} fill="currentColor" /> : <MessageSquare size={18} />}
           </div>
        </div>

        <div className="space-y-1">
           <div className="flex items-center justify-between">
              <h3 className="text-lg font-black tracking-tight group-hover:text-indigo-400 transition-colors truncate">{chat.name}</h3>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{chat.time}</span>
           </div>
           <p className="text-xs text-slate-400 font-medium line-clamp-1 opacity-80 group-hover:opacity-100 transition-opacity">
             {chat.last}
           </p>
        </div>
      </div>
    </div>
  );
};

export default ChatListView;
