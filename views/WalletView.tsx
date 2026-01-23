
import React from 'react';
import { 
  ChevronLeft, Zap, ArrowUpRight, ArrowDownLeft, 
  History, ShieldCheck, Wallet, MoreVertical, 
  Plus, CreditCard, Banknote, Search, Filter, 
  ReceiptText, CheckCircle2, Clock
} from 'lucide-react';
import { Product } from '../types';

interface WalletViewProps {
  onBack: () => void;
  myPurchases: Product[];
  onAddFunds: () => void;
}

const WalletView: React.FC<WalletViewProps> = ({ onBack, myPurchases, onAddFunds }) => {
  const balance = 12450;
  
  // Combine real purchases with some mock transaction data
  const transactions = [
    ...myPurchases.map(p => ({
      id: p.id,
      title: p.title,
      amount: p.price,
      type: 'DEBIT',
      category: p.category,
      time: 'Just Now',
      status: 'VERIFIED'
    })),
    { id: 't1', title: 'Funds Added', amount: 5000, type: 'CREDIT', category: 'Wallet', time: 'Yesterday', status: 'SUCCESS' },
    { id: 't2', title: 'Sold: HC Verma Physics', amount: 450, type: 'CREDIT', category: 'Notebook', time: '2 days ago', status: 'SUCCESS' },
    { id: 't3', title: 'Nexus Hub Rental Fee', amount: 19, type: 'DEBIT', category: 'Platform', time: '3 days ago', status: 'SUCCESS' }
  ];

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <header className="px-6 pt-12 pb-6 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-3 bg-slate-100 text-slate-900 rounded-2xl active:scale-90 transition-all">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
              <Zap size={16} fill="currentColor" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Nexus Pay</h1>
          </div>
        </div>
        <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl"><MoreVertical size={20} /></button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 hide-scrollbar pb-32">
        {/* Fututistic Card */}
        <div className="relative group perspective-1000">
           <div className="w-full bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl shadow-indigo-200 overflow-hidden relative transition-all duration-700 hover:rotate-x-2">
              <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
                 <Zap size={180} fill="currentColor" />
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between space-y-12">
                 <div className="flex justify-between items-start">
                    <div>
                       <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Campus Balance</p>
                       <h2 className="text-4xl font-black tracking-tighter italic">₹{balance.toLocaleString('en-IN')}</h2>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                       <ShieldCheck size={14} className="text-emerald-400" />
                       <span className="text-[8px] font-black uppercase tracking-widest">Vault Encrypted</span>
                    </div>
                 </div>
                 
                 <div className="flex justify-between items-end">
                    <div className="space-y-1">
                       <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Account Owner</p>
                       <p className="text-xs font-black uppercase tracking-widest">NEXUS NODE • 2025</p>
                    </div>
                    <div className="flex -space-x-3">
                       <div className="w-10 h-10 rounded-full bg-indigo-500/50 blur-sm" />
                       <div className="w-10 h-10 rounded-full bg-purple-500/50 blur-sm" />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-4 gap-4">
           {[
             { label: 'Pay', icon: ArrowUpRight, color: 'bg-indigo-600', text: 'text-white' },
             { label: 'Receive', icon: ArrowDownLeft, color: 'bg-emerald-500', text: 'text-white' },
             { label: 'Add', icon: Plus, color: 'bg-white', text: 'text-slate-900', action: onAddFunds },
             { label: 'History', icon: History, color: 'bg-white', text: 'text-slate-900' }
           ].map((btn, i) => (
             <button key={i} onClick={btn.action} className="flex flex-col items-center space-y-2 group">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-90 ${btn.color} ${btn.text}`}>
                   <btn.icon size={22} strokeWidth={3} />
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">{btn.label}</span>
             </button>
           ))}
        </div>

        {/* Transaction History */}
        <div className="space-y-5">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Ledger</h3>
              <div className="flex items-center space-x-3">
                 <Search size={14} className="text-slate-300" />
                 <Filter size={14} className="text-slate-300" />
              </div>
           </div>

           <div className="space-y-3">
              {transactions.map((tx, i) => (
                <div key={tx.id} className="bg-white p-5 rounded-[32px] border border-slate-100 flex items-center justify-between group animate-in slide-in-from-right duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                   <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'CREDIT' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                         {tx.type === 'CREDIT' ? <ArrowDownLeft size={20} /> : <ReceiptText size={20} />}
                      </div>
                      <div>
                         <h4 className="text-sm font-black text-slate-900 leading-none mb-1.5 group-hover:text-indigo-600 transition-colors">{tx.title}</h4>
                         <div className="flex items-center space-x-2">
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{tx.time}</span>
                            <div className="w-1 h-1 bg-slate-200 rounded-full" />
                            <div className="flex items-center space-x-1">
                               <CheckCircle2 size={10} className="text-emerald-500" />
                               <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">{tx.status}</span>
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className={`text-sm font-black tracking-tight ${tx.type === 'CREDIT' ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                      </p>
                      <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">
                        {tx.category}
                      </p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Quick Help */}
        <div className="bg-indigo-600 rounded-[40px] p-8 text-white flex flex-col space-y-6 shadow-2xl shadow-indigo-100 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-6 opacity-20 transition-transform duration-700 group-hover:rotate-12">
              <ShieldCheck size={80} />
           </div>
           <div className="space-y-2 relative z-10">
              <h4 className="text-lg font-black tracking-tight">Campus Protection</h4>
              <p className="text-xs text-indigo-100 font-medium leading-relaxed opacity-80">
                Every transaction on Nexus Pay is protected by student-only escrow. Funds are only released when you confirm receipt.
              </p>
           </div>
           <button className="bg-white text-indigo-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest self-start px-6 active:scale-95 transition-all">
             Learn about security
           </button>
        </div>
      </div>
    </div>
  );
};

export default WalletView;
