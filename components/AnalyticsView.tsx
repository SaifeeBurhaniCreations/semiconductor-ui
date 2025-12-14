import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ScatterChart, Scatter, ZAxis, Legend, ComposedChart, Line
} from 'recharts';
import { 
  Play, Calendar, FileText, Bell, Plus, Download, AlertTriangle, 
  Search, ChevronDown, CheckCircle, BrainCircuit, ArrowUpRight, Loader2, Check,
  Trash2, X, Save
} from 'lucide-react';

const MOCK_CORRELATIONS = [
  { x: 10, y: 30, z: 200, name: 'Node A', cause: 'Thermal Drift in Sector 7' },
  { x: 30, y: 200, z: 200, name: 'Node B', cause: 'Buffer Overflow (Predicted)' },
  { x: 45, y: 100, z: 400, name: 'Node C', cause: 'Thermal Drift in Sector 7' },
  { x: 50, y: 400, z: 100, name: 'Node D', cause: 'Timing Desync on Node 4' },
  { x: 70, y: 150, z: 300, name: 'Node E', cause: 'Thermal Drift in Sector 7' },
  { x: 100, y: 250, z: 500, name: 'Node F', cause: 'Timing Desync on Node 4' },
];

const MOCK_TRENDS = [
    { name: 'Batch A', yield: 92, defects: 4 },
    { name: 'Batch B', yield: 95, defects: 2 },
    { name: 'Batch C', yield: 88, defects: 8 },
    { name: 'Batch D', yield: 97, defects: 1 },
    { name: 'Batch E', yield: 91, defects: 5 },
    { name: 'Batch F', yield: 94, defects: 3 },
    { name: 'Batch G', yield: 99, defects: 0 },
];

const INITIAL_ALERTS = [
    { id: 1, name: "Critical Coherence Drop", condition: "IF coherence < 90% FOR > 5s", action: "Emergency Halt, Notify Ops", active: true },
    { id: 2, name: "Thermal Runaway Prediction", condition: "IF temp_gradient > 0.5K/s AND AI_Conf > 80%", action: "Trigger Cooling Boost", active: true },
    { id: 3, name: "Idle Node Detection", condition: "IF node_state == 'idle' FOR > 1h", action: "Log Warning", active: false }
];

