import React from 'react';
import { LogicNode, NodeDetails } from '../types';
import { 
  X, Activity, Cpu, GitBranch, Layers, ShieldCheck, 
  Play, Database, AlertTriangle, Zap, Search
} from 'lucide-react';

interface NodeInspectorProps {
  node: LogicNode;
  details: NodeDetails;
  onClose: () => void;
  onAction: (action: string) => void;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({ node, details, onClose, onAction }) => {
  return (
    <div className="h-full flex flex-col bg-quantum-900 border border-quantum-600 rounded-lg overflow-hidden shadow-2xl relative">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-quantum-800 border-b border-quantum-600">
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

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        
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

        {/* Identity Profile */}
        <div>
          <h4 className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3 h-3 mr-2" /> Identity Profile
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
             <div className="p-2 bg-quantum-950 border border-quantum-700 rounded">
               <span className="block text-slate-600 mb-1">ROLE</span>
               <span className="text-slate-300">{details.identity.role}</span>
             </div>
             <div className="p-2 bg-quantum-950 border border-quantum-700 rounded">
               <span className="block text-slate-600 mb-1">CATEGORY</span>
               <span className="text-slate-300">{details.identity.category}</span>
             </div>
             <div className="p-2 bg-quantum-950 border border-quantum-700 rounded">
               <span className="block text-slate-600 mb-1">VERSION</span>
               <span className="text-cyan-400">{details.identity.version}</span>
             </div>
             <div className="p-2 bg-quantum-950 border border-quantum-700 rounded">
               <span className="block text-slate-600 mb-1">DEPENDENCIES</span>
               <span className="text-slate-300">{details.identity.dependencies} Nodes</span>
             </div>
          </div>
        </div>

        {/* AI Intelligence Layer */}
        <div className="relative p-3 rounded-lg border border-purple-500/20 bg-gradient-to-br from-purple-900/10 to-transparent">
          <div className="flex items-center justify-between mb-2">
            <h4 className="flex items-center text-xs font-bold text-purple-400 uppercase tracking-wider">
              <Zap className="w-3 h-3 mr-2" /> AI Diagnosis
            </h4>
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded">
              CONFIDENCE: 98.2%
            </span>
          </div>
          
          <div className="space-y-2 mb-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Optimization Score</span>
              <span className="text-slate-200 font-mono">{details.intelligence.optimizationScore}/100</span>
            </div>
            <div className="w-full bg-quantum-950 h-1 rounded-full overflow-hidden">
               <div className="h-full bg-purple-500" style={{ width: `${details.intelligence.optimizationScore}%` }}></div>
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {details.intelligence.prediction}
            </p>
          </div>
          
          <button 
            onClick={() => onAction('analyze')}
            className="w-full py-1.5 flex items-center justify-center text-xs bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded transition-colors"
          >
            <Search className="w-3 h-3 mr-1.5" /> RUN DEEP ANALYSIS
          </button>
        </div>

        {/* State Metrics */}
        <div>
           <h4 className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            <Activity className="w-3 h-3 mr-2" /> Live Telemetry
          </h4>
          <div className="space-y-2">
            <MetricRow label="Active Threads" value={details.state.activeThreads} unit="" />
            <MetricRow label="Health Integrity" value={details.state.health} unit="%" color={details.state.health > 90 ? 'text-green-400' : 'text-yellow-400'} />
            <MetricRow label="Last Execution" value={details.state.lastExecution} unit="" />
            <MetricRow label="System Uptime" value={details.state.uptime} unit="" />
          </div>
        </div>

      </div>

      {/* Action Footer */}
      <div className="p-3 bg-quantum-800 border-t border-quantum-600 grid grid-cols-2 gap-2">
        <button 
           onClick={() => onAction('simulate')}
           className="flex items-center justify-center px-3 py-2 bg-quantum-700 hover:bg-quantum-600 text-slate-200 text-xs font-bold rounded border border-quantum-600 transition-colors"
        >
          <Play className="w-3 h-3 mr-2" /> SIMULATE
        </button>
        <button 
           onClick={() => onAction('validate')}
           className="flex items-center justify-center px-3 py-2 bg-cyan-900/20 hover:bg-cyan-900/30 text-cyan-400 text-xs font-bold rounded border border-cyan-500/30 transition-colors"
        >
          <ShieldCheck className="w-3 h-3 mr-2" /> VALIDATE
        </button>
      </div>

    </div>
  );
};

const MetricRow = ({ label, value, unit, color = 'text-slate-200' }: any) => (
  <div className="flex justify-between items-center text-xs py-1 border-b border-quantum-700/50 last:border-0">
    <span className="text-slate-500 font-mono">{label}</span>
    <span className={`font-mono ${color}`}>{value}{unit}</span>
  </div>
);