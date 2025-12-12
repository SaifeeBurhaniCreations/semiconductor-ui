import React from 'react';
import { ToggleLeft, ToggleRight, Lock, Key, Sliders, RefreshCw, ShieldAlert, CheckSquare, GitPullRequest, UploadCloud, Copy } from 'lucide-react';

export const ConfigurationView: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Feature Flags */}
        <div className="bg-quantum-900 border border-quantum-600 rounded-lg p-5">
            <h3 className="text-sm font-bold text-slate-200 uppercase mb-4 flex items-center">
                <Sliders className="w-4 h-4 mr-2 text-purple-400" /> Feature Flags & Rollouts
            </h3>
            <div className="space-y-6">
                <div>
                     <ToggleItem label="Experimental Quantum Solver" desc="Enable Tier-2 unstable QPU access." active={true} />
                     <div className="mt-2 pl-1">
                         <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                             <span>Rollout: Canary (5%)</span>
                             <span>Target: Global</span>
                         </div>
                         <div className="w-full h-1 bg-quantum-950 rounded-full overflow-hidden">
                             <div className="h-full bg-purple-500 w-[5%]"></div>
                         </div>
                     </div>
                </div>
                
                <ToggleItem label="Auto-Healing Logic" desc="Allow AI to rewrite paths automatically." active={false} />
                
                <div>
                     <ToggleItem label="Verbose Telemetry" desc="Stream raw sensor data to archival." active={true} />
                     <div className="mt-2 pl-1">
                         <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                             <span>Rollout: 100%</span>
                         </div>
                         <div className="w-full h-1 bg-quantum-950 rounded-full overflow-hidden">
                             <div className="h-full bg-cyan-500 w-full"></div>
                         </div>
                     </div>
                </div>
            </div>
        </div>

        {/* Process Recipe Library */}
        <div className="bg-quantum-900 border border-quantum-600 rounded-lg p-5">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-200 uppercase flex items-center">
                    <RefreshCw className="w-4 h-4 mr-2 text-cyan-400" /> Process Recipe Library
                </h3>
                <button className="text-[10px] text-cyan-400 hover:underline">Manage All</button>
            </div>
            <div className="space-y-3">
                <div className="p-3 bg-quantum-950 border border-quantum-700 rounded flex flex-col gap-2 group hover:border-cyan-500/30 transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-xs font-bold text-slate-200 flex items-center">
                                Reflow-Profile-A7 
                                <span className="ml-2 px-1.5 py-0.5 bg-green-900/20 text-green-400 text-[9px] rounded border border-green-500/20">LIVE</span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">v4.2 • Modified 2h ago</div>
                        </div>
                        <button className="text-slate-500 hover:text-cyan-400"><GitPullRequest className="w-3 h-3" /></button>
                    </div>
                    {/* Actions */}
                    <div className="flex space-x-2 pt-2 border-t border-quantum-800">
                        <button className="flex-1 py-1 bg-quantum-800 hover:bg-quantum-700 text-[10px] rounded text-slate-300 flex items-center justify-center">
                            <Copy className="w-3 h-3 mr-1.5" /> Fork
                        </button>
                        <button className="flex-1 py-1 bg-cyan-900/20 hover:bg-cyan-900/30 border border-cyan-500/20 text-[10px] rounded text-cyan-400 flex items-center justify-center">
                            <UploadCloud className="w-3 h-3 mr-1.5" /> Deploy
                        </button>
                    </div>
                </div>

                <div className="p-3 bg-quantum-950 border border-quantum-700 rounded flex flex-col gap-2 opacity-70">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-xs font-bold text-slate-200 flex items-center">
                                Etch-Standard-v2
                                <span className="ml-2 px-1.5 py-0.5 bg-slate-800 text-slate-500 text-[9px] rounded border border-slate-700">ARCHIVED</span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">v2.0 • Deprecated</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Approval Gates (New) */}
        <div className="bg-quantum-900 border border-quantum-600 rounded-lg p-5">
             <h3 className="text-sm font-bold text-slate-200 uppercase mb-4 flex items-center">
                <ShieldAlert className="w-4 h-4 mr-2 text-orange-400" /> Approval Gates
            </h3>
            <div className="space-y-3">
                 <div className="flex items-center justify-between p-3 bg-quantum-950 border border-quantum-700 rounded">
                     <div className="flex items-center">
                         <CheckSquare className="w-4 h-4 text-slate-500 mr-3" />
                         <div>
                             <div className="text-xs font-bold text-slate-200">Production Deployments</div>
                             <div className="text-[10px] text-slate-500">Requires 2 senior engineer signatures.</div>
                         </div>
                     </div>
                     <span className="text-[10px] text-orange-400 font-mono bg-orange-900/20 px-1.5 py-0.5 rounded border border-orange-500/30">STRICT</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-quantum-950 border border-quantum-700 rounded">
                     <div className="flex items-center">
                         <CheckSquare className="w-4 h-4 text-slate-500 mr-3" />
                         <div>
                             <div className="text-xs font-bold text-slate-200">Simulation Parameter Updates</div>
                             <div className="text-[10px] text-slate-500">Requires AI validation pass.</div>
                         </div>
                     </div>
                     <span className="text-[10px] text-cyan-400 font-mono bg-cyan-900/20 px-1.5 py-0.5 rounded border border-cyan-500/30">AUTO</span>
                 </div>
            </div>
        </div>

        {/* Security / Secrets */}
        <div className="bg-quantum-900 border border-quantum-600 rounded-lg p-5">
             <h3 className="text-sm font-bold text-slate-200 uppercase mb-4 flex items-center">
                <Lock className="w-4 h-4 mr-2 text-red-400" /> Access Control & Secrets
            </h3>
            <div className="space-y-4">
                 <div className="p-3 bg-quantum-950 border border-quantum-700 rounded flex flex-col justify-between">
                     <div className="flex items-start justify-between">
                         <span className="text-xs font-mono text-slate-400">API_KEY_MASTER</span>
                         <Key className="w-4 h-4 text-slate-600" />
                     </div>
                     <div className="mt-3 flex items-center justify-between">
                         <span className="text-xs font-mono text-slate-200">sk_live_...94x</span>
                         <button className="text-[10px] text-red-400 hover:text-red-300 border border-red-900/50 px-2 py-0.5 rounded bg-red-900/10">Rotate (MFA)</button>
                     </div>
                 </div>
                 <div className="p-3 bg-quantum-950 border border-quantum-700 rounded flex flex-col justify-between">
                     <div className="flex items-start justify-between">
                         <span className="text-xs font-mono text-slate-400">QUANTUM_BRIDGE_TOKEN</span>
                         <Key className="w-4 h-4 text-slate-600" />
                     </div>
                     <div className="mt-3 flex items-center justify-between">
                         <span className="text-xs font-mono text-slate-200">qb_v1_...f2a</span>
                         <button className="text-[10px] text-red-400 hover:text-red-300 border border-red-900/50 px-2 py-0.5 rounded bg-red-900/10">Rotate (MFA)</button>
                     </div>
                 </div>
            </div>
        </div>
    </div>
  );
};

const ToggleItem = ({ label, desc, active }: { label: string, desc: string, active: boolean }) => (
    <div className="flex items-start justify-between group cursor-pointer">
        <div>
            <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">{label}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{desc}</div>
        </div>
        <button className={`text-2xl transition-colors ${active ? 'text-cyan-400' : 'text-slate-700'}`}>
            {active ? <ToggleRight /> : <ToggleLeft />}
        </button>
    </div>
);