import React from 'react';
import { CreditCard, Download, Zap, HardDrive, Users, Check, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const USAGE_DATA = Array.from({ length: 14 }, (_, i) => ({
    day: `D-${i+1}`,
    compute: 50 + Math.random() * 50,
    storage: 20 + Math.random() * 10
}));

export const BillingView: React.FC = () => {
  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto custom-scrollbar bg-quantum-950/50">
        
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-1">Subscription & Usage</h2>
            <p className="text-sm text-slate-500">Manage your Quantum Control plan and billing details.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Plan Card */}
            <div className="bg-gradient-to-br from-purple-900/20 to-quantum-900 border border-purple-500/30 rounded-lg p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={100} /></div>
                <div className="relative z-10">
                    <div className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">Current Plan</div>
                    <h3 className="text-3xl font-bold text-white mb-4">Enterprise Quantum</h3>
                    <ul className="space-y-2 mb-6">
                        <li className="flex items-center text-xs text-slate-300"><Check className="w-3 h-3 text-green-400 mr-2" /> Unlimited Logic Nodes</li>
                        <li className="flex items-center text-xs text-slate-300"><Check className="w-3 h-3 text-green-400 mr-2" /> Priority QPU Access</li>
                        <li className="flex items-center text-xs text-slate-300"><Check className="w-3 h-3 text-green-400 mr-2" /> 24/7 Dedicated Support</li>
                    </ul>
                    <button className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded shadow-lg transition-colors">
                        Manage Plan
                    </button>
                </div>
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
                <button className="text-xs text-cyan-400 hover:text-cyan-300 font-bold">Update Method</button>
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
                                <button className="text-slate-500 hover:text-cyan-400"><Download className="w-4 h-4" /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    </div>
  );
};