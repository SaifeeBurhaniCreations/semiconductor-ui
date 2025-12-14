import React, { useState, useEffect } from 'react';
import { 
    BarChart2, Eye, Thermometer, Scan, ZoomIn, ZoomOut, Layers, 
    Check, X, AlertTriangle, Cpu, Activity, Video, Wifi, WifiOff,
    Play, Pause, Download, Aperture, Maximize2, FileText
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, BarChart, Bar 
} from 'recharts';

// --- MOCK DATA ---
const YIELD_DATA = [
    { lot: 'L-901', yield: 98.2, defects: 12 },
    { lot: 'L-902', yield: 96.5, defects: 24 },
    { lot: 'L-903', yield: 99.1, defects: 5 },
    { lot: 'L-904', yield: 88.4, defects: 85 },
    { lot: 'L-905', yield: 94.2, defects: 32 },
    { lot: 'L-906', yield: 97.8, defects: 8 },
    { lot: 'L-907', yield: 98.5, defects: 4 },
];

const THERMAL_DATA = Array.from({ length: 50 }, (_, i) => ({
    time: i * 2,
    target: 20 + 200 * (1 - Math.exp(-i/10)), 
    actual: 20 + 195 * (1 - Math.exp(-i/10)) + (Math.random() * 10 - 5),
    limit: 240
}));

const INITIAL_DEFECTS = [
    { id: 'D-01', type: 'Particle', loc: 'X:12 Y:45', prob: 0.98, status: 'pending' },
    { id: 'D-02', type: 'Scratch', loc: 'X:88 Y:12', prob: 0.85, status: 'rejected' },
    { id: 'D-03', type: 'Bridge', loc: 'X:54 Y:67', prob: 0.62, status: 'verified' },
];

