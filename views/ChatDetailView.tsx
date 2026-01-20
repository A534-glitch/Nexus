
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Phone, Video, Send, Plus, MoreVertical, X, Sparkles, Zap, ArrowUpRight, ShieldCheck, Heart, Info, DollarSign, Handshake, Check, AlertCircle, HelpCircle } from 'lucide-react';
import { User, Message } from '../types';

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
  const [dealProgress, setDealProgress] = useState(initialOffer ? (initialOffer / 50000) * 100 : 40);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm1', senderId: 'them', senderName: 'Priya Patel', text: 'Hey Arjun! Is the price for the iPad negotiable? I am a student at SRCC and could really use it for design work.', timestamp: Date.now() - 3600000 },
    { id: 'm2', senderId: currentUser.id, senderName: currentUser.name, text: 'Hey Priya! Glad to hear. I am open to a fair bargain for a fellow student. What did you have in mind?', timestamp: Date.now() - 3500000 },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, showBargainTool]);

  const handleSend = (textOverride?: string, offerAmount?: number) => {
    const textToSend = textOverride || msg;
    if (!textToSend.trim()) return;
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: textToSend,
      offerAmount: offerAmount,
      timestamp: Date.now()
    }]);
    setMsg('');
    setShowBargainTool(false);
  };

  const handleProposeOffer = () => {
    const amount = Math.floor(dealProgress * 500);
    handleSend(`I'd like to propose a formal offer of ₹${amount.toLocaleString('en-IN')}.`, amount);
  };

  return (
    <div className="flex flex-col h-full bg-[#fcfcfc] overflow-hidden">
      {/* Dynamic Header */}
      <div className="bg-slate-900 pt-12 pb-6 px-6 relative z-[110] shadow-2xl">
         <div className="flex items-center justify-between mb-8">
            <button onClick={onBack} className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-white active:scale-90 transition-all">
               <ChevronLeft size={20} />
            </button>
            <div className="text-center" onClick={() => onNavigateToUserProfile({ id: 'them', name: 'Priya Patel', avatar: '', college: 'SRCC' } as User)}>
               <h3 className="text-white text-lg font-black tracking-tighter">Priya Patel</h3>
               <div className="flex items-center justify-center space-x-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">In Negotiation</span>
               </div>
            </div>
            <button className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-white">
               <MoreVertical size={20} />
            </button>
         </div>

         <div className="bg-white/5 backdrop-blur-3xl rounded-[32px] p-5 border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-4 px-1 relative z-10">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                 <Handshake size={12} className="mr-2" /> Bargain Status
               </span>
               <span className="text-xs font-black text-indigo-400 italic">₹{(dealProgress * 500).toLocaleString('en-IN')}</span>
            </div>
            <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
               <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700 ease-out" 
                style={{ width: `${dealProgress}%` }}
               />
               <input 
                type="range" 
                min="0" max="100" 
                value={dealProgress}
                onChange={(e) => setDealProgress(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-pointer"
               />
            </div>
            <div className="flex justify-between mt-3 px-1 relative z-10">
               <span className="text-[8px] font-black text-slate-500 uppercase">Min Goal</span>
               <span className="text-[8px] font-black text-slate-500 uppercase">Asking Price</span>
            </div>
         </div>
      </div>

      {/* Chat Canvas */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 hide-scrollbar relative">
         <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-slate-900 to-transparent pointer-events-none opacity-20" />
         
         {messages.map((m, idx) => (
           <div 
            key={m.id} 
            className={`flex ${m.senderId === currentUser.id ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-500`}
            style={{ animationDelay: `${idx * 50}ms` }}
           >
              <div className={`max-w-[85%] px-6 py-4 shadow-xl relative ${
                m.senderId === currentUser.id 
                ? 'bg-indigo-600 text-white rounded-[32px] rounded-tr-lg' 
                : 'bg-white text-slate-800 rounded-[32px] rounded-tl-lg border border-slate-100'
              }`}>
                 {m.offerAmount ? (
                   <div className="mb-3 p-4 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white/20 rounded-xl"><DollarSign size={16} /></div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-white/60">Formal Offer Sent</p>
                          <p className="text-lg font-black tracking-tight">₹{m.offerAmount.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-emerald-400 text-white rounded-full flex items-center justify-center animate-bounce shadow-lg">
                        <Check size={16} strokeWidth={4} />
                      </div>
                   </div>
                 ) : null}
                 
                 <p className="text-sm font-medium leading-relaxed">{m.text}</p>
                 <div className={`mt-3 text-[8px] font-black uppercase tracking-tighter opacity-40 ${m.senderId === currentUser.id ? 'text-white' : 'text-slate-400'}`}>
                   {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </div>
              </div>
           </div>
         ))}
      </div>

      {/* Negotiation Controls & Input */}
      <div className="p-6 pb-12 bg-white/95 backdrop-blur-2xl border-t border-slate-100 relative">
         
         {/* User Friendly Bargain Tool */}
         {showBargainTool && (
           <div className="absolute bottom-full left-6 right-6 mb-6 p-8 bg-slate-900 text-white rounded-[48px] shadow-2xl animate-in slide-in-from-bottom-8 duration-500 border border-white/10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-500/20 rounded-xl">
                    <Handshake size={20} className="text-indigo-400" />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em]">Negotiation Console</h4>
                </div>
                <button onClick={() => setShowBargainTool(false)} className="p-2 bg-white/10 rounded-full"><X size={14} /></button>
              </div>
              
              <div className="bg-white/5 p-6 rounded-[32px] border border-white/5 mb-8">
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-2 text-center">Your Proposed Price</p>
                 <h2 className="text-4xl font-black text-center tracking-tighter text-white">₹{(dealProgress * 500).toLocaleString('en-IN')}</h2>
              </div>

              <div className="space-y-6 mb-8">
                 <div className="bg-indigo-500/10 p-4 rounded-2xl flex items-start space-x-3">
                    <Sparkles size={16} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] font-bold text-indigo-200 leading-relaxed italic">
                      "Student Tip: Offers within 10-15% of the asking price have a 90% higher success rate on Nexus."
                    </p>
                 </div>

                 <div className="flex space-x-3">
                    <button onClick={() => setDealProgress(prev => Math.max(0, prev - 5))} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-xs active:scale-95 transition-all">- ₹2,500</button>
                    <button onClick={() => setDealProgress(prev => Math.min(100, prev + 5))} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-xs active:scale-95 transition-all">+ ₹2,500</button>
                 </div>
              </div>
              
              <button 
                onClick={handleProposeOffer}
                className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center space-x-2 active:scale-95"
              >
                <span>Submit Formal Offer</span>
                <Handshake size={20} />
              </button>
           </div>
         )}

         <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowBargainTool(!showBargainTool)}
              className={`p-4 rounded-[28px] transition-all shadow-lg flex items-center justify-center space-x-2 ${showBargainTool ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-indigo-600'}`}
            >
               <Handshake size={24} />
               <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Negotiate</span>
            </button>
            
            <div className="flex-1 bg-slate-50 border border-slate-100 rounded-[28px] px-6 py-4 flex items-center group focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
               <input 
                type="text" 
                placeholder="Type your message..."
                className="flex-1 bg-transparent border-none text-sm font-bold outline-none placeholder:text-slate-400"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
               />
               <button 
                onClick={() => handleSend()}
                className={`ml-3 p-3 rounded-2xl transition-all ${msg.trim() ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 active:scale-90' : 'text-slate-300'}`}
               >
                  <Send size={18} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ChatDetailView;
