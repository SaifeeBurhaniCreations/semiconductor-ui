import React, { useState } from 'react';
import { 
    Search, Filter, GitCommit, Clock, AlertCircle, Share2, Download, Layers, 
    CheckCircle2, CircleDashed, List, X, FileJson, FileText, User, ShieldCheck
} from 'lucide-react';
import { LogicGraph } from './LogicGraph';
import { LogicNode, ModuleType, SystemModulesState, HandshakeState } from '../types';

// Mock Nodes for the Lineage View
const LINEAGE_NODES: LogicNode[] = [
    { id: 'root', label: 'Ingest: Wafer Data', type: ModuleType.SENSOR, status: 'active', x: 0, y: 0, connections: ['p1', 'p2'] },
    { id: 'p1', label: 'Process: Etch', type: ModuleType.LOGIC, status: 'active', x: 0, y: 0, connections: ['q1'] },
    { id: 'p2', label: 'Process: Litho', type: ModuleType.LOGIC, status: 'idle', x: 0, y: 0, connections: ['q1'] },
    { id: 'q1', label: 'QC: Optical Inspection', type: ModuleType.AI_CORE, status: 'error', x: 0, y: 0, connections: ['out'] },
    { id: 'out', label: 'Output: Binning', type: ModuleType.ACTUATOR, status: 'active', x: 0, y: 0, connections: [] },
];

const AUDIT_LOGS = [
    { id: 'AUD-001', time: '10:42:15', user: 'ENG-04', action: 'Param Update', target: 'Process: Etch', details: 'Threshold set to 0.45' },
    { id: 'AUD-002', time: '10:45:00', user: 'SYS-AUTO', action: 'Validation Pass', target: 'QC: Optical', details: 'Checksum verified' },
    { id: 'AUD-003', time: '11:02:30', user: 'ADMIN', action: 'Override', target: 'Output: Binning', details: 'Manual gate release' },
    { id: 'AUD-004', time: '11:15:10', user: 'ENG-01', action: 'Config Change', target: 'Process: Litho', details: 'Rolled back to v2.1' },
];

interface LineageViewProps {
    modulesStatus: SystemModulesState;
}

const ModuleHealthPill = ({ label, status }: { label: string, status: HandshakeState }) => (
    <div className="flex items-center space-x-1.5 px-2 py-1 bg-quantum-950 border border-quantum-700 rounded text-[10px] font-mono">
        {status === 'success' ? <CheckCircle2 className="w-3 h-3 text-quantum-success" /> : <CircleDashed className="w-3 h-3 text-quantum-warn animate-spin" />}
        <span className={status === 'success' ? 'text-slate-300' : 'text-slate-500'}>{label}</span>
    </div>
);