export const ManufacturingView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'yield' | 'aoi' | 'thermal'>('yield');
    const [zoom, setZoom] = useState(1);
    const [streamStatus, setStreamStatus] = useState<'live' | 'paused' | 'offline'>('live');
    const [showAiOverlay, setShowAiOverlay] = useState(true);
    const [defects, setDefects] = useState(INITIAL_DEFECTS);
    const [reportGenerating, setReportGenerating] = useState(false);

    const handleDefectAction = (id: string, action: 'verify' | 'reject') => {
        setDefects(prev => prev.filter(d => d.id !== id));
        // In a real app, this would update the status instead of removing
    };

    const handleGenerateReport = () => {
        setReportGenerating(true);
        setTimeout(() => {
            alert("Inspection Report [RPT-2025-A1] has been generated and sent to Document Store.");
            setReportGenerating(false);
        }, 1500);
    };

    const handleDownload = () => {
        alert("Downloading high-res snapshot of current frame...");
    };

    const handleMaximize = () => {
        const el = document.getElementById('live-feed-container');
        if (el) {
            if (!document.fullscreenElement) {
                el.requestFullscreen().catch(err => {
                    alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                });
            } else {
                document.exitFullscreen();
            }
        } else {
            alert("Entering Fullscreen Mode (Simulated)");
        }
    };

    return (
        <div className="flex flex-col h-full bg-quantum-900 border border-quantum-600 rounded-lg overflow-hidden">
            {/* Header Tabs */}
            <div className="flex items-center px-4 border-b border-quantum-600 bg-quantum-800 shrink-0 h-12">
                <TabButton 
                    active={activeTab === 'yield'} 
                    onClick={() => setActiveTab('yield')} 
                    icon={<BarChart2 className="w-4 h-4" />} 
                    label="Yield Dashboard" 
                />
                <TabButton 
                    active={activeTab === 'aoi'} 
                    onClick={() => setActiveTab('aoi')} 
                    icon={<Eye className="w-4 h-4" />} 
                    label="Live Inspection Feed" 
                />
                <TabButton 
                    active={activeTab === 'thermal'} 
                    onClick={() => setActiveTab('thermal')} 
                    icon={<Thermometer className="w-4 h-4" />} 
                    label="Thermal Profiling" 
                />
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-quantum-950/50">
                
                {/* --- YIELD DASHBOARD --- */}
                {activeTab === 'yield' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard label="Current Lot Yield" value="94.2%" delta="-2.1%" color="text-orange-400" />
                            <StatCard label="Defect Density" value="0.42 / cm²" delta="+0.05" color="text-slate-200" />
                            <StatCard label="Throughput" value="142 WPH" delta="+12" color="text-cyan-400" />
                            <StatCard label="Est. Revenue" value="$42.5k" delta="+$1.2k" color="text-green-400" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-quantum-900 border border-quantum-700 rounded-lg p-5 shadow-lg">
                                <h3 className="text-sm font-bold text-slate-200 uppercase mb-4 tracking-wider">Lot Yield Trend</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={YIELD_DATA}>
                                            <defs>
                                                <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1c2633" vertical={false} />
                                            <XAxis dataKey="lot" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                                            <YAxis stroke="#475569" fontSize={10} domain={[80, 100]} axisLine={false} tickLine={false} />
                                            <Tooltip contentStyle={{ backgroundColor: '#0a0f16', borderColor: '#2b3a4a', color: '#e2e8f0' }} />
                                            <Area type="monotone" dataKey="yield" stroke="#22d3ee" fill="url(#colorYield)" strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            
                            <div className="bg-quantum-900 border border-quantum-700 rounded-lg p-5 shadow-lg">
                                <h3 className="text-sm font-bold text-slate-200 uppercase mb-4 tracking-wider">Top Defect Categories</h3>
                                <div className="space-y-4">
                                    <DefectBar label="Particle Contamination" count={45} percent={42} color="bg-red-500" />
                                    <DefectBar label="Pattern Bridging" count={28} percent={26} color="bg-orange-500" />
                                    <DefectBar label="Resist Lift" count={12} percent={11} color="bg-yellow-500" />
                                    <DefectBar label="Focus Spot" count={8} percent={7} color="bg-blue-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- AOI INSPECTION --- */}
                {activeTab === 'aoi' && (
                    <div className="flex flex-col lg:flex-row gap-6 h-[600px] animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Main Viewer */}
                        <div id="live-feed-container" className="flex-1 bg-black rounded-lg border border-quantum-600 relative overflow-hidden flex items-center justify-center group shadow-2xl flex-col">
                            
                            {/* Stream Header (Overlay) */}
                            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-20 flex justify-between items-start pointer-events-none">
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-2 h-2 rounded-full ${streamStatus === 'live' ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`}></div>
                                        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">Live Visual Feed — Inspection Camera 3</h3>
                                    </div>
                                    <div className="flex items-center space-x-3 mt-1 ml-4">
                                        <span className="text-[10px] font-mono text-slate-400 flex items-center">
                                            <Activity className="w-3 h-3 mr-1" /> Latency: 42ms
                                        </span>
                                        <span className="text-[10px] font-mono text-cyan-400 flex items-center">
                                            <Scan className="w-3 h-3 mr-1" /> AI Detection: {showAiOverlay ? 'ACTIVE' : 'HIDDEN'}
                                        </span>
                                    </div>
                                </div>
                                <div className="pointer-events-auto flex space-x-2">
                                    <button 
                                        onClick={() => setStreamStatus(s => s === 'live' ? 'paused' : 'live')}
                                        className="p-1.5 bg-quantum-900/80 hover:bg-quantum-800 border border-quantum-700 rounded text-slate-300 transition-colors"
                                        title={streamStatus === 'live' ? "Pause Feed" : "Resume Feed"}
                                    >
                                        {streamStatus === 'live' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                    </button>
                                    <button 
                                        onClick={handleDownload}
                                        className="p-1.5 bg-quantum-900/80 hover:bg-quantum-800 border border-quantum-700 rounded text-slate-300 transition-colors"
                                        title="Download Snapshot"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={handleMaximize}
                                        className="p-1.5 bg-quantum-900/80 hover:bg-quantum-800 border border-quantum-700 rounded text-slate-300 transition-colors"
                                        title="Fullscreen"
                                    >
                                        <Maximize2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Toolbar (Bottom Center) */}
                            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 pointer-events-auto">
                                <button onClick={() => setZoom(z => Math.max(z - 0.5, 1))} className="p-2 bg-quantum-900/90 border border-quantum-700 rounded-l hover:bg-quantum-800 text-slate-300"><ZoomOut className="w-4 h-4" /></button>
                                <span className="px-3 py-2 bg-quantum-900/90 border-y border-quantum-700 text-xs font-mono text-slate-300 flex items-center">{zoom}x</span>
                                <button onClick={() => setZoom(z => Math.min(z + 0.5, 4))} className="p-2 bg-quantum-900/90 border border-quantum-700 rounded-r hover:bg-quantum-800 text-slate-300"><ZoomIn className="w-4 h-4" /></button>
                                
                                <div className="w-px h-8 bg-quantum-700 mx-2"></div>
                                
                                <button 
                                    onClick={() => setShowAiOverlay(!showAiOverlay)}
                                    className={`px-3 py-2 border rounded text-xs font-bold flex items-center transition-colors ${showAiOverlay ? 'bg-cyan-900/80 border-cyan-500/50 text-cyan-400' : 'bg-quantum-900/90 border-quantum-700 text-slate-400'}`}
                                >
                                    <Aperture className="w-4 h-4 mr-2" /> {showAiOverlay ? 'AI Layer ON' : 'AI Layer OFF'}
                                </button>
                            </div>
                            
                            {/* Mock Wafer Visual / Video Feed */}
                            <div 
                                className="w-full h-full relative transition-transform duration-300 flex items-center justify-center overflow-hidden"
                                style={{ 
                                    backgroundImage: 'radial-gradient(circle, #0f172a 1px, transparent 1px)', 
                                    backgroundSize: '30px 30px',
                                    transform: `scale(${zoom})`
                                }}
                            >
                                {/* Grid Overlay for Industrial Feel */}
                                <div className="absolute inset-0 pointer-events-none" 
                                     style={{ backgroundImage: 'linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px)', backgroundSize: '100px 100px' }}>
                                </div>

                                <div className="w-[500px] h-[500px] rounded-full border border-slate-700 bg-slate-900/50 relative shadow-[0_0_150px_rgba(34,211,238,0.05)]">
                                    <div className="absolute inset-0 rounded-full border-[40px] border-slate-800/20"></div>
                                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-700 font-mono text-[10px] tracking-widest">WAFER ID: WF-742-LIVE</span>
                                    
                                    {/* AI Overlays */}
                                    {showAiOverlay && (
                                        <>
                                            {/* Edge Alignment */}
                                            <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/30 animate-pulse"></div>
                                            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-cyan-900/80 text-cyan-400 text-[9px] px-2 py-0.5 rounded border border-cyan-500/30">
                                                Detecting edge alignment...
                                            </div>

                                            {/* Anomalies */}
                                            <div className="absolute top-[30%] left-[40%]">
                                                <div className="w-8 h-8 border-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse relative group cursor-pointer">
                                                    <div className="absolute left-full top-0 ml-2 bg-quantum-900 border border-red-500 text-[10px] text-red-400 px-2 py-1 rounded whitespace-nowrap z-20">
                                                        Particle (98%)
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="absolute top-[65%] left-[60%]">
                                                <div className="w-12 h-8 border-2 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.6)] relative group cursor-pointer">
                                                    <div className="absolute right-full top-0 mr-2 bg-quantum-900 border border-orange-500 text-[10px] text-orange-400 px-2 py-1 rounded whitespace-nowrap z-20">
                                                        Scratch (85%)
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            
                            {/* Connection Status Overlay if Offline */}
                            {streamStatus === 'offline' && (
                                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
                                    <WifiOff className="w-12 h-12 text-slate-600 mb-4" />
                                    <h3 className="text-lg font-bold text-slate-400">Stream Offline</h3>
                                    <p className="text-sm text-slate-600 mb-4">Camera 3 is unreachable. Reconnecting...</p>
                                    <button className="px-4 py-2 bg-quantum-800 border border-quantum-600 rounded text-slate-300 hover:text-white">Retry Connection</button>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="w-80 bg-quantum-900 border border-quantum-600 rounded-lg flex flex-col shadow-lg">
                            <div className="p-4 border-b border-quantum-600">
                                <h3 className="text-sm font-bold text-slate-200 uppercase flex items-center">
                                    <Scan className="w-4 h-4 mr-2 text-cyan-400" /> Detected Anomalies
                                </h3>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {defects.length === 0 ? (
                                    <div className="text-center text-slate-500 text-xs py-8 italic">
                                        No active anomalies pending review.
                                    </div>
                                ) : (
                                    defects.map(d => (
                                        <div key={d.id} className="p-3 bg-quantum-950 border border-quantum-700 rounded hover:border-cyan-500/50 transition-colors cursor-pointer group">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-xs font-bold text-slate-200">{d.id}</span>
                                                <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">{d.loc}</span>
                                            </div>
                                            <div className="text-xs text-slate-400 mb-2">{d.type}</div>
                                            <div className="flex items-center justify-between">
                                                <div className="text-[10px] text-slate-500 font-mono">Conf: {(d.prob * 100).toFixed(0)}%</div>
                                                <div className="flex space-x-1">
                                                    <button onClick={() => handleDefectAction(d.id, 'verify')} className="p-1 text-slate-500 hover:text-green-400 hover:bg-green-900/20 rounded transition-colors" title="Verify">
                                                        <Check className="w-3 h-3" />
                                                    </button>
                                                    <button onClick={() => handleDefectAction(d.id, 'reject')} className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors" title="Reject False Positive">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="p-4 border-t border-quantum-600 bg-quantum-950 rounded-b-lg">
                                <button 
                                    onClick={handleGenerateReport}
                                    disabled={reportGenerating}
                                    className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded transition-colors shadow-glow-cyan flex items-center justify-center"
                                >
                                    {reportGenerating ? (
                                        <>Generating...</>
                                    ) : (
                                        <><FileText className="w-3 h-3 mr-2" /> Generate Inspection Report</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- THERMAL PROFILING --- */}
                {activeTab === 'thermal' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-quantum-900 border border-quantum-700 rounded-lg p-5 shadow-lg">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-sm font-bold text-slate-200 uppercase flex items-center">
                                    <Thermometer className="w-4 h-4 mr-2 text-red-400" /> Reflow Profile Compare
                                </h3>
                                <div className="flex items-center space-x-4 text-xs font-mono">
                                    <div className="flex items-center space-x-2">
                                        <span className="w-3 h-1 bg-slate-500 rounded-full"></span>
                                        <span className="text-slate-400">Target</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="w-3 h-1 bg-red-400 rounded-full"></span>
                                        <span className="text-slate-400">Actual</span>
                                    </div>
                                </div>
                            </div>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={THERMAL_DATA}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1c2633" vertical={false} />
                                        <XAxis dataKey="time" type="number" unit="s" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                                        <YAxis stroke="#475569" fontSize={10} unit="°C" domain={[0, 260]} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0a0f16', borderColor: '#2b3a4a', color: '#e2e8f0' }} />
                                        <Line type="monotone" dataKey="target" stroke="#64748b" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                                        <Line type="monotone" dataKey="actual" stroke="#f87171" strokeWidth={2} dot={false} />
                                        <Line type="monotone" dataKey="limit" stroke="#ef4444" strokeWidth={1} dot={false} strokeOpacity={0.3} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-orange-900/10 border border-orange-500/20 rounded-lg flex items-start space-x-3">
                                <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-bold text-orange-400 mb-1">Thermal Soak Variance</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Detected a +5.2°C variance during the soak phase (t=90s). This may lead to incomplete flux activation in Zone 3.
                                    </p>
                                </div>
                            </div>
                            <div className="p-4 bg-quantum-900 border border-quantum-700 rounded-lg">
                                <h4 className="text-xs font-bold text-slate-300 uppercase mb-3 flex items-center">
                                    <Activity className="w-3 h-3 mr-2 text-cyan-400" /> Probe Telemetry
                                </h4>
                                <div className="space-y-2">
                                    <ProbeRow id="TC-01" val="214.5°C" status="ok" />
                                    <ProbeRow id="TC-02" val="218.2°C" status="warn" />
                                    <ProbeRow id="TC-03" val="213.9°C" status="ok" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

// --- Sub-components ---

const TabButton = ({ active, onClick, icon, label }: any) => (
    <button 
        onClick={onClick}
        className={`flex items-center px-4 h-full border-b-2 transition-colors text-xs font-bold uppercase tracking-wide ${
            active 
            ? 'border-cyan-400 text-cyan-400 bg-quantum-900/50' 
            : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-quantum-800'
        }`}
    >
        <span className="mr-2">{icon}</span>
        {label}
    </button>
);

const StatCard = ({ label, value, delta, color }: any) => (
    <div className="bg-quantum-900 border border-quantum-700 p-4 rounded-lg shadow-sm">
        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{label}</div>
        <div className="text-2xl font-mono font-bold text-slate-200 mt-2">{value}</div>
        <div className={`text-xs mt-1 font-medium ${color}`}>{delta} <span className="text-slate-600 font-normal">vs target</span></div>
    </div>
);

const DefectBar = ({ label, count, percent, color }: any) => (
    <div>
        <div className="flex justify-between text-xs text-slate-300 mb-1.5">
            <span className="font-medium">{label}</span>
            <span className="font-mono text-slate-500">{count} ({percent}%)</span>
        </div>
        <div className="w-full h-1.5 bg-quantum-950 rounded-full overflow-hidden">
            <div className={`h-full ${color}`} style={{ width: `${percent}%` }}></div>
        </div>
    </div>
);

const ProbeRow = ({ id, val, status }: any) => (
    <div className="flex justify-between items-center text-xs p-2 bg-quantum-950 rounded border border-quantum-800">
        <span className="font-mono text-slate-400">{id}</span>
        <span className={`font-mono font-bold ${status === 'warn' ? 'text-orange-400' : 'text-slate-200'}`}>{val}</span>
    </div>
);