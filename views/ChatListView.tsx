
import React, { useState } from 'react';
import { Search, Edit, Trash2, MoreHorizontal, GraduationCap, Pin } from 'lucide-react';
import { User } from '../types';

interface ChatListViewProps {
  onSelectChat: (id: string) => void;
  onNavigateToUserProfile: (user: User) => void;
}

const ChatListView: React.FC<ChatListViewProps> = ({ onSelectChat, onNavigateToUserProfile }) => {
  const [chats, setChats] = useState([
    { id: 'user2', name: 'Priya Patel', last: 'Is the iPad still available?', time: '10:45 AM', unread: 2, isPinned: true, college: 'SRCC Delhi' },
    { id: 'user3', name: 'Rahul Varma', last: 'Okay, lets meet at the library.', time: 'Yesterday', unread: 0, isPinned: false, college: 'BITS Pilani' },
    { id: 'u104', name: 'Sana Varma', last: 'The notes are really helpful!', time: 'Monday', unread: 0, isPinned: false, college: 'VIT Vellore' },
  ]);

  const handleDeleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Delete conversation with this student?")) {
      setChats(prev => prev.filter(c => c.id !== id));
    }
  };

  const togglePin = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setChats(prev => prev.map(c => c.id === id ? { ...c, isPinned: !c.isPinned } : c));
  };

  const handleAvatarClick = (e: React.MouseEvent, chat: any) => {
    e.stopPropagation();
    onNavigateToUserProfile({
      id: chat.id,
      name: chat.name,
      avatar: `https://picsum.photos/seed/${chat.name}/100`,
      college: chat.college
    });
  };

  const sortedChats = [...chats].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="px-6 py-6 border-b border-slate-50 sticky top-0 bg-white/90 backdrop-blur z-30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-indigo-600 rounded-lg shadow-sm">
              <GraduationCap size={20} className="text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Nexus Chat</h1>
          </div>
          <button className="p-2 bg-indigo-50 text-indigo-600 rounded-full transition-transform active:scale-90">
            <Edit size={20} />
          </button>
        </div>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-24">
        {sortedChats.length === 0 ? (
          <div className="p-12 text-center opacity-30 flex flex-col items-center">
             <div className="p-6 bg-slate-50 rounded-full mb-4">
                <Trash2 size={32} />
             </div>
             <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Inbox is empty</p>
          </div>
        ) : (
          sortedChats.map(chat => (
            <div 
              key={chat.id}
              className={`group relative transition-colors ${chat.isPinned ? 'bg-slate-50/50' : ''}`}
            >
              <button 
                onClick={() => onSelectChat(chat.id)}
                className="w-full flex items-center px-6 py-5 hover:bg-slate-50 transition-colors border-b border-slate-50"
              >
                <div className="relative" onClick={(e) => handleAvatarClick(e, chat)}>
                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 overflow-hidden shadow-sm hover:scale-105 transition-transform active:scale-95">
                    <img src={`https://picsum.photos/seed/${chat.name}/100`} alt="" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 ml-4 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors">{chat.name}</h3>
                      {chat.isPinned && <Pin size={12} className="text-indigo-600 rotate-45 fill-indigo-600" />}
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={`text-sm line-clamp-1 ${chat.unread > 0 ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}>
                      {chat.last}
                    </p>
                    {chat.unread > 0 && (
                      <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ml-2">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
              
              {/* Quick Actions */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onClick={(e) => togglePin(e, chat.id)}
                  className={`p-2 rounded-full transition-all hover:bg-white shadow-sm ${chat.isPinned ? 'text-indigo-600' : 'text-slate-300'}`}
                  title={chat.isPinned ? "Unpin Chat" : "Pin Chat"}
                >
                  <Pin size={18} className={chat.isPinned ? 'rotate-45' : ''} />
                </button>
                <button 
                  onClick={(e) => handleDeleteChat(e, chat.id)}
                  className="p-2 text-slate-300 hover:text-rose-500 transition-all hover:bg-white shadow-sm rounded-full"
                  title="Delete Chat"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatListView;
