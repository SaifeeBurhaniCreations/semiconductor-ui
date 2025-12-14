
import React, { useState, useEffect } from 'react';
import { 
    BrainCircuit, CheckCircle, XCircle, AlertTriangle, RefreshCw, 
    Flag, Search, ChevronRight, BarChart2, ShieldAlert, Activity,
    TrendingUp, GitCommit, Sliders, History, FileText, ChevronLeft,
    Play, AlertOctagon, Scale, Users, Zap, Check
} from 'lucide-react';
import { 
    ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';
import { VisualObject } from './VisualObject';

// --- MOCK DATA ---

const INITIAL_DECISIONS = [
    { id: 'DEC-902', type: 'Optimization', target: 'Cooling Loop A', category: 'Machine', variant: 'chamber', action: 'Increase Flow +15%', conf: 92, status: 'pending', time: '10:42:05', risk: 'Low', model: 'v4.2.1' },
    { id: 'DEC-903', type: 'Safety', target: 'Pressure Valve 4', category: 'Sensor', variant: 'thermal', action: 'Emergency Release', conf: 99, status: 'approved', time: '10:38:12', risk: 'High', model: 'v4.1.0-safe' },
    { id: 'DEC-904', type: 'Routing', target: 'Logic Node 7', category: 'Process', variant: 'inspection', action: 'Bypass Sector 4', conf: 45, status: 'flagged', time: '10:15:00', risk: 'Medium', model: 'v4.2.1' },
    { id: 'DEC-905', type: 'Maintenance', target: 'Servo Arm B', category: 'Machine', variant: 'robot', action: 'Schedule Service', conf: 88, status: 'rejected', time: '09:50:22', risk: 'Low', model: 'v4.2.1' },
    { id: 'DEC-906', type: 'Quality', target: 'Optical Inspect', category: 'Process', variant: 'inspection', action: 'Flag Defect', conf: 96, status: 'approved', time: '09:45:10', risk: 'Low', model: 'v3.9.5' },
];

const FEATURE_IMPORTANCE = [
    { feature: 'Temp Variance', score: 85, color: 'from-orange-500 to-red-500', icon: <Zap className="w-3 h-3" /> },
    { feature: 'Vibration', score: 65, color: 'from-blue-500 to-cyan-500', icon: <Activity className="w-3 h-3" /> },
    { feature: 'Hist. Failures', score: 45, color: 'from-purple-500 to-pink-500', icon: <History className="w-3 h-3" /> },
    { feature: 'Power Draw', score: 30, color: 'from-yellow-500 to-orange-500', icon: <Zap className="w-3 h-3" /> },
    { feature: 'Throughput', score: 20, color: 'from-emerald-500 to-green-500', icon: <BarChart2 className="w-3 h-3" /> },
];

const DRIFT_DATA = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    accuracy: 98 - (i * 0.1) - (Math.random() * 2),
    drift: 2 + (i * 0.15) + (Math.random()),
    threshold: 15
}));

const AUDIT_LOGS = [
    { id: 'AUD-882', user: 'Dr. Vance', action: 'Override', reason: 'Contextual maintenance scheduled', time: '2h ago', decisionId: 'DEC-905' },
    { id: 'AUD-881', user: 'Sys_Auto', action: 'Auto-Approve', reason: 'Confidence > 98%', time: '3h ago', decisionId: 'DEC-903' },
    { id: 'AUD-880', user: 'Eng_Lee', action: 'Flag Drift', reason: 'False positive on vibration', time: '5h ago', decisionId: 'DEC-899' },
];

