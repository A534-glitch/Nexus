
import React from 'react';
import { ChevronLeft, Bell, Tag, Heart, MessageCircle, Info, Trash2, CheckCircle, Clock } from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'DEAL' | 'LIKE' | 'COMMENT' | 'CAMPUS' | 'SYSTEM';
  title: string;
  message: string;
  time: string;
  isUnread: boolean;
}

interface NotificationViewProps {
  onBack: () => void;
}

const NotificationView: React.FC<NotificationViewProps> = ({ onBack }) => {
  const notifications: NotificationItem[] = [
    {
      id: '1',
      type: 'DEAL',
      title: 'New Bargain Offer',
      message: 'Rahul offered ₹42,000 for your iPad Pro. Review the offer now!',
      time: '2m ago',
      isUnread: true
    },
    {
      id: '2',
      type: 'LIKE',
      title: 'Campus Social',
      message: 'Priya and 5 others liked your "Organic Chemistry Notes" story.',
      time: '15m ago',
      isUnread: true
    },
    {
      id: '3',
      type: 'CAMPUS',
      title: 'Library Alert',
      message: 'Central Library hours extended until 2:00 AM for exam season.',
      time: '1h ago',
      isUnread: false
    },
    {
      id: '4',
      type: 'COMMENT',
      title: 'New Comment',
      message: 'Sana commented: "Are these notes covering Semester 3 as well?"',
      time: '3h ago',
      isUnread: false
    },
    {
      id: '5',
      type: 'SYSTEM',
      title: 'Security Verified',
      message: 'Your campus ID has been successfully re-verified for 2025.',
      time: 'Yesterday',
      isUnread: false
    }
  ];

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'DEAL': return <Tag className="text-amber-500" size={18} />;
      case 'LIKE': return <Heart className="text-rose-500" size={18} fill="currentColor" />;
      case 'COMMENT': return <MessageCircle className="text-indigo-500" size={18} />;
      case 'CAMPUS': return <Info className="text-emerald-500" size={18} />;
      case 'SYSTEM': return <CheckCircle className="text-blue-500" size={18} />;
    }
  };

  const getBg = (type: NotificationItem['type']) => {
    switch (type) {
      case 'DEAL': return 'bg-amber-50';
      case 'LIKE': return 'bg-rose-50';
      case 'COMMENT': return 'bg-indigo-50';
      case 'CAMPUS': return 'bg-emerald-50';
      case 'SYSTEM': return 'bg-blue-50';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <header className="px-5 py-6 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-[100]">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack} 
            className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-900 rounded-full shadow-sm hover:bg-white active:scale-75 transition-all duration-300 ring-4 ring-slate-50"
          >
            <ChevronLeft size={24} strokeWidth={3} />
          </button>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Notifications</h1>
        </div>
        <button className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
          Clear All
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 hide-scrollbar">
        <div className="flex items-center justify-between mb-4 px-1">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Activity</h3>
           <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Mark all as read</span>
        </div>

        {notifications.map((n) => (
          <div 
            key={n.id} 
            className={`p-4 rounded-[28px] border transition-all flex items-start space-x-4 ${n.isUnread ? 'bg-white border-indigo-100 shadow-lg shadow-indigo-900/5' : 'bg-white/50 border-slate-100'}`}
          >
            <div className={`p-3 rounded-2xl flex-shrink-0 ${getBg(n.type)}`}>
              {getIcon(n.type)}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-900 leading-tight">{n.title}</h4>
                <div className="flex items-center space-x-1">
                   <Clock size={10} className="text-slate-300" />
                   <span className="text-[9px] font-bold text-slate-300">{n.time}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {n.message}
              </p>
              {n.isUnread && (
                <div className="pt-2">
                   <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="py-12 text-center space-y-3 opacity-20">
           <Bell size={40} className="mx-auto text-slate-400" />
           <p className="text-[10px] font-black uppercase tracking-[0.3em]">No more notifications</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationView;
