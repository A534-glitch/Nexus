
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Send, Bot, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { User, Message } from '../types';
import { streamChatResponse } from '../services/gemini';

interface AiChatViewProps {
  currentUser: User;
  onBack: () => void;
}

const AiChatView: React.FC<AiChatViewProps> = ({ currentUser, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'welcome', 
      senderId: 'ai', 
      senderName: 'Nexus AI', 
      text: "Hey! I'm your real-time campus assistant. Ask me anything! 🎓", 
      timestamp: Date.now(), 
      isAi: true 
    }
  ]);
  const [input, setInput] = useState('');
  const [isBotThinking, setIsBotThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages or text arrives
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isBotThinking]);

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

    // 1. Add User Message to screen
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsBotThinking(true);

    // 2. Prepare AI history for context
    const chatHistory = messages.map(m => ({
      role: m.isAi ? 'model' : 'user',
      text: m.text || ''
    }));

    // 3. Create a blank AI message that we will fill chunk by chunk
    const aiMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: aiMessageId,
      senderId: 'ai',
      senderName: 'Nexus AI',
      text: '', // Start empty
      timestamp: Date.now(),
      isAi: true
    }]);

    let accumulatedText = "";

    // 4. Start Streaming from Gemini
    await streamChatResponse(userMsgText, chatHistory, (newChunk) => {
      accumulatedText += newChunk;
      // Update only the specific AI message with the new text
      setMessages(prev => prev.map(m => 
        m.id === aiMessageId ? { ...m, text: accumulatedText } : m
      ));
    });

    setIsBotThinking(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* AI Header */}
      <header className="bg-indigo-600 pt-12 pb-6 px-6 shadow-lg flex items-center justify-between">
        <button onClick={onBack} className="p-2 bg-white/10 rounded-xl text-white">
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h2 className="text-white font-black text-lg">Nexus AI Assistant</h2>
          <div className="flex items-center justify-center space-x-1">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-[10px] text-indigo-100 font-bold uppercase tracking-widest">Real-time Stream</span>
          </div>
        </div>
        <button className="p-2 text-white/50"><RefreshCw size={20} /></button>
      </header>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.isAi ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] px-5 py-3 rounded-[24px] shadow-sm ${
              m.isAi ? 'bg-white text-slate-800 rounded-tl-none border border-slate-100' : 'bg-indigo-600 text-white rounded-tr-none'
            }`}>
              <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{m.text}</p>
              {m.isAi && !m.text && <Loader2 size={16} className="animate-spin text-indigo-400 my-1" />}
              <span className="text-[8px] opacity-40 mt-2 block font-bold uppercase">
                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isBotThinking && !messages[messages.length-1].text && (
          <div className="flex justify-start">
             <div className="bg-white p-3 rounded-2xl border border-slate-100 italic text-slate-400 text-xs">AI is thinking...</div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-6 pb-10 bg-white border-t border-slate-100">
        <div className="flex items-center space-x-3 bg-slate-100 rounded-[28px] px-4 py-2 border border-slate-200">
          <input 
            type="text" 
            placeholder="Type a question..."
            className="flex-1 bg-transparent border-none py-3 text-sm font-bold outline-none text-slate-900"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button 
            onClick={handleSendMessage}
            disabled={!input.trim() || isBotThinking}
            className={`p-3 rounded-2xl transition-all ${input.trim() ? 'bg-indigo-600 text-white shadow-md active:scale-90' : 'bg-slate-300 text-white'}`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiChatView;
