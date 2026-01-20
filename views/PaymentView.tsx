
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { 
  ChevronLeft, ShieldCheck, CreditCard, Landmark, Wallet, 
  CheckCircle2, IndianRupee, Clock, ArrowRight, Smartphone, 
  Shield, Lock, Info, AlertCircle, Check, Delete, X, RefreshCw, Loader2, Zap, Layout, Search, Banknote
} from 'lucide-react';

interface PaymentViewProps {
  product: Product;
  type: 'BUY' | 'RENT';
  onBack: () => void;
  onComplete: () => void;
}

type PaymentStage = 'SELECTION' | 'DETAILS' | 'PIN_ENTRY' | 'PROCESSING' | 'SUCCESS';
type PaymentMethod = 'UPI' | 'CARD' | 'NB';

const PaymentView: React.FC<PaymentViewProps> = ({ product, type, onBack, onComplete }) => {
  const [method, setMethod] = useState<PaymentMethod>('UPI');
  const [stage, setStage] = useState<PaymentStage>('SELECTION');
  const [upiId, setUpiId] = useState('');
  const [pin, setPin] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [processStep, setProcessStep] = useState(0);

  const finalPrice = type === 'BUY' ? product.price : Math.floor(product.price * 0.1);

  const processingSteps = [
    "Establishing Encrypted Tunnel...",
    "Validating P2P Smart Contract...",
    "Interfacing with Bank Gateway...",
    "Confirming Instant Ledger Update..."
  ];

  const popularBanks = [
    { name: 'HDFC Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg' },
    { name: 'SBI', logo: 'https://upload.wikimedia.org/wikipedia/en/5/58/State_Bank_of_India_logo.svg' },
    { name: 'ICICI Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg' },
    { name: 'Axis Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Axis_Bank_logo.svg' },
    { name: 'Kotak Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Kotak_Mahindra_Bank_logo.svg' },
    { name: 'PNB', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Punjab_National_Bank_logo.svg' }
  ];

  const upiApps = [
    { name: 'Google Pay', icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Pay_GPay_Logo.svg' },
    { name: 'PhonePe', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg' },
    { name: 'Paytm', icon: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg' }
  ];

  const cardBrands = {
    VISA: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg',
    MASTERCARD: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
    RUPAY: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Rupay-Logo.svg'
  };

  useEffect(() => {
    if (stage === 'PROCESSING') {
      const interval = setInterval(() => {
        setProcessStep(prev => {
          if (prev < processingSteps.length - 1) return prev + 1;
          clearInterval(interval);
          setStage('SUCCESS');
          return prev;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [stage]);

  const handleCardNumberChange = (val: string) => {
    const numeric = val.replace(/\D/g, '').slice(0, 16);
    const formatted = numeric.match(/.{1,4}/g)?.join(' ') || numeric;
    setCardNumber(formatted);
  };

  const getCardBrand = (): keyof typeof cardBrands | null => {
    if (cardNumber.startsWith('4')) return 'VISA';
    if (cardNumber.startsWith('5')) return 'MASTERCARD';
    if (cardNumber.startsWith('6')) return 'RUPAY';
    return null;
  };

  if (stage === 'SUCCESS') {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white p-10 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl animate-bounce mb-8">
          <CheckCircle2 size={48} strokeWidth={3} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-2 text-center">Transfer Confirmed</h2>
        <p className="text-slate-500 font-bold mb-10 text-center uppercase text-[10px] tracking-widest">ORDER-ID: NEX-{Math.floor(Math.random()*1000000)}</p>
        
        <div className="w-full bg-slate-50 p-8 rounded-[40px] border border-slate-100 space-y-6 shadow-inner">
           <div className="flex justify-between items-center">
             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Beneficiary</span>
             <span className="text-sm font-black text-slate-900">{product.sellerName}</span>
           </div>
           <div className="flex justify-between items-center">
             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Network</span>
             <span className="text-sm font-black text-slate-900">Nexus Secure Pay</span>
           </div>
           <div className="h-[1px] bg-slate-200 w-full" />
           <div className="flex justify-between items-center">
             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Paid Amount</span>
             <span className="text-2xl font-black text-emerald-600 tracking-tighter">₹{finalPrice.toLocaleString('en-IN')}</span>
           </div>
        </div>
        
        <button onClick={onComplete} className="w-full py-6 bg-slate-900 text-white rounded-[28px] font-black uppercase tracking-[0.2em] text-xs mt-12 shadow-2xl active:scale-95 transition-all">
           Back to Campus Hub
        </button>
      </div>
    );
  }

  if (stage === 'PROCESSING') {
    return (
      <div className="h-full bg-white flex flex-col items-center justify-center p-8">
        <div className="w-24 h-24 relative mb-12">
           <div className="absolute inset-0 bg-indigo-500/10 rounded-full animate-ping" />
           <div className="absolute inset-4 bg-indigo-600 rounded-full flex items-center justify-center shadow-xl">
              <RefreshCw size={32} className="text-white animate-spin" />
           </div>
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2 text-center">{processingSteps[processStep]}</h2>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">AES-256 BANK GRADE SECURITY</p>
      </div>
    );
  }

  if (stage === 'PIN_ENTRY') {
    return (
      <div className="h-full bg-white flex flex-col animate-in slide-in-from-bottom duration-500">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white z-20">
           <button onClick={() => setStage('DETAILS')} className="p-3 bg-slate-100 rounded-2xl"><ChevronLeft size={20} /></button>
           <div className="flex flex-col items-center">
             <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" className="h-4 mb-1" alt="UPI" />
             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Secure PIN Access</span>
           </div>
           <div className="w-10" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center space-y-12 px-8">
           <div className="text-center space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confirm Payment</p>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">₹{finalPrice.toLocaleString('en-IN')}</h1>
           </div>
           <div className="flex space-x-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`w-5 h-5 rounded-full border-4 transition-all duration-300 ${i < pin.length ? 'bg-indigo-600 border-indigo-600 scale-125 shadow-lg' : 'border-slate-100'}`} />
              ))}
           </div>
           <div className="flex items-center space-x-2 text-slate-400">
              <Shield size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">Encrypted via Nexus P2P Vault</span>
           </div>
        </div>

        <div className="bg-slate-50 grid grid-cols-3 gap-0.5 p-0.5 border-t border-slate-200 pb-16">
           {['1','2','3','4','5','6','7','8','9','DEL','0','OK'].map(key => (
             <button 
              key={key}
              onClick={() => {
                if (key === 'DEL') setPin(prev => prev.slice(0,-1));
                else if (key === 'OK') stage === 'PIN_ENTRY' && setStage('PROCESSING');
                else if (pin.length < 6) setPin(prev => prev + key);
              }}
              className={`h-24 text-2xl font-black flex items-center justify-center transition-all ${key === 'OK' ? 'bg-indigo-600 text-white shadow-inner' : 'bg-white text-slate-900 active:bg-slate-100 active:scale-95'}`}
             >
               {key === 'DEL' ? <Delete size={28} /> : key === 'OK' ? <Check size={40} strokeWidth={4} /> : key}
             </button>
           ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="px-6 py-8 bg-white border-b border-slate-100 flex items-center sticky top-0 z-40">
        <button onClick={stage === 'DETAILS' ? () => setStage('SELECTION') : onBack} className="p-3 bg-slate-100 text-slate-900 rounded-2xl mr-4 hover:bg-slate-200 transition-all"><ChevronLeft size={20} /></button>
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">Safe Checkout</h1>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">PEER-TO-PEER ENCRYPTION</p>
        </div>
      </header>

      <div className="flex-1 p-6 space-y-8 overflow-y-auto hide-scrollbar">
         {stage === 'SELECTION' && (
           <div className="space-y-8 animate-in slide-in-from-right duration-300">
              <div className="bg-white p-6 rounded-[40px] flex items-center space-x-5 border border-slate-100 shadow-sm">
                 <div className="w-16 h-16 rounded-[24px] overflow-hidden shadow-inner">
                    <img src={product.image} className="w-full h-full object-cover" alt="" />
                 </div>
                 <div className="flex-1">
                    <h3 className="text-sm font-black text-slate-900 leading-tight mb-1">{product.title}</h3>
                    <p className="text-xs font-black text-indigo-600 tracking-tighter">Total Due: ₹{finalPrice.toLocaleString('en-IN')}</p>
                 </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Verified Methods</h4>
                
                <div className="grid gap-3">
                   <button onClick={() => setMethod('UPI')} className={`w-full p-6 rounded-[32px] border-2 transition-all flex items-center justify-between ${method === 'UPI' ? 'border-indigo-600 bg-indigo-50 shadow-xl' : 'border-white bg-white shadow-sm'}`}>
                      <div className="flex items-center space-x-5">
                         <div className={`p-4 rounded-2xl ${method === 'UPI' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}><Smartphone size={24} /></div>
                         <div className="text-left">
                            <p className="text-sm font-black text-slate-900">UPI Instant</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">GPay, PhonePe, Paytm</p>
                       </div>
                    </div>
                    {method === 'UPI' && <CheckCircle2 className="text-indigo-600" size={24} />}
                 </button>

                 <button onClick={() => setMethod('CARD')} className={`w-full p-6 rounded-[32px] border-2 transition-all flex items-center justify-between ${method === 'CARD' ? 'border-indigo-600 bg-indigo-50 shadow-xl' : 'border-white bg-white shadow-sm'}`}>
                    <div className="flex items-center space-x-5">
                       <div className={`p-4 rounded-2xl ${method === 'CARD' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}><CreditCard size={24} /></div>
                       <div className="text-left">
                          <p className="text-sm font-black text-slate-900">Cards</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Visa, Master, RuPay</p>
                       </div>
                    </div>
                    {method === 'CARD' && <CheckCircle2 className="text-indigo-600" size={24} />}
                 </button>

                 <button onClick={() => setMethod('NB')} className={`w-full p-6 rounded-[32px] border-2 transition-all flex items-center justify-between ${method === 'NB' ? 'border-indigo-600 bg-indigo-50 shadow-xl' : 'border-white bg-white shadow-sm'}`}>
                    <div className="flex items-center space-x-5">
                       <div className={`p-4 rounded-2xl ${method === 'NB' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}><Landmark size={24} /></div>
                       <div className="text-left">
                          <p className="text-sm font-black text-slate-900">Net Banking</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">India's Top Banks</p>
                       </div>
                    </div>
                    {method === 'NB' && <CheckCircle2 className="text-indigo-600" size={24} />}
                 </button>
                </div>
              </div>
           </div>
         )}

         {/* UPI Details */}
         {stage === 'DETAILS' && method === 'UPI' && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
               <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-xl text-center">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8">Choose App</h4>
                  <div className="grid grid-cols-3 gap-6 mb-10">
                     {upiApps.map(app => (
                        <button key={app.name} className="flex flex-col items-center space-y-2 group">
                           <div className="w-16 h-16 rounded-[22px] bg-white border border-slate-100 flex items-center justify-center p-3 group-active:scale-95 transition-all shadow-sm">
                              <img src={app.icon} className="w-full h-full object-contain" alt="" />
                           </div>
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{app.name}</span>
                        </button>
                     ))}
                  </div>
                  <div className="relative mb-8">
                     <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                     <div className="relative flex justify-center"><span className="bg-white px-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">or Enter VPA</span></div>
                  </div>
                  <input 
                    className="w-full bg-slate-50 border-none py-6 px-8 rounded-[32px] font-black text-base text-center outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all mb-4"
                    placeholder="student@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                  <div className="flex items-center justify-center space-x-2 text-indigo-400">
                    <ShieldCheck size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">NPCI Authenticated</span>
                  </div>
               </div>
            </div>
         )}

         {/* Card Details */}
         {stage === 'DETAILS' && method === 'CARD' && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
               <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-xl space-y-6">
                  <div className="relative">
                    <input 
                      className="w-full bg-slate-50 border-none py-6 px-8 rounded-[32px] font-black text-base outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 h-6 flex items-center space-x-2">
                       {getCardBrand() ? (
                         <img src={cardBrands[getCardBrand()!]} className="h-full object-contain" alt={getCardBrand()!} />
                       ) : (
                         <div className="flex space-x-1 opacity-20">
                            <img src={cardBrands.VISA} className="h-4" alt="" />
                            <img src={cardBrands.MASTERCARD} className="h-4" alt="" />
                         </div>
                       )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <input 
                      className="bg-slate-50 border-none py-5 px-8 rounded-[24px] font-black text-sm outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all text-center"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                     />
                     <input 
                       type="password"
                       className="w-full bg-slate-50 border-none py-5 px-8 rounded-[24px] font-black text-sm outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all text-center"
                       placeholder="CVV"
                       value={cvv}
                       onChange={(e) => setCvv(e.target.value.slice(0,3))}
                     />
                  </div>
                  <div className="flex items-center space-x-3 text-slate-400 bg-slate-50/50 p-4 rounded-2xl">
                     <Lock size={14} />
                     <span className="text-[9px] font-black uppercase tracking-widest leading-none">PCI-DSS Compliant Gateway</span>
                  </div>
               </div>
            </div>
         )}

         {/* Net Banking */}
         {stage === 'DETAILS' && method === 'NB' && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
               <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-xl">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 text-center">Select Bank</h4>
                  <div className="grid grid-cols-2 gap-4">
                     {popularBanks.map(bank => (
                        <button 
                          key={bank.name} 
                          onClick={() => setSelectedBank(bank.name)}
                          className={`p-6 rounded-[28px] border-2 flex flex-col items-center justify-center transition-all h-32 ${selectedBank === bank.name ? 'border-indigo-600 bg-indigo-50 shadow-lg' : 'border-slate-50 bg-white'}`}
                        >
                           <img src={bank.logo} className="h-10 w-auto object-contain mb-3" alt={bank.name} />
                           <span className="text-[9px] font-black text-slate-900 uppercase tracking-tighter text-center">{bank.name}</span>
                        </button>
                     ))}
                  </div>
                  <button className="w-full mt-6 py-5 border-2 border-dashed border-slate-200 rounded-[28px] text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-center space-x-2">
                     <Search size={14} /> <span>View All Banks</span>
                  </button>
               </div>
            </div>
         )}
      </div>

      <footer className="p-8 bg-white border-t border-slate-100 rounded-t-[56px] shadow-2xl space-y-6">
         <div className="flex items-center justify-between px-4">
            <div className="flex items-center space-x-2 opacity-50">
               <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Secure Payments by</span>
               <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Razorpay_logo.png" className="h-2.5" alt="Razorpay" />
            </div>
            <div className="flex items-center space-x-3 opacity-30">
               <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" className="h-3" alt="UPI" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Rupay-Logo.svg" className="h-3" alt="RuPay" />
            </div>
         </div>
         
         <button 
          onClick={() => {
            if (stage === 'SELECTION') setStage('DETAILS');
            else if (method === 'UPI') setStage('PIN_ENTRY');
            else setStage('PROCESSING');
          }}
          disabled={
            (stage === 'DETAILS' && method === 'UPI' && !upiId) ||
            (stage === 'DETAILS' && method === 'CARD' && (cardNumber.length < 16 || !expiry || !cvv)) ||
            (stage === 'DETAILS' && method === 'NB' && !selectedBank)
          }
          className="w-full py-6 bg-slate-900 text-white rounded-[28px] font-black flex items-center justify-center space-x-3 shadow-2xl active:scale-95 transition-all disabled:opacity-30"
         >
            <span className="uppercase tracking-[0.2em] text-xs">
              {stage === 'SELECTION' ? 'Continue Payment' : `Pay ₹${finalPrice.toLocaleString('en-IN')}`}
            </span>
            <ArrowRight size={20} />
         </button>
      </footer>
    </div>
  );
};

export default PaymentView;