export const AIOversightView: React.FC = () => {
    const [view, setView] = useState<'feed' | 'detail' | 'drift' | 'governance' | 'simulator'>('feed');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [decisions, setDecisions] = useState(INITIAL_DECISIONS);
    const [simParams, setSimParams] = useState({ temp: 140, pressure: 50, vibration: 0.1 });

    const selectedDecision = decisions.find(d => d.id === selectedId) || decisions[0];

    // Helper to navigate
    const openDetail = (id: string) => {
        setSelectedId(id);
        setView('detail');
    };

    const handleAction = (id: string, newStatus: string) => {
        setDecisions(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
        // We stay on the detail view to show the result
    };

    return (
        <div className="flex flex-col h-full bg-quantum-900 border border-quantum-600 rounded-lg overflow-hidden relative">
            
            {/* Navigation Header */}
            <div className="h-14 border-b border-quantum-600 bg-quantum-800 flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center space-x-4">
                    {view === 'detail' && (
                        <button onClick={() => setView('feed')} className="p-1.5 rounded hover:bg-quantum-700 text-slate-400 hover:text-slate-200">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    )}
                    <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center">
                        <BrainCircuit className="w-4 h-4 mr-2 text-purple-400" /> 
                        {view === 'feed' && 'AI Decision Stream'}
                        {view === 'detail' && 'Reasoning Inspection'}
                        {view === 'drift' && 'Model Drift & Stability'}
                        {view === 'governance' && 'Governance & Audit'}
                        {view === 'simulator' && 'Counterfactual Simulator'}
                    </h2>
                </div>
                
                {view !== 'detail' && (
                    <div className="flex bg-quantum-950 p-1 rounded border border-quantum-700">
                        <NavTab label="Feed" active={view === 'feed'} onClick={() => setView('feed')} icon={<Activity className="w-3 h-3" />} />
                        <NavTab label="Drift" active={view === 'drift'} onClick={() => setView('drift')} icon={<TrendingUp className="w-3 h-3" />} />
                        <NavTab label="Governance" active={view === 'governance'} onClick={() => setView('governance')} icon={<ShieldAlert className="w-3 h-3" />} />
                        <NavTab label="Simulator" active={view === 'simulator'} onClick={() => setView('simulator')} icon={<Sliders className="w-3 h-3" />} />
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden bg-quantum-950/50 relative">
                
                {/* --- PAGE 1: FEED --- */}
                {view === 'feed' && (
                    <div className="flex h-full">
                        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-4">
                            {decisions.map(dec => (
                                <div 
                                    key={dec.id}
                                    onClick={() => openDetail(dec.id)}
                                    className="bg-quantum-900 border border-quantum-700 hover:border-purple-500/50 p-4 rounded-lg cursor-pointer group transition-all relative overflow-hidden"
                                >
                                    <div className="flex justify-between items-start mb-2 relative z-10">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-2.5 bg-quantum-950 rounded border border-quantum-800 text-purple-400">
                                                <VisualObject category={dec.category as any} variant={dec.variant} size={24} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-200 group-hover:text-purple-300 transition-colors">{dec.action}</div>
                                                <div className="text-xs text-slate-500">{dec.target} • {dec.time}</div>
                                            </div>
                                        </div>
                                        <RiskBadge risk={dec.risk} />
                                    </div>
                                    
                                    <div className="mt-3 relative z-10">
                                        <div className="flex justify-between text-[10px] text-slate-400 mb-1 uppercase font-bold">
                                            <span>Confidence</span>
                                            <span>{dec.conf}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-quantum-950 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${dec.conf < 70 ? 'bg-red-500' : dec.conf < 90 ? 'bg-orange-500' : 'bg-green-500'}`} 
                                                style={{ width: `${dec.conf}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Action Status Overlay */}
                                    <div className="absolute right-4 bottom-4 opacity-50">
                                        {dec.status === 'approved' && <CheckCircle className="w-12 h-12 text-green-900/50" />}
                                        {dec.status === 'rejected' && <XCircle className="w-12 h-12 text-red-900/50" />}
                                        {dec.status === 'flagged' && <Flag className="w-12 h-12 text-orange-900/50" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Right Summary Panel */}
                        <div className="w-72 bg-quantum-900 border-l border-quantum-600 p-6 flex flex-col">
                            <h3 className="text-xs font-bold text-slate-200 uppercase mb-4 tracking-widest">Feed Insights</h3>
                            <div className="space-y-4">
                                <div className="p-3 bg-red-900/10 border border-red-500/20 rounded">
                                    <div className="text-2xl font-bold text-red-400">12%</div>
                                    <div className="text-[10px] text-red-300/70 uppercase">High Risk Decisions</div>
                                </div>
                                <div className="p-3 bg-purple-900/10 border border-purple-500/20 rounded">
                                    <div className="text-2xl font-bold text-purple-400">94.2%</div>
                                    <div className="text-[10px] text-purple-300/70 uppercase">Avg. Confidence</div>
                                </div>
                            </div>
                            
                            <div className="mt-8">
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Active Filters</h4>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 bg-quantum-800 rounded text-[10px] text-slate-300 border border-quantum-700 flex items-center">
                                        Risk: High <XCircle className="w-3 h-3 ml-1 cursor-pointer hover:text-white" />
                                    </span>
                                    <span className="px-2 py-1 bg-quantum-800 rounded text-[10px] text-slate-300 border border-quantum-700 flex items-center">
                                        Model: v4.2+ <XCircle className="w-3 h-3 ml-1 cursor-pointer hover:text-white" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- PAGE 2: DETAIL VIEW --- */}
                {view === 'detail' && (
                    <div className="flex h-full p-6 gap-6">
                        {/* Column 1: Context */}
                        <div className="w-1/4 bg-quantum-900 border border-quantum-700 rounded-lg p-5">
                            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center">
                                <FileText className="w-4 h-4 mr-2 text-cyan-400" /> Decision Context
                            </h3>
                            <div className="flex flex-col items-center mb-6 p-4 bg-quantum-950 border border-quantum-800 rounded-lg">
                                <div className="text-cyan-400 mb-2">
                                    <VisualObject category={selectedDecision.category as any} variant={selectedDecision.variant} size={64} />
                                </div>
                                <div className="text-sm font-bold text-slate-200">{selectedDecision.target}</div>
                                <div className="text-xs text-slate-500 font-mono uppercase">{selectedDecision.category}</div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold">Model Version</div>
                                    <div className="text-sm text-slate-200 font-mono bg-quantum-950 px-2 py-1 rounded border border-quantum-800 mt-1">
                                        {selectedDecision.model}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold">Input Snapshot (T-0)</div>
                                    <div className="mt-1 space-y-1">
                                        <div className="flex justify-between text-xs text-slate-400 border-b border-quantum-800 pb-1">
                                            <span>Temp</span> <span className="font-mono text-slate-200">142.4 K</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-400 border-b border-quantum-800 pb-1">
                                            <span>Vibration</span> <span className="font-mono text-red-400">0.82 g</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-400 border-b border-quantum-800 pb-1">
                                            <span>Load</span> <span className="font-mono text-slate-200">88%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Reasoning (ENHANCED GRAPH) */}
                        <div className="flex-1 bg-quantum-900 border border-quantum-700 rounded-lg p-5 flex flex-col">
                            <h3 className="text-sm font-bold text-slate-200 mb-6 flex items-center">
                                <BrainCircuit className="w-4 h-4 mr-2 text-purple-400" /> Feature Weighted Analysis
                            </h3>
                            
                            <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                                {FEATURE_IMPORTANCE.map((item, index) => (
                                    <div key={index} className="group">
                                        <div className="flex justify-between items-end mb-1">
                                            <div className="flex items-center text-slate-300 text-xs font-bold">
                                                <span className="p-1 bg-quantum-800 rounded mr-2 text-slate-400">{item.icon}</span>
                                                {item.feature}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-[10px] text-slate-500">Contribution</span>
                                                <span className="text-sm font-mono font-bold text-slate-100">{item.score}%</span>
                                            </div>
                                        </div>
                                        <div className="h-3 w-full bg-quantum-950 rounded-full overflow-hidden relative border border-quantum-800">
                                            {/* Background Tick Marks for industrial feel */}
                                            <div className="absolute inset-0 w-full h-full flex justify-between px-1">
                                                {[...Array(10)].map((_, i) => (
                                                    <div key={i} className="w-px h-full bg-quantum-900/50"></div>
                                                ))}
                                            </div>
                                            {/* Animated Gradient Bar */}
                                            <div 
                                                className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out relative group-hover:brightness-110`}
                                                style={{ width: `${item.score}%` }}
                                            >
                                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 blur-[2px]"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 p-4 bg-purple-900/10 border border-purple-500/20 rounded-lg text-xs text-purple-200 leading-relaxed shadow-inner">
                                <div className="flex items-start">
                                    <Activity className="w-4 h-4 mr-2 text-purple-400 shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="text-purple-400 block mb-1">Inference Path:</strong>
                                        Detected <span className="font-mono text-orange-300">Temp_Variance > 0.5</span> combined with rising <span className="font-mono text-cyan-300">Vibration_Trend</span>. The model predicts a thermal runaway with <span className="font-bold text-white">92% Confidence</span>. Recommended action aligns with safety protocols.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Column 3: Controls */}
                        <div className="w-1/4 flex flex-col gap-4">
                            <div className="bg-quantum-900 border border-quantum-700 rounded-lg p-5">
                                <h3 className="text-sm font-bold text-slate-200 mb-4">Operator Actions</h3>
                                <div className="space-y-3">
                                    {/* Approve Button */}
                                    <button 
                                        onClick={() => handleAction(selectedDecision.id, 'approved')}
                                        disabled={selectedDecision.status !== 'pending'}
                                        className={`w-full py-3 text-xs font-bold rounded shadow-lg flex items-center justify-center transition-all transform active:scale-95 ${
                                            selectedDecision.status === 'approved' 
                                            ? 'bg-green-600/20 border border-green-500/50 text-green-400 cursor-default' 
                                            : selectedDecision.status === 'pending'
                                            ? 'bg-green-600 hover:bg-green-500 text-white'
                                            : 'bg-quantum-950 border border-quantum-800 text-slate-600 cursor-not-allowed opacity-50'
                                        }`}
                                    >
                                        {selectedDecision.status === 'approved' ? <Check className="w-4 h-4 mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                                        {selectedDecision.status === 'approved' ? 'Action Approved' : 'Approve Action'}
                                    </button>

                                    {/* Override Button */}
                                    <button 
                                        onClick={() => handleAction(selectedDecision.id, 'rejected')}
                                        disabled={selectedDecision.status !== 'pending'}
                                        className={`w-full py-3 border rounded flex items-center justify-center transition-all text-xs font-bold ${
                                            selectedDecision.status === 'rejected' 
                                            ? 'bg-red-900/20 border-red-500/50 text-red-400 cursor-default' 
                                            : selectedDecision.status === 'pending'
                                            ? 'bg-red-900/10 hover:bg-red-900/30 border-red-500/30 text-red-400 hover:text-red-300'
                                            : 'bg-quantum-950 border border-quantum-800 text-slate-600 cursor-not-allowed opacity-50'
                                        }`}
                                    >
                                        <XCircle className="w-4 h-4 mr-2" /> 
                                        {selectedDecision.status === 'rejected' ? 'Action Overridden' : 'Override / Reject'}
                                    </button>

                                    {/* Flag Button */}
                                    <button 
                                        onClick={() => handleAction(selectedDecision.id, 'flagged')}
                                        disabled={selectedDecision.status !== 'pending'}
                                        className={`w-full py-3 border rounded flex items-center justify-center transition-all text-xs font-bold ${
                                            selectedDecision.status === 'flagged' 
                                            ? 'bg-orange-900/20 border-orange-500/50 text-orange-400 cursor-default' 
                                            : selectedDecision.status === 'pending'
                                            ? 'bg-quantum-800 hover:bg-quantum-700 border-quantum-600 text-slate-300 hover:text-orange-400'
                                            : 'bg-quantum-950 border border-quantum-800 text-slate-600 cursor-not-allowed opacity-50'
                                        }`}
                                    >
                                        <Flag className="w-4 h-4 mr-2" /> 
                                        {selectedDecision.status === 'flagged' ? 'Flagged as Drift' : 'Flag as Drift'}
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex-1 bg-quantum-900 border border-quantum-700 rounded-lg p-5">
                                <h3 className="text-sm font-bold text-slate-200 mb-4">Similar Cases</h3>
                                <div className="space-y-2">
                                    {[1,2,3].map(i => (
                                        <div key={i} className="text-xs text-slate-400 border-b border-quantum-800 pb-2 mb-2 last:border-0 hover:bg-quantum-800/30 p-2 -mx-2 rounded transition-colors cursor-pointer">
                                            <div className="flex justify-between">
                                                <span className="font-mono text-cyan-500">DEC-8{90+i}</span>
                                                <span className="text-green-400 bg-green-900/20 px-1 rounded text-[9px]">SUCCESS</span>
                                            </div>
                                            <div className="text-[10px] text-slate-600 mt-1">Similiarity: {98-i*5}% • 2 days ago</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- PAGE 3: DRIFT DASHBOARD --- */}
                {view === 'drift' && (
                    <div className="p-6 h-full overflow-y-auto custom-scrollbar space-y-6">
                        <div className="grid grid-cols-4 gap-4">
                            <StatCard label="Model Accuracy (30d)" value="96.8%" delta="-0.4%" color="text-slate-200" />
                            <StatCard label="Drift Score" value="3.2" delta="+0.8" color="text-orange-400" />
                            <StatCard label="Training Age" value="14 Days" sub="Fresh" color="text-green-400" />
                            <StatCard label="Bias Indicator" value="0.02" sub="Nominal" color="text-purple-400" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
                            <div className="bg-quantum-900 border border-quantum-700 rounded-lg p-5 flex flex-col">
                                <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center">
                                    <Activity className="w-4 h-4 mr-2 text-cyan-400" /> Accuracy Trend vs Drift
                                </h3>
                                <div className="flex-1 w-full min-h-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={DRIFT_DATA}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1c2633" vertical={false} />
                                            <XAxis dataKey="day" stroke="#475569" fontSize={10} />
                                            <YAxis yAxisId="left" stroke="#475569" fontSize={10} domain={[80, 100]} />
                                            <YAxis yAxisId="right" orientation="right" stroke="#475569" fontSize={10} />
                                            <Tooltip contentStyle={{ backgroundColor: '#0a0f16', borderColor: '#2b3a4a', color: '#e2e8f0' }} />
                                            <Line yAxisId="left" type="monotone" dataKey="accuracy" stroke="#22d3ee" strokeWidth={2} dot={false} name="Accuracy" />
                                            <Line yAxisId="right" type="monotone" dataKey="drift" stroke="#f97316" strokeWidth={2} dot={false} name="Drift Score" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-quantum-900 border border-quantum-700 rounded-lg p-5 flex flex-col">
                                <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center">
                                    <AlertOctagon className="w-4 h-4 mr-2 text-red-400" /> Drift by Feature Category
                                </h3>
                                <div className="flex-1 w-full min-h-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                                            { subject: 'Thermal', A: 120, B: 110, fullMark: 150 },
                                            { subject: 'Vibration', A: 98, B: 130, fullMark: 150 },
                                            { subject: 'Power', A: 86, B: 130, fullMark: 150 },
                                            { subject: 'Timing', A: 99, B: 100, fullMark: 150 },
                                            { subject: 'Pressure', A: 85, B: 90, fullMark: 150 },
                                            { subject: 'Logic', A: 65, B: 85, fullMark: 150 },
                                        ]}>
                                            <PolarGrid stroke="#2b3a4a" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                            <Radar name="Training" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                                            <Radar name="Serving" dataKey="B" stroke="#f97316" fill="#f97316" fillOpacity={0.3} />
                                            <Tooltip contentStyle={{ backgroundColor: '#0a0f16', borderColor: '#2b3a4a', color: '#e2e8f0' }} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button className="px-6 py-2 border border-quantum-600 rounded text-slate-300 text-xs hover:bg-quantum-800">Switch to Model v4.1 (Stable)</button>
                            <button className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded shadow-lg flex items-center">
                                <RefreshCw className="w-3 h-3 mr-2" /> Trigger Retraining
                            </button>
                        </div>
                    </div>
                )}

                {/* --- PAGE 4: GOVERNANCE --- */}
                {view === 'governance' && (
                    <div className="p-6 h-full overflow-y-auto custom-scrollbar space-y-6">
                        <div className="grid grid-cols-3 gap-6">
                            <GovernanceStat label="AI Autonomy Rate" value="94.5%" sub="Human intervention required on 5.5%" />
                            <GovernanceStat label="Override Rate" value="1.2%" sub="Manual correction of AI actions" />
                            <GovernanceStat label="Compliance Score" value="100%" sub="All decisions logged & explainable" />
                        </div>

                        <div className="bg-quantum-900 border border-quantum-700 rounded-lg overflow-hidden">
                            <div className="p-4 border-b border-quantum-800 bg-quantum-800/50 flex justify-between items-center">
                                <h3 className="text-sm font-bold text-slate-200 uppercase flex items-center">
                                    <Scale className="w-4 h-4 mr-2 text-cyan-400" /> Human-in-the-Loop Audit Log
                                </h3>
                                <button className="text-xs text-cyan-400 hover:underline">Export Report</button>
                            </div>
                            <table className="w-full text-left text-xs">
                                <thead className="bg-quantum-950 text-slate-500 font-mono uppercase">
                                    <tr>
                                        <th className="px-4 py-3">Audit ID</th>
                                        <th className="px-4 py-3">User</th>
                                        <th className="px-4 py-3">Action</th>
                                        <th className="px-4 py-3">Reason Provided</th>
                                        <th className="px-4 py-3">Reference Decision</th>
                                        <th className="px-4 py-3">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-quantum-800 text-slate-300">
                                    {AUDIT_LOGS.map(log => (
                                        <tr key={log.id} className="hover:bg-quantum-800/50 transition-colors">
                                            <td className="px-4 py-3 font-mono text-slate-500">{log.id}</td>
                                            <td className="px-4 py-3 flex items-center"><Users className="w-3 h-3 mr-2 text-slate-500" /> {log.user}</td>
                                            <td className="px-4 py-3 font-bold text-orange-400">{log.action}</td>
                                            <td className="px-4 py-3 italic text-slate-400">"{log.reason}"</td>
                                            <td className="px-4 py-3 font-mono text-cyan-400 cursor-pointer hover:underline" onClick={() => openDetail(log.decisionId)}>{log.decisionId}</td>
                                            <td className="px-4 py-3 font-mono text-slate-500">{log.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- PAGE 5: SIMULATOR --- */}
                {view === 'simulator' && (
                    <div className="flex h-full p-6 gap-8">
                        {/* Left: Controls */}
                        <div className="w-1/3 bg-quantum-900 border border-quantum-700 rounded-lg p-6 flex flex-col">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-slate-100 flex items-center">
                                    <Sliders className="w-5 h-5 mr-2 text-cyan-400" /> What-If Analysis
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">Adjust input parameters to simulate AI response.</p>
                            </div>

                            <div className="space-y-8 flex-1">
                                <SimSlider label="Core Temperature (K)" value={simParams.temp} min={100} max={400} onChange={(v) => setSimParams({...simParams, temp: v})} />
                                <SimSlider label="System Pressure (Bar)" value={simParams.pressure} min={0} max={100} onChange={(v) => setSimParams({...simParams, pressure: v})} />
                                <SimSlider label="Vibration (g)" value={simParams.vibration} min={0} max={2} step={0.01} onChange={(v) => setSimParams({...simParams, vibration: v})} />
                            </div>

                            <div className="mt-8 pt-6 border-t border-quantum-800">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-slate-400">Scenario</span>
                                    <button className="text-xs text-cyan-400 hover:underline">Save Preset</button>
                                </div>
                                <button className="w-full py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold rounded shadow-glow-cyan flex items-center justify-center hover:opacity-90 transition-opacity">
                                    <Play className="w-4 h-4 mr-2" /> Run Simulation
                                </button>
                            </div>
                        </div>

                        {/* Right: Outcome */}
                        <div className="flex-1 flex flex-col items-center justify-center relative bg-quantum-900/50 rounded-lg border border-quantum-700 border-dashed p-8">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 to-transparent pointer-events-none"></div>
                            
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">AI Prediction Confidence</h3>
                            
                            {/* Visual Gauge */}
                            <div className="relative w-64 h-32 overflow-hidden mb-6">
                                <div className="absolute top-0 left-0 w-full h-full bg-quantum-800 rounded-t-full"></div>
                                <div 
                                    className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-t-full origin-bottom transition-transform duration-500 ease-out opacity-80"
                                    style={{ transform: `rotate(${(simParams.temp / 400) * 180 - 180}deg)` }} // Fake logic linking temp to outcome
                                ></div>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-28 bg-quantum-900 rounded-t-full flex items-end justify-center pb-4">
                                    <span className="text-4xl font-mono font-bold text-slate-100">
                                        {(simParams.temp / 4).toFixed(1)}%
                                    </span>
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <div className="text-lg font-bold text-slate-200">
                                    Predicted Action: <span className="text-cyan-400">Emergency Cooling</span>
                                </div>
                                <p className="text-xs text-slate-500 max-w-sm">
                                    Based on current parameters, the AI model v4.2 predicts a critical thermal event with high confidence.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

// --- Sub-Components ---

const NavTab = ({ label, active, onClick, icon }: any) => (
    <button 
        onClick={onClick}
        className={`flex items-center px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            active 
            ? 'bg-quantum-700 text-cyan-400 shadow-sm' 
            : 'text-slate-400 hover:text-slate-200 hover:bg-quantum-800'
        }`}
    >
        <span className="mr-2">{icon}</span>
        {label}
    </button>
);

const RiskBadge = ({ risk }: { risk: string }) => {
    const color = risk === 'High' ? 'text-red-400 bg-red-900/20 border-red-500/30' : 
                  risk === 'Medium' ? 'text-orange-400 bg-orange-900/20 border-orange-500/30' : 
                  'text-green-400 bg-green-900/20 border-green-500/30';
    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${color}`}>
            {risk} Risk
        </span>
    );
};

const StatCard = ({ label, value, delta, color, sub }: any) => (
    <div className="bg-quantum-900 border border-quantum-700 p-4 rounded-lg">
        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{label}</div>
        <div className={`text-2xl font-mono font-bold mt-1 ${color}`}>{value}</div>
        <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-slate-400 font-bold">{delta}</span>
            {sub && <span className="text-[10px] text-slate-600">{sub}</span>}
        </div>
    </div>
);

const GovernanceStat = ({ label, value, sub }: any) => (
    <div className="p-5 bg-quantum-900 border border-quantum-700 rounded-lg flex flex-col justify-between h-24 relative overflow-hidden group">
        <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><Scale size={40} /></div>
        <div className="text-sm font-bold text-slate-400 uppercase tracking-wide">{label}</div>
        <div>
            <div className="text-3xl font-mono font-bold text-slate-100">{value}</div>
            <div className="text-[10px] text-slate-500 mt-1">{sub}</div>
        </div>
    </div>
);

const SimSlider = ({ label, value, min, max, step=1, onChange }: any) => (
    <div>
        <div className="flex justify-between mb-2">
            <label className="text-xs font-bold text-slate-400 uppercase">{label}</label>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-900/20 px-2 rounded">{value}</span>
        </div>
        <input 
            type="range" 
            min={min} 
            max={max} 
            step={step}
            value={value} 
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-quantum-950 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400"
        />
        <div className="flex justify-between text-[10px] text-slate-600 mt-1">
            <span>{min}</span>
            <span>{max}</span>
        </div>
    </div>
);
