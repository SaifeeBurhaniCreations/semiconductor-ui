import React, { useState, useEffect } from 'react';
import { LogicNode, NodeDetails, SystemModulesState } from '../types';
import { 
  X, Activity, Cpu, GitBranch, Layers, ShieldCheck, 
  Play, Database, AlertTriangle, Zap, Search, Terminal, CheckCircle, Lock, RotateCw, History, ArrowRightLeft
} from 'lucide-react';

interface NodeInspectorProps {
  node: LogicNode;
  details: NodeDetails;
  modulesStatus: SystemModulesState;
  onClose: () => void;
  onAction: (action: string) => void;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({ node, details, modulesStatus, onClose, onAction }) => {
  const [view, setView] = useState<'info' | 'provenance' | 'timeline'>('info');
  const [logs, setLogs] = useState<string[]>([]);

  // Simulation Logic (retained for quick action)
  const runQuickSim = () => {
    onAction('simulate');
    setLogs(['Quick check running...']);
    setTimeout(() => setLogs(p => [...p, 'Done.']), 1000);
  };

  return (
    <div className="h-full flex flex-col bg-quantum-900 border border-quantum-600 rounded-lg overflow-hidden shadow-2xl relative">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-quantum-800 border-b border-quantum-600 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 bg-cyan-500/10 rounded border border-cyan-500/30">
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 tracking-wide">{node.label}</h3>
            <span className="text-[10px] font-mono text-slate-500 uppercase">{node.type} | ID: {node.id}</span>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-quantum-950 border-b border-quantum-700">
          <TabButton label="Overview" active={view === 'info'} onClick={() => setView('info')} icon={<Activity className="w-3 h-3" />} />
          <TabButton label="Provenance" active={view === 'provenance'} onClick={() => setView('provenance')} icon={<GitBranch className="w-3 h-3" />} />
          <TabButton label="History" active={view === 'timeline'} onClick={() => setView('timeline')} icon={<History className="w-3 h-3" />} />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-quantum-900/50">
        
        {/* VIEW: INFO */}
        {view === 'info' && (
            <>
                {/* Status Banner */}
                <div className={`
                flex items-center justify-between p-3 rounded border
                ${node.status === 'active' ? 'bg-cyan-500/5 border-cyan-500/20' : 
                    node.status === 'error' ? 'bg-red-500/5 border-red-500/20' : 'bg-slate-800/30 border-slate-700'}
                `}>
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${node.status === 'active' ? 'bg-cyan-400 shadow-glow-cyan' : node.status === 'error' ? 'bg-red-500' : 'bg-slate-500'}`}></div>
                        <span className="text-xs font-mono font-bold uppercase text-slate-300">{node.status} STATE</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">T-00:00:02</span>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <KpiCard label="Health" value={`${details.state.health}%`} color="text-green-400" />
                    <KpiCard label="Uptime" value={details.state.uptime} color="text-slate-200" />
                    <KpiCard label="Threads" value={details.state.activeThreads} color="text-cyan-400" />
                    <KpiCard label="Ver" value={details.identity.version} color="text-purple-400" />
                </div>

                {/* AI Intelligence Layer */}
                <div className="relative p-3 rounded-lg border border-purple-500/20 bg-gradient-to-br from-purple-900/10 to-transparent">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="flex items-center text-xs font-bold text-purple-400 uppercase tracking-wider">
                        <Zap className="w-3 h-3 mr-2" /> AI Diagnosis
                        </h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded">
                        98.2% CONF
                        </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                        {details.intelligence.prediction}
                    </p>
                </div>
            </>
        )}

        {/* VIEW: PROVENANCE */}
        {view === 'provenance' && (
            <div className="space-y-4">
                 <div className="p-3 bg-quantum-950 border border-quantum-700 rounded-lg">
                     <h4 className="text-[10px] text-slate-500 uppercase font-bold mb-2">Upstream Inputs</h4>
                     <div className="space-y-2">
                         <div className="flex items-center justify-between text-xs text-slate-300 p-2 bg-quantum-900 rounded border border-quantum-800">
                             <div className="flex items-center"><ArrowRightLeft className="w-3 h-3 mr-2 text-slate-500" /> Wafer-Batch-A9</div>
                             <span className="text-[9px] bg-cyan-900/30 text-cyan-400 px-1 rounded">DIRECT</span>
                         </div>
                         <div className="flex items-center justify-between text-xs text-slate-300 p-2 bg-quantum-900 rounded border border-quantum-800">
                             <div className="flex items-center"><ArrowRightLeft className="w-3 h-3 mr-2 text-slate-500" /> Config-Set-2.1</div>
                             <span className="text-[9px] bg-slate-800 text-slate-500 px-1 rounded">REF</span>
                         </div>
                     </div>
                 </div>
                 <div className="flex justify-center"><div className="h-4 w-px bg-quantum-700"></div></div>
                 <div className="p-3 bg-cyan-900/10 border border-cyan-500/30 rounded-lg text-center">
                     <div className="text-xs font-bold text-cyan-400">{node.label}</div>
                     <div className="text-[9px] text-cyan-600 mt-1">Current Node</div>
                 </div>
                 <div className="flex justify-center"><div className="h-4 w-px bg-quantum-700"></div></div>
                 <div className="p-3 bg-quantum-950 border border-quantum-700 rounded-lg">
                     <h4 className="text-[10px] text-slate-500 uppercase font-bold mb-2">Downstream Impact</h4>
                     <div className="space-y-2">
                         <div className="flex items-center justify-between text-xs text-slate-300 p-2 bg-quantum-900 rounded border border-quantum-800">
                             <div className="flex items-center"><ArrowRightLeft className="w-3 h-3 mr-2 text-slate-500" /> Binning-System</div>
                             <span className="text-[9px] bg-orange-900/30 text-orange-400 px-1 rounded">CRITICAL</span>
                         </div>
                     </div>
                 </div>
            </div>
        )}

        {/* VIEW: TIMELINE */}
        {view === 'timeline' && (
            <div className="space-y-4 pl-2">
                 {[1,2,3,4].map(i => (
                     <div key={i} className="relative pl-4 border-l border-quantum-700 pb-2">
                         <div className="absolute -left-1 top-1 w-2 h-2 bg-quantum-600 rounded-full border border-quantum-900"></div>
                         <div className="text-[10px] text-slate-500 mb-0.5">Today, 10:0{i} AM</div>
                         <div className="text-xs font-medium text-slate-300">Parameter Update</div>
                         <div className="text-[10px] text-slate-500">Threshold adjusted by <span className="text-cyan-400">User-01</span></div>
                     </div>
                 ))}
            </div>
        )}

      </div>

      {/* Footer Actions */}
      <div className="p-3 bg-quantum-800 border-t border-quantum-600 flex justify-end space-x-2 shrink-0">
            <button className="p-2 hover:bg-quantum-700 rounded text-slate-400 hover:text-cyan-400 transition-colors" title="Export JSON"><Database className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-quantum-700 rounded text-slate-400 hover:text-green-400 transition-colors" title="Validate"><ShieldCheck className="w-4 h-4" /></button>
            <button className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded transition-colors flex items-center justify-center">
                <Search className="w-3 h-3 mr-2" /> Inspect Logs
            </button>
      </div>
    </div>
  );
};

const TabButton = ({ label, active, onClick, icon }: any) => (
    <button 
        onClick={onClick}
        className={`flex-1 py-2 text-xs flex items-center justify-center transition-colors border-b-2 ${
            active ? 'border-cyan-400 text-cyan-400 bg-quantum-900' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-quantum-800'
        }`}
    >
        {icon && <span className="mr-2 opacity-70">{icon}</span>}
        {label}
    </button>
);

const KpiCard = ({ label, value, color }: any) => (
    <div className="p-2 bg-quantum-950 border border-quantum-700 rounded">
        <div className="text-[10px] text-slate-500 uppercase">{label}</div>
        <div className={`text-sm font-mono font-bold ${color}`}>{value}</div>
    </div>
);