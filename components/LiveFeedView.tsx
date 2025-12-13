import React, { useState, useEffect } from 'react';
import { 
    Grid, LayoutTemplate, Activity, AlertTriangle, Wifi, WifiOff, 
    Play, Pause, FastForward, Rewind, Camera, Aperture, 
    Maximize2, FileText, Settings, RefreshCw, ChevronLeft, 
    Search, Filter, Calendar, Clock, Download, Layers, Eye,
    CheckCircle2, XCircle, Cpu, Network, RotateCcw, Loader2, X
} from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

// --- MOCK DATA ---

const CAMERAS = [
    { id: 'CAM-01', name: 'Assembly Line A', location: 'Zone 4', status: 'online', ai: 'active', anomalies: 2, latency: 24, fps: 60, res: '4K', thumbnail: 'bg-slate-800' },
    { id: 'CAM-02', name: 'Thermal Chamber', location: 'Zone 2', status: 'warning', ai: 'degraded', anomalies: 5, latency: 120, fps: 30, res: '1080p', thumbnail: 'bg-orange-900/20' },
    { id: 'CAM-03', name: 'Loading Dock', location: 'Ext. North', status: 'online', ai: 'idle', anomalies: 0, latency: 45, fps: 30, res: '1080p', thumbnail: 'bg-slate-800' },
    { id: 'CAM-04', name: 'Secure Vault', location: 'Basement', status: 'offline', ai: 'offline', anomalies: 0, latency: 0, fps: 0, res: 'N/A', thumbnail: 'bg-black' },
    { id: 'CAM-05', name: 'Robotic Arm 7', location: 'Zone 1', status: 'online', ai: 'active', anomalies: 12, latency: 18, fps: 120, res: '4K', thumbnail: 'bg-slate-800' },
    { id: 'CAM-06', name: 'QC Microscope', location: 'Lab 3', status: 'online', ai: 'learning', anomalies: 0, latency: 32, fps: 60, res: '8K', thumbnail: 'bg-slate-800' },
];

const ANOMALIES = [
    { id: 'evt-1', time: '10:42:05', type: 'Foreign Object', conf: 98, severity: 'high' },
    { id: 'evt-2', time: '10:41:12', type: 'Misalignment', conf: 85, severity: 'medium' },
    { id: 'evt-3', time: '10:38:55', type: 'Thermal Spike', conf: 92, severity: 'high' },
    { id: 'evt-4', time: '10:35:20', type: 'Motion Detect', conf: 60, severity: 'low' },
];

const HEALTH_DATA = Array.from({ length: 20 }, (_, i) => ({
    time: i,
    bitrate: 4000 + Math.random() * 2000,
    cpu: 30 + Math.random() * 40
}));

