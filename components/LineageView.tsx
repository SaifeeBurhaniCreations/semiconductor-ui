import React from 'react';
import { Search, Filter, GitCommit, Clock, AlertCircle, Share2, Download, Layers } from 'lucide-react';
import { LogicGraph } from './LogicGraph';
import { LogicNode, ModuleType } from '../types';

// Mock Nodes for the Lineage View (more complex than main dashboard)
const LINEAGE_NODES: LogicNode[] = [
    { id: 'root', label: 'Ingest: Wafer Data', type: ModuleType.SENSOR, status: 'active', x: 0, y: 0, connections: ['p1', 'p2'] },
    { id: 'p1', label: 'Process: Etch', type: ModuleType.LOGIC, status: 'active', x: 0, y: 0, connections: ['q1'] },
    { id: 'p2', label: 'Process: Litho', type: ModuleType.LOGIC, status: 'idle', x: 0, y: 0, connections: ['q1'] },
    { id: 'q1', label: 'QC: Optical Inspection', type: ModuleType.AI_CORE, status: 'error', x: 0, y: 0, connections: ['out'] },
    { id: 'out', label: 'Output: Binning', type: ModuleType.ACTUATOR, status: 'active', x: 0, y: 0, connections: [] },
];

export const LineageView: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-quantum-900/30 rounded-lg overflow-hidden border border-quantum-600/50">
        {/* Toolbar */}
        <div className="h-12 border-b border-quantum-600 bg-quantum-900 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center space-x-2">
                <div className="relative">
                    <Search className="w-3 h-3 absolute left-2.5 top-2 text-slate-500" />
                    <input 
                        type="text" 
                        placeholder="Search node ID, lot, or tag..."
                        className="h-7 pl-8 pr-3 bg-quantum-950 border border-quantum-700 rounded text-xs text-slate-300 focus:border-cyan-500/50 focus:outline-none w-64"
                    />
                </div>
                <button className="h-7 px-2 flex items-center bg-quantum-800 border border-quantum-700 rounded text-xs text-slate-400 hover:text-slate-200">
                    <Filter className="w-3 h-3 mr-1.5" /> Filter
                </button>
            </div>
            <div className="flex items-center space-x-2">
                 <button className="h-7 px-2 flex items-center bg-quantum-800 border border-quantum-700 rounded text-xs text-slate-400 hover:text-slate-200">
                    <Clock className="w-3 h-3 mr-1.5" /> History
                </button>
                <div className="h-4 w-px bg-quantum-700 mx-1"></div>
                 <button className="p-1.5 text-slate-400 hover:text-cyan-400">
                    <Share2 className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-slate-400 hover:text-cyan-400">
                    <Download className="w-4 h-4" />
                </button>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
            {/* Main Canvas */}
            <div className="flex-1 relative bg-quantum-950">
                 <LogicGraph nodes={LINEAGE_NODES} />
                 
                 {/* Floating Insights Panel */}
                 <div className="absolute bottom-4 left-4 w-64 bg-quantum-900/90 backdrop-blur border border-quantum-600 rounded-lg p-3 shadow-2xl">
                     <h4 className="text-xs font-bold text-slate-300 uppercase mb-2 flex items-center">
                         <Layers className="w-3 h-3 mr-2 text-purple-400" /> Active Insights
                     </h4>
                     <div className="space-y-2">
                         <div className="flex items-start space-x-2 text-xs">
                             <AlertCircle className="w-3 h-3 text-red-500 mt-0.5" />
                             <span className="text-slate-400">Bottleneck detected at <span className="text-slate-200 font-mono">QC: Optical</span>. Latency +45ms.</span>
                         </div>
                         <div className="flex items-start space-x-2 text-xs">
                             <GitCommit className="w-3 h-3 text-cyan-500 mt-0.5" />
                             <span className="text-slate-400">Version v2.1 applied to <span className="text-slate-200 font-mono">Process: Etch</span> 10m ago.</span>
                         </div>
                     </div>
                 </div>
            </div>

            {/* Right Side: Timeline/Provenance */}
            <div className="w-72 bg-quantum-900 border-l border-quantum-600 flex flex-col">
                <div className="p-3 border-b border-quantum-600 bg-quantum-800">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide">Provenance Timeline</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
                    {[1,2,3,4,5].map((i) => (
                        <div key={i} className="relative pl-4 pb-4 border-l border-quantum-700 last:border-0">
                            <div className={`absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full border-2 border-quantum-900 ${i===1 ? 'bg-cyan-500' : 'bg-slate-600'}`}></div>
                            <div className="text-[10px] text-slate-500 font-mono mb-0.5">Today, 10:42:{10+i}</div>
                            <div className="text-xs font-medium text-slate-300">Validation Check Passed</div>
                            <div className="text-[10px] text-slate-500 mt-1">Node <span className="text-cyan-400">QC: Optical</span> marked as compliant by Auto-Auditor.</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};