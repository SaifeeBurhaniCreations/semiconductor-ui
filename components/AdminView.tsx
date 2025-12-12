import React from 'react';
import { Activity, Download, HardDrive, ShieldAlert, Terminal, BarChart2, Cpu, Zap, AlertOctagon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const USAGE_DATA = [
  { name: 'Logic', visits: 4520, errors: 12 },
  { name: 'Sim', visits: 3100, errors: 45 },
  { name: 'Docs', visits: 2100, errors: 2 },
  { name: 'Analytics', visits: 2780, errors: 8 },
  { name: 'Security', visits: 1890, errors: 0 },
];

const LATENCY_DATA = Array.from({ length: 50 }, (_, i) => ({
    time: i,
    ms: 10 + Math.random() * 20 + (i > 30 ? 50 : 0) // Simulated spike
}));

export const AdminView: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-quantum-900 border border-quantum-600 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="h-14 border-b border-quantum-600 bg-quantum-800 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                <h2 className="font-bold text-slate-100 tracking-wide">System Admin & Observability</h2>
            </div>
            <div className="flex space-x-3">
                <button className="px-3 py-1.5 bg-quantum-900 border border-quantum-600 rounded text-xs text-slate-300 hover:text-cyan-400 flex items-center">
                    <Terminal className="w-3 h-3 mr-2" /> Run Self-Test
                </button>
                <button className="px-3 py-1.5 bg-quantum-700 border border-quantum-600 rounded text-xs text-white hover:bg-quantum-600 flex items-center shadow-lg">
                    <Download className="w-3 h-3 mr-2" /> Diagnostic Bundle
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-quantum-950/30 space-y-6">
            
            {/* System Health Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Diagnostics Panel */}
                <div className="lg:col-span-2 bg-quantum-900 border border-quantum-700 rounded-lg p-5">
                    <h3 className="text-sm font-bold text-slate-200 uppercase mb-4 flex items-center">
                        <Activity className="w-4 h-4 mr-2 text-cyan-400" /> Network Latency Heatmap
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={LATENCY_DATA}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1c2633" />
                                <XAxis dataKey="time" hide />
                                <YAxis stroke="#475569" fontSize={10} />
                                <Tooltip contentStyle={{ backgroundColor: '#0a0f16', borderColor: '#2b3a4a', color: '#e2e8f0' }} />
                                <Line type="step" dataKey="ms" stroke="#ef4444" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex items-center justify-between p-3 bg-red-900/10 border border-red-500/20 rounded">
                        <div className="flex items-center space-x-2">
                            <AlertOctagon className="w-4 h-4 text-red-500" />
                            <span className="text-xs text-red-400 font-bold">Latency Spike Detected</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">T-minus 15s • Region: EU-West</span>
                    </div>
                </div>

                {/* Core Health */}
                <div className="bg-quantum-900 border border-quantum-700 rounded-lg p-5 flex flex-col">
                    <h3 className="text-sm font-bold text-slate-200 uppercase mb-4 flex items-center">
                        <Cpu className="w-4 h-4 mr-2 text-purple-400" /> Quantum Core Status
                    </h3>
                    <div className="flex-1 grid grid-cols-4 gap-2 content-start">
                        {Array.from({ length: 32 }).map((_, i) => (
                            <div 
                                key={i} 
                                className={`aspect-square rounded border flex items-center justify-center text-[10px] font-mono transition-colors cursor-help
                                ${i === 14 ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse' : 
                                  i > 28 ? 'bg-slate-800 border-slate-700 text-slate-500' : 
                                  'bg-green-500/10 border-green-500/30 text-green-400'}`}
                                title={i === 14 ? "Core 14: DECOHERENCE DETECTED" : `Core ${i}: NOMINAL`}
                            >
                                {i}
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-quantum-800">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Available Capacity</span>
                            <span>88%</span>
                        </div>
                        <div className="w-full h-1 bg-quantum-950 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500 w-[88%]"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Usage Analytics */}
            <div className="bg-quantum-900 border border-quantum-700 rounded-lg p-5">
                 <div className="flex justify-between items-center mb-6">
                     <h3 className="text-sm font-bold text-slate-200 uppercase flex items-center">
                        <BarChart2 className="w-4 h-4 mr-2 text-orange-400" /> Feature Usage Metrics
                    </h3>
                    <select className="bg-quantum-950 border border-quantum-700 text-[10px] rounded px-2 py-1 text-slate-400">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                    </select>
                 </div>
                 <div className="h-64 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={USAGE_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                             <CartesianGrid strokeDasharray="3 3" stroke="#1c2633" vertical={false} />
                             <XAxis dataKey="name" stroke="#475569" fontSize={10} />
                             <YAxis stroke="#475569" fontSize={10} />
                             <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{ backgroundColor: '#0a0f16', borderColor: '#2b3a4a', color: '#e2e8f0' }} />
                             <Bar dataKey="visits" name="Visits" fill="#22d3ee" radius={[4, 4, 0, 0]} barSize={40} />
                             <Bar dataKey="errors" name="Errors" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={40} />
                         </BarChart>
                     </ResponsiveContainer>
                 </div>
            </div>

        </div>
    </div>
  );
};