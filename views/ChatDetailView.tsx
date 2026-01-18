
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Phone, Video, Send, Plus, MoreVertical, CornerUpLeft, X, Tag, Trash2, RotateCcw, MessageCircle, Camera, Mic, Image as ImageIcon } from 'lucide-react';
import { User, Message } from '../types';
import { getChatResponse } from '../services/gemini';

interface ChatDetailViewProps {
  chatId: string;
  onBack: () => void;
  currentUser: User;
  initialOffer?: number;
}

const ChatDetailView: React.FC<ChatDetailViewProps> = ({ chatId, onBack, currentUser, initialOffer }) => {
  const [msg, setMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm1', senderId: 'them', senderName: 'Priya Patel', text: 'Hey! Is that iPad still available?', timestamp: Date.now() - 3600000 },
    { id: 'm2', senderId: currentUser.id, senderName: currentUser.name, text: 'Yes, it is. Are you interested in a quick deal?', timestamp: Date.now() - 3500000 },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const triggerAiResponse = async (userText: string) => {
    setIsTyping(true);
    const aiResponse = await getChatResponse("Context of deal", userText, "Priya Patel");
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        senderId: 'them',
        senderName: 'Priya Patel',
        text: aiResponse || "That sounds great, let's discuss!",
        timestamp: Date.now()
      }]);
    }, 2000);
  };

  const handleSend = () => {
    if (!msg.trim()) return;
    const newMessage = { 
      id: Date.now().toString(), 
      senderId: currentUser.id, 
      senderName: currentUser.name, 
      text: msg, 
      timestamp: Date.now() 
    };
    setMessages(prev => [...prev, newMessage]);
    setMsg('');
    triggerAiResponse(msg);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        const newMessage: Message = {
          id: Date.now().toString(),
          senderId: currentUser.id,
          senderName: currentUser.name,
          image: imageData,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, newMessage]);
        triggerAiResponse("I've shared a photo of the item.");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f7f6]">
      <header className="px-5 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between sticky top-0 z-[100]">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack} 
            className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-900 rounded-full shadow-sm hover:bg-white active:scale-75 transition-all duration-300 ring-4 ring-slate-50"
            aria-label="Back"
          >
            <ChevronLeft size={24} strokeWidth={3} />
          </button>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img src="https://picsum.photos/seed/Priya/100" className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-50" alt="" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white ring-2 ring-emerald-100"></div>
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 leading-none">Priya Patel</h3>
              <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-1">Active Now</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2.5 hover:bg-slate-100 rounded-2xl text-slate-900 transition-all active:scale-90"><Phone size={20} /></button>
          <button className="p-2.5 hover:bg-slate-100 rounded-2xl text-slate-900 transition-all active:scale-90"><Video size={20} /></button>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 hide-scrollbar">
        <div className="flex flex-col items-center py-6">
           <div className="px-4 py-1.5 bg-slate-200/50 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Today</div>
        </div>
        
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.senderId === currentUser.id ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
             <div className={`max-w-[75%] rounded-[24px] shadow-sm text-sm font-medium leading-relaxed overflow-hidden ${
               m.senderId === currentUser.id 
               ? 'bg-indigo-600 text-white rounded-tr-none' 
               : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
             }`}>
                {m.image && (
                  <div className="p-1">
                    <img src={m.image} className="w-full h-auto rounded-2xl object-cover max-h-64" alt="Shared" />
                  </div>
                )}
                {m.text && <p className="px-4 py-3">{m.text}</p>}
                <div className={`px-4 pb-2 text-[9px] font-bold uppercase tracking-tighter ${m.senderId === currentUser.id ? 'text-indigo-200 text-right' : 'text-slate-300'}`}>
                   {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
             </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex space-x-1.5 items-center">
               <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
               <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
               <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white/80 backdrop-blur-xl border-t border-slate-100 px-4 pt-3 pb-12">
        <div className="flex items-center space-x-2">
           {/* Gallery/File Input */}
           <input 
             type="file" 
             ref={fileInputRef} 
             className="hidden" 
             accept="image/*" 
             onChange={handleImageUpload} 
           />
           {/* Dedicated Camera Input */}
           <input 
             type="file" 
             ref={cameraInputRef} 
             className="hidden" 
             accept="image/*" 
             capture="environment" 
             onChange={handleImageUpload} 
           />
           
           <button 
             onClick={() => fileInputRef.current?.click()}
             className="p-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all active:scale-90"
             title="Upload Photo"
           >
             <Plus size={22} />
           </button>
           
           <div className="flex-1 bg-slate-100 rounded-3xl flex items-center px-4 py-1.5 border border-slate-200/50 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <input 
                type="text" 
                placeholder="Message..."
                className="flex-1 bg-transparent border-none py-2.5 text-sm font-medium focus:outline-none"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={() => cameraInputRef.current?.click()}
                className="p-2 text-slate-400 hover:text-indigo-600 active:scale-110 transition-transform"
                title="Open Camera"
              >
                <Camera size={20} />
              </button>
           </div>
           
           <button 
             onClick={handleSend}
             disabled={!msg.trim()}
             className={`p-3 rounded-2xl transition-all active:scale-90 ${msg.trim() ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-400'}`}
           >
             <Send size={22} className={msg.trim() ? '-rotate-12' : ''} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDetailView;
