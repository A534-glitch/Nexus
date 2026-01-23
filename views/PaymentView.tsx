import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import { 
  ChevronLeft, ShieldCheck, IndianRupee, Clock, ArrowRight, 
  Shield, Lock, Info, Check, Delete, RefreshCw, ReceiptText, Copy, Share2,
  Smartphone
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
  const [timeLeft, setTimeLeft] = useState(300); 
  const [copied, setCopied] = useState(false);

  const subtotal = type === 'BUY' ? product.price : (product.rentPrice || Math.floor(product.price * 0.1));
  const convFee = 19;
  const gst = Math.floor(subtotal * 0.18);
  const finalPrice = subtotal + convFee + gst;

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

  const handleCopyId = () => {
    navigator.clipboard.writeText(transactionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareReceipt = async () => {
    const receiptText = `🎓 NEXUS CAMPUS RECEIPT\n\n✅ Payment Successful!\n--------------------------\n📦 Item: ${product.title}\n👤 Paid to: ${product.sellerName}\n💰 Amount: ₹${finalPrice.toLocaleString('en-IN')}\n🆔 Transaction ID: ${transactionId}\n--------------------------\nVerified via Nexus P2P Hub. 🚀`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Nexus Receipt', text: receiptText }); } catch (err) {}
    } else {
      await navigator.clipboard.writeText(receiptText);
      alert('Receipt text copied!');
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
    { name: 'SBI', logo: 'https://upload.wikimedia.org/wikipedia/en/5/58/State_Bank_of_India_logo.svg' }
  ];

  const upiApps = [
    { name: 'GPay', icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Pay_GPay_Logo.svg' },
    { name: 'PhonePe', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg' }
  ];

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

  // Early returns handle narrowing automatically for the main render block
  if (stage === 'SUCCESS') {
    return (
      <div className="h-full flex flex-col bg-white overflow-y-auto hide-scrollbar animate-in fade-in duration-500">
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
          <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-200 mb-8">
             <Check size={56} strokeWidth={4} />
          </div>
          <div className="text-center space-y-2 mb-10">
             <h2 className="text-5xl font-[900] text-slate-900 tracking-tighter italic">₹{finalPrice.toLocaleString('en-IN')}</h2>
             <p className="text-sm font-bold text-slate-500">Paid to <span className="text-slate-900 font-black">{product.sellerName}</span></p>
          </div>
          <div className="w-full bg-slate-50 rounded-[40px] p-8 border border-slate-100 space-y-4">
             <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</span>
                <span className="text-xs font-black text-slate-900">{transactionId}</span>
             </div>
          </div>
        </div>
        <div className="p-8 space-y-4">
           <button onClick={handleShareReceipt} className="w-full py-5 bg-indigo-600 text-white rounded-[28px] font-black uppercase text-xs">Share Receipt</button>
           <button onClick={onComplete} className="w-full py-5 bg-white border-2 border-slate-900 text-slate-900 rounded-[28px] font-black uppercase text-xs">Finish</button>
        </div>
      </div>
    );
  }

  if (stage === 'PROCESSING') {
    return (
      <div className="h-full bg-white flex flex-col items-center justify-center p-8">
        <RefreshCw size={48} className="text-indigo-600 animate-spin mb-6" />
        <h2 className="text-xl font-black text-slate-900 tracking-tight">{processingSteps[processStep]}</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#fdfdfd]">
      <header className="px-6 pt-10 pb-6 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-4">
          <button onClick={stage === 'SUMMARY' ? onBack : () => setStage('SUMMARY')} className="p-3 bg-slate-100 rounded-2xl"><ChevronLeft size={20} /></button>
          <h1 className="text-lg font-black text-slate-900 tracking-tight">Checkout</h1>
        </div>
        <div className="px-3 py-1 bg-rose-50 rounded-lg text-rose-500 font-black text-[10px]">{formatTime(timeLeft)}</div>
      </header>

      <div className="flex-1 overflow-y-auto">
        {stage === 'SUMMARY' && (
          <div className="p-6 space-y-6">
             <div className="bg-white p-6 rounded-[32px] border border-slate-200 flex items-center space-x-4">
                <img src={product.image} className="w-20 h-20 rounded-2xl object-cover" alt="" />
                <div className="flex-1 min-w-0">
                   <h3 className="text-sm font-black text-slate-900 truncate">{product.title}</h3>
                   <p className="text-xs font-bold text-slate-400 mt-1">₹{subtotal.toLocaleString('en-IN')}</p>
                </div>
             </div>
             <div className="bg-slate-900 rounded-[40px] p-8 text-white">
                <div className="flex justify-between mb-4"><span className="opacity-60 text-xs">GST (18%)</span><span className="font-bold">₹{gst}</span></div>
                <div className="border-t border-white/10 pt-4 flex justify-between items-end">
                   <div><p className="text-[10px] uppercase font-black opacity-40">Total Amount</p><h4 className="text-3xl font-black">₹{finalPrice.toLocaleString()}</h4></div>
                </div>
             </div>
          </div>
        )}

        {stage === 'SELECTION' && (
           <div className="p-6 space-y-4">
              <button onClick={() => setStage('DETAILS')} className="w-full p-6 bg-white border border-slate-100 rounded-3xl flex items-center space-x-4 active:scale-95 transition-all">
                {/* Fixed: Added missing Smartphone icon from lucide-react imports */}
                <Smartphone className="text-indigo-600" />
                <span className="font-black text-sm">UPI Payment</span>
              </button>
           </div>
        )}

        {stage === 'DETAILS' && (
           <div className="p-6">
              <input className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl font-black text-center" placeholder="student@vpa" value={upiId} onChange={e => setUpiId(e.target.value)} />
           </div>
        )}

        {stage === 'PIN_ENTRY' && (
           <div className="h-full flex flex-col items-center justify-center p-8 space-y-8">
              <div className="flex space-x-3">
                 {[...Array(6)].map((_, i) => (
                   <div key={i} className={`w-4 h-4 rounded-full ${i < pin.length ? 'bg-indigo-600' : 'bg-slate-100'}`} />
                 ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                 {['1','2','3','4','5','6','7','8','9','DEL','0','OK'].map(key => (
                   <button key={key} onClick={() => {
                     if (key === 'DEL') setPin(p => p.slice(0,-1));
                     else if (key === 'OK') pin.length === 6 && setStage('PROCESSING');
                     else if (pin.length < 6) setPin(p => p + key);
                   }} className="w-16 h-16 bg-white border border-slate-100 rounded-2xl font-black">{key}</button>
                 ))}
              </div>
           </div>
        )}
      </div>

      {stage !== 'PIN_ENTRY' && (
        <footer className="p-8 bg-white border-t border-slate-100 space-y-4">
           <button 
            onClick={() => {
              if (stage === 'SUMMARY') setStage('SELECTION');
              else if (stage === 'SELECTION') setStage('DETAILS');
              else if (stage === 'DETAILS') setStage('PIN_ENTRY');
            }}
            className="w-full py-6 bg-slate-900 text-white rounded-[28px] font-black uppercase tracking-widest text-xs"
           >
              Continue
           </button>
        </footer>
      )}
    </div>
  );
};

export default PaymentView;