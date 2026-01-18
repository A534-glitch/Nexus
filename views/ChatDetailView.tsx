
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Phone, Video, Send, Plus, MoreVertical, CornerUpLeft, X, Tag, Trash2, RotateCcw, MessageCircle, Camera, Mic, MicOff, Image as ImageIcon, VideoOff, PhoneOff, Volume2 } from 'lucide-react';
import { User, Message } from '../types';
import { getChatResponse } from '../services/gemini';
import { GoogleGenAI, Modality, LiveServerMessage, Type, FunctionDeclaration, Blob } from '@google/genai';

// --- Audio Helpers for Live API ---
// Implement manual decode function following guidelines
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Implement manual encode function following guidelines
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Implement manual decodeAudioData function following guidelines for raw PCM streaming
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// Fix createBlob return type to use Blob from @google/genai and use supported audio/pcm MIME type
function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

// --- Safety Function Declaration ---
const reportSafetyViolation: FunctionDeclaration = {
  name: 'reportSafetyViolation',
  parameters: {
    type: Type.OBJECT,
    description: 'Call this function immediately if you detect nudity, sexually explicit content, or severe policy violations in the video frames.',
    properties: {
      reason: {
        type: Type.STRING,
        description: 'Brief description of the violation detected (e.g., "nudity detected").',
      },
    },
    required: ['reason'],
  },
};