export const AnalyticsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reports' | 'launcher' | 'alerts'>('reports');
  const [exportState, setExportState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [selectedCause, setSelectedCause] = useState<string | null>(null);

  // Job Launcher State
  const [jobStatus, setJobStatus] = useState<'idle' | 'running' | 'success'>('idle');
  const [isRecurring, setIsRecurring] = useState(false);
  const [jobMessage, setJobMessage] = useState('');

  // Alert Rules State
  const [rules, setRules] = useState(INITIAL_ALERTS);
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [newRule, setNewRule] = useState({ name: '', condition: '', action: '' });

  const handleExport = () => {
      setExportState('loading');
      setTimeout(() => {
          setExportState('done');
          setTimeout(() => setExportState('idle'), 2000);
      }, 1500);
  };

  const handleCauseClick = (label: string) => {
      setSelectedCause(prev => prev === label ? null : label);
  };

  // Job Launcher Logic
  const handleLaunchJob = () => {
      setJobStatus('running');
      setJobMessage('Initializing resources...');
      
      setTimeout(() => {
          setJobStatus('success');
          setJobMessage(isRecurring 
              ? 'Job launched successfully. Recurring schedule [WEEKLY] registered.' 
              : 'Job launched successfully. Results will appear in Reports.'
          );
          
          setTimeout(() => {
              setJobStatus('idle');
              setJobMessage('');
          }, 4000);
      }, 2500);
  };

  // Alert Rules Logic
  const toggleRule = (id: number) => {
      setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const deleteRule = (id: number) => {
      setRules(prev => prev.filter(r => r.id !== id));
  };

  const saveNewRule = () => {
      if (!newRule.name || !newRule.condition || !newRule.action) return;
      setRules(prev => [
          { id: Date.now(), ...newRule, active: true },
          ...prev
      ]);
      setNewRule({ name: '', condition: '', action: '' });
      setIsAddingRule(false);
  };

  // Filter correlations based on selection
  const filteredCorrelations = selectedCause 
    ? MOCK_CORRELATIONS.map(c => ({...c, opacity: c.cause === selectedCause ? 1 : 0.1}))
    : MOCK_CORRELATIONS.map(c => ({...c, opacity: 1}));

  // Custom Scatter Tooltip
  const CustomScatterTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
          const data = payload[0].payload;
          return (
              <div className="bg-quantum-900 border border-quantum-600 p-2 rounded shadow-xl text-xs">
                  <div className="font-bold text-slate-200 mb-1">{data.name}</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-400">
                      <span>Temp:</span> <span className="text-cyan-400 font-mono">{data.x} K</span>
                      <span>Press:</span> <span className="text-purple-400 font-mono">{data.y} Pa</span>
                      <span>Impact:</span> <span className="text-white font-mono">{data.z}</span>
                  </div>
              </div>
          );
      }
      return null;
  };

  // Custom Trend Tooltip
  const CustomTrendTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
          return (
              <div className="bg-quantum-900 border border-quantum-600 p-3 rounded shadow-xl text-xs">
                  <div className="font-bold text-slate-200 mb-2 border-b border-quantum-700 pb-1">{label}</div>
                  <div className="space-y-1">
                      <div className="flex justify-between items-center w-32">
                          <span className="text-cyan-400">Yield:</span>
                          <span className="text-slate-200 font-mono font-bold">{payload[0].value}%</span>
                      </div>
                      <div className="flex justify-between items-center w-32">
                          <span className="text-red-400">Defects:</span>
                          <span className="text-slate-200 font-mono font-bold">{payload[1].value}</span>
                      </div>
                  </div>
              </div>
          );
      }
      return null;
  };

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
                        <button 
                            onClick={handleExport}
                            disabled={exportState !== 'idle'}
                            className={`px-3 py-1.5 border rounded text-xs font-bold flex items-center transition-all ${
                                exportState === 'done' ? 'bg-green-600 border-green-500 text-white' : 
                                exportState === 'loading' ? 'bg-quantum-800 border-quantum-600 text-slate-400' :
                                'bg-quantum-700 hover:bg-quantum-600 border-quantum-600 text-slate-200'
                            }`}
                        >
                            {exportState === 'loading' ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : 
                             exportState === 'done' ? <Check className="w-3 h-3 mr-2" /> : 
                             <Download className="w-3 h-3 mr-2" />}
                            {exportState === 'loading' ? 'Generating...' : exportState === 'done' ? 'Downloaded' : 'Export PDF'}
                        </button>
                    </div>

                    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Correlation Chart */}
                        <div className="bg-quantum-950 border border-quantum-700 rounded-lg p-4 shadow-lg flex flex-col">
                            <h3 className="text-xs font-bold text-slate-300 uppercase mb-4">Parameter Correlation Map</h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1c2633" />
                                        <XAxis type="number" dataKey="x" name="Temp" unit="K" stroke="#475569" fontSize={10} tick={{fill: '#64748b'}} />
                                        <YAxis type="number" dataKey="y" name="Press" unit="Pa" stroke="#475569" fontSize={10} tick={{fill: '#64748b'}} />
                                        <ZAxis type="number" dataKey="z" range={[50, 400]} name="Score" />
                                        <Tooltip content={<CustomScatterTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#475569' }} />
                                        <Scatter name="Nodes" data={filteredCorrelations} fill="#8b5cf6">
                                            {filteredCorrelations.map((entry, index) => (
                                                <cell key={`cell-${index}`} fill={entry.cause === selectedCause ? '#22d3ee' : '#8b5cf6'} fillOpacity={entry.opacity} />
                                            ))}
                                        </Scatter>
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-2 text-[10px] text-slate-500 text-center">
                                * Click root causes on right to filter map
                            </div>
                        </div>

                        {/* Top Findings */}
                        <div className="bg-quantum-950 border border-quantum-700 rounded-lg p-4 shadow-lg flex flex-col">
                            <h3 className="text-xs font-bold text-slate-300 uppercase mb-4">Root Cause Candidates</h3>
                            <div className="flex-1 space-y-3">
                                <FindingItem 
                                    score={98} 
                                    label="Thermal Drift in Sector 7" 
                                    severity="critical" 
                                    active={selectedCause === "Thermal Drift in Sector 7"}
                                    onClick={() => handleCauseClick("Thermal Drift in Sector 7")}
                                />
                                <FindingItem 
                                    score={85} 
                                    label="Timing Desync on Node 4" 
                                    severity="warning" 
                                    active={selectedCause === "Timing Desync on Node 4"}
                                    onClick={() => handleCauseClick("Timing Desync on Node 4")}
                                />
                                <FindingItem 
                                    score={62} 
                                    label="Buffer Overflow (Predicted)" 
                                    severity="info" 
                                    active={selectedCause === "Buffer Overflow (Predicted)"}
                                    onClick={() => handleCauseClick("Buffer Overflow (Predicted)")}
                                />
                            </div>
                            <div className="mt-4 p-3 bg-cyan-900/10 border border-cyan-500/20 rounded text-xs text-cyan-200 leading-relaxed">
                                <strong className="block mb-1 text-cyan-400">AI Insight:</strong>
                                High correlation detected between rapid temperature fluctuations in Sector 7 and yield drops. Recommended action: Recalibrate cooling loop PID controller.
                            </div>
                        </div>

                        {/* Trend Chart (Composed) */}
                        <div className="lg:col-span-2 bg-quantum-950 border border-quantum-700 rounded-lg p-4 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                <BrainCircuit size={120} />
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xs font-bold text-slate-300 uppercase">Yield vs Defect Trend</h3>
                                <div className="flex items-center space-x-4 text-[10px] font-mono">
                                    <div className="flex items-center"><span className="w-2 h-2 bg-cyan-500 rounded-sm mr-2"></span> Yield %</div>
                                    <div className="flex items-center"><span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span> Defects</div>
                                </div>
                            </div>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={MOCK_TRENDS} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <defs>
                                            <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1c2633" vertical={false} />
                                        <XAxis dataKey="name" stroke="#475569" fontSize={10} tick={{fill: '#64748b'}} />
                                        <YAxis yAxisId="left" stroke="#06b6d4" fontSize={10} domain={[80, 100]} tick={{fill: '#06b6d4'}} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#ef4444" fontSize={10} domain={[0, 10]} tick={{fill: '#ef4444'}} />
                                        <Tooltip content={<CustomTrendTooltip />} cursor={{fill: 'rgba(34, 211, 238, 0.05)'}} />
                                        <Bar yAxisId="left" dataKey="yield" fill="url(#yieldGradient)" barSize={40} radius={[4, 4, 0, 0]} />
                                        <Line yAxisId="right" type="monotone" dataKey="defects" stroke="#ef4444" strokeWidth={3} dot={{r: 4, fill: '#1e293b', stroke: '#ef4444', strokeWidth: 2}} activeDot={{r: 6, fill: '#ef4444'}} />
                                    </ComposedChart>
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

                    <div className="space-y-6 bg-quantum-950 border border-quantum-700 p-6 rounded-lg relative overflow-hidden">
                        {jobStatus !== 'idle' && (
                            <div className="absolute inset-0 bg-quantum-950/90 z-20 flex flex-col items-center justify-center animate-in fade-in duration-200">
                                {jobStatus === 'running' ? (
                                    <>
                                        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
                                        <span className="text-sm font-bold text-slate-200 uppercase tracking-widest">{jobMessage}</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                                        <span className="text-sm font-bold text-slate-200 uppercase tracking-widest mb-1">{jobMessage}</span>
                                        {isRecurring && <span className="text-xs text-cyan-400 font-mono">[ Scheduled Weekly ]</span>}
                                    </>
                                )}
                            </div>
                        )}

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
                            <label className="flex items-center space-x-2 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    checked={isRecurring}
                                    onChange={(e) => setIsRecurring(e.target.checked)}
                                    className="rounded bg-quantum-800 border-quantum-600 text-cyan-500 focus:ring-0" 
                                />
                                <span className={`text-xs ${isRecurring ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'}`}>
                                    Schedule recurring weekly
                                </span>
                            </label>
                            <button 
                                onClick={handleLaunchJob}
                                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded text-sm shadow-glow-cyan transition-all"
                            >
                                Launch Analysis Job
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- ALERTS VIEW --- */}
            {activeTab === 'alerts' && (
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <div className="p-4 border-b border-quantum-600 bg-quantum-800/50 flex justify-between items-center sticky top-0 z-10 backdrop-blur">
                        <h2 className="text-lg font-bold text-slate-100 flex items-center">
                            <Bell className="w-5 h-5 mr-2 text-orange-400" /> Alert Rules Configuration
                        </h2>
                        <button 
                            onClick={() => setIsAddingRule(true)}
                            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-bold flex items-center"
                        >
                            <Plus className="w-3 h-3 mr-2" /> New Rule
                        </button>
                    </div>
                    
                    <div className="p-4 space-y-3 overflow-y-auto custom-scrollbar flex-1 bg-quantum-950/30">
                        
                        {/* New Rule Form */}
                        {isAddingRule && (
                            <div className="p-4 rounded-lg border border-cyan-500/50 bg-quantum-900 shadow-xl animate-in fade-in slide-in-from-top-2">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wide">Configure New Rule</h3>
                                    <button onClick={() => setIsAddingRule(false)} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                                    <div>
                                        <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Rule Name</label>
                                        <input 
                                            autoFocus
                                            type="text" 
                                            placeholder="e.g. Voltage Spike Detect"
                                            className="w-full bg-quantum-950 border border-quantum-700 rounded p-2 text-xs text-slate-200 outline-none focus:border-cyan-500"
                                            value={newRule.name}
                                            onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Logic Condition</label>
                                        <input 
                                            type="text" 
                                            placeholder="IF voltage > 12V..."
                                            className="w-full bg-quantum-950 border border-quantum-700 rounded p-2 text-xs font-mono text-cyan-200 outline-none focus:border-cyan-500"
                                            value={newRule.condition}
                                            onChange={(e) => setNewRule({...newRule, condition: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Action</label>
                                        <input 
                                            type="text" 
                                            placeholder="Notify / Halt / Log"
                                            className="w-full bg-quantum-950 border border-quantum-700 rounded p-2 text-xs text-slate-200 outline-none focus:border-cyan-500"
                                            value={newRule.action}
                                            onChange={(e) => setNewRule({...newRule, action: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button 
                                        onClick={saveNewRule}
                                        disabled={!newRule.name || !newRule.condition || !newRule.action}
                                        className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded flex items-center"
                                    >
                                        <Save className="w-3 h-3 mr-2" /> Save Active Rule
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Rule List */}
                        {rules.map(rule => (
                            <div key={rule.id} className={`p-4 rounded-lg border flex justify-between items-center transition-all ${rule.active ? 'bg-quantum-950 border-quantum-700' : 'bg-quantum-900/50 border-quantum-800 opacity-60'}`}>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-bold text-slate-200">{rule.name}</span>
                                        {!rule.active && <span className="text-[10px] bg-slate-800 text-slate-500 px-1.5 rounded">DISABLED</span>}
                                    </div>
                                    <div className="text-xs font-mono text-cyan-500/80 mt-1">{rule.condition}</div>
                                    <div className="text-[10px] text-slate-500 mt-1 flex items-center">
                                        <ArrowUpRight className="w-3 h-3 mr-1" /> THEN: {rule.action}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    {/* Toggle Switch */}
                                    <div 
                                        onClick={() => toggleRule(rule.id)}
                                        className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${rule.active ? 'bg-cyan-600' : 'bg-slate-700'}`}
                                    >
                                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${rule.active ? 'left-[22px]' : 'left-0.5'}`}></div>
                                    </div>
                                    {/* Delete Action */}
                                    <button 
                                        onClick={() => deleteRule(rule.id)}
                                        className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
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

const FindingItem = ({ score, label, severity, active, onClick }: any) => (
    <div 
        onClick={onClick}
        className={`flex items-center justify-between p-3 border rounded transition-all cursor-pointer group ${
            active 
            ? 'bg-cyan-900/20 border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.1)]' 
            : 'bg-quantum-900 border-quantum-800 hover:border-quantum-600'
        }`}
    >
        <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs ${severity === 'critical' ? 'bg-red-500/10 text-red-500' : severity === 'warning' ? 'bg-orange-500/10 text-orange-500' : 'bg-cyan-500/10 text-cyan-500'}`}>
                {score}
            </div>
            <div>
                <div className={`text-sm font-medium transition-colors ${active ? 'text-cyan-400' : 'text-slate-200 group-hover:text-cyan-400'}`}>{label}</div>
                <div className="text-[10px] text-slate-500 uppercase">Confidence Score</div>
            </div>
        </div>
        <ArrowUpRight className={`w-4 h-4 transition-colors ${active ? 'text-cyan-400' : 'text-slate-600 group-hover:text-cyan-500'}`} />
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