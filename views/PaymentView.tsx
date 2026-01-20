
import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import { 
  ChevronLeft, ShieldCheck, CreditCard, Landmark, Wallet, 
  CheckCircle2, IndianRupee, Clock, ArrowRight, Smartphone, 
  Shield, Lock, Info, AlertCircle, Check, Delete, X, RefreshCw, Loader2, Zap, Layout, Search, Banknote,
  FileText, Share2, ReceiptText
} from 'lucide-react';

interface PaymentViewProps {
  product: Product;
  type: 'BUY' | 'RENT';
  onBack: () => void;
  onComplete: () => void;
}

type PaymentStage = 'SUMMARY' | 'SELECTION' | 'DETAILS' | 'PIN_ENTRY' | 'PROCESSING' | 'SUCCESS';
type PaymentMethod = 'UPI' | 'CARD' | 'NB';

const PaymentView: React.FC<PaymentViewProps> = ({ product, type, onBack, onComplete }) => {
  const [method, setMethod] = useState<PaymentMethod>('UPI');
  const [stage, setStage] = useState<PaymentStage>('SUMMARY');
  const [upiId, setUpiId] = useState('');
  const [pin, setPin] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [processStep, setProcessStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes timer

  const subtotal = type === 'BUY' ? product.price : (product.rentPrice || Math.floor(product.price * 0.1));
  const convFee = 19;
  const gst = Math.floor(subtotal * 0.18);
  const finalPrice = subtotal + convFee + gst;

  // Generate a stable transaction ID for the session
  const transactionId = useMemo(() => `NX-${Math.floor(Math.random() * 100000000)}`, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShareReceipt = async () => {
    const receiptText = `Nexus Campus Transaction Receipt\n\n` +
      `Transaction ID: ${transactionId}\n` +
      `Merchant: NEXUS CAMPUS PAY\n` +
      `Item: ${product.title}\n` +
      `Seller: ${product.sellerName}\n` +
      `Type: ${type === 'BUY' ? 'Purchase' : 'Rental'}\n` +
      `Amount Paid: ₹${finalPrice.toLocaleString('en-IN')}\n\n` +
      `Verified P2P Exchange via Nexus. 🎓🚀`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Nexus Receipt',
          text: receiptText,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled or failed', err);
      }
    } else {
      // Fallback: Copy to Clipboard
      try {
        await navigator.clipboard.writeText(receiptText);
        alert('Receipt details copied to clipboard!');
      } catch (err) {
        console.error('Clipboard failed', err);
      }
    }
  };

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
    { name: 'GPay', icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Pay_GPay_Logo.svg' },
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
      }, 800);
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
      <div className="h-full flex flex-col items-center justify-center bg-slate-50 p-6 animate-in zoom-in duration-500 overflow-y-auto">
        <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl animate-bounce mb-6">
          <CheckCircle2 size={40} strokeWidth={3} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-1 text-center">Payment Successful</h2>
        <p className="text-slate-400 font-bold mb-8 text-center uppercase text-[9px] tracking-widest">TRANSACTION-ID: {transactionId}</p>
        
        <div className="w-full bg-white p-8 rounded-[40px] border border-slate-200 space-y-5 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <ReceiptText size={100} />
           </div>
           <div className="flex justify-between items-center">
             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Merchant</span>
             <span className="text-xs font-black text-slate-900">NEXUS CAMPUS PAY</span>
           </div>
           <div className="flex justify-between items-center">
             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Seller</span>
             <span className="text-xs font-black text-slate-900">{product.sellerName}</span>
           </div>
           <div className="flex justify-between items-center">
             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Item</span>
             <span className="text-xs font-black text-slate-600 truncate max-w-[150px]">{product.title}</span>
           </div>
           <div className="h-[1px] bg-slate-100 w-full" />
           <div className="flex justify-between items-center">
             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Amount Paid</span>
             <div className="text-right">
                <span className="text-2xl font-black text-slate-900 tracking-tighter">₹{finalPrice.toLocaleString('en-IN')}</span>
                <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Instant Settlement</p>
             </div>
           </div>
        </div>

        <div className="mt-8 flex items-center space-x-3 w-full">
           <button 
            onClick={handleShareReceipt}
            className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center space-x-2 active:scale-95 transition-all"
           >
              <Share2 size={16} />
              <span>Share Receipt</span>
           </button>
           <button onClick={onComplete} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-200 active:scale-95 transition-all">
              Done
           </button>
        </div>
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
        <div className="text-center space-y-3">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">{processingSteps[processStep]}</h2>
          <div className="flex items-center justify-center space-x-2 text-slate-400">
             <Shield size={14} />
             <p className="text-[9px] font-black uppercase tracking-[0.4em]">DO NOT CLOSE THIS WINDOW</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#fdfdfd]">
      <header className="px-6 pt-10 pb-6 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-4">
          <button onClick={stage === 'SUMMARY' ? onBack : () => setStage(stage === 'DETAILS' ? 'SELECTION' : stage === 'PIN_ENTRY' ? 'DETAILS' : 'SUMMARY')} className="p-3 bg-slate-100 text-slate-900 rounded-2xl hover:bg-slate-200 transition-all"><ChevronLeft size={20} /></button>
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">Checkout</h1>
            <div className="flex items-center space-x-2 mt-1">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Encrypted P2P Session</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
           <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Expires in</span>
           <div className="flex items-center space-x-1 px-3 py-1 bg-rose-50 rounded-lg border border-rose-100 text-rose-500">
              <Clock size={12} strokeWidth={3} />
              <span className="text-[10px] font-black tabular-nums">{formatTime(timeLeft)}</span>
           </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {stage === 'SUMMARY' && (
          <div className="p-6 space-y-8 animate-in slide-in-from-right duration-400">
             {/* Order Identity Card */}
             <div className="bg-white p-6 rounded-[32px] flex items-center space-x-5 border border-slate-200 shadow-sm">
                <div className="w-20 h-20 rounded-[20px] overflow-hidden bg-slate-50 shadow-inner">
                   <img src={product.image} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">{type === 'RENT' ? 'RENTAL NODE' : 'PURCHASE NODE'}</p>
                   <h3 className="text-sm font-black text-slate-900 leading-tight truncate">{product.title}</h3>
                   <p className="text-xs font-bold text-slate-400 mt-1">{product.category} Resource</p>
                </div>
             </div>

             {/* Bill Breakdown */}
             <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bill Summary</h4>
                   <FileText size={14} className="text-slate-300" />
                </div>
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 space-y-6">
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500">Node Subtotal</span>
                      <span className="text-xs font-black text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                         <span className="text-xs font-bold text-slate-500">Campus Conv. Fee</span>
                         <Info size={12} className="text-slate-300" />
                      </div>
                      <span className="text-xs font-black text-slate-900">₹{convFee}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500">GST (18%)</span>
                      <span className="text-xs font-black text-slate-900">₹{gst.toLocaleString('en-IN')}</span>
                   </div>
                   <div className="pt-6 border-t border-slate-50 flex justify-between items-end">
                      <div>
                         <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">Final Amount</p>
                         <h4 className="text-4xl font-black text-slate-900 tracking-tighter italic">₹{finalPrice.toLocaleString('en-IN')}</h4>
                      </div>
                      <div className="text-right">
                         <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Secured by</p>
                         <ShieldCheck className="text-indigo-600 inline-block" size={20} />
                      </div>
                   </div>
                </div>
             </div>

             <div className="p-6 bg-emerald-50 rounded-[32px] border border-emerald-100 flex items-start space-x-4">
                <CheckCircle2 size={18} className="text-emerald-600 mt-0.5" />
                <p className="text-[10px] font-bold text-emerald-800 leading-relaxed uppercase tracking-tight">
                  This transaction is P2P verified. Funds will be held in Nexus Vault until you confirm receipt of the item from {product.sellerName}.
                </p>
             </div>
          </div>
        )}

        {stage === 'SELECTION' && (
          <div className="p-6 space-y-8 animate-in slide-in-from-right duration-400">
             <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Select Channel</h4>
                <div className="grid gap-4">
                   {[
                     { id: 'UPI', label: 'UPI Instant', desc: 'GPay, PhonePe, Paytm', icon: Smartphone, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                     { id: 'CARD', label: 'Credit/Debit Card', desc: 'Visa, Mastercard, RuPay', icon: CreditCard, color: 'text-amber-500', bg: 'bg-amber-50' },
                     { id: 'NB', label: 'Net Banking', desc: 'Secure Bank Portal', icon: Landmark, color: 'text-emerald-600', bg: 'bg-emerald-50' }
                   ].map((opt) => (
                     <button 
                      key={opt.id}
                      onClick={() => setMethod(opt.id as PaymentMethod)}
                      className={`w-full p-6 rounded-[32px] border-2 transition-all flex items-center justify-between group ${method === opt.id ? 'border-indigo-600 bg-white shadow-xl scale-[1.02]' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                     >
                        <div className="flex items-center space-x-5">
                           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${method === opt.id ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                              <opt.icon size={24} />
                           </div>
                           <div className="text-left">
                              <p className={`text-sm font-black transition-colors ${method === opt.id ? 'text-indigo-600' : 'text-slate-900'}`}>{opt.label}</p>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{opt.desc}</p>
                           </div>
                        </div>
                        {method === opt.id && <CheckCircle2 className="text-indigo-600" size={24} />}
                     </button>
                   ))}
                </div>
             </div>
          </div>
        )}

        {stage === 'DETAILS' && method === 'UPI' && (
          <div className="p-6 space-y-8 animate-in slide-in-from-right duration-400">
             <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-xl text-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" className="h-6 mx-auto mb-8 opacity-40" alt="UPI" />
                <div className="grid grid-cols-3 gap-6 mb-10">
                   {upiApps.map(app => (
                      <button key={app.name} className="flex flex-col items-center space-y-3 group">
                         <div className="w-16 h-16 rounded-[24px] bg-white border border-slate-100 flex items-center justify-center p-3 group-active:scale-95 transition-all shadow-sm group-hover:shadow-md">
                            <img src={app.icon} className="w-full h-full object-contain" alt="" />
                         </div>
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{app.name}</span>
                      </button>
                   ))}
                </div>
                <div className="relative mb-8">
                   <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                   <div className="relative flex justify-center"><span className="bg-white px-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">or Manual VPA</span></div>
                </div>
                <div className="space-y-4">
                   <input 
                    className="w-full bg-slate-50 border border-slate-100 py-6 px-8 rounded-[32px] font-black text-base text-center outline-none focus:bg-white focus:ring-4 focus:ring-indigo-600/5 transition-all"
                    placeholder="student@vpa"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                   />
                   <div className="flex items-center justify-center space-x-2 text-emerald-500">
                     <ShieldCheck size={14} />
                     <span className="text-[9px] font-black uppercase tracking-widest">NPCI Secure Channel</span>
                   </div>
                </div>
             </div>
          </div>
        )}

        {stage === 'DETAILS' && method === 'CARD' && (
          <div className="p-6 space-y-8 animate-in slide-in-from-right duration-400">
             <div className="bg-white p-8 rounded-[48px] border border-slate-200 shadow-xl space-y-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-2">Card Details</h4>
                <div className="relative">
                  <input 
                    className="w-full bg-slate-50 border border-slate-100 py-6 px-8 rounded-[32px] font-black text-base outline-none focus:bg-white focus:ring-4 focus:ring-indigo-600/5 transition-all"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 h-6 flex items-center space-x-2">
                     {getCardBrand() && (
                       <img src={cardBrands[getCardBrand()!]} className="h-full object-contain" alt="" />
                     )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <input 
                    className="bg-slate-50 border border-slate-100 py-5 px-8 rounded-[24px] font-black text-sm outline-none text-center focus:bg-white"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                   />
                   <input 
                     type="password"
                     className="w-full bg-slate-50 border border-slate-100 py-5 px-8 rounded-[24px] font-black text-sm outline-none text-center focus:bg-white"
                     placeholder="CVV"
                     value={cvv}
                     onChange={(e) => setCvv(e.target.value.slice(0,3))}
                   />
                </div>
                <div className="flex items-center justify-center space-x-3 text-slate-300">
                   <Lock size={14} />
                   <span className="text-[9px] font-black uppercase tracking-widest">PCI-DSS Level 1 Compliant</span>
                </div>
             </div>
          </div>
        )}

        {stage === 'DETAILS' && method === 'NB' && (
          <div className="p-6 space-y-8 animate-in slide-in-from-right duration-400">
             <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-xl">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 text-center">Partner Banks</h4>
                <div className="grid grid-cols-2 gap-4">
                   {popularBanks.map(bank => (
                      <button 
                        key={bank.name} 
                        onClick={() => setSelectedBank(bank.name)}
                        className={`p-6 rounded-[28px] border-2 flex flex-col items-center justify-center transition-all h-32 ${selectedBank === bank.name ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-slate-50 bg-white hover:border-slate-200'}`}
                      >
                         <img src={bank.logo} className="h-10 w-auto object-contain mb-3" alt="" />
                         <span className="text-[9px] font-black text-slate-900 uppercase tracking-tighter text-center">{bank.name}</span>
                      </button>
                   ))}
                </div>
             </div>
          </div>
        )}

        {stage === 'PIN_ENTRY' && (
          <div className="h-full flex flex-col items-center justify-center space-y-12 px-8 py-20 animate-in slide-in-from-bottom duration-500">
             <div className="text-center space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Securing Transmission</p>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">₹{finalPrice.toLocaleString('en-IN')}</h1>
             </div>
             <div className="flex space-x-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`w-5 h-5 rounded-full border-4 transition-all duration-300 ${i < pin.length ? 'bg-indigo-600 border-indigo-600 scale-125 shadow-lg' : 'border-slate-100'}`} />
                ))}
             </div>
             <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
                {['1','2','3','4','5','6','7','8','9','DEL','0','OK'].map(key => (
                  <button 
                    key={key}
                    onClick={() => {
                      if (key === 'DEL') setPin(prev => prev.slice(0,-1));
                      else if (key === 'OK') pin.length === 6 && setStage('PROCESSING');
                      else if (pin.length < 6) setPin(prev => prev + key);
                    }}
                    className={`h-16 rounded-2xl flex items-center justify-center text-xl font-black transition-all ${key === 'OK' ? 'bg-emerald-500 text-white shadow-lg' : key === 'DEL' ? 'bg-slate-100 text-slate-400' : 'bg-white border border-slate-100 text-slate-900 active:scale-90 shadow-sm'}`}
                  >
                    {key === 'DEL' ? <Delete size={20} /> : key === 'OK' ? <Check size={28} strokeWidth={4} /> : key}
                  </button>
                ))}
             </div>
          </div>
        )}
      </div>

      {stage !== 'PIN_ENTRY' && (
        <footer className="p-8 bg-white border-t border-slate-100 rounded-t-[56px] shadow-[0_-20px_50px_rgba(0,0,0,0.05)] space-y-6">
           <div className="flex items-center justify-between px-4">
              <div className="flex items-center space-x-2 opacity-50">
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Gateway Verified</span>
                 <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Razorpay_logo.png" className="h-3" alt="Razorpay" />
              </div>
              <div className="flex items-center space-x-3 opacity-30">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" className="h-4" alt="UPI" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Rupay-Logo.svg" className="h-4" alt="RuPay" />
              </div>
           </div>
           
           <button 
            onClick={() => {
              if (stage === 'SUMMARY') setStage('SELECTION');
              else if (stage === 'SELECTION') setStage('DETAILS');
              else if (method === 'UPI') setStage('PIN_ENTRY');
              else setStage('PROCESSING');
            }}
            disabled={
              (stage === 'DETAILS' && method === 'UPI' && !upiId) ||
              (stage === 'DETAILS' && method === 'CARD' && (cardNumber.replace(/\s/g, '').length < 16 || !expiry || !cvv)) ||
              (stage === 'DETAILS' && method === 'NB' && !selectedBank)
            }
            className="w-full py-6 bg-slate-900 text-white rounded-[28px] font-black flex items-center justify-center space-x-3 shadow-2xl active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
           >
              <span className="uppercase tracking-[0.2em] text-[10px]">
                {stage === 'SUMMARY' ? 'Secure Payment Flow' : stage === 'SELECTION' ? 'Continue Details' : `Confirm ₹${finalPrice.toLocaleString('en-IN')}`}
              </span>
              <ArrowRight size={18} strokeWidth={3} />
           </button>
        </footer>
      )}
    </div>
  );
};

export default PaymentView;
