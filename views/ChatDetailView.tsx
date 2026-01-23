
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Send, MoreVertical, Handshake, Check, Loader2, Zap, Sparkles, MessageSquare, ShieldCheck, TrendingDown, TrendingUp } from 'lucide-react';
import { User, Message } from '../types';
import { streamPeerResponse, streamChatResponse } from '../services/gemini';

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
  const [showBroker, setShowBroker] = useState(false);
  const [dealProgress, setDealProgress] = useState(initialOffer ? Math.min(100, (initialOffer / 50000) * 100) : 40);
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const [isBrokerThinking, setIsBrokerThinking] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm1', senderId: 'them', senderName: 'Priya Patel', text: 'Hey! Is the price for the iPad Pro negotiable? I saw it on the Hub.', timestamp: Date.now() - 3600000 },
    { id: 'm2', senderId: currentUser.id, senderName: currentUser.name, text: 'I can lower it slightly if we meet today. What is your offer?', timestamp: Date.now() - 3500000 },
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isPeerTyping, showBargainTool, showBroker]);

  const handleSend = async (textOverride?: string, offerAmount?: number, isAi?: boolean) => {
    const textToSend = textOverride || msg;
    if (!textToSend.trim()) return;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      senderId: isAi ? 'ai_broker' : currentUser.id,
      senderName: isAi ? 'Nexus Deal Broker' : currentUser.name,
      text: textToSend,
      offerAmount: offerAmount,
      timestamp: Date.now(),
      isAi: isAi
    };
    
    setMessages(prev => [...prev, userMsg]);
    if (!isAi) setMsg('');
    setShowBargainTool(false);

    if (!isAi) {
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
        text: '', 
        timestamp: Date.now()
      }]);

      let accumulated = "";
      await streamPeerResponse('Priya Patel', textToSend, history, (chunk) => {
        accumulated += chunk;
        setMessages(prev => prev.map(m => m.id === peerMsgId ? { ...m, text: accumulated } : m));
      });
      setIsPeerTyping(false);
    }
  };

  const handleSummonBroker = async () => {
    setShowBroker(true);
    setIsBrokerThinking(true);
    
    const lastUserMsg = messages.filter(m => m.senderId === currentUser.id).slice(-1)[0]?.text || "";
    const history = messages.map(m => ({ role: m.senderId === currentUser.id ? 'user' : 'model', text: m.text || '' }));
    
    let brokerText = "";
    const brokerMsgId = "broker-" + Date.now();
    
    setMessages(prev => [...prev, {
      id: brokerMsgId,
      senderId: 'ai_broker',
      senderName: 'Nexus Broker',
      text: '',
      timestamp: Date.now(),
      isAi: true
    }]);

    await streamChatResponse(
      `As the Nexus Deal Broker, analyze this negotiation. Suggest a fair campus price for this item and explain why based on campus demand. Keep it short. History: ${JSON.stringify(history)}`,
      [],
      (chunk) => {
        brokerText += chunk;
        setMessages(prev => prev.map(m => m.id === brokerMsgId ? { ...m, text: brokerText } : m));
      }
    );
    
    setIsBrokerThinking(false);
  };

  const handleProposeOffer = () => {
    const amount = Math.floor(dealProgress * 500);
    handleSend(`Proposed campus offer: ₹${amount.toLocaleString('en-IN')}`, amount);
  };

  return (
    <div className="flex flex-col h-full bg-[#fdfdfd] overflow-hidden">
      <header className="bg-[#0f172a] pt-14 pb-6 px-6 relative z-[110] flex items-center justify-between shadow-2xl">
         <div className="flex items-center space-x-4">
            <button onClick={onBack} className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/50 active:scale-90 transition-all"><ChevronLeft size={20}/></button>
            <div className="flex items-center space-x-3" onClick={() => onNavigateToUserProfile({ id: 'them', name: 'Priya Patel', avatar: '' } as any)}>
               <div className="relative">
                  <img src="https://picsum.photos/seed/Priya/100" className="w-10 h-10 rounded-xl border border-white/10" alt="" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0f172a]"></div>
               </div>
               <div>
                  <h3 className="text-white text-sm font-black">Priya Patel</h3>
                  <div className="flex items-center space-x-1.5">
                     <ShieldCheck size={10} className="text-indigo-400" />
                     <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Verified Senior</p>
                  </div>
               </div>
            </div>
         </div>
         <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/50"><MoreVertical size={20}/></button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar bg-slate-50/50">
         {messages.map((m) => (
           <div key={m.id} className={`flex ${m.senderId === currentUser.id ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[85%] px-5 py-4 rounded-[28px] relative ${
                m.isAi 
                  ? 'bg-gradient-to-br from-indigo-900 to-purple-900 text-white border border-indigo-500/30 rounded-tl-none shadow-xl shadow-indigo-900/10' 
                  : m.senderId === currentUser.id 
                    ? 'bg-slate-900 text-white rounded-tr-none shadow-lg' 
                    : 'bg-white border border-slate-200 text-slate-900 rounded-tl-none shadow-sm'
              }`}>
                 {m.isAi && (
                   <div className="flex items-center space-x-2 mb-2 opacity-60">
                      <Sparkles size={12} className="text-indigo-400 fill-indigo-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Nexus Deal Broker</span>
                   </div>
                 )}
                 {m.offerAmount && (
                    <div className="mb-3 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-between">
                       <div className="flex items-center space-x-2">
                          <TrendingDown size={14} className="text-emerald-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest">P2P Offer</span>
                       </div>
                       <span className="text-lg font-black italic tracking-tighter">₹{m.offerAmount.toLocaleString()}</span>
                    </div>
                 )}
                 <p className="text-sm font-medium leading-relaxed">{m.text}</p>
                 {!m.text && <Loader2 size={16} className="animate-spin text-indigo-400 mt-2" />}
              </div>
           </div>
         ))}
         {isPeerTyping && (
           <div className="flex justify-start">
              <div className="bg-white px-5 py-3 rounded-full border border-slate-100 flex items-center space-x-2">
                 <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                 <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                 <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
              </div>
           </div>
         )}
      </div>

      <div className="p-6 pb-12 bg-white border-t border-slate-100 space-y-4">
         {showBargainTool && (
           <div className="p-8 bg-[#0f172a] rounded-[40px] text-white shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
              <div className="flex items-center justify-between mb-8">
                 <h4 className="text-[10px] uppercase font-black tracking-[0.4em] text-slate-500">Adjust Node Value</h4>
                 <button onClick={() => setShowBargainTool(false)} className="p-2 bg-white/5 rounded-full"><X size={16} /></button>
              </div>
              <div className="text-5xl font-[900] text-center mb-8 italic tracking-tighter">₹{(dealProgress * 500).toLocaleString()}</div>
              <input type="range" min="0" max="100" value={dealProgress} onChange={e => setDealProgress(Number(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500 mb-8" />
              <button onClick={handleProposeOffer} className="w-full py-5 bg-indigo-600 rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-900/50 flex items-center justify-center space-x-3">
                 <Check size={18} strokeWidth={3} />
                 <span>Authorize Offer</span>
              </button>
           </div>
         )}

         <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowBargainTool(!showBargainTool)} 
              className={`p-4 rounded-2xl transition-all ${showBargainTool ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
              title="Bargain"
            >
               <Handshake size={20} />
            </button>
            <button 
              onClick={handleSummonBroker} 
              className={`p-4 rounded-2xl transition-all ${showBroker ? 'bg-purple-600 text-white' : 'bg-slate-100 text-purple-600'}`}
              title="Summon Broker"
            >
               <Sparkles size={20} fill={showBroker ? 'currentColor' : 'none'} />
            </button>
            <div className="flex-1 relative flex items-center">
               <input 
                className="w-full bg-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none border-2 border-transparent focus:border-indigo-500/20 transition-all text-slate-900 placeholder:text-slate-400" 
                placeholder="Synchronize thoughts..." 
                value={msg} 
                onChange={e => setMsg(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSend()} 
               />
               <button onClick={() => handleSend()} className="absolute right-2 p-2.5 bg-indigo-600 text-white rounded-xl active:scale-90 transition-all">
                  <Send size={18} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

const X = ({ size, className }: { size?: number, className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
);

export default ChatDetailView;
