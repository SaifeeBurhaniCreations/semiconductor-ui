import React from 'react';
import { ToggleLeft, ToggleRight, Lock, Key, Sliders, RefreshCw } from 'lucide-react';

export const ConfigurationView: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Feature Flags */}
        <div className="bg-quantum-900 border border-quantum-600 rounded-lg p-5">
            <h3 className="text-sm font-bold text-slate-200 uppercase mb-4 flex items-center">
                <Sliders className="w-4 h-4 mr-2 text-purple-400" /> Feature Flags & Rollouts
            </h3>
            <div className="space-y-4">
                <ToggleItem label="Experimental Quantum Solver" desc="Enable Tier-2 unstable QPU access for non-critical paths." active={true} />
                <ToggleItem label="Auto-Healing Logic" desc="Allow AI to rewrite disconnected node paths automatically." active={false} />
                <ToggleItem label="Verbose Telemetry" desc="Stream raw sensor data to archival storage (High bandwidth)." active={true} />
            </div>
        </div>

        {/* Process Recipes */}
        <div className="bg-quantum-900 border border-quantum-600 rounded-lg p-5">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-200 uppercase flex items-center">
                    <RefreshCw className="w-4 h-4 mr-2 text-cyan-400" /> Active Recipes
                </h3>
                <button className="text-[10px] text-cyan-400 hover:underline">View History</button>
            </div>
            <div className="space-y-3">
                <div className="p-3 bg-quantum-950 border border-quantum-700 rounded flex justify-between items-center">
                    <div>
                        <div className="text-xs font-bold text-slate-200">Reflow-Profile-A7</div>
                        <div className="text-[10px] text-slate-500">Last modified: 2h ago by ENG-04</div>
                    </div>
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 text-[10px] rounded border border-green-500/20">LIVE</span>
                </div>
                <div className="p-3 bg-quantum-950 border border-quantum-700 rounded flex justify-between items-center opacity-60">
                    <div>
                        <div className="text-xs font-bold text-slate-200">Etch-Standard-v2</div>
                        <div className="text-[10px] text-slate-500">Deprecated</div>
                    </div>
                    <span className="px-2 py-1 bg-slate-800 text-slate-500 text-[10px] rounded border border-slate-700">ARCHIVED</span>
                </div>
            </div>
        </div>

        {/* Security / Secrets */}
        <div className="col-span-1 lg:col-span-2 bg-quantum-900 border border-quantum-600 rounded-lg p-5">
             <h3 className="text-sm font-bold text-slate-200 uppercase mb-4 flex items-center">
                <Lock className="w-4 h-4 mr-2 text-red-400" /> Access Control & Secrets
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="p-4 bg-quantum-950 border border-quantum-700 rounded flex flex-col justify-between">
                     <div className="flex items-start justify-between">
                         <span className="text-xs font-mono text-slate-400">API_KEY_MASTER</span>
                         <Key className="w-4 h-4 text-slate-600" />
                     </div>
                     <div className="mt-4 flex items-center justify-between">
                         <span className="text-xs font-mono text-slate-200">sk_live_...94x</span>
                         <button className="text-[10px] text-red-400 hover:text-red-300">Rotate</button>
                     </div>
                 </div>
                 <div className="p-4 bg-quantum-950 border border-quantum-700 rounded flex flex-col justify-between">
                     <div className="flex items-start justify-between">
                         <span className="text-xs font-mono text-slate-400">QUANTUM_BRIDGE_TOKEN</span>
                         <Key className="w-4 h-4 text-slate-600" />
                     </div>
                     <div className="mt-4 flex items-center justify-between">
                         <span className="text-xs font-mono text-slate-200">qb_v1_...f2a</span>
                         <button className="text-[10px] text-red-400 hover:text-red-300">Rotate</button>
                     </div>
                 </div>
            </div>
        </div>
    </div>
  );
};

const ToggleItem = ({ label, desc, active }: { label: string, desc: string, active: boolean }) => (
    <div className="flex items-start justify-between">
        <div>
            <div className="text-xs font-bold text-slate-200">{label}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{desc}</div>
        </div>
        <button className={`text-2xl ${active ? 'text-cyan-400' : 'text-slate-700'}`}>
            {active ? <ToggleRight /> : <ToggleLeft />}
        </button>
    </div>
);