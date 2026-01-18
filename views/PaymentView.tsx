
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { 
  ChevronLeft, ShieldCheck, CreditCard, Landmark, Wallet, 
  CheckCircle2, IndianRupee, Clock, ArrowRight, Smartphone, 
  Shield, Lock, Info, AlertCircle, Check, Delete, X, RefreshCw
} from 'lucide-react';

interface PaymentViewProps {
  product: Product;
  type: 'BUY' | 'RENT';
  onBack: () => void;
  onComplete: () => void;
}

type PaymentStage = 'SELECTION' | 'DETAILS' | 'VERIFYING_VPA' | 'PIN_ENTRY' | 'PROCESSING' | 'SUCCESS';

const PaymentView: React.FC<PaymentViewProps> = ({ product, type, onBack, onComplete }) => {
  const [method, setMethod] = useState<'UPI' | 'CARD' | 'NB'>('UPI');
  const [stage, setStage] = useState<PaymentStage>('SELECTION');
  const [upiId, setUpiId] = useState('');
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [processStep, setProcessStep] = useState(0);

  const rentPrice = Math.floor(product.price * 0.1);
  const finalPrice = type === 'BUY' ? product.price : rentPrice;

  const steps = [
    "Securely connecting to NPCI...",
    "Validating student credentials...",
    "Encrypting payment token...",
    "Confirming fund availability..."
  ];

  useEffect(() => {
    if (stage === 'VERIFYING_VPA') {
      const timer = setTimeout(() => setStage('PIN_ENTRY'), 2000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === 'PROCESSING') {
      const interval = setInterval(() => {
        setProcessStep(prev => {
          if (prev < steps.length - 1) return prev + 1;
          clearInterval(interval);
          setStage('SUCCESS');
          return prev;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [stage]);

  const handleInitialPay = () => {
    setStage('DETAILS');
  };

  const handleFinalSubmit = () => {
    if (method === 'UPI') {
      setStage('VERIFYING_VPA');
    } else {
      setStage('PROCESSING');
    }
  };

  const handlePinSubmit = () => {
    if (pin.length >= 4) {
      setStage('PROCESSING');
    }
  };

  const handlePinClick = (num: string) => {
    if (pin.length < 6) setPin(prev => prev + num);
  };

  const handlePinDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const popularApps = [
    { name: 'Google Pay', icon: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg' },
    { name: 'PhonePe', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg' },
    { name: 'Paytm', icon: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg' },
    { name: 'BHIM', icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png' },
  ];

  const popularBanks = [
    { name: 'HDFC Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/HDFC_Bank_Logo.svg' },
    { name: 'SBI', logo: 'https://upload.wikimedia.org/wikipedia/en/5/58/State_Bank_of_India_logo.svg' },
    { name: 'ICICI Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg' },
    { name: 'Axis Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Axis_Bank_logo.svg' },
  ];

  if (stage === 'SUCCESS') {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white p-8 animate-in fade-in zoom-in duration-500">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-emerald-400/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
          <div className="relative w-28 h-28 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl animate-bounce">
            <CheckCircle2 size={56} strokeWidth={2.5} />
          </div>
        </div>
        <h2 className="text-3xl font-black text-slate-900 text-center tracking-tighter">Transaction Successful</h2>
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 mt-6 w-full space-y-3">
          <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
            <span>Reference No.</span>
            <span className="text-slate-900">{Math.floor(Math.random() * 1000000000000)}</span>
          </div>
          <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
            <span>Merchant</span>
            <span className="text-slate-900">Nexus Marketplace</span>
          </div>
          <div className="pt-3 border-t border-slate-200/50 flex justify-between items-center">
            <span className="text-sm font-bold text-slate-900">Total Paid</span>
            <span className="text-xl font-black text-emerald-600">₹{finalPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>
        <button 
          onClick={onComplete}
          className="mt-10 w-full py-5 bg-slate-900 text-white rounded-[24px] font-black uppercase text-xs tracking-widest active:scale-95 transition-all shadow-xl"
        >
          Done
        </button>
      </div>
    );
  }

  if (stage === 'VERIFYING_VPA') {
    return (
      <div className="h-full bg-white flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h3 className="text-lg font-black text-slate-900 mb-2">Verifying VPA</h3>
        <p className="text-sm text-slate-500 font-medium">{upiId}</p>
        <div className="mt-12 flex items-center space-x-2 grayscale opacity-30">
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" className="h-4" alt="UPI" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Secure NPCI Tunnel</span>
        </div>
      </div>
    );
  }

  if (stage === 'PIN_ENTRY') {
    return (
      <div className="h-full bg-slate-100 flex flex-col animate-in slide-in-from-bottom duration-500">
        {/* UPI Standard PIN Interface */}
        <div className="p-6 bg-white shadow-sm flex items-center justify-between border-b border-slate-200">
          <button onClick={() => setStage('DETAILS')} className="text-slate-400"><X size={24} /></button>
          <div className="flex flex-col items-center">
             <div className="bg-indigo-600 px-3 py-1 rounded-lg mb-1 shadow-md">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Secure PIN</span>
             </div>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">NPCI Transaction Gateway</p>
          </div>
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" className="h-4" alt="UPI" />
        </div>

        <div className="flex-1 bg-white p-8 flex flex-col items-center justify-center space-y-10">
          <div className="text-center space-y-2">
            <h4 className="text-slate-400 text-xs font-black uppercase tracking-widest">Paying To</h4>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Nexus Student Marketplace</h2>
            <div className="text-3xl font-black text-indigo-600 tabular-nums">₹{finalPrice.toLocaleString('en-IN')}</div>
          </div>

          <div className="w-full max-w-xs space-y-4">
            <div className="flex justify-between px-2">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enter UPI PIN</span>
               <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Forgot PIN?</span>
            </div>
            <div className="flex justify-center space-x-4 bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-200 ${i < pin.length ? 'bg-indigo-600 border-indigo-600 scale-125' : 'border-slate-300'}`}></div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-world Standard Numeric Pad */}
        <div className="bg-slate-50 grid grid-cols-3 gap-1 p-1 pb-10 border-t border-slate-200">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'delete', '0', 'submit'].map((btn, idx) => {
            if (btn === 'delete') return (
              <button key={idx} onClick={handlePinDelete} className="h-20 flex items-center justify-center text-slate-400 hover:bg-white active:bg-slate-200 transition-all">
                <Delete size={24} />
              </button>
            );
            if (btn === 'submit') return (
              <button key={idx} onClick={handlePinSubmit} disabled={pin.length < 4} className="h-20 flex items-center justify-center bg-indigo-600 text-white disabled:bg-slate-300 transition-all">
                <Check size={32} strokeWidth={3} />
              </button>
            );
            return (
              <button key={idx} onClick={() => handlePinClick(btn)} className="h-20 flex flex-col items-center justify-center text-slate-900 bg-white hover:bg-slate-50 active:bg-slate-100 transition-all">
                <span className="text-2xl font-bold">{btn}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="px-4 py-6 bg-white border-b border-slate-100 flex items-center sticky top-0 z-40">
        <button 
          onClick={stage === 'DETAILS' ? () => setStage('SELECTION') : onBack} 
          className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-900 rounded-full shadow-sm hover:bg-white active:scale-75 transition-all duration-300 ring-4 ring-slate-50 mr-4"
        >
          <ChevronLeft size={24} strokeWidth={3} />
        </button>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Checkout</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-40 hide-scrollbar">
        {/* Real Order Summary */}
        <div className="bg-white p-5 rounded-[32px] border border-slate-100 flex items-center space-x-5 shadow-sm">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-inner bg-slate-50">
            <img src={product.image} className="w-full h-full object-cover" alt="" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-black text-slate-900 truncate">{product.title}</h3>
            <div className="flex items-center space-x-2 mt-1">
               <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${type === 'BUY' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                 {type}
               </span>
               <span className="text-[10px] text-slate-400 font-bold">₹{finalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {stage === 'SELECTION' ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Select Method</h4>
            <div className="space-y-3">
              {[
                { id: 'UPI', label: 'UPI Instant', sub: 'GPay, PhonePe, Paytm', icon: Wallet, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { id: 'CARD', label: 'Debit/Credit Cards', sub: 'Visa, Master, RuPay', icon: CreditCard, color: 'text-rose-500', bg: 'bg-rose-50' },
                { id: 'NB', label: 'Net Banking', sub: 'All Indian Banks', icon: Landmark, color: 'text-amber-500', bg: 'bg-amber-50' }
              ].map((m) => (
                <button 
                  key={m.id}
                  onClick={() => setMethod(m.id as any)}
                  className={`w-full p-6 rounded-[32px] border-2 transition-all flex items-center space-x-4 text-left ${method === m.id ? 'bg-indigo-50/30 border-indigo-600 shadow-xl shadow-indigo-100' : 'bg-white border-white'}`}
                >
                  <div className={`p-3 rounded-2xl ${method === m.id ? 'bg-indigo-600 text-white' : `${m.bg} ${m.color}`}`}>
                    <m.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-900">{m.label}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{m.sub}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${method === m.id ? 'border-indigo-600' : 'border-slate-200'}`}>
                    {method === m.id && <div className="w-3 h-3 bg-indigo-600 rounded-full animate-in zoom-in"></div>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {method === 'UPI' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-3">Popular Apps</h4>
                  <div className="grid grid-cols-4 gap-4">
                    {popularApps.map(app => (
                      <button 
                        key={app.name}
                        onClick={() => { setSelectedApp(app.name); setUpiId(app.name === 'BHIM' ? 'student@upi' : ''); }}
                        className={`flex flex-col items-center space-y-2 p-3 rounded-2xl border-2 transition-all ${selectedApp === app.name ? 'border-indigo-600 bg-indigo-50 shadow-lg' : 'border-white bg-white shadow-sm'}`}
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center bg-white p-2">
                          <img src={app.icon} className="max-w-full max-h-full object-contain" alt={app.name} />
                        </div>
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter truncate w-full text-center">{app.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">VPA Address (UPI ID)</h4>
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="username@bank"
                      className="w-full bg-white border border-slate-100 py-5 px-6 rounded-[24px] font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-600/10 shadow-sm"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 grayscale opacity-30">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" className="h-2" alt="UPI" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {method === 'CARD' && (
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Details</h4>
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 space-y-5 shadow-sm">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Number</label>
                      <input 
                        type="text"
                        placeholder="XXXX XXXX XXXX XXXX"
                        className="w-full bg-slate-50 border border-slate-100 py-4 px-5 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-600/20"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim())}
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiry</label>
                         <input 
                           type="text"
                           placeholder="MM/YY"
                           className="w-full bg-slate-50 border border-slate-100 py-4 px-5 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-600/20"
                           value={cardExpiry}
                           onChange={(e) => setCardExpiry(e.target.value)}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CVV</label>
                         <input 
                           type="password"
                           placeholder="***"
                           maxLength={3}
                           className="w-full bg-slate-50 border border-slate-100 py-4 px-5 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-600/20"
                           value={cardCvv}
                           onChange={(e) => setCardCvv(e.target.value)}
                         />
                      </div>
                   </div>
                </div>
              </div>
            )}

            {method === 'NB' && (
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Bank</h4>
                <div className="grid grid-cols-2 gap-4">
                   {popularBanks.map((bank) => (
                     <button 
                        key={bank.name}
                        onClick={() => setSelectedBank(bank.name)}
                        className={`p-6 rounded-[28px] border-2 flex flex-col items-center justify-center space-y-3 transition-all ${selectedBank === bank.name ? 'bg-indigo-50 border-indigo-600 shadow-lg' : 'bg-white border-white shadow-sm'}`}
                     >
                        <div className="h-8 flex items-center justify-center">
                           <img src={bank.logo} className="max-h-full object-contain" alt={bank.name} />
                        </div>
                        <span className="text-[11px] font-black text-slate-700">{bank.name}</span>
                     </button>
                   ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-white/60 p-5 rounded-[28px] border border-slate-200 flex items-start space-x-3">
           <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
              <ShieldCheck size={18} />
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Safe & Secure Payment</p>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-1">PCI-DSS compliant systems ensure your details are always encrypted.</p>
           </div>
        </div>
      </div>

      <div className="bg-white border-t border-slate-100 p-6 sticky bottom-0 z-50 rounded-t-[48px] shadow-[0_-20px_60px_rgba(0,0,0,0.12)]">
        <div className="flex justify-between items-center mb-6 px-2">
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount to Pay</span>
              <span className="text-3xl font-black text-slate-900 tracking-tighter">₹{finalPrice.toLocaleString('en-IN')}</span>
           </div>
           <div className="flex items-center space-x-3 grayscale opacity-40 scale-90">
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" className="h-3" alt="UPI" />
              <div className="h-4 w-[1px] bg-slate-200"></div>
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/RuPay_logo.svg" className="h-3" alt="RuPay" />
           </div>
        </div>
        
        <button 
          onClick={stage === 'SELECTION' ? handleInitialPay : handleFinalSubmit}
          disabled={stage === 'DETAILS' && (
            (method === 'UPI' && !upiId) || 
            (method === 'CARD' && (!cardNumber || !cardExpiry || !cardCvv)) ||
            (method === 'NB' && !selectedBank)
          )}
          className="w-full bg-slate-900 text-white py-5 rounded-[32px] font-black shadow-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none group"
        >
          <span className="uppercase tracking-[0.2em] text-xs">
            {stage === 'SELECTION' ? 'Continue Checkout' : `Authorize ₹${finalPrice.toLocaleString('en-IN')}`}
          </span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
        
        <div className="mt-5 flex items-center justify-center space-x-2">
           <Lock size={12} className="text-slate-300" />
           <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">NPCI Secured</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentView;