export const LiveFeedView: React.FC = () => {
    const [view, setView] = useState<'dashboard' | 'live' | 'playback' | 'detail'>('dashboard');
    const [selectedCamId, setSelectedCamId] = useState<string | null>(null);
    
    // Header UI State
    const [searchOpen, setSearchOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'warning' | 'offline'>('all');

    // Camera Control Actions State
    const [cameraAction, setCameraAction] = useState<{ type: string, message: string } | null>(null);

    const selectedCam = CAMERAS.find(c => c.id === selectedCamId) || CAMERAS[0];

    // Filter Logic
    const filteredCameras = CAMERAS.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = statusFilter === 'all' || c.status === statusFilter;
        return matchesSearch && matchesFilter;
    });

    const navigateTo = (v: typeof view, camId?: string) => {
        if (camId) setSelectedCamId(camId);
        setView(v);
    };

    // Control Handlers
    const handleRestart = () => {
        setCameraAction({ type: 'restart', message: 'REBOOTING SYSTEM...' });
        setTimeout(() => setCameraAction(null), 3000);
    };

    const handleCalibrate = () => {
        setCameraAction({ type: 'calibrate', message: 'CALIBRATING SENSORS...' });
        setTimeout(() => setCameraAction(null), 2500);
    };

    const handleResetNet = () => {
        setCameraAction({ type: 'network', message: 'NETWORK RESET INITIATED...' });
        setTimeout(() => setCameraAction({ type: 'network', message: 'RECONNECTING...' }), 1500);
        setTimeout(() => setCameraAction(null), 3000);
    };

    const handleFocus = () => {
        setCameraAction({ type: 'focus', message: 'AUTO-FOCUSING...' });
        setTimeout(() => setCameraAction(null), 2000);
    };

    return (
        <div className="flex flex-col h-full bg-quantum-900 border border-quantum-600 rounded-lg overflow-hidden relative">
            
            {/* Top Navigation Bar */}
            <div className="h-14 border-b border-quantum-600 bg-quantum-800 flex items-center justify-between px-4 shrink-0 relative z-20">
                <div className="flex items-center space-x-4">
                    {view !== 'dashboard' && (
                        <button onClick={() => setView('dashboard')} className="p-1.5 rounded hover:bg-quantum-700 text-slate-400 hover:text-slate-200 transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    )}
                    <div>
                        <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center">
                            <Eye className="w-4 h-4 mr-2 text-cyan-400" /> 
                            {view === 'dashboard' ? 'Vision Systems Overview' : selectedCam.name}
                        </h2>
                        {view !== 'dashboard' && (
                            <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono mt-0.5">
                                <span>{selectedCam.id}</span>
                                <span>•</span>
                                <span className={selectedCam.status === 'online' ? 'text-green-400' : 'text-red-400'}>{selectedCam.status.toUpperCase()}</span>
                            </div>
                        )}
                    </div>
                </div>

                {view !== 'dashboard' && (
                    <div className="flex bg-quantum-950 p-1 rounded border border-quantum-700">
                        <NavTab label="Live View" active={view === 'live'} onClick={() => setView('live')} icon={<Activity className="w-3 h-3" />} />
                        <NavTab label="Playback" active={view === 'playback'} onClick={() => setView('playback')} icon={<Rewind className="w-3 h-3" />} />
                        <NavTab label="Device Detail" active={view === 'detail'} onClick={() => setView('detail')} icon={<Settings className="w-3 h-3" />} />
                    </div>
                )}

                <div className="flex items-center space-x-2">
                    {/* Interactive Search */}
                    {searchOpen ? (
                        <div className="flex items-center bg-quantum-950 border border-quantum-700 rounded-md px-2 py-1 animate-in fade-in slide-in-from-right-2 duration-200">
                            <Search className="w-3 h-3 text-slate-500 mr-2" />
                            <input 
                                autoFocus
                                type="text" 
                                placeholder="Search ID/Name..."
                                className="bg-transparent border-none text-xs text-slate-200 focus:outline-none w-32"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onBlur={() => !searchQuery && setSearchOpen(false)}
                            />
                            <button onClick={() => { setSearchQuery(''); setSearchOpen(false); }} className="ml-1 text-slate-500 hover:text-white"><X className="w-3 h-3" /></button>
                        </div>
                    ) : (
                        <button onClick={() => setSearchOpen(true)} className="p-2 hover:bg-quantum-700 rounded text-slate-400 hover:text-cyan-400 transition-colors">
                            <Search className="w-4 h-4" />
                        </button>
                    )}

                    {/* Interactive Filter */}
                    <div className="relative">
                        <button 
                            onClick={() => setFilterOpen(!filterOpen)} 
                            className={`p-2 rounded transition-colors ${filterOpen ? 'bg-quantum-700 text-cyan-400' : 'hover:bg-quantum-700 text-slate-400 hover:text-cyan-400'}`}
                        >
                            <Filter className="w-4 h-4" />
                        </button>
                        {filterOpen && (
                            <div className="absolute right-0 top-full mt-2 w-32 bg-quantum-900 border border-quantum-600 rounded shadow-xl z-50 py-1">
                                {['all', 'online', 'warning', 'offline'].map(status => (
                                    <button 
                                        key={status}
                                        onClick={() => { setStatusFilter(status as any); setFilterOpen(false); }}
                                        className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-quantum-800 uppercase flex justify-between items-center"
                                    >
                                        {status}
                                        {statusFilter === status && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden bg-quantum-950/50">
                
                {/* --- PAGE 1: DASHBOARD --- */}
                {view === 'dashboard' && (
                    <div className="p-6 h-full overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredCameras.map(cam => (
                                <div key={cam.id} className="bg-quantum-900 border border-quantum-700 rounded-lg overflow-hidden group hover:border-cyan-500/50 transition-all shadow-lg flex flex-col">
                                    {/* Thumbnail Preview */}
                                    <div className={`h-40 w-full relative ${cam.thumbnail} flex items-center justify-center`}>
                                        {cam.status === 'offline' ? (
                                            <div className="flex flex-col items-center text-slate-600">
                                                <WifiOff className="w-8 h-8 mb-2" />
                                                <span className="text-xs font-mono">SIGNAL LOST</span>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                                                <div className="text-slate-700 font-mono text-4xl font-bold opacity-20 select-none">LIVE</div>
                                                {/* Status Overlay */}
                                                <div className="absolute top-2 left-2 flex space-x-1">
                                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${cam.status === 'online' ? 'bg-green-500/80 text-black' : cam.status === 'warning' ? 'bg-orange-500/80 text-black' : 'bg-red-500/80 text-white'}`}>
                                                        {cam.status}
                                                    </span>
                                                    {cam.ai === 'active' && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-cyan-500/80 text-black">AI ACTIVE</span>}
                                                </div>
                                            </>
                                        )}
                                        {/* Hover Actions */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3 backdrop-blur-sm">
                                            <button onClick={() => navigateTo('live', cam.id)} className="p-2 bg-cyan-600 hover:bg-cyan-500 rounded-full text-white shadow-glow-cyan"><Play className="w-5 h-5" /></button>
                                            <button onClick={() => navigateTo('detail', cam.id)} className="p-2 bg-quantum-700 hover:bg-quantum-600 rounded-full text-white"><Settings className="w-5 h-5" /></button>
                                        </div>
                                    </div>

                                    {/* Info Body */}
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="text-sm font-bold text-slate-200">{cam.name}</h3>
                                                <span className="text-[10px] text-slate-500 font-mono">{cam.id}</span>
                                            </div>
                                            <div className="text-xs text-slate-500 mb-3">{cam.location}</div>
                                            
                                            <div className="grid grid-cols-2 gap-2 mb-3">
                                                <MetricPill label="Latency" value={`${cam.latency}ms`} color={cam.latency < 50 ? 'text-green-400' : 'text-orange-400'} />
                                                <MetricPill label="Res" value={cam.res} color="text-slate-300" />
                                            </div>
                                        </div>

                                        {cam.anomalies > 0 ? (
                                            <div className="flex items-center text-xs text-orange-400 bg-orange-900/10 border border-orange-500/20 p-2 rounded">
                                                <AlertTriangle className="w-3 h-3 mr-2 shrink-0" />
                                                {cam.anomalies} Anomalies Detected
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-xs text-slate-500 bg-quantum-950 border border-quantum-800 p-2 rounded">
                                                <CheckCircle2 className="w-3 h-3 mr-2 shrink-0 text-green-500" />
                                                System Normal
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- PAGE 2: LIVE VIEWER --- */}
                {view === 'live' && (
                    <div className="flex h-full">
                        {/* Left Sidebar: Metrics */}
                        <div className="w-64 bg-quantum-900 border-r border-quantum-600 p-4 space-y-6 hidden lg:block">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Stream Health</h3>
                                <div className="space-y-4">
                                    <StreamMetric label="Bitrate" value="8.4 Mbps" trend="+0.2" icon={<Activity className="w-4 h-4 text-cyan-400" />} />
                                    <StreamMetric label="Framerate" value={`${selectedCam.fps} FPS`} trend="stable" icon={<Camera className="w-4 h-4 text-purple-400" />} />
                                    <StreamMetric label="Packet Loss" value="0.01%" trend="good" icon={<Wifi className="w-4 h-4 text-green-400" />} />
                                    <StreamMetric label="AI Latency" value="14ms" trend="+2ms" icon={<Cpu className="w-4 h-4 text-orange-400" />} />
                                </div>
                            </div>
                            <div className="pt-4 border-t border-quantum-700">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Camera Controls</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <ControlBtn icon={<RefreshCw />} label="Restart" onClick={handleRestart} loading={cameraAction?.type === 'restart'} />
                                    <ControlBtn icon={<Aperture />} label="Calibrate" onClick={handleCalibrate} loading={cameraAction?.type === 'calibrate'} />
                                    <ControlBtn icon={<WifiOff />} label="Reset Net" onClick={handleResetNet} loading={cameraAction?.type === 'network'} />
                                    <ControlBtn icon={<Maximize2 />} label="Focus" onClick={handleFocus} loading={cameraAction?.type === 'focus'} />
                                </div>
                            </div>
                        </div>

                        {/* Center: Video Feed */}
                        <div className="flex-1 bg-black relative flex items-center justify-center group overflow-hidden">
                            {/* Feed Placeholder */}
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black opacity-80"></div>
                            
                            {/* Simulated Content */}
                            <div className="relative w-full h-full max-w-4xl max-h-[80%] border border-slate-800 bg-slate-900/20 flex items-center justify-center overflow-hidden shadow-2xl">
                                
                                {/* Base Grid Pattern */}
                                <div className={`absolute inset-0 transition-opacity duration-500 ${cameraAction?.type === 'focus' ? 'opacity-20 blur-sm' : 'opacity-100'}`} style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(34, 211, 238, .05) 25%, rgba(34, 211, 238, .05) 26%, transparent 27%, transparent 74%, rgba(34, 211, 238, .05) 75%, rgba(34, 211, 238, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(34, 211, 238, .05) 25%, rgba(34, 211, 238, .05) 26%, transparent 27%, transparent 74%, rgba(34, 211, 238, .05) 75%, rgba(34, 211, 238, .05) 76%, transparent 77%, transparent)', backgroundSize: '50px 50px' }}></div>
                                
                                {/* Calibration Grid Overlay */}
                                {cameraAction?.type === 'calibrate' && (
                                    <div className="absolute inset-0 z-10 grid grid-cols-4 grid-rows-4 animate-pulse">
                                        {[...Array(16)].map((_, i) => (
                                            <div key={i} className="border border-cyan-500/30"></div>
                                        ))}
                                    </div>
                                )}

                                {/* Content Label */}
                                <div className={`text-slate-700 font-mono text-6xl font-bold opacity-30 select-none animate-pulse transition-all ${cameraAction?.type === 'focus' ? 'blur-md' : 'blur-0'}`}>
                                    {selectedCam.name}
                                </div>
                                
                                {/* Full Screen Action Overlay */}
                                {cameraAction && (
                                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                                        <div className="flex flex-col items-center">
                                            {cameraAction.type === 'network' ? <WifiOff className="w-12 h-12 text-red-500 animate-pulse mb-4" /> : 
                                             <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />}
                                            <span className="text-xl font-bold text-slate-200 tracking-widest uppercase">{cameraAction.message}</span>
                                        </div>
                                    </div>
                                )}

                                {/* AI Overlays (Mock) - Hide if action is active */}
                                {!cameraAction && (
                                    <>
                                        <div className="absolute top-[20%] left-[30%] w-32 h-32 border-2 border-dashed border-red-500/60 rounded flex items-start justify-end p-1">
                                            <span className="bg-red-500 text-white text-[10px] font-bold px-1 rounded">Defect 98%</span>
                                        </div>
                                        <div className="absolute bottom-[30%] right-[20%] w-24 h-48 border-2 border-cyan-500/40 rounded flex items-start justify-start p-1">
                                            <span className="bg-cyan-500 text-black text-[10px] font-bold px-1 rounded">Object</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Overlay Controls */}
                            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-quantum-900/90 border border-quantum-700 px-4 py-2 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button className="p-2 hover:text-cyan-400 text-white"><Rewind className="w-5 h-5" /></button>
                                <button className="p-3 bg-cyan-600 hover:bg-cyan-500 rounded-full text-white shadow-glow-cyan"><Pause className="w-5 h-5 fill-current" /></button>
                                <button className="p-2 hover:text-cyan-400 text-white"><FastForward className="w-5 h-5" /></button>
                                <div className="h-6 w-px bg-slate-600 mx-2"></div>
                                <button className="text-xs font-bold text-cyan-400 hover:text-cyan-300">AI VIEW: ON</button>
                                <button className="text-xs font-bold text-slate-400 hover:text-slate-300">HEATMAP: OFF</button>
                            </div>
                        </div>

                        {/* Right Sidebar: Anomaly Log */}
                        <div className="w-72 bg-quantum-900 border-l border-quantum-600 flex flex-col">
                            <div className="p-4 border-b border-quantum-700 bg-quantum-800">
                                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest">AI Anomaly Log</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                {ANOMALIES.map(evt => (
                                    <div key={evt.id} className="bg-quantum-950 border border-quantum-800 rounded p-3 hover:border-cyan-500/30 transition-colors cursor-pointer group">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`text-xs font-bold uppercase ${evt.severity === 'high' ? 'text-red-400' : 'text-orange-400'}`}>{evt.type}</span>
                                            <span className="text-[10px] text-slate-500 font-mono">{evt.time}</span>
                                        </div>
                                        <div className="w-full h-1 bg-quantum-900 rounded-full overflow-hidden mb-2">
                                            <div className={`h-full ${evt.severity === 'high' ? 'bg-red-500' : 'bg-orange-500'}`} style={{ width: `${evt.conf}%` }}></div>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] text-slate-400">
                                            <span>Conf: {evt.conf}%</span>
                                            <span className="group-hover:text-cyan-400 transition-colors">Review Frame</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- PAGE 3: PLAYBACK --- */}
                {view === 'playback' && (
                    <div className="flex flex-col h-full p-6">
                        <div className="bg-black border border-quantum-700 rounded-lg flex-1 relative overflow-hidden mb-4">
                            {/* Playback Placeholder */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-30">
                                <Play className="w-20 h-20 text-slate-600" />
                            </div>
                            <div className="absolute top-4 left-4 bg-black/50 px-2 py-1 rounded text-xs font-mono text-slate-300">
                                2025-10-24 09:42:15 UTC
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="h-32 bg-quantum-900 border border-quantum-600 rounded-lg p-4 flex flex-col justify-center">
                            <div className="flex justify-between text-xs text-slate-500 font-mono mb-2">
                                <span>09:00</span>
                                <span>10:00</span>
                                <span>11:00</span>
                                <span>12:00</span>
                            </div>
                            <div className="relative h-12 bg-quantum-950 rounded border border-quantum-800 overflow-hidden cursor-crosshair group">
                                {/* Markers */}
                                <div className="absolute left-[15%] top-0 bottom-0 w-0.5 bg-red-500/50 hover:bg-red-400 hover:w-1 transition-all" title="Anomaly"></div>
                                <div className="absolute left-[42%] top-0 bottom-0 w-0.5 bg-orange-500/50 hover:bg-orange-400 hover:w-1 transition-all" title="Warning"></div>
                                <div className="absolute left-[78%] top-0 bottom-0 w-0.5 bg-red-500/50 hover:bg-red-400 hover:w-1 transition-all" title="Anomaly"></div>
                                
                                {/* Scrubber */}
                                <div className="absolute left-[42%] top-0 bottom-0 w-0.5 bg-cyan-400 shadow-[0_0_10px_#22d3ee] z-10">
                                    <div className="absolute -top-1 -left-1.5 w-3.5 h-3.5 bg-cyan-400 rounded-full border-2 border-quantum-900"></div>
                                </div>
                            </div>
                            <div className="flex justify-center space-x-4 mt-2">
                                <button className="p-1 hover:text-cyan-400"><Rewind className="w-4 h-4" /></button>
                                <button className="p-1 hover:text-cyan-400"><Play className="w-4 h-4" /></button>
                                <button className="p-1 hover:text-cyan-400"><FastForward className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- PAGE 4: DEVICE DETAIL --- */}
                {view === 'detail' && (
                    <div className="p-6 h-full overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            
                            {/* Left: Info Card */}
                            <div className="bg-quantum-900 border border-quantum-700 rounded-lg p-6 space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center border border-slate-600">
                                        <Camera className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-100">{selectedCam.name}</h3>
                                        <div className="text-xs text-slate-500 font-mono">ID: {selectedCam.id}</div>
                                        <div className={`text-xs font-bold uppercase mt-1 ${selectedCam.status === 'online' ? 'text-green-400' : 'text-red-400'}`}>
                                            {selectedCam.status}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-quantum-800">
                                    <DetailRow label="Firmware" value="v4.2.1-stable" />
                                    <DetailRow label="MAC Address" value="00:1A:2B:3C:4D:5E" />
                                    <DetailRow label="IP Address" value="192.168.42.101" />
                                    <DetailRow label="Uptime" value="14d 2h 12m" />
                                    <DetailRow label="Last Calib" value="2025-10-01" />
                                </div>

                                <div className="pt-4 border-t border-quantum-800 space-y-2">
                                    <button className="w-full py-2 bg-quantum-800 hover:bg-quantum-700 border border-quantum-600 rounded text-xs font-bold text-slate-300 transition-colors flex items-center justify-center">
                                        <Download className="w-3 h-3 mr-2" /> Download Logs
                                    </button>
                                    <button className="w-full py-2 bg-quantum-800 hover:bg-quantum-700 border border-quantum-600 rounded text-xs font-bold text-slate-300 transition-colors flex items-center justify-center">
                                        <RefreshCw className="w-3 h-3 mr-2" /> Update Firmware
                                    </button>
                                    <button className="w-full py-2 bg-red-900/20 hover:bg-red-900/30 border border-red-500/30 rounded text-xs font-bold text-red-400 transition-colors">
                                        Factory Reset
                                    </button>
                                </div>
                            </div>

                            {/* Right: Telemetry Charts */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-quantum-900 border border-quantum-700 rounded-lg p-5">
                                    <h3 className="text-sm font-bold text-slate-200 uppercase mb-4 flex items-center">
                                        <Network className="w-4 h-4 mr-2 text-cyan-400" /> Network Throughput
                                    </h3>
                                    <div className="h-48 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={HEALTH_DATA}>
                                                <defs>
                                                    <linearGradient id="colorBitrate" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#1c2633" vertical={false} />
                                                <XAxis dataKey="time" hide />
                                                <YAxis stroke="#475569" fontSize={10} domain={['auto', 'auto']} />
                                                <Tooltip contentStyle={{ backgroundColor: '#0a0f16', borderColor: '#2b3a4a', color: '#e2e8f0' }} />
                                                <Area type="monotone" dataKey="bitrate" stroke="#22d3ee" fill="url(#colorBitrate)" strokeWidth={2} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="bg-quantum-900 border border-quantum-700 rounded-lg p-5">
                                    <h3 className="text-sm font-bold text-slate-200 uppercase mb-4 flex items-center">
                                        <Cpu className="w-4 h-4 mr-2 text-purple-400" /> On-Device Inference Load
                                    </h3>
                                    <div className="h-48 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={HEALTH_DATA}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#1c2633" vertical={false} />
                                                <XAxis dataKey="time" hide />
                                                <YAxis stroke="#475569" fontSize={10} domain={[0, 100]} />
                                                <Tooltip contentStyle={{ backgroundColor: '#0a0f16', borderColor: '#2b3a4a', color: '#e2e8f0' }} />
                                                <Line type="monotone" dataKey="cpu" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
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

const MetricPill = ({ label, value, color }: any) => (
    <div className="bg-quantum-900 border border-quantum-800 rounded px-2 py-1 flex justify-between items-center">
        <span className="text-[10px] text-slate-500 uppercase">{label}</span>
        <span className={`text-xs font-mono font-bold ${color}`}>{value}</span>
    </div>
);

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

const StreamMetric = ({ label, value, trend, icon }: any) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-quantum-950 border border-quantum-800 rounded">{icon}</div>
            <div>
                <div className="text-xs text-slate-500 uppercase">{label}</div>
                <div className="text-sm font-mono font-bold text-slate-200">{value}</div>
            </div>
        </div>
        <div className={`text-[10px] px-1.5 rounded ${trend === 'stable' || trend === 'good' ? 'bg-green-900/20 text-green-400' : 'bg-orange-900/20 text-orange-400'}`}>
            {trend}
        </div>
    </div>
);

const ControlBtn = ({ icon, label, onClick, loading }: any) => (
    <button 
        onClick={onClick}
        disabled={loading}
        className={`flex flex-col items-center justify-center p-2 border rounded transition-colors ${
            loading 
            ? 'bg-quantum-900 border-cyan-500/50 text-cyan-400 animate-pulse' 
            : 'bg-quantum-950 border-quantum-800 hover:border-cyan-500/30 hover:text-cyan-400 text-slate-400'
        }`}
    >
        <div className="mb-1">{loading ? <RotateCcw className="w-4 h-4 animate-spin" /> : icon}</div>
        <span className="text-[9px] uppercase font-bold">{label}</span>
    </button>
);

const DetailRow = ({ label, value }: any) => (
    <div className="flex justify-between items-center text-xs">
        <span className="text-slate-500">{label}</span>
        <span className="font-mono text-slate-300 bg-quantum-950 px-2 py-0.5 rounded border border-quantum-800">{value}</span>
    </div>
);