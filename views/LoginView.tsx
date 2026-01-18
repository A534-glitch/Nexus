
import React, { useState } from 'react';
import { ShieldCheck, GraduationCap, Sparkles, ChevronRight } from 'lucide-react';

interface LoginViewProps {
  onLogin: (name: string) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onLogin(name);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center px-6 relative overflow-hidden bg-white">
      {/* Soft Ambient Background Glows */}
      <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] bg-indigo-50 blur-[120px] rounded-full opacity-60"></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-violet-50 blur-[120px] rounded-full opacity-60"></div>

      <div className="w-full max-w-sm space-y-10 relative z-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-indigo-600 rounded-[28px] shadow-2xl shadow-indigo-200 float-animation">
            <GraduationCap className="text-white" size={40} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-1">Nexus</h1>
            <div className="flex items-center justify-center space-x-2">
              <span className="h-[1px] w-4 bg-slate-200"></span>
              <p className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em]">Student Ecosystem</p>
              <span className="h-[1px] w-4 bg-slate-200"></span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="group">
                <label htmlFor="name" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Full Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600/50 focus:bg-white transition-all outline-none placeholder:text-slate-300 font-bold text-sm"
                  placeholder="Arjun Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="group">
                <label htmlFor="email" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Email Address</label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600/50 focus:bg-white transition-all outline-none placeholder:text-slate-300 font-bold text-sm"
                  placeholder="arjun@nexus.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="group w-full py-5 bg-slate-900 hover:bg-black text-white font-black rounded-2xl shadow-xl shadow-slate-200 transition-all transform active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              <span className="uppercase tracking-[0.15em] text-xs">Sign In to Campus</span>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        <div className="space-y-6 text-center">
          <div className="flex items-center justify-center space-x-8">
             <div className="flex flex-col items-center space-y-1.5">
               <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600"><ShieldCheck size={20} /></div>
               <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Verified</span>
             </div>
             <div className="flex flex-col items-center space-y-1.5">
               <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600"><Sparkles size={20} /></div>
               <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">AI Enabled</span>
             </div>
          </div>
          <div className="flex flex-col space-y-1">
            <p className="text-[9px] text-slate-300 font-black uppercase tracking-[0.3em]">Developed for Indian Students</p>
            <p className="text-[8px] text-slate-200 font-bold uppercase tracking-[0.1em]">© 2025 Nexus Digital Labs</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
