
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Send, Bot, Sparkles, Loader2, RefreshCw, Zap, Newspaper, TrendingUp } from 'lucide-react';
import { User, Message, Product } from '../types';
import { streamChatResponse, streamProactiveInsight } from '../services/gemini';

interface AiChatViewProps {
  currentUser: User;
  products: Product[];
  onBack: () => void;
}

const AiChatView: React.FC<AiChatViewProps> = ({ currentUser, products, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isBotThinking]);

  // Initial Proactive Insight Logic
  useEffect(() => {
    if (messages.length === 0) {
      const getInitialInsight = async () => {
        setIsSyncing(true);
        setIsBotThinking(true);

        const insightId = "proactive-" + Date.now();
        setMessages([{
          id: insightId,
          senderId: 'ai',
          senderName: 'Nexus Brain',
          text: '',
          timestamp: Date.now(),
          isAi: true
        }]);

        let accumulated = "";
        await streamProactiveInsight(currentUser, products, (chunk) => {
          accumulated += chunk;
          setMessages(prev => prev.map(m => m.id === insightId ? { ...m, text: accumulated } : m));
        });

        setIsBotThinking(false);
        setIsSyncing(false);
      };

      getInitialInsight();
    }
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMsgText = input;
    const userMsg: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: userMsgText,
      timestamp: Date.now(),
      isAi: false
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsBotThinking(true);

    const chatHistory = messages.map(m => ({
      role: m.isAi ? 'model' : 'user',
      text: m.text || ''
    }));

    const aiMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: aiMessageId,
      senderId: 'ai',
      senderName: 'Nexus Assistant',
      text: '',
      timestamp: Date.now(),
      isAi: true
    }]);

    let accumulatedText = "";
    await streamChatResponse(userMsgText, chatHistory, (newChunk) => {
      accumulatedText += newChunk;
      setMessages(prev => prev.map(m => 
        m.id === aiMessageId ? { ...m, text: accumulatedText } : m
      ));
    });

    setIsBotThinking(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-hidden">
      {/* AI Header */}
      <header className="bg-indigo-600 pt-14 pb-6 px-8 shadow-2xl relative z-20 flex items-center justify-between">
        <button onClick={onBack} className="p-3 bg-white/10 rounded-2xl text-white active:scale-90 transition-all">
          <ChevronLeft size={24} />
        </button>
        <div className="text-center flex flex-col items-center">
          <div className="flex items-center space-x-2">
             <div className="p-1.5 bg-cyan-400 rounded-lg shadow-[0_0_10px_rgba(34,211,238,0.5)]">
               <Bot size={18} className="text-indigo-900" />
             </div>
             <h2 className="text-white font-black text-lg tracking-tight">Nexus Brain</h2>
          </div>
          <div className="flex items-center justify-center space-x-1.5 mt-1">
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isSyncing ? 'bg-amber-400' : 'bg-emerald-400'}`}></div>
            <span className="text-[9px] text-indigo-100 font-black uppercase tracking-[0.2em]">
              {isSyncing ? 'Syncing Node Intelligence' : 'Synchronized'}
            </span>
          </div>
        </div>
        <button className="p-3 bg-white/10 rounded-2xl text-white/50 active:rotate-180 transition-transform duration-500">
          <RefreshCw size={20} />
        </button>
      </header>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar relative">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 opacity-5 pointer-events-none">
           <Bot size={300} className="text-indigo-600" />
        </div>

        {messages.map((m) => {
          const isProactive = m.id.startsWith('proactive-');
          return (
            <div key={m.id} className={`flex ${m.isAi ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2 duration-500`}>
              <div className={`max-w-[90%] px-5 py-4 rounded-[32px] shadow-sm relative border ${
                isProactive 
                  ? 'bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-indigo-500/30 rounded-tl-none ring-2 ring-indigo-500/20' 
                  : m.isAi 
                    ? 'bg-white text-slate-800 rounded-tl-none border-slate-100' 
                    : 'bg-indigo-600 text-white rounded-tr-none border-indigo-500 shadow-xl shadow-indigo-100'
              }`}>
                {isProactive && (
                   <div className="flex items-center space-x-2 mb-3">
                      <div className="p-1.5 bg-indigo-500 rounded-lg">
                        <TrendingUp size={12} className="text-white" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Intelligence Report</span>
                   </div>
                )}
                <p className={`text-sm font-medium leading-relaxed whitespace-pre-wrap ${isProactive ? 'italic' : ''}`}>{m.text}</p>
                {m.isAi && !m.text && <Loader2 size={16} className="animate-spin text-indigo-400 my-2" />}
                <div className="flex items-center justify-between mt-3 opacity-40">
                  <span className="text-[8px] font-bold uppercase tracking-tighter">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {m.isAi && <Sparkles size={10} className="text-indigo-400" />}
                </div>
              </div>
            </div>
          );
        })}
        {isBotThinking && !messages[messages.length-1]?.text && (
          <div className="flex justify-start">
             <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-3">
                <div className="flex space-x-1">
                   <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                   <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                   <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processing Node...</span>
             </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-6 pb-12 bg-white border-t border-slate-100 relative z-30">
        <div className="flex items-center space-x-3 bg-slate-50 rounded-[32px] px-5 py-2.5 border border-slate-200 shadow-inner group focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          <div className="p-2 text-indigo-400">
             <Zap size={20} fill="currentColor" className="opacity-20 group-focus-within:opacity-100 transition-opacity" />
          </div>
          <input 
            type="text" 
            placeholder="Query Nexus Brain..."
            className="flex-1 bg-transparent border-none py-3 text-sm font-bold outline-none text-slate-900 placeholder:text-slate-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button 
            onClick={handleSendMessage}
            disabled={!input.trim() || isBotThinking}
            className={`p-3.5 rounded-2xl transition-all shadow-lg ${input.trim() ? 'bg-indigo-600 text-white active:scale-90 scale-105' : 'bg-slate-200 text-slate-400 grayscale'}`}
          >
            <Send size={20} strokeWidth={2.5} />
          </button>
        </div>
        <div className="mt-4 flex justify-center space-x-6">
           <button className="flex items-center space-x-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
              <Newspaper size={12} />
              <span>Campus Buzz</span>
           </button>
           <button className="flex items-center space-x-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
              <TrendingUp size={12} />
              <span>Market Trends</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default AiChatView;