export const LineageView: React.FC<LineageViewProps> = ({ modulesStatus }) => {
  const [viewMode, setViewMode] = useState<'graph' | 'audit'>('graph');
  const [showQueue, setShowQueue] = useState(true);

  return (
    <div className="flex flex-col h-full bg-quantum-900/30 rounded-lg overflow-hidden border border-quantum-600/50 relative">
        {/* Toolbar & Health */}
        <div className="h-12 border-b border-quantum-600 bg-quantum-900 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                     <ModuleHealthPill label="CORE" status={modulesStatus.quantumCore} />
                     <ModuleHealthPill label="DOCS" status={modulesStatus.document} />
                     <ModuleHealthPill label="CONF" status={modulesStatus.configuration} />
                </div>
                <div className="h-4 w-px bg-quantum-700"></div>
                <div className="flex space-x-1 bg-quantum-950 rounded p-0.5 border border-quantum-700">
                    <button 
                        onClick={() => setViewMode('graph')}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${viewMode === 'graph' ? 'bg-quantum-700 text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        Graph
                    </button>
                    <button 
                        onClick={() => setViewMode('audit')}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${viewMode === 'audit' ? 'bg-quantum-700 text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        Audit Trail
                    </button>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                 <div className="relative">
                    <Search className="w-3 h-3 absolute left-2.5 top-2 text-slate-500" />
                    <input 
                        type="text" 
                        placeholder={viewMode === 'graph' ? "Search lineage..." : "Filter audit logs..."}
                        className="h-7 pl-8 pr-3 bg-quantum-950 border border-quantum-700 rounded text-xs text-slate-300 focus:border-cyan-500/50 focus:outline-none w-48"
                    />
                </div>
                 <button className="h-7 px-2 flex items-center bg-quantum-800 border border-quantum-700 rounded text-xs text-slate-400 hover:text-slate-200">
                    <Clock className="w-3 h-3 mr-1.5" /> 24h
                </button>
                <button className="p-1.5 text-slate-400 hover:text-cyan-400" title="Export Trace">
                    <Download className="w-4 h-4" />
                </button>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden relative">
            {/* Main Canvas / Table */}
            <div className="flex-1 relative bg-quantum-950 flex flex-col">
                 
                 {viewMode === 'graph' ? (
                     <>
                        <div className="flex-1 relative">
                             <LogicGraph nodes={LINEAGE_NODES} />
                             
                             {/* Floating Insights Panel */}
                             <div className="absolute top-4 left-4 w-64 bg-quantum-900/90 backdrop-blur border border-quantum-600 rounded-lg p-3 shadow-2xl z-10">
                                 <h4 className="text-xs font-bold text-slate-300 uppercase mb-2 flex items-center justify-between">
                                     <span className="flex items-center"><Layers className="w-3 h-3 mr-2 text-purple-400" /> Insights</span>
                                     <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1 rounded">LIVE</span>
                                 </h4>
                                 <div className="space-y-2">
                                     <div className="flex items-start space-x-2 text-xs">
                                         <AlertCircle className="w-3 h-3 text-red-500 mt-0.5 shrink-0" />
                                         <span className="text-slate-400 leading-snug">Bottleneck at <span className="text-slate-200 font-mono">QC: Optical</span>. Latency +45ms.</span>
                                     </div>
                                 </div>
                             </div>
                        </div>

                        {/* Queued Jobs Panel (Bottom) */}
                        {showQueue && (
                            <div className="absolute bottom-4 left-4 right-4 h-32 bg-quantum-900/95 backdrop-blur border border-quantum-600 rounded-lg shadow-xl flex flex-col z-10 animate-in slide-in-from-bottom-5">
                                <div className="flex items-center justify-between px-3 py-2 border-b border-quantum-700 bg-quantum-800/50">
                                    <div className="flex items-center space-x-2">
                                        <List className="w-3 h-3 text-slate-400" />
                                        <span className="text-xs font-bold text-slate-300 uppercase">Simulation Queue</span>
                                    </div>
                                    <button onClick={() => setShowQueue(false)} className="text-slate-500 hover:text-slate-300"><X className="w-3 h-3" /></button>
                                </div>
                                <div className="flex-1 overflow-auto p-0">
                                    <table className="w-full text-left text-[10px] font-mono">
                                        <thead className="text-slate-500 bg-quantum-950/50 sticky top-0">
                                            <tr>
                                                <th className="px-3 py-1 font-normal">Job ID</th>
                                                <th className="px-3 py-1 font-normal">Target</th>
                                                <th className="px-3 py-1 font-normal">Priority</th>
                                                <th className="px-3 py-1 font-normal">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-slate-300 divide-y divide-quantum-800">
                                            <tr>
                                                <td className="px-3 py-1.5">SIM-902</td>
                                                <td className="px-3 py-1.5">Full-Lot Stress</td>
                                                <td className="px-3 py-1.5 text-orange-400">HIGH</td>
                                                <td className="px-3 py-1.5 text-slate-500">Queued</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                     </>
                 ) : (
                    <div className="flex-1 overflow-auto p-4">
                        <div className="bg-quantum-900 border border-quantum-700 rounded-lg overflow-hidden">
                            <table className="w-full text-left text-xs text-slate-300">
                                <thead className="bg-quantum-800 text-slate-500 uppercase font-bold text-[10px]">
                                    <tr>
                                        <th className="px-4 py-3">Event ID</th>
                                        <th className="px-4 py-3">Timestamp</th>
                                        <th className="px-4 py-3">User</th>
                                        <th className="px-4 py-3">Action</th>
                                        <th className="px-4 py-3">Target Node</th>
                                        <th className="px-4 py-3">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-quantum-800">
                                    {AUDIT_LOGS.map(log => (
                                        <tr key={log.id} className="hover:bg-quantum-800/50 transition-colors">
                                            <td className="px-4 py-3 font-mono text-slate-500">{log.id}</td>
                                            <td className="px-4 py-3 font-mono">{log.time}</td>
                                            <td className="px-4 py-3 flex items-center">
                                                <User className="w-3 h-3 mr-2 text-cyan-500" /> {log.user}
                                            </td>
                                            <td className="px-4 py-3 font-bold text-slate-200">{log.action}</td>
                                            <td className="px-4 py-3 text-cyan-400">{log.target}</td>
                                            <td className="px-4 py-3 text-slate-400 italic">{log.details}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                 )}
            </div>

            {/* Right Side: Timeline/Provenance */}
            <div className="w-72 bg-quantum-900 border-l border-quantum-600 flex flex-col z-20 shadow-xl">
                <div className="p-3 border-b border-quantum-600 bg-quantum-800 flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                        {viewMode === 'graph' ? 'Timeline' : 'Export Options'}
                    </h3>
                    {viewMode === 'graph' && <Filter className="w-3 h-3 text-slate-500 cursor-pointer hover:text-cyan-400" />}
                </div>
                
                {viewMode === 'graph' ? (
                    <div className="flex-1 overflow-y-auto p-3 space-y-5 custom-scrollbar bg-quantum-900">
                        {[1,2,3,4,5].map((i) => (
                            <div key={i} className="relative pl-4 border-l border-quantum-700 last:border-0 group cursor-pointer">
                                <div className={`absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full border-2 border-quantum-900 transition-colors ${i===1 ? 'bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'bg-slate-700 group-hover:bg-slate-500'}`}></div>
                                <div className="flex justify-between items-start mb-0.5">
                                    <span className="text-[10px] text-slate-500 font-mono">10:42:{10+i}</span>
                                    {i===1 && <span className="text-[9px] bg-green-900/30 text-green-400 px-1 rounded border border-green-500/20">PASSED</span>}
                                </div>
                                <div className="text-xs font-medium text-slate-200 group-hover:text-cyan-400 transition-colors">Validation Check</div>
                                <div className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                                    Node <span className="text-slate-300">QC: Optical</span> compliance verified.
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-4 space-y-4">
                        <div className="bg-quantum-950 p-3 rounded border border-quantum-700">
                            <h4 className="text-xs font-bold text-slate-300 mb-2">Data Selection</h4>
                            <label className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
                                <input type="checkbox" checked className="rounded bg-quantum-900 border-quantum-700 text-cyan-500 focus:ring-0" />
                                <span>Audit Logs</span>
                            </label>
                            <label className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
                                <input type="checkbox" checked className="rounded bg-quantum-900 border-quantum-700 text-cyan-500 focus:ring-0" />
                                <span>Chain of Custody</span>
                            </label>
                             <label className="flex items-center space-x-2 text-xs text-slate-400">
                                <input type="checkbox" className="rounded bg-quantum-900 border-quantum-700 text-cyan-500 focus:ring-0" />
                                <span>Snapshots</span>
                            </label>
                        </div>
                        <button className="w-full py-2 bg-quantum-800 border border-quantum-600 rounded text-xs text-slate-300 hover:text-cyan-400 flex items-center justify-center">
                            <FileJson className="w-3 h-3 mr-2" /> Export JSON
                        </button>
                        <button className="w-full py-2 bg-quantum-800 border border-quantum-600 rounded text-xs text-slate-300 hover:text-cyan-400 flex items-center justify-center">
                            <FileText className="w-3 h-3 mr-2" /> Export Signed PDF
                        </button>
                        <div className="mt-4 flex items-start space-x-2 p-2 bg-green-900/20 rounded border border-green-500/20">
                            <ShieldCheck className="w-4 h-4 text-green-500 mt-0.5" />
                            <p className="text-[10px] text-slate-400 leading-snug">Exports are cryptographically signed by the Quantum Core Authority.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};