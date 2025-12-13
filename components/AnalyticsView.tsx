import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ScatterChart, Scatter, ZAxis, Legend
} from 'recharts';
import { 
  Play, Calendar, FileText, Bell, Plus, Download, AlertTriangle, 
  Search, ChevronDown, CheckCircle, BrainCircuit, ArrowUpRight
} from 'lucide-react';

const MOCK_CORRELATIONS = [
  { x: 10, y: 30, z: 200, name: 'Node A' },
  { x: 30, y: 200, z: 200, name: 'Node B' },
  { x: 45, y: 100, z: 400, name: 'Node C' },
  { x: 50, y: 400, z: 100, name: 'Node D' },
  { x: 70, y: 150, z: 300, name: 'Node E' },
  { x: 100, y: 250, z: 500, name: 'Node F' },
];

const MOCK_TRENDS = [
    { name: 'Batch A', yield: 92, defects: 4 },
    { name: 'Batch B', yield: 95, defects: 2 },
    { name: 'Batch C', yield: 88, defects: 8 },
    { name: 'Batch D', yield: 97, defects: 1 },
    { name: 'Batch E', yield: 91, defects: 5 },
];

export const AnalyticsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reports' | 'launcher' | 'alerts'>('reports');

  return (
    <div className="flex h-full gap-4 overflow-hidden">
        {/* Sidebar */}
        <div className="w-56 bg-quantum-900 border border-quantum-600 rounded-lg flex flex-col shrink-0">
            <div className="p-3 border-b border-quantum-600 bg-quantum-800">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Analytics Suite</h3>
            </div>
            <div className="flex-1 p-2 space-y-1">
                <NavButton active={activeTab === 'reports'} icon={<FileText />} label="Insight Reports" onClick={() => setActiveTab('reports')} />
                <NavButton active={activeTab === 'launcher'} icon={<Play />} label="Job Launcher" onClick={() => setActiveTab('launcher')} />
                <NavButton active={activeTab === 'alerts'} icon={<Bell />} label="Alert Rules" onClick={() => setActiveTab('alerts')} />
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-quantum-900 border border-quantum-600 rounded-lg flex flex-col min-w-0 overflow-hidden">
            
            {/* --- REPORTS VIEW --- */}
            {activeTab === 'reports' && (
                <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar">
                    <div className="p-4 border-b border-quantum-600 bg-quantum-800/50 flex justify-between items-center sticky top-0 z-10 backdrop-blur">
                        <div>
                            <h2 className="text-lg font-bold text-slate-100 flex items-center">
                                <BrainCircuit className="w-5 h-5 mr-2 text-purple-400" />
                                Weekly Yield Correlation Analysis
                            </h2>
                            <p className="text-xs text-slate-400 font-mono mt-1">Generated: Oct 24, 2025 • Model: QM-7</p>
                        </div>
                        <button className="px-3 py-1.5 bg-quantum-700 hover:bg-quantum-600 border border-quantum-600 rounded text-xs text-slate-200 flex items-center transition-colors">
                            <Download className="w-3 h-3 mr-2" /> Export PDF
                        </button>
                    </div>

                    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Correlation Chart */}
                        <div className="bg-quantum-950 border border-quantum-700 rounded-lg p-4 shadow-lg">
                            <h3 className="text-xs font-bold text-slate-300 uppercase mb-4">Parameter Correlation Map</h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1c2633" />
                                        <XAxis type="number" dataKey="x" name="Temp" unit="K" stroke="#475569" fontSize={10} />
                                        <YAxis type="number" dataKey="y" name="Press" unit="Pa" stroke="#475569" fontSize={10} />
                                        <ZAxis type="number" dataKey="z" range={[50, 400]} name="Score" />
                                        <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0a0f16', borderColor: '#2b3a4a', color: '#e2e8f0' }} />
                                        <Legend />
                                        <Scatter name="Nodes" data={MOCK_CORRELATIONS} fill="#8b5cf6" shape="circle" />
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Top Findings */}
                        <div className="bg-quantum-950 border border-quantum-700 rounded-lg p-4 shadow-lg flex flex-col">
                            <h3 className="text-xs font-bold text-slate-300 uppercase mb-4">Root Cause Candidates</h3>
                            <div className="flex-1 space-y-3">
                                <FindingItem score={98} label="Thermal Drift in Sector 7" severity="critical" />
                                <FindingItem score={85} label="Timing Desync on Node 4" severity="warning" />
                                <FindingItem score={62} label="Buffer Overflow (Predicted)" severity="info" />
                            </div>
                            <div className="mt-4 p-3 bg-cyan-900/10 border border-cyan-500/20 rounded text-xs text-cyan-200 leading-relaxed">
                                <strong className="block mb-1 text-cyan-400">AI Insight:</strong>
                                High correlation detected between rapid temperature fluctuations in Sector 7 and yield drops. Recommended action: Recalibrate cooling loop PID controller.
                            </div>
                        </div>

                        {/* Trend Chart */}
                        <div className="lg:col-span-2 bg-quantum-950 border border-quantum-700 rounded-lg p-4 shadow-lg">
                            <h3 className="text-xs font-bold text-slate-300 uppercase mb-4">Yield vs Defect Trend</h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={MOCK_TRENDS} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1c2633" vertical={false} />
                                        <XAxis dataKey="name" stroke="#475569" fontSize={10} />
                                        <YAxis stroke="#475569" fontSize={10} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0a0f16', borderColor: '#2b3a4a', color: '#e2e8f0' }} />
                                        <Legend />
                                        <Bar dataKey="yield" stackId="a" fill="#06b6d4" name="Yield %" />
                                        <Bar dataKey="defects" stackId="a" fill="#ef4444" name="Defects" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- LAUNCHER VIEW --- */}
            {activeTab === 'launcher' && (
                <div className="p-8 max-w-2xl mx-auto w-full">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-quantum-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-quantum-600 shadow-glow-cyan">
                            <Play className="w-8 h-8 text-cyan-400 ml-1" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-100">Analytics Job Launcher</h2>
                        <p className="text-slate-500 mt-2">Configure and schedule deep-dive analysis tasks on historical datasets.</p>
                    </div>

                    <div className="space-y-6 bg-quantum-950 border border-quantum-700 p-6 rounded-lg">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Target Dataset</label>
                            <select className="w-full bg-quantum-900 border border-quantum-600 rounded p-2.5 text-sm text-slate-200 focus:border-cyan-500 outline-none">
                                <option>Production_Logs_Q3_2025 (14.2 TB)</option>
                                <option>Simulation_Runs_Archive_A (2.1 TB)</option>
                            </select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Analysis Model</label>
                                <select className="w-full bg-quantum-900 border border-quantum-600 rounded p-2.5 text-sm text-slate-200 focus:border-cyan-500 outline-none">
                                    <option>Standard Anomaly Detection</option>
                                    <option>Deep Learning Root Cause</option>
                                    <option>Predictive Maintenance v2</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Date Range</label>
                                <div className="flex items-center bg-quantum-900 border border-quantum-600 rounded p-2.5">
                                    <Calendar className="w-4 h-4 text-slate-500 mr-2" />
                                    <span className="text-sm text-slate-200">Last 30 Days</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-quantum-700 flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded bg-quantum-800 border-quantum-600 text-cyan-500 focus:ring-0" />
                                <span className="text-xs text-slate-400">Schedule recurring weekly</span>
                            </div>
                            <button className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded text-sm shadow-glow-cyan transition-all">
                                Launch Analysis Job
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- ALERTS VIEW --- */}
            {activeTab === 'alerts' && (
                <div className="flex-1 flex flex-col">
                    <div className="p-4 border-b border-quantum-600 bg-quantum-800/50 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-100 flex items-center">
                            <Bell className="w-5 h-5 mr-2 text-orange-400" /> Alert Rules Configuration
                        </h2>
                        <button className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-bold flex items-center">
                            <Plus className="w-3 h-3 mr-2" /> New Rule
                        </button>
                    </div>
                    <div className="p-4 space-y-3 overflow-y-auto">
                        <AlertRuleItem 
                            name="Critical Coherence Drop" 
                            condition="IF coherence < 90% FOR > 5s" 
                            action="Emergency Halt, Notify Ops" 
                            active={true} 
                        />
                        <AlertRuleItem 
                            name="Thermal Runaway Prediction" 
                            condition="IF temp_gradient > 0.5K/s AND AI_Conf > 80%" 
                            action="Trigger Cooling Boost" 
                            active={true} 
                        />
                        <AlertRuleItem 
                            name="Idle Node Detection" 
                            condition="IF node_state == 'idle' FOR > 1h" 
                            action="Log Warning" 
                            active={false} 
                        />
                    </div>
                </div>
            )}

        </div>
    </div>
  );
};

