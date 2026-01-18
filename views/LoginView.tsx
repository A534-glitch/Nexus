
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  GraduationCap, 
  Smartphone, 
  Lock, 
  UserPlus, 
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Info
} from 'lucide-react';

interface LoginViewProps {
  onLogin: (name: string) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setIsLoading(true);
      // Simulated professional authentication delay
      setTimeout(() => {
        onLogin(name);
      }, 1200);
    }
  };

  const handleForgotPassword = () => {
    alert("Verification link sent! Please check your university email inbox to reset your password. 🛡️");
  };

  const handleCreateAccount = () => {
    alert("Nexus is currently in private beta for selected campuses. New account creation requires a referral code from your student representative. 🎓");
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden relative font-['Plus_Jakarta_Sans']">
      {/* Premium Background Ambiance */}
      <div className="absolute top-[-10%] right-[-15%] w-[400px] h-[400px] bg-indigo-50/40 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-15%] w-[400px] h-[400px] bg-rose-50/40 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10 max-w-sm mx-auto w-full">
        {/* Branding Section */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-[30px] shadow-2xl shadow-indigo-200 mb-6 transform -rotate-2 hover:rotate-0 transition-transform duration-500 group">
            <GraduationCap size={44} className="text-white group-hover:scale-110 transition-transform" strokeWidth={2.5} />
          </div>
          <h1 className="text-5xl font-[900] text-slate-900 tracking-tighter italic mb-2">
            Nexus
          </h1>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">
            The Student Marketplace
          </p>
        </div>

        {/* Primary Login Card */}
        <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-3">
              <div className="relative group">
                <input
                  type="text"
                  required
                  className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-5 py-4 rounded-[22px] focus:border-indigo-400 focus:bg-white transition-all outline-none placeholder:text-slate-300 font-bold text-sm shadow-sm group-hover:border-slate-200"
                  placeholder="Campus Email or Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-5 py-4 rounded-[22px] focus:border-indigo-400 focus:bg-white transition-all outline-none placeholder:text-slate-300 font-bold text-sm shadow-sm group-hover:border-slate-200 pr-12"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative group">
                <input
                  type="text"
                  required
                  className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-5 py-4 rounded-[22px] focus:border-indigo-400 focus:bg-white transition-all outline-none placeholder:text-slate-300 font-bold text-sm shadow-sm group-hover:border-slate-200"
                  placeholder="Display Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-slate-900 hover:bg-black text-white font-black rounded-[22px] shadow-2xl shadow-slate-200 transition-all transform active:scale-[0.97] text-[11px] uppercase tracking-[0.2em] mt-6 flex items-center justify-center space-x-2 overflow-hidden relative"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Log In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Secondary Actions Area */}
          <div className="flex flex-col items-center space-y-2 pt-2">
            <button 
              onClick={handleForgotPassword}
              className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.2em] hover:text-indigo-800 transition-colors py-1.5"
            >
              Forgot password?
            </button>
            
            <button 
              onClick={handleCreateAccount}
              className="text-[10px] text-slate-900 font-black uppercase tracking-[0.2em] hover:text-indigo-600 transition-colors py-1.5 flex items-center space-x-2"
            >
              <UserPlus size={14} className="text-indigo-600" />
              <span>Create a new account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Corporate Style Footer */}
      <footer className="w-full px-8 pb-12 flex flex-col items-center space-y-6 relative z-10 mt-auto">
        <div className="flex flex-col items-center space-y-3">
           <div className="flex items-center space-x-3 text-slate-200">
              <Smartphone size={20} strokeWidth={2.5} />
              <div className="w-[1px] h-4 bg-slate-200"></div>
              <ShieldCheck size={20} strokeWidth={2.5} />
           </div>
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Campus Integrity Verified</p>
        </div>

        <div className="w-full pt-6 border-t border-slate-50 max-w-sm mx-auto">
           <div className="flex items-center justify-center flex-wrap gap-x-5 gap-y-3 mb-4">
              {['Privacy', 'Terms', 'Safety', 'API'].map((item) => (
                <button key={item} className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                  {item}
                </button>
              ))}
           </div>
           <div className="text-center">
             <p className="text-[8px] text-slate-200 font-black uppercase tracking-[0.5em]">
               © 2025 NEXUS DIGITAL LABS • BUILT FOR EDUCATION
             </p>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginView;
