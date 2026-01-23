
import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  Plus,
  ShieldCheck,
  Smartphone,
  Globe,
  Lock,
  Zap,
  Fingerprint
} from 'lucide-react';

interface LoginViewProps {
  onLogin: (name: string) => void;
}

type AuthMode = 'LANDING' | 'SIGNUP_STEP_1' | 'SIGNUP_STEP_2' | 'SIGNUP_FINAL' | 'LOGIN' | 'SUCCESS';

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('LANDING');
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  
  // Signup State
  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [college, setCollege] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, [mode]);

  const handleNext = (nextMode: AuthMode) => {
    setShowContent(false);
    setTimeout(() => setMode(nextMode), 300);
  };

  const handleSignupComplete = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      handleNext('SUCCESS');
    }, 2000);
  };

  const handleFinalEntry = () => {
    onLogin(fullName || userName || "Nexus Pioneer");
  };

  return (
    <div className="h-full flex flex-col bg-[#020617] text-white overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_50%,#312e81_0%,#020617_60%)] opacity-40 pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[-10%] w-[250px] h-[250px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className={`flex-1 flex flex-col px-8 relative z-10 w-full max-w-sm mx-auto transition-all duration-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        
        {mode === 'LANDING' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="relative mb-12 group">
              <div className="w-24 h-24 bg-indigo-600 rounded-[32px] shadow-[0_0_50px_rgba(79,70,229,0.5)] flex items-center justify-center animate-bounce-subtle">
                <GraduationCap size={48} className="text-white" />
              </div>
              <div className="absolute -inset-4 bg-indigo-500/20 rounded-[40px] blur-xl group-hover:bg-indigo-500/40 transition-all duration-700"></div>
            </div>
            
            <h1 className="text-6xl font-black tracking-tighter italic mb-4">Nexus</h1>
            <p className="text-slate-400 font-bold text-sm tracking-wide mb-16 leading-relaxed">
              The professional peer-to-peer ecosystem <br/> exclusive to verified students.
            </p>

            <div className="w-full space-y-4">
              <button 
                onClick={() => handleNext('SIGNUP_STEP_1')}
                className="w-full py-5 bg-white text-slate-900 font-black rounded-[24px] shadow-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all"
              >
                <Plus size={18} strokeWidth={3} />
                <span className="uppercase tracking-widest text-xs">Initialize Identity</span>
              </button>
              
              <button 
                onClick={() => handleNext('LOGIN')}
                className="w-full py-5 bg-white/5 border border-white/10 text-white font-black rounded-[24px] flex items-center justify-center space-x-2 active:scale-95 transition-all backdrop-blur-xl"
              >
                <span className="uppercase tracking-widest text-xs">Enter Existing Node</span>
              </button>
            </div>
          </div>
        )}

        {(mode === 'SIGNUP_STEP_1' || mode === 'SIGNUP_STEP_2' || mode === 'LOGIN') && (
          <div className="pt-24 flex-1 flex flex-col">
            <button 
              onClick={() => handleNext('LANDING')} 
              className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-10 active:scale-90 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            
            <h2 className="text-4xl font-black italic tracking-tighter mb-2">
              {mode === 'LOGIN' ? 'Welcome Back' : 'Setup Node'}
            </h2>
            <p className="text-slate-500 text-sm font-bold mb-10">
              {mode === 'LOGIN' ? 'Verify your identity to resume synchrony.' : `Step ${mode === 'SIGNUP_STEP_1' ? '1' : '2'} of 2: Digital Identity`}
            </p>

            <div className="space-y-4">
              {mode === 'SIGNUP_STEP_1' && (
                <>
                  <InputWithIcon icon={Zap} placeholder="Full Legal Name" value={fullName} onChange={setFullName} />
                  <InputWithIcon icon={Smartphone} placeholder="Campus Username" value={userName} onChange={setUserName} />
                  <button 
                    disabled={!fullName || !userName}
                    onClick={() => handleNext('SIGNUP_STEP_2')}
                    className="w-full py-5 bg-indigo-600 rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-500/20 flex items-center justify-center space-x-2 disabled:opacity-30 transition-all mt-4"
                  >
                    <span>Proceed to Verification</span>
                    <ArrowRight size={16} />
                  </button>
                </>
              )}

              {mode === 'SIGNUP_STEP_2' && (
                <>
                  <InputWithIcon icon={Globe} placeholder="University Institution" value={college} onChange={setCollege} />
                  <InputWithIcon icon={Lock} placeholder="Secure Password" type="password" value={password} onChange={setPassword} />
                  <button 
                    disabled={!college || !password || isLoading}
                    onClick={handleSignupComplete}
                    className="w-full py-5 bg-indigo-600 rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-500/20 flex items-center justify-center space-x-2 disabled:opacity-30 transition-all mt-4"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <span>Initialize Account</span>}
                  </button>
                </>
              )}

              {mode === 'LOGIN' && (
                <>
                  <InputWithIcon icon={Smartphone} placeholder="Username" value={userName} onChange={setUserName} />
                  <InputWithIcon icon={Fingerprint} placeholder="Passcode" type="password" value={password} onChange={setPassword} />
                  <button 
                    disabled={!userName || !password || isLoading}
                    onClick={() => onLogin(userName)}
                    className="w-full py-5 bg-indigo-600 rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-500/20 flex items-center justify-center space-x-2 mt-4"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <span>Verify Session</span>}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {mode === 'SUCCESS' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-emerald-500 text-white rounded-[32px] flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)] mb-8">
              <CheckCircle2 size={48} strokeWidth={3} />
            </div>
            <h2 className="text-4xl font-black tracking-tighter italic mb-4">Node Initialized</h2>
            <p className="text-slate-400 font-bold text-sm tracking-wide mb-12 leading-relaxed px-4">
              Your campus identity has been verified <br/> and automatically saved to the registry.
            </p>
            <button 
              onClick={handleFinalEntry}
              className="w-full py-5 bg-white text-slate-900 font-black rounded-[24px] uppercase tracking-widest text-xs shadow-2xl active:scale-95 transition-all"
            >
              Enter Nexus Hub
            </button>
          </div>
        )}

      </div>

      <footer className="p-8 mt-auto flex flex-col items-center opacity-20 relative z-10">
        <div className="flex items-center space-x-3 mb-2">
          <ShieldCheck size={12} className="text-indigo-400" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em]">Campus Escrow Protected</p>
        </div>
        <p className="text-[8px] font-bold text-slate-500 tracking-widest">© 2025 NEXUS SYSTEM v1.2</p>
      </footer>
    </div>
  );
};

const InputWithIcon = ({ icon: Icon, placeholder, value, onChange, type = "text" }: any) => (
  <div className="relative group">
    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
      <Icon size={18} />
    </div>
    <input 
      type={type}
      placeholder={placeholder}
      className="w-full bg-white/5 border border-white/10 rounded-[24px] py-5 pl-16 pr-6 text-sm font-bold text-white outline-none focus:bg-white/10 focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const Loader2 = ({ className, size }: { className?: string, size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);

export default LoginView;
