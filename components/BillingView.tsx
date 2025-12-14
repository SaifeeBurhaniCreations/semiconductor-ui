import React, { useState } from 'react';
import { CreditCard, Download, Zap, HardDrive, Users, Check, ArrowRight, X, Loader2, Star } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const USAGE_DATA = Array.from({ length: 14 }, (_, i) => ({
    day: `D-${i+1}`,
    compute: 50 + Math.random() * 50,
    storage: 20 + Math.random() * 10
}));

const PLANS = [
    { name: 'Starter', price: '$0', period: '/mo', features: ['5 Logic Nodes', 'Basic Simulation', 'Community Support'], color: 'slate' },
    { name: 'Pro', price: '$499', period: '/mo', features: ['50 Logic Nodes', 'Advanced Physics Engine', 'Priority Support', '30 Days Retention'], color: 'cyan' },
    { name: 'Enterprise', price: '$4k', period: '/mo', features: ['Unlimited Nodes', 'Dedicated Quantum Core', '24/7 SLA', 'On-Premise Option', 'Custom AI Models'], color: 'purple' },
];

export const BillingView: React.FC = () => {
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('Enterprise');
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [updatingPayment, setUpdatingPayment] = useState(false);

  const handleUpgrade = (planName: string) => {
      // TODO: Replace with backend call to Stripe/Billing provider
      if (window.confirm(`Confirm change to ${planName} Plan? Pro-rated charges may apply.`)) {
          setCurrentPlan(planName);
          setShowPlanModal(false);
      }
  };

  const handleUpdatePayment = (e: React.FormEvent) => {
      e.preventDefault();
      // TODO: Replace with backend call to secure vault
      setUpdatingPayment(true);
      setTimeout(() => {
          setUpdatingPayment(false);
          setShowPaymentModal(false);
          alert("Payment method updated successfully.");
      }, 1500);
  };

  const handleDownloadInvoice = (id: number) => {
      // TODO: Replace with backend call to generate PDF
      setDownloadingId(id);
      setTimeout(() => {
          setDownloadingId(null);
          alert(`Invoice #${id} downloaded.`);
      }, 1500);
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto custom-scrollbar bg-quantum-950/50 relative">
        
        {/* Plan Selection Modal */}
        {showPlanModal && (
            <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in duration-200">
                <div className="bg-quantum-900 border border-quantum-600 rounded-xl w-full max-w-5xl p-8 shadow-2xl relative overflow-hidden">
                    <button onClick={() => setShowPlanModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X className="w-6 h-6" /></button>
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">Upgrade Your Quantum Capacity</h2>
                        <p className="text-slate-400">Scale your logic nodes and simulation fidelity instantly.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                        {PLANS.map((plan) => (
                            <div key={plan.name} className={`relative p-6 rounded-lg border flex flex-col ${plan.name === currentPlan ? 'bg-quantum-800 border-cyan-500 ring-1 ring-cyan-500/50' : 'bg-quantum-950 border-quantum-700 hover:border-quantum-500 transition-colors'}`}>
                                {plan.name === currentPlan && (
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-cyan-500 text-quantum-950 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Current Plan</div>
                                )}
                                <div className="mb-4">
                                    <h3 className={`text-lg font-bold ${plan.color === 'purple' ? 'text-purple-400' : plan.color === 'cyan' ? 'text-cyan-400' : 'text-slate-300'}`}>{plan.name}</h3>
                                    <div className="flex items-baseline mt-2">
                                        <span className="text-3xl font-mono font-bold text-white">{plan.price}</span>
                                        <span className="text-slate-500 ml-1">{plan.period}</span>
                                    </div>
                                </div>
                                <ul className="space-y-3 mb-8 flex-1">
                                    {plan.features.map((f, i) => (
                                        <li key={i} className="flex items-center text-xs text-slate-300">
                                            <Check className={`w-3 h-3 mr-2 ${plan.color === 'purple' ? 'text-purple-500' : 'text-cyan-500'}`} /> {f}
                                        </li>
                                    ))}
                                </ul>
                                <button 
                                    onClick={() => handleUpgrade(plan.name)}
                                    disabled={plan.name === currentPlan}
                                    className={`w-full py-2 rounded text-xs font-bold uppercase tracking-wider transition-all ${
                                        plan.name === currentPlan 
                                        ? 'bg-quantum-900 text-slate-500 cursor-default' 
                                        : 'bg-white text-black hover:bg-slate-200'
                                    }`}
                                >
                                    {plan.name === currentPlan ? 'Active' : 'Select Plan'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* Payment Update Modal */}
        {showPaymentModal && (
            <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-quantum-900 border border-quantum-600 rounded-lg w-full max-w-md p-6 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-200">Update Payment Method</h3>
                        <button onClick={() => setShowPaymentModal(false)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
                    </div>
                    <form onSubmit={handleUpdatePayment} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Card Number</label>
                            <div className="flex items-center bg-quantum-950 border border-quantum-700 rounded px-3 py-2">
                                <CreditCard className="w-4 h-4 text-slate-500 mr-2" />
                                <input type="text" placeholder="0000 0000 0000 0000" className="bg-transparent border-none text-slate-200 w-full focus:outline-none font-mono text-sm" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Expiry</label>
                                <input type="text" placeholder="MM/YY" className="w-full bg-quantum-950 border border-quantum-700 rounded p-2 text-slate-200 focus:border-cyan-500 outline-none text-sm font-mono" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CVC</label>
                                <input type="text" placeholder="123" className="w-full bg-quantum-950 border border-quantum-700 rounded p-2 text-slate-200 focus:border-cyan-500 outline-none text-sm font-mono" required />
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            disabled={updatingPayment}
                            className="w-full mt-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded shadow-glow-cyan flex items-center justify-center"
                        >
                            {updatingPayment ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Payment Method'}
                        </button>
                    </form>
                </div>
            </div>
        )}

        <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-1">Subscription & Usage</h2>
            <p className="text-sm text-slate-500">Manage your Quantum Control plan and billing details.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Plan Card */}
            <div className={`bg-gradient-to-br border rounded-lg p-6 relative overflow-hidden flex flex-col justify-between
                ${currentPlan === 'Enterprise' ? 'from-purple-900/20 to-quantum-900 border-purple-500/30' : 
                  currentPlan === 'Pro' ? 'from-cyan-900/20 to-quantum-900 border-cyan-500/30' : 'from-slate-800/20 to-quantum-900 border-slate-600'}
            `}>
                <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={100} /></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start">
                        <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${currentPlan === 'Enterprise' ? 'text-purple-400' : 'text-cyan-400'}`}>Current Plan</div>
                        {currentPlan === 'Enterprise' && <Star className="w-4 h-4 text-purple-400 fill-purple-400" />}
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">{currentPlan} Quantum</h3>
                    <ul className="space-y-2 mb-6">
                        <li className="flex items-center text-xs text-slate-300"><Check className="w-3 h-3 text-green-400 mr-2" /> Unlimited Logic Nodes</li>
                        <li className="flex items-center text-xs text-slate-300"><Check className="w-3 h-3 text-green-400 mr-2" /> Priority QPU Access</li>
                        <li className="flex items-center text-xs text-slate-300"><Check className="w-3 h-3 text-green-400 mr-2" /> 24/7 Dedicated Support</li>
                    </ul>
                </div>
                <button 
                    onClick={() => setShowPlanModal(true)}
                    className={`w-full py-2 text-white font-bold text-xs rounded shadow-lg transition-colors relative z-10 ${currentPlan === 'Enterprise' ? 'bg-purple-600 hover:bg-purple-500' : 'bg-cyan-600 hover:bg-cyan-500'}`}
                >
                    Manage Plan
                </button>
            </div>

            {/* Usage Metrics */}
            <div className="lg:col-span-2 bg-quantum-900 border border-quantum-700 rounded-lg p-6">
                 <div className="flex justify-between items-center mb-6">
                     <h3 className="text-sm font-bold text-slate-200 uppercase">Usage Forecast</h3>
                     <span className="text-xs text-slate-500">Billing Cycle: 14 Days Remaining</span>
                 </div>
                 <div className="h-40 w-full mb-4">
                     <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={USAGE_DATA}>
                             <defs>
                                <linearGradient id="colorCompute" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                                </linearGradient>
                             </defs>
                             <XAxis dataKey="day" hide />
                             <Tooltip contentStyle={{ backgroundColor: '#0a0f16', borderColor: '#2b3a4a', color: '#e2e8f0', fontSize: '10px' }} />
                             <Area type="monotone" dataKey="compute" stroke="#22d3ee" fillOpacity={1} fill="url(#colorCompute)" strokeWidth={2} />
                             <Area type="monotone" dataKey="storage" stroke="#8b5cf6" fill="transparent" strokeDasharray="3 3" />
                         </AreaChart>
                     </ResponsiveContainer>
                 </div>
                 <div className="grid grid-cols-3 gap-4 border-t border-quantum-800 pt-4">
                     <div>
                         <div className="text-[10px] text-slate-500 uppercase">Compute Units</div>
                         <div className="text-xl font-mono text-cyan-400">14,205 <span className="text-xs text-slate-600">/ 50k</span></div>
                     </div>
                     <div>
                         <div className="text-[10px] text-slate-500 uppercase">Storage</div>
                         <div className="text-xl font-mono text-purple-400">4.2 TB <span className="text-xs text-slate-600">/ 10 TB</span></div>
                     </div>
                     <div>
                         <div className="text-[10px] text-slate-500 uppercase">Est. Cost</div>
                         <div className="text-xl font-mono text-slate-200">$4,102.50</div>
                     </div>
                 </div>
            </div>
        </div>

        <div className="bg-quantum-900 border border-quantum-700 rounded-lg p-6">
            <h3 className="text-sm font-bold text-slate-200 uppercase mb-4 flex items-center">
                <CreditCard className="w-4 h-4 mr-2 text-slate-400" /> Payment & Invoices
            </h3>
            
            <div className="flex items-center justify-between p-4 bg-quantum-950 border border-quantum-800 rounded mb-6">
                <div className="flex items-center space-x-4">
                    <div className="p-2 bg-slate-800 rounded text-slate-300"><CreditCard /></div>
                    <div>
                        <div className="text-sm font-bold text-slate-200">Visa ending in 4242</div>
                        <div className="text-xs text-slate-500">Expires 12/28</div>
                    </div>
                </div>
                <button onClick={() => setShowPaymentModal(true)} className="text-xs text-cyan-400 hover:text-cyan-300 font-bold">Update Method</button>
            </div>

            <table className="w-full text-left text-xs">
                <thead className="text-slate-500 uppercase font-mono border-b border-quantum-800">
                    <tr>
                        <th className="py-2">Invoice ID</th>
                        <th className="py-2">Date</th>
                        <th className="py-2">Amount</th>
                        <th className="py-2">Status</th>
                        <th className="py-2 text-right">Download</th>
                    </tr>
                </thead>
                <tbody className="text-slate-300 divide-y divide-quantum-800">
                    {[1, 2, 3].map(i => (
                        <tr key={i} className="group hover:bg-quantum-800/30 transition-colors">
                            <td className="py-3 font-mono text-slate-400">INV-2025-00{i}</td>
                            <td className="py-3">Oct {24 - i*7}, 2025</td>
                            <td className="py-3 font-mono">$4,100.00</td>
                            <td className="py-3"><span className="px-1.5 py-0.5 bg-green-900/20 text-green-400 rounded border border-green-500/20 text-[10px] uppercase font-bold">Paid</span></td>
                            <td className="py-3 text-right">
                                <button 
                                    onClick={() => handleDownloadInvoice(2025000 + i)}
                                    className="text-slate-500 hover:text-cyan-400 transition-colors"
                                    disabled={downloadingId === 2025000 + i}
                                >
                                    {downloadingId === 2025000 + i ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    </div>
  );
};