const NavButton = ({ active, icon, label, onClick }: any) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center p-2.5 rounded-md transition-colors text-sm font-medium ${active ? 'bg-quantum-800 text-cyan-400' : 'text-slate-400 hover:bg-quantum-800/50 hover:text-slate-200'}`}
    >
        <div className={`mr-3 ${active ? 'text-cyan-400' : 'text-slate-500'}`}>{icon}</div>
        {label}
    </button>
);

const FindingItem = ({ score, label, severity }: any) => (
    <div className="flex items-center justify-between p-3 bg-quantum-900 border border-quantum-800 rounded hover:border-quantum-600 transition-colors cursor-pointer group">
        <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs ${severity === 'critical' ? 'bg-red-500/10 text-red-500' : severity === 'warning' ? 'bg-orange-500/10 text-orange-500' : 'bg-cyan-500/10 text-cyan-500'}`}>
                {score}
            </div>
            <div>
                <div className="text-sm text-slate-200 font-medium group-hover:text-cyan-400 transition-colors">{label}</div>
                <div className="text-[10px] text-slate-500 uppercase">Confidence Score</div>
            </div>
        </div>
        <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-500" />
    </div>
);

const AlertRuleItem = ({ name, condition, action, active }: any) => (
    <div className={`p-4 rounded-lg border flex justify-between items-center ${active ? 'bg-quantum-950 border-quantum-700' : 'bg-quantum-900/50 border-quantum-800 opacity-60'}`}>
        <div>
            <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-slate-200">{name}</span>
                {!active && <span className="text-[10px] bg-slate-800 text-slate-500 px-1.5 rounded">DISABLED</span>}
            </div>
            <div className="text-xs font-mono text-cyan-500/80 mt-1">{condition}</div>
            <div className="text-[10px] text-slate-500 mt-1 flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-1" /> THEN: {action}
            </div>
        </div>
        <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${active ? 'bg-cyan-600' : 'bg-slate-700'}`}>
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${active ? 'left-[22px]' : 'left-0.5'}`}></div>
        </div>
    </div>
);