// --- Live Call Component ---
const LiveCallOverlay = ({ user, callType, onEndCall, currentUser }: { user: any, callType: 'audio' | 'video', onEndCall: () => void, currentUser: User }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(callType === 'audio');
  const [status, setStatus] = useState('Connecting...');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sessionRef = useRef<any>(null);
  const audioContexts = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

  useEffect(() => {
    const startCall = async () => {
      try {
        setStatus('Ringing...');
        // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        audioContexts.current = { input: inputCtx, output: outputCtx };

        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: true, 
          video: callType === 'video' 
        });

        if (videoRef.current && callType === 'video') {
          videoRef.current.srcObject = stream;
        }

        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-12-2025',
          callbacks: {
            onopen: () => {
              setStatus('Connected');
              const source = inputCtx.createMediaStreamSource(stream);
              const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
              scriptProcessor.onaudioprocess = (e) => {
                if (isMuted) return;
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                // Solely rely on sessionPromise resolves to send real-time input
                sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
              };
              source.connect(scriptProcessor);
              scriptProcessor.connect(inputCtx.destination);

              if (callType === 'video') {
                const FRAME_RATE = 1; 
                const interval = setInterval(() => {
                  if (videoRef.current && canvasRef.current && !isVideoOff) {
                    const ctx = canvasRef.current.getContext('2d');
                    canvasRef.current.width = videoRef.current.videoWidth / 4;
                    canvasRef.current.height = videoRef.current.videoHeight / 4;
                    ctx?.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                    const base64Data = canvasRef.current.toDataURL('image/jpeg', 0.5).split(',')[1];
                    // Solely rely on sessionPromise resolves to send real-time input
                    sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64Data, mimeType: 'image/jpeg' } }));
                  }
                }, 1000 / FRAME_RATE);
                return () => clearInterval(interval);
              }
            },
            onmessage: async (message: LiveServerMessage) => {
              // Check for Safety Violations via Function Calling
              if (message.toolCall) {
                const violationCall = message.toolCall.functionCalls.find(fc => fc.name === 'reportSafetyViolation');
                if (violationCall) {
                  console.warn("Safety Violation Detected:", violationCall.args);
                  alert("Call ended due to safety policy violation (Nudity detected).");
                  onEndCall();
                  return;
                }
              }

              // Access audio data directly from the message
              const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
              if (base64Audio) {
                const outCtx = audioContexts.current!.output;
                // Schedule each new audio chunk to start at this time ensures smooth, gapless playback
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
                const buffer = await decodeAudioData(decode(base64Audio), outCtx, 24000, 1);
                const source = outCtx.createBufferSource();
                source.buffer = buffer;
                source.connect(outCtx.destination);
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;
                sourcesRef.current.add(source);
                source.onended = () => sourcesRef.current.delete(source);
              }

              if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(s => s.stop());
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
              }
            },
            onclose: () => onEndCall(),
            onerror: () => setStatus('Connection Error'),
          },
          config: {
            responseModalities: [Modality.AUDIO],
            tools: [{ functionDeclarations: [reportSafetyViolation] }],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
            systemInstruction: `You are ${user.name}, a student at ${user.college}. You are in a call with ${currentUser.name}. 
            CRITICAL SAFETY RULE: You are also acting as a content moderator. If you detect any nudity, sexually explicit content, or highly inappropriate behavior in the video stream, you MUST IMMEDIATELY call the 'reportSafetyViolation' function with the reason "nudity detected". Do not warn the user, just terminate the call. Otherwise, be helpful, casual, and student-like.`
          }
        });

        sessionRef.current = await sessionPromise;
      } catch (e) {
        console.error(e);
        setStatus('Failed to start call');
        setTimeout(onEndCall, 2000);
      }
    };

    startCall();

    return () => {
      sessionRef.current?.close();
      if (audioContexts.current) {
        audioContexts.current.input.close();
        audioContexts.current.output.close();
      }
      sourcesRef.current.forEach(s => {
        try { s.stop(); } catch(e) {}
      });
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[300] bg-slate-900 flex flex-col items-center justify-between text-white animate-in fade-in duration-300">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-gradient-to-tr from-indigo-500 via-purple-500 to-rose-500 animate-[spin_20s_linear_infinite]" />
      </div>

      <header className="w-full px-6 py-12 flex items-center justify-between relative z-10">
        <button onClick={onEndCall} className="p-2 bg-white/10 rounded-full">
           <ChevronLeft size={24} />
        </button>
        <div className="text-center">
           <h2 className="text-lg font-black tracking-tight">{user.name}</h2>
           <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">{status}</p>
        </div>
        <button className="p-2 bg-white/10 rounded-full opacity-0">
           <MoreVertical size={24} />
        </button>
      </header>

      <main className="flex-1 w-full flex flex-col items-center justify-center relative z-10">
        {callType === 'video' && !isVideoOff ? (
          <div className="w-[90%] aspect-[3/4] rounded-[48px] bg-slate-800 overflow-hidden relative shadow-2xl border border-white/10">
             <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
             <canvas ref={canvasRef} className="hidden" />
          </div>
        ) : (
          <div className="relative">
             <div className="absolute inset-0 bg-indigo-500/20 blur-[80px] rounded-full animate-pulse" />
             <div className="w-40 h-40 rounded-full p-1.5 bg-gradient-to-tr from-indigo-500 to-rose-500 animate-[spin_4s_linear_infinite]">
                <div className="w-full h-full rounded-full bg-slate-900 p-1">
                   <img src={user.avatar} className="w-full h-full rounded-full object-cover" alt="" />
                </div>
             </div>
             <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-1 h-8">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1 bg-indigo-400 rounded-full animate-bounce" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }} />
                ))}
             </div>
          </div>
        )}
      </main>

      <footer className="w-full px-10 pb-20 pt-10 flex items-center justify-around relative z-10">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className={`p-5 rounded-full backdrop-blur-md transition-all active:scale-90 ${isMuted ? 'bg-white text-slate-900' : 'bg-white/10 text-white'}`}
        >
          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
        
        <button 
          onClick={onEndCall}
          className="p-6 bg-rose-500 text-white rounded-full shadow-2xl shadow-rose-500/40 active:scale-90 transition-all"
        >
          <PhoneOff size={32} />
        </button>

        {callType === 'video' ? (
          <button 
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-5 rounded-full backdrop-blur-md transition-all active:scale-90 ${isVideoOff ? 'bg-white text-slate-900' : 'bg-white/10 text-white'}`}
          >
            {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
          </button>
        ) : (
          <button className="p-5 bg-white/10 text-white rounded-full backdrop-blur-md">
            <Volume2 size={24} />
          </button>
        )}
      </footer>
    </div>
  );
};

// Define the missing ChatDetailViewProps interface
interface ChatDetailViewProps {
  chatId: string;
  onBack: () => void;
  currentUser: User;
  onNavigateToUserProfile: (user: User) => void;
  initialOffer?: number;
}

const ChatDetailView: React.FC<ChatDetailViewProps> = ({ chatId, onBack, currentUser, onNavigateToUserProfile, initialOffer }) => {
  const [msg, setMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video'>('audio');
  
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

  const handleHeaderClick = () => {
    onNavigateToUserProfile({
      id: 'them',
      name: 'Priya Patel',
      avatar: 'https://picsum.photos/seed/Priya/100',
      college: 'SRCC Delhi'
    });
  };

  const startCall = (type: 'audio' | 'video') => {
    setCallType(type);
    setIsCalling(true);
  };

  const themeUser = {
    id: 'them',
    name: 'Priya Patel',
    avatar: 'https://picsum.photos/seed/Priya/100',
    college: 'SRCC Delhi'
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f7f6]">
      {isCalling && (
        <LiveCallOverlay 
          user={themeUser} 
          callType={callType} 
          currentUser={currentUser}
          onEndCall={() => setIsCalling(false)} 
        />
      )}

      <header className="px-5 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between sticky top-0 z-[100]">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack} 
            className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-900 rounded-full shadow-sm hover:bg-white active:scale-75 transition-all duration-300 ring-4 ring-slate-50"
            aria-label="Back"
          >
            <ChevronLeft size={24} strokeWidth={3} />
          </button>
          <div 
            className="flex items-center space-x-3 cursor-pointer group active:opacity-70 transition-opacity"
            onClick={handleHeaderClick}
          >
            <div className="relative">
              <img src="https://picsum.photos/seed/Priya/100" className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-50" alt="" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white ring-2 ring-emerald-100"></div>
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 leading-none group-hover:text-indigo-600 transition-colors">Priya Patel</h3>
              <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-1">Active Now</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => startCall('audio')} className="p-2.5 hover:bg-slate-100 rounded-2xl text-slate-900 transition-all active:scale-90"><Phone size={20} /></button>
          <button onClick={() => startCall('video')} className="p-2.5 hover:bg-slate-100 rounded-2xl text-slate-900 transition-all active:scale-90"><Video size={20} /></button>
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
