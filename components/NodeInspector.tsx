import React, { useState, useEffect } from 'react';
import { LogicNode, NodeDetails, SystemModulesState } from '../types';
import { 
  X, Activity, Cpu, GitBranch, Layers, ShieldCheck, 
  Play, Database, AlertTriangle, Zap, Search, Terminal, CheckCircle, Lock, RotateCw
} from 'lucide-react';

interface NodeInspectorProps {
  node: LogicNode;
  details: NodeDetails;
  modulesStatus: SystemModulesState;
  onClose: () => void;
  onAction: (action: string) => void;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({ node, details, modulesStatus, onClose, onAction }) => {
  const [view, setView] = useState<'info' | 'validating' | 'simulating' | 'analytics'>('info');
  const [logs, setLogs] = useState<string[]>([]);
  const [validationSteps, setValidationSteps] = useState([
      { name: 'Schema Integrity', status: 'pending' },
      { name: 'Metadata Presence', status: 'pending' },
      { name: 'Cyclic Dependency Check', status: 'pending' },
      { name: 'Safety Constraints', status: 'pending' },
  ]);
  const [isValidated, setIsValidated] = useState(false);

  // Validation Flow
  const startValidation = () => {
      setView('validating');
      onAction('validate');
      const steps = [...validationSteps];
      
      steps.forEach((step, idx) => {
          setTimeout(() => {
              setValidationSteps(prev => {
                  const newSteps = [...prev];
                  newSteps[idx].status = 'success';
                  return newSteps;
              });
              if(idx === steps.length - 1) setIsValidated(true);
          }, 600 * (idx + 1));
      });
  };

  // Simulation Flow
  const startSimulation = () => {
      if (modulesStatus.quantumCore !== 'success') return;
      setView('simulating');
      onAction('simulate');
      setLogs(['Initializing Digital Twin environment...']);
      
      let count = 0;
      const interval = setInterval(() => {
          count++;
          setLogs(prev => [...prev, `[${Date.now()}] T+${count}ms: Cycle logic verified. Temp: ${(300 + Math.random()*20).toFixed(1)}K`]);
          if (count > 8) {
              clearInterval(interval);
              setLogs(prev => [...prev, `[${Date.now()}] SIMULATION COMPLETE. YIELD: 99.4%`]);
          }
      }, 500);
  };

  // Render Check Item
  const CheckItem = ({ label, status }: { label: string, status: string }) => (
      <div className="flex items-center justify-between p-2 bg-quantum-950/50 rounded border border-quantum-700">
          <span className="text-xs text-slate-300 font-mono">{label}</span>
          {status === 'pending' && <span className="w-3 h-3 border-2 border-slate-600 border-t-slate-300 rounded-full animate-spin"></span>}
          {status === 'success' && <CheckCircle className="w-4 h-4 text-quantum-success" />}
      </div>
  );

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

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        
        {/* VIEW: INFO (Default) */}
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
                </div>
            </>
        )}

        {/* VIEW: VALIDATING */}
        {view === 'validating' && (
            <div className="space-y-3">
                <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-4">
                    <ShieldCheck className="w-4 h-4 animate-pulse" />
                    <span>RUNNING COMPLIANCE CHECKS...</span>
                </div>
                {validationSteps.map((step, i) => <CheckItem key={i} label={step.name} status={step.status} />)}
                {isValidated && (
                     <div className="mt-4 p-2 bg-green-500/10 border border-green-500/30 rounded text-center">
                         <span className="text-xs text-green-400 font-bold">NODE CERTIFIED</span>
                         <button onClick={() => setView('info')} className="block w-full mt-2 text-[10px] underline text-slate-400">Return to Overview</button>
                     </div>
                )}
            </div>
        )}

        {/* VIEW: SIMULATING */}
        {view === 'simulating' && (
            <div className="flex flex-col h-full min-h-[300px]">
                 <div className="flex items-center justify-between mb-2">
                     <span className="text-xs font-mono text-cyan-400">DIGITAL TWIN TERMINAL</span>
                     <span className="text-[10px] text-slate-500">LIVE</span>
                 </div>
                 <div className="flex-1 bg-black/50 border border-quantum-700 rounded p-2 font-mono text-[10px] text-slate-300 overflow-y-auto">
                     {logs.map((l, i) => <div key={i}>{l}</div>)}
                     <div className="animate-pulse">_</div>
                 </div>
                 <button onClick={() => setView('info')} className="mt-2 text-xs text-slate-500 hover:text-slate-300">Close Simulation</button>
            </div>
        )}

      </div>

      {/* Action Footer */}
      {view === 'info' && (
        <div className="p-3 bg-quantum-800 border-t border-quantum-600 grid grid-cols-2 gap-2 shrink-0">
            <button 
                onClick={startSimulation}
                disabled={modulesStatus.quantumCore !== 'success' || !isValidated}
                className="group relative flex items-center justify-center px-3 py-2 bg-quantum-700 hover:bg-quantum-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-200 text-xs font-bold rounded border border-quantum-600 transition-colors"
            >
            {modulesStatus.quantumCore !== 'success' ? (
                 <Lock className="w-3 h-3 mr-2" /> 
            ) : (
                 <Play className="w-3 h-3 mr-2" />
            )}
            SIMULATE
            
            {/* Tooltip for disabled state */}
            {modulesStatus.quantumCore !== 'success' && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-40 p-2 bg-black border border-quantum-600 text-[10px] text-slate-300 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Requires Quantum Core Handshake
                </div>
            )}
            </button>
            <button 
                onClick={startValidation}
                className="flex items-center justify-center px-3 py-2 bg-cyan-900/20 hover:bg-cyan-900/30 text-cyan-400 text-xs font-bold rounded border border-cyan-500/30 transition-colors"
            >
            <ShieldCheck className="w-3 h-3 mr-2" /> VALIDATE
            </button>
        </div>
      )}

    </div>
  );
};

const MetricRow = ({ label, value, unit, color = 'text-slate-200' }: any) => (
  <div className="flex justify-between items-center text-xs py-1 border-b border-quantum-700/50 last:border-0">
    <span className="text-slate-500 font-mono">{label}</span>
    <span className={`font-mono ${color}`}>{value}{unit}</span>
  </div>
);