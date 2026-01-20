
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Send, MoreVertical, X, Sparkles, Handshake, Check, Loader2, DollarSign } from 'lucide-react';
import { User, Message } from '../types';
import { streamPeerResponse } from '../services/gemini';

interface ChatDetailViewProps {
  chatId: string;
  onBack: () => void;
  currentUser: User;
  onNavigateToUserProfile: (user: User) => void;
  initialOffer?: number;
}

const ChatDetailView: React.FC<ChatDetailViewProps> = ({ chatId, onBack, currentUser, onNavigateToUserProfile, initialOffer }) => {
  const [msg, setMsg] = useState('');
  const [showBargainTool, setShowBargainTool] = useState(false);
  const [dealProgress, setDealProgress] = useState(initialOffer ? Math.min(100, (initialOffer / 50000) * 100) : 40);
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm1', senderId: 'them', senderName: 'Priya Patel', text: 'Hey! Is the price for the iPad negotiable? I am a student and really need it for college.', timestamp: Date.now() - 3600000 },
    { id: 'm2', senderId: currentUser.id, senderName: currentUser.name, text: 'Hey Priya! I can go a bit lower for a fellow student. What is your offer?', timestamp: Date.now() - 3500000 },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isPeerTyping, showBargainTool]);

  const handleSend = async (textOverride?: string, offerAmount?: number) => {
    const textToSend = textOverride || msg;
    if (!textToSend.trim()) return;
    
    // 1. Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: textToSend,
      offerAmount: offerAmount,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setMsg('');
    setShowBargainTool(false);

    // 2. Trigger Real-Time Peer Response
    setIsPeerTyping(true);
    
    const history = messages.map(m => ({
      role: m.senderId === currentUser.id ? 'user' : 'model',
      text: m.text || ''
    }));

    const peerMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: peerMsgId,
      senderId: 'them',
      senderName: 'Priya Patel',
      text: '', // Start empty for streaming
      timestamp: Date.now()
    }]);

    let accumulated = "";
    await streamPeerResponse('Priya Patel', textToSend, history, (chunk) => {
      accumulated += chunk;
      setMessages(prev => prev.map(m => m.id === peerMsgId ? { ...m, text: accumulated } : m));
    });

    setIsPeerTyping(false);
  };

  const handleProposeOffer = () => {
    const amount = Math.floor(dealProgress * 500);
    handleSend(`I am proposing ₹${amount.toLocaleString('en-IN')} as my final offer.`, amount);
  };

  return (
    <div className="flex flex-col h-full bg-[#fcfcfc] overflow-hidden">
      {/* Real-time Status Header */}
      <div className="bg-slate-900 pt-12 pb-6 px-6 relative z-[110] shadow-2xl">
         <div className="flex items-center justify-between mb-8">
            <button onClick={onBack} className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-white active:scale-90 transition-all">
               <ChevronLeft size={20} />
            </button>
            <div className="text-center" onClick={() => onNavigateToUserProfile({ id: 'them', name: 'Priya Patel', avatar: '', college: 'SRCC' } as User)}>
               <h3 className="text-white text-lg font-black tracking-tighter">Priya Patel</h3>
               <div className="flex items-center justify-center space-x-1.5 mt-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${isPeerTyping ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
                  <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">
                    {isPeerTyping ? 'Typing...' : 'Online'}
                  </span>
               </div>
            </div>
            <button className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-white">
               <MoreVertical size={20} />
            </button>
         </div>

         {/* Negotiation Tracker */}
         <div className="bg-white/5 backdrop-blur-3xl rounded-[32px] p-5 border border-white/5">
            <div className="flex items-center justify-between mb-4 px-1">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                 <Handshake size={12} className="mr-2" /> Live Negotiation
               </span>
               <span className="text-xs font-black text-indigo-400 italic">₹{(dealProgress * 500).toLocaleString('en-IN')}</span>
            </div>
            <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
               <div className="absolute inset-y-0 left-0 bg-indigo-500 transition-all duration-700" style={{ width: `${dealProgress}%` }} />
               <input type="range" min="0" max="100" value={dealProgress} onChange={(e) => setDealProgress(Number(e.target.value))} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
         </div>
      </div>

      {/* Chat Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 hide-scrollbar">
         {messages.map((m) => (
           <div key={m.id} className={`flex ${m.senderId === currentUser.id ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[85%] px-6 py-4 shadow-sm ${
                m.senderId === currentUser.id 
                ? 'bg-indigo-600 text-white rounded-[28px] rounded-tr-none' 
                : 'bg-white text-slate-800 rounded-[28px] rounded-tl-none border border-slate-100'
              }`}>
                 {m.offerAmount && (
                   <div className="mb-3 p-3 bg-black/10 rounded-xl flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DollarSign size={14} />
                        <span className="text-[10px] font-black uppercase">Offer: ₹{m.offerAmount.toLocaleString()}</span>
                      </div>
                      <Check size={14} strokeWidth={4} className="text-emerald-400" />
                   </div>
                 )}
                 <p className="text-sm font-medium leading-relaxed">{m.text}</p>
                 {!m.text && <Loader2 size={16} className="animate-spin text-indigo-400 mt-2" />}
              </div>
           </div>
         ))}
         {isPeerTyping && !messages[messages.length-1].text && (
           <div className="flex justify-start">
              <div className="bg-slate-100 px-4 py-2 rounded-2xl flex space-x-1">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
              </div>
           </div>
         )}
      </div>

      {/* Input Bar */}
      <div className="p-6 pb-12 bg-white border-t border-slate-100">
         {showBargainTool && (
           <div className="mb-6 p-6 bg-slate-900 rounded-[40px] text-white animate-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-xs font-black uppercase tracking-widest">Bargain Console</h4>
                <button onClick={() => setShowBargainTool(false)}><X size={18} /></button>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl mb-6 text-center">
                 <p className="text-[9px] text-indigo-300 uppercase font-black mb-1">Your Price</p>
                 <h2 className="text-3xl font-black italic">₹{(dealProgress * 500).toLocaleString()}</h2>
              </div>
              <button onClick={handleProposeOffer} className="w-full py-4 bg-indigo-600 rounded-2xl font-black uppercase text-xs">Send Formal Offer</button>
           </div>
         )}

         <div className="flex items-center space-x-3">
            <button onClick={() => setShowBargainTool(!showBargainTool)} className={`p-4 rounded-[24px] ${showBargainTool ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-indigo-600'}`}>
               <Handshake size={24} />
            </button>
            <div className="flex-1 bg-slate-100 rounded-[28px] px-6 py-4 flex items-center">
               <input type="text" placeholder="Reply to Priya..." className="flex-1 bg-transparent border-none text-sm font-bold outline-none" value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
               <button onClick={() => handleSend()} className={`ml-3 ${msg.trim() ? 'text-indigo-600' : 'text-slate-300'}`}><Send size={20} /></button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ChatDetailView;
