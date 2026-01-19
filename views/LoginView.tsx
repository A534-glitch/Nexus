
import React, { useState } from 'react';
import { 
  GraduationCap, 
  Smartphone, 
  Lock, 
  UserPlus, 
  ArrowRight,
  Eye,
  EyeOff,
  ChevronLeft,
  Mail,
  CheckCircle2,
  User as UserIcon,
  AtSign,
  Plus,
  ShieldCheck
} from 'lucide-react';

interface LoginViewProps {
  onLogin: (name: string) => void;
}

type AuthMode = 'LANDING' | 'LOGIN' | 'FORGOT' | 'FORGOT_SUCCESS' | 'SIGNUP' | 'SIGNUP_SUCCESS';

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('LANDING');
  const [isLoading, setIsLoading] = useState(false);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [displayName, setDisplayName] = useState('');

  // Forgot Password State
  const [resetEmail, setResetEmail] = useState('');

  // Signup State
  const [signupEmail, setSignupEmail] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (displayName.trim() || loginEmail.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        onLogin(displayName || loginEmail.split('@')[0]);
      }, 1200);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API registration
    setTimeout(() => {
      setIsLoading(false);
      setMode('SIGNUP_SUCCESS');
    }, 1800);
  };

  const handleResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetEmail.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setMode('FORGOT_SUCCESS');
      }, 1500);
    }
  };

  const handleFinishSignup = () => {
    onLogin(signupName || signupUsername);
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden relative font-['Plus_Jakarta_Sans']">
      {/* Dynamic Ambient Backgrounds */}
      <div className="absolute top-[-5%] right-[-10%] w-[350px] h-[350px] bg-indigo-50/50 rounded-full blur-[90px] pointer-events-none transition-all duration-1000"></div>
      <div className="absolute bottom-[-5%] left-[-10%] w-[350px] h-[350px] bg-rose-50/30 rounded-full blur-[90px] pointer-events-none transition-all duration-1000"></div>
      
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10 max-w-sm mx-auto w-full">
        
        {/* --- LANDING MODE --- */}
        {mode === 'LANDING' && (
          <div className="w-full flex flex-col items-center text-center animate-in fade-in zoom-in duration-700">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-indigo-600 rounded-[32px] shadow-2xl shadow-indigo-200 mb-8 transform hover:scale-105 transition-transform duration-500">
              <GraduationCap size={52} className="text-white" strokeWidth={2.5} />
            </div>
            
            <h1 className="text-6xl font-[900] text-slate-900 tracking-tighter italic mb-2">
              Nexus
            </h1>
            <p className="text-sm font-bold text-slate-400 mb-12 max-w-[240px] leading-relaxed">
              The professional peer-to-peer ecosystem for students.
            </p>

            <div className="w-full space-y-4">
              <button
                onClick={() => setMode('SIGNUP')}
                className="w-full py-5 bg-indigo-600 text-white font-black rounded-[24px] shadow-xl shadow-indigo-100 flex items-center justify-center space-x-3 active:scale-[0.98] transition-all group"
              >
                <Plus size={20} strokeWidth={3} />
                <span className="uppercase tracking-[0.2em] text-xs">Create New Account</span>
              </button>

              <button
                onClick={() => setMode('LOGIN')}
                className="w-full py-5 bg-white border-2 border-slate-100 text-slate-900 font-black rounded-[24px] flex items-center justify-center space-x-2 active:scale-[0.98] transition-all hover:bg-slate-50"
              >
                <span className="uppercase tracking-[0.2em] text-xs">Log In</span>
              </button>
            </div>
          </div>
        )}

        {/* --- LOGIN MODE --- */}
        {mode === 'LOGIN' && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col items-center mb-10">
              <h1 className="text-5xl font-[900] text-slate-900 tracking-tighter italic mb-1">Nexus</h1>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Welcome Back</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <input
                type="text"
                required
                className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-5 py-4 rounded-[20px] focus:border-indigo-400 focus:bg-white transition-all outline-none placeholder:text-slate-400 font-semibold text-sm shadow-sm"
                placeholder="Email or Username"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-5 py-4 rounded-[20px] focus:border-indigo-400 focus:bg-white transition-all outline-none placeholder:text-slate-400 font-semibold text-sm shadow-sm pr-12"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <input
                type="text"
                required
                className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-5 py-4 rounded-[20px] focus:border-indigo-400 focus:bg-white transition-all outline-none placeholder:text-slate-400 font-semibold text-sm shadow-sm"
                placeholder="Display Name (Profile)"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[20px] shadow-xl shadow-indigo-100 transition-all transform active:scale-[0.98] text-[11px] uppercase tracking-[0.2em] mt-6 flex items-center justify-center space-x-2"
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

              <button
                type="button"
                onClick={() => setMode('LANDING')}
                className="w-full py-4 bg-white border border-slate-200 text-slate-600 font-black rounded-[20px] transition-all transform active:scale-[0.98] text-[11px] uppercase tracking-[0.2em] flex items-center justify-center space-x-2"
              >
                <ChevronLeft size={16} strokeWidth={3} />
                <span>Go Back</span>
              </button>
            </form>

            <div className="flex flex-col items-center space-y-5 pt-8">
              <button 
                onClick={() => setMode('FORGOT')}
                className="text-[10px] text-slate-400 font-bold hover:text-indigo-600 transition-colors uppercase tracking-widest"
              >
                Forgotten Password?
              </button>
              
              <div className="w-full flex items-center space-x-4">
                <div className="flex-1 h-[1px] bg-slate-100"></div>
                <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest">or</span>
                <div className="flex-1 h-[1px] bg-slate-100"></div>
              </div>

              <button 
                onClick={() => setMode('SIGNUP')}
                className="text-xs text-indigo-600 font-black uppercase tracking-widest hover:text-indigo-800 transition-colors py-1"
              >
                Create New Account
              </button>
            </div>
          </div>
        )}

        {/* --- SIGNUP MODE --- */}
        {mode === 'SIGNUP' && (
          <div className="w-full animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-8">
               <h1 className="text-4xl font-[900] text-slate-900 tracking-tighter italic mb-2">Nexus</h1>
               <p className="text-sm text-slate-500 font-bold px-6 leading-relaxed">
                 Sign up to join the largest campus marketplace in the country.
               </p>
            </div>

            <form onSubmit={handleSignupSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input
                  type="email"
                  required
                  className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-5 py-4 pl-11 rounded-[20px] focus:border-indigo-400 focus:bg-white transition-all outline-none placeholder:text-slate-400 font-semibold text-sm shadow-sm"
                  placeholder="Campus Email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input
                  type="text"
                  required
                  className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-5 py-4 pl-11 rounded-[20px] focus:border-indigo-400 focus:bg-white transition-all outline-none placeholder:text-slate-400 font-semibold text-sm shadow-sm"
                  placeholder="Full Name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                />
              </div>
              <div className="relative">
                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input
                  type="text"
                  required
                  className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-5 py-4 pl-11 rounded-[20px] focus:border-indigo-400 focus:bg-white transition-all outline-none placeholder:text-slate-400 font-semibold text-sm shadow-sm"
                  placeholder="Username"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input
                  type="password"
                  required
                  className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-5 py-4 pl-11 rounded-[20px] focus:border-indigo-400 focus:bg-white transition-all outline-none placeholder:text-slate-400 font-semibold text-sm shadow-sm"
                  placeholder="Password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                />
              </div>

              <p className="text-[9px] text-slate-400 font-bold text-center px-6 pt-2">
                By signing up, you agree to our <span className="text-slate-600">Terms</span>, <span className="text-slate-600">Data Policy</span> and <span className="text-slate-600">Cookies Policy</span>.
              </p>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[20px] shadow-xl shadow-indigo-100 transition-all transform active:scale-[0.98] text-[11px] uppercase tracking-[0.2em] mt-4 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span>Sign Up</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setMode('LANDING')}
                className="w-full py-4 bg-white border border-slate-200 text-slate-600 font-black rounded-[20px] transition-all transform active:scale-[0.98] text-[11px] uppercase tracking-[0.2em] mt-2 flex items-center justify-center space-x-2"
              >
                <ChevronLeft size={16} strokeWidth={3} />
                <span>Go Back</span>
              </button>
            </form>

            <div className="mt-8 border-t border-slate-100 pt-6 text-center">
              <p className="text-[11px] text-slate-500 font-bold">
                Already have an account?{' '}
                <button 
                  onClick={() => setMode('LOGIN')}
                  className="text-indigo-600 font-black uppercase tracking-widest hover:underline"
                >
                  Log In
                </button>
              </p>
            </div>
          </div>
        )}

        {/* --- SIGNUP SUCCESS --- */}
        {mode === 'SIGNUP_SUCCESS' && (
          <div className="w-full text-center animate-in fade-in zoom-in duration-500">
             <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[32px] mb-8 shadow-inner">
               <CheckCircle2 size={44} strokeWidth={2.5} />
             </div>
             <h2 className="text-3xl font-[900] text-slate-900 tracking-tight mb-4 italic">Welcome to Nexus!</h2>
             <p className="text-sm text-slate-500 font-medium px-4 mb-10 leading-relaxed">
               Your campus account has been successfully created. Join the peer marketplace and start trading today.
             </p>
             <button
               onClick={handleFinishSignup}
               className="w-full py-5 bg-slate-900 text-white font-black rounded-[24px] shadow-2xl transition-all transform active:scale-[0.98] text-xs uppercase tracking-[0.2em]"
             >
               Get Started
             </button>
          </div>
        )}

        {/* --- FORGOT PASSWORD MODE --- */}
        {mode === 'FORGOT' && (
          <div className="w-full animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 border-2 border-slate-100 rounded-[28px] shadow-sm mb-6 text-slate-900">
                <Lock size={44} strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Trouble logging in?</h2>
              <p className="text-sm text-slate-500 font-medium px-4">
                Enter your email or username and we'll send you a link to get back into your account.
              </p>
            </div>

            <form onSubmit={handleResetRequest} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="text"
                  required
                  className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-5 py-4 pl-12 rounded-[20px] focus:border-indigo-400 focus:bg-white transition-all outline-none placeholder:text-slate-400 font-semibold text-sm shadow-sm"
                  placeholder="Email or Username"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[20px] shadow-xl shadow-indigo-100 transition-all transform active:scale-[0.98] text-[11px] uppercase tracking-[0.2em] flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span>Send Login Link</span>
                )}
              </button>
            </form>

            <button 
              onClick={() => setMode('LOGIN')}
              className="w-full mt-12 py-5 border-t border-slate-100 flex items-center justify-center space-x-2 text-slate-900 font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft size={16} strokeWidth={3} />
              <span>Back to login</span>
            </button>
          </div>
        )}

        {/* --- FORGOT SUCCESS --- */}
        {mode === 'FORGOT_SUCCESS' && (
          <div className="w-full text-center animate-in fade-in zoom-in duration-500">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[28px] shadow-sm mb-8">
              <CheckCircle2 size={44} strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-3">Email Sent</h2>
            <p className="text-sm text-slate-500 font-medium mb-8 px-4 leading-relaxed">
              We've sent a link to <span className="text-slate-900 font-black">{resetEmail}</span>. Click that link to get back into your account.
            </p>
            <button
              onClick={() => setMode('LOGIN')}
              className="w-full py-4 bg-slate-900 text-white font-black rounded-[20px] shadow-xl transition-all transform active:scale-[0.98] text-[11px] uppercase tracking-[0.2em]"
            >
              OK
            </button>
          </div>
        )}
      </div>

      {/* Corporate Style Footer */}
      <footer className="w-full px-8 pb-12 flex flex-col items-center space-y-6 relative z-10 mt-auto">
        <div className="flex flex-col items-center space-y-3">
           <div className="flex items-center space-x-3 text-slate-200">
              <Smartphone size={20} strokeWidth={2.5} />
              <div className="w-[1px] h-4 bg-slate-200"></div>
              <ShieldCheck size={20} strokeWidth={2.5} />
           </div>
           <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Campus Integrity Verified</p>
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
               © 2025 NEXUS DIGITAL LABS • BUILT FOR STUDENTS
             </p>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginView;
