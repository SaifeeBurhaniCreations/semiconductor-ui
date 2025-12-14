import React, { useState, useEffect, useRef } from 'react';
import { 
    Grid, LayoutTemplate, Activity, AlertTriangle, Wifi, WifiOff, 
    Play, Pause, FastForward, Rewind, Camera, Aperture, 
    Maximize2, FileText, Settings, RefreshCw, ChevronLeft, 
    Search, Filter, Calendar, Clock, Download, Layers, Eye,
    CheckCircle2, XCircle, Cpu, Network, RotateCcw, Loader2, X, AlertOctagon, Zap, Thermometer
} from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

// --- SEMICONDUCTOR ASSEMBLY LINE OBJECTS ---

const CAMERAS = [
    // 1) Glass-Interposer R&D Pilot Line
    { 
        id: 'GLS-LSR-01', 
        name: 'Femto-Laser TGV Gen4', 
        location: 'Glass Pilot Line', 
        status: 'online', 
        visualType: 'laser-tgv',
        ai: 'active', 
        anomalies: 0, 
        latency: 12, 
        fps: 120, 
        res: '8K', 
        thumbnail: 'bg-indigo-900/20',
        properties: { pulseWidth: '200fs', wavelength: '515nm', depthControl: '±0.5µm' }
    },
    { 
        id: 'GLS-ETCH-02', 
        name: 'Wet Etch Bench E3', 
        location: 'Glass Pilot Line', 
        status: 'warning', 
        visualType: 'wet-etch',
        ai: 'monitoring', 
        anomalies: 3, 
        latency: 45, 
        fps: 30, 
        res: '4K', 
        thumbnail: 'bg-cyan-900/20',
        properties: { chemistry: 'HF/HNO3', bathTemp: '45°C', etchRate: '0.8µm/min' }
    },

    // 2) Advanced Packaging OSAT
    { 
        id: 'PKG-BND-08', 
        name: 'Hybrid Bonder HB-X', 
        location: 'Adv. Packaging Hall', 
        status: 'online', 
        visualType: 'hybrid-bonder',
        ai: 'active', 
        anomalies: 1, 
        latency: 8, 
        fps: 240, 
        res: '4K', 
        thumbnail: 'bg-slate-800',
        properties: { alignment: '<200nm', force: '15N', throughput: '4500 UPH' }
    },
    { 
        id: 'PKG-DICE-04', 
        name: 'Laser Grooving Saw', 
        location: 'Adv. Packaging Hall', 
        status: 'offline', 
        visualType: 'wafer-saw',
        ai: 'offline', 
        anomalies: 0, 
        latency: 0, 
        fps: 0, 
        res: 'N/A', 
        thumbnail: 'bg-black',
        properties: { kerfWidth: '15µm', bladeSpeed: '45k RPM', cooling: 'DI Water' }
    },

    // 3) SiC/GaN Module Line
    { 
        id: 'PWR-SINT-01', 
        name: 'Ag Sintering Press', 
        location: 'SiC Module Line', 
        status: 'online', 
        visualType: 'sinter-press',
        ai: 'learning', 
        anomalies: 0, 
        latency: 24, 
        fps: 60, 
        res: '1080p', 
        thumbnail: 'bg-orange-900/10',
        properties: { pressure: '20MPa', peakTemp: '250°C', atmosphere: 'N2' }
    },
    { 
        id: 'PWR-TEST-09', 
        name: 'Hi-Pot Tester HV-5', 
        location: 'SiC Module Line', 
        status: 'critical', 
        visualType: 'hipot-tester',
        ai: 'alert', 
        anomalies: 12, 
        latency: 5, 
        fps: 60, 
        res: '1080p', 
        thumbnail: 'bg-red-900/20',
        properties: { voltage: '3.3kV', leakageLimit: '10µA', partialDischarge: 'Detect' }
    },
];

const ANOMALIES = [
    { id: 'evt-1', time: '10:42:05', type: 'Micro-Crack', conf: 98, severity: 'high', source: 'GLS-LSR-01' },
    { id: 'evt-2', time: '10:41:12', type: 'Void Detect', conf: 85, severity: 'medium', source: 'PWR-SINT-01' },
    { id: 'evt-3', time: '10:38:55', type: 'Align Drift', conf: 92, severity: 'high', source: 'PKG-BND-08' },
    { id: 'evt-4', time: '10:35:20', type: 'Particles', conf: 60, severity: 'low', source: 'GLS-ETCH-02' },
];

const HEALTH_DATA = Array.from({ length: 20 }, (_, i) => ({
    time: i,
    bitrate: 4000 + Math.random() * 2000,
    cpu: 30 + Math.random() * 40
}));

// --- VISUALIZATION COMPONENT ---

const SemiconVisualizer: React.FC<{ type: string, paused: boolean, showAi: boolean }> = ({ type, paused, showAi }) => {
    // Shared SVG props for consistency
    const svgBase = "w-full h-full opacity-80 transition-all duration-1000";
    const strokeColor = "#22d3ee"; // Cyan
    const highlightColor = "#8b5cf6"; // Purple
    const alertColor = "#ef4444"; // Red
    const aiColor = "#10b981"; // Green for AI overlays
    const glowFilter = "drop-shadow(0 0 5px rgba(34,211,238,0.5))";

    if (type === 'laser-tgv') {
        return (
            <svg className={svgBase} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Wafer Base */}
                <circle cx="200" cy="200" r="150" stroke="#1e293b" strokeWidth="2" fill="rgba(30, 41, 59, 0.3)" />
                <circle cx="200" cy="200" r="140" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                {/* Grid Pattern on Wafer */}
                <path d="M100 200 H300 M200 100 V300 M130 200 H270 M200 130 V270" stroke="#334155" strokeWidth="0.5" />
                
                {/* Laser Head Assembly */}
                <g className={!paused ? "animate-[spin_10s_linear_infinite]" : ""} style={{ transformOrigin: '200px 200px' }}>
                    <rect x="190" y="20" width="20" height="60" fill={strokeColor} opacity="0.2" />
                    <rect x="195" y="20" width="10" height="60" stroke={strokeColor} strokeWidth="1" />
                    {/* Laser Beam */}
                    <line x1="200" y1="80" x2="200" y2="200" stroke={highlightColor} strokeWidth="2" strokeDasharray="2 2" className={!paused ? "animate-pulse" : ""} style={{ filter: glowFilter }} />
                </g>

                {/* Impact Point */}
                <circle cx="200" cy="200" r="3" fill="white" className={!paused ? "animate-ping" : ""} />
                
                {/* AI Overlay: Predictive Path */}
                {showAi && (
                    <g className="animate-pulse">
                        <circle cx="200" cy="200" r="20" stroke={aiColor} strokeWidth="1" strokeDasharray="2 2" fill="rgba(16, 185, 129, 0.1)" />
                        <path d="M200 200 Q250 250 300 200" stroke={aiColor} strokeWidth="1" strokeDasharray="4 4" fill="none" />
                        <text x="230" y="230" fill={aiColor} fontSize="10" fontFamily="monospace">PREDICTIVE PATH</text>
                        <rect x="220" y="100" width="60" height="20" rx="2" fill="rgba(0,0,0,0.5)" stroke={aiColor} />
                        <text x="225" y="113" fill={aiColor} fontSize="8" fontFamily="monospace">HAZ: NOMINAL</text>
                    </g>
                )}

                {/* Status Text */}
                <text x="30" y="370" fill={strokeColor} fontFamily="monospace" fontSize="12">MODE: TGV DRILLING</text>
                <text x="30" y="385" fill={strokeColor} fontFamily="monospace" fontSize="12">DEPTH: 150µm</text>
            </svg>
        );
    }

    if (type === 'wet-etch') {
        return (
            <svg className={svgBase} viewBox="0 0 400 400" fill="none">
                {/* Tank */}
                <path d="M50 100 L50 350 L350 350 L350 100" stroke="#334155" strokeWidth="4" fill="rgba(15, 23, 42, 0.5)" />
                
                {/* Liquid Level */}
                <path 
                    d="M60 200 Q130 190 200 200 T340 200 V340 H60 Z" 
                    fill="url(#liquidGrad)" 
                    opacity="0.6"
                    className={!paused ? "animate-[pulse_3s_ease-in-out_infinite]" : ""}
                />
                <defs>
                    <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#0891b2" stopOpacity="0.2" />
                    </linearGradient>
                </defs>

                {/* Wafer Cassette */}
                <rect x="150" y="150" width="100" height="120" stroke="white" strokeWidth="2" fill="none" opacity="0.5" />
                <line x1="160" y1="150" x2="160" y2="270" stroke="white" strokeWidth="1" opacity="0.3" />
                <line x1="240" y1="150" x2="240" y2="270" stroke="white" strokeWidth="1" opacity="0.3" />

                {/* Bubbles */}
                {!paused && (
                    <>
                        <g className="animate-[bounce_2s_infinite]">
                            <circle cx="100" cy="300" r="3" fill="#22d3ee" opacity="0.5" />
                            {showAi && <rect x="90" y="290" width="20" height="20" stroke={aiColor} strokeWidth="1" fill="none" />}
                        </g>
                        <g className="animate-[bounce_3s_infinite]">
                            <circle cx="200" cy="320" r="4" fill="#22d3ee" opacity="0.5" />
                            {showAi && <rect x="190" y="310" width="20" height="20" stroke={aiColor} strokeWidth="1" fill="none" />}
                        </g>
                        <g className="animate-[bounce_2.5s_infinite]">
                            <circle cx="300" cy="310" r="2" fill="#22d3ee" opacity="0.5" />
                        </g>
                    </>
                )}

                {/* AI Overlay: Contamination Monitor */}
                {showAi && (
                    <>
                        <text x="70" y="320" fill={aiColor} fontSize="10" fontFamily="monospace">PARTICLE: 0.2µm</text>
                        <line x1="50" y1="200" x2="350" y2="200" stroke={aiColor} strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                        <text x="280" y="190" fill={aiColor} fontSize="10" fontFamily="monospace">LEVEL OK</text>
                    </>
                )}

                <text x="30" y="50" fill={strokeColor} fontFamily="monospace" fontSize="12">CHEM: HF/HNO3</text>
                <text x="30" y="65" fill={strokeColor} fontFamily="monospace" fontSize="12">TEMP: 45.0°C</text>
            </svg>
        );
    }

    if (type === 'hybrid-bonder') {
        return (
            <svg className={svgBase} viewBox="0 0 400 400" fill="none">
                {/* Alignment Crosshairs */}
                <line x1="200" y1="0" x2="200" y2="400" stroke="#334155" strokeWidth="1" strokeDasharray="5 5" />
                <line x1="0" y1="200" x2="400" y2="200" stroke="#334155" strokeWidth="1" strokeDasharray="5 5" />

                {/* Top Die (Upper Chuck) */}
                <g className={!paused ? "animate-[bounce_4s_infinite]" : ""} style={{ transformOrigin: 'center' }}>
                    <rect x="150" y="100" width="100" height="80" stroke={strokeColor} strokeWidth="2" fill="rgba(6, 182, 212, 0.1)" />
                    <circle cx="200" cy="140" r="20" stroke={strokeColor} strokeWidth="1" />
                    <text x="175" y="145" fill={strokeColor} fontSize="10" fontFamily="monospace">DIE A</text>
                    
                    {/* AI Overlay: Dynamic Vector */}
                    {showAi && (
                        <line x1="200" y1="140" x2="200" y2="220" stroke={aiColor} strokeWidth="2" markerEnd="url(#aiArrow)" />
                    )}
                </g>

                {/* Bottom Wafer (Lower Chuck) */}
                <rect x="100" y="220" width="200" height="20" stroke={highlightColor} strokeWidth="2" fill="rgba(139, 92, 246, 0.1)" />
                <rect x="150" y="220" width="100" height="20" fill={highlightColor} opacity="0.2" />
                
                {/* Contact Points & AI Fiducials */}
                <circle cx="160" cy="220" r="2" fill="white" />
                {showAi && <rect x="155" y="215" width="10" height="10" stroke={aiColor} strokeWidth="1" fill="none" />}
                
                <circle cx="240" cy="220" r="2" fill="white" />
                {showAi && <rect x="235" y="215" width="10" height="10" stroke={aiColor} strokeWidth="1" fill="none" />}

                {/* Visual Guides */}
                <path d="M190 200 L210 200 M200 190 L200 210" stroke={alertColor} strokeWidth="1" opacity={!paused ? "1" : "0.5"} />
                
                <defs>
                    <marker id="aiArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                        <path d="M0,0 L6,3 L0,6 Z" fill={aiColor} />
                    </marker>
                </defs>

                {showAi && (
                    <text x="260" y="210" fill={aiColor} fontSize="10" fontFamily="monospace">OFFSET: 0.02nm</text>
                )}
                
                <text x="20" y="370" fill={highlightColor} fontFamily="monospace" fontSize="12">ALIGN: &lt;200nm</text>
                <text x="20" y="385" fill={highlightColor} fontFamily="monospace" fontSize="12">FORCE: 15N</text>
            </svg>
        );
    }

    if (type === 'sinter-press') {
        return (
            <svg className={svgBase} viewBox="0 0 400 400" fill="none">
                {/* Press Frame */}
                <rect x="100" y="50" width="200" height="300" stroke="#475569" strokeWidth="4" rx="10" />
                
                {/* Module Package */}
                <rect x="140" y="180" width="120" height="40" stroke="#f97316" strokeWidth="2" fill="rgba(249, 115, 22, 0.1)" />
                
                {/* AI Overlay: Thermal Mesh */}
                {showAi && (
                    <g opacity="0.3">
                        <path d="M140 180 L260 180" stroke={aiColor} strokeWidth="0.5" />
                        <path d="M140 190 L260 190" stroke={aiColor} strokeWidth="0.5" />
                        <path d="M140 200 L260 200" stroke={aiColor} strokeWidth="0.5" />
                        <path d="M140 210 L260 210" stroke={aiColor} strokeWidth="0.5" />
                        <path d="M160 180 L160 220" stroke={aiColor} strokeWidth="0.5" />
                        <path d="M200 180 L200 220" stroke={aiColor} strokeWidth="0.5" />
                        <path d="M240 180 L240 220" stroke={aiColor} strokeWidth="0.5" />
                        <text x="145" y="175" fill={aiColor} fontSize="8">ΔT: 0.1°C</text>
                    </g>
                )}

                {/* Pressure Arrows */}
                <g className={!paused ? "animate-[pulse_2s_infinite]" : ""}>
                    <path d="M200 100 L200 170" stroke="#f97316" strokeWidth="4" markerEnd="url(#arrow)" />
                    <path d="M200 300 L200 230" stroke="#f97316" strokeWidth="4" markerEnd="url(#arrow)" />
                </g>
                <defs>
                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                        <path d="M0 0 L10 5 L0 10 z" fill="#f97316" />
                    </marker>
                </defs>

                {/* Heat Waves */}
                {!paused && (
                    <g opacity="0.5">
                        <path d="M120 200 Q110 180 120 160" stroke="#ef4444" strokeWidth="2" className="animate-[pulse_1s_infinite]" />
                        <path d="M280 200 Q290 180 280 160" stroke="#ef4444" strokeWidth="2" className="animate-[pulse_1.2s_infinite]" />
                    </g>
                )}

                <text x="280" y="200" fill="#f97316" fontFamily="monospace" fontSize="14" fontWeight="bold">250°C</text>
                <text x="280" y="220" fill="#f97316" fontFamily="monospace" fontSize="12">20MPa</text>
            </svg>
        );
    }

    if (type === 'hipot-tester') {
        return (
            <svg className={svgBase} viewBox="0 0 400 400" fill="none">
                {/* Circuit Diagram Background */}
                <path d="M50 200 H150 L170 150 L190 250 L210 150 L230 250 L250 200 H350" stroke="#334155" strokeWidth="2" />
                
                {/* DUT (Device Under Test) */}
                <rect x="150" y="150" width="100" height="100" stroke={alertColor} strokeWidth="2" fill="rgba(239, 68, 68, 0.05)" />
                <text x="185" y="205" fill={alertColor} fontSize="14" fontWeight="bold">DUT</text>

                {/* AI Overlay: Discharge Prediction */}
                {showAi && (
                    <g>
                        <circle cx="200" cy="200" r="60" stroke={aiColor} strokeWidth="1" strokeDasharray="4 4" fill="none" className="animate-[spin_10s_linear_infinite]" />
                        <text x="160" y="130" fill={aiColor} fontSize="10">ISOLATION ZONE</text>
                        <path d="M200 150 L220 130" stroke={aiColor} strokeWidth="1" />
                    </g>
                )}

                {/* Arcing Effect */}
                {!paused && (
                    <path 
                        d="M200 150 Q220 100 250 120 T300 100" 
                        stroke="#fbbf24" 
                        strokeWidth="2" 
                        fill="none" 
                        className="animate-[pulse_0.2s_infinite]" 
                        style={{ filter: "drop-shadow(0 0 8px #fbbf24)" }}
                    />
                )}

                {/* Voltage Meter Visual */}
                <circle cx="200" cy="350" r="40" stroke="#475569" strokeWidth="2" />
                <line x1="200" y1="350" x2="230" y2="320" stroke={alertColor} strokeWidth="2" className={!paused ? "animate-[spin_2s_alternate_infinite]" : ""} style={{ transformOrigin: '200px 350px' }} />
                
                <text x="30" y="50" fill={alertColor} fontFamily="monospace" fontSize="16" fontWeight="bold">HIGH VOLTAGE</text>
                <text x="30" y="70" fill={alertColor} fontFamily="monospace" fontSize="12">3.3 kV ACTIVE</text>
            </svg>
        );
    }

    // Default / Generic View
    return (
        <div className="flex items-center justify-center h-full text-slate-600">
            <Camera className="w-16 h-16 opacity-20" />
        </div>
    );
};

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

    // Live View Controls State
    const [isLivePaused, setIsLivePaused] = useState(false);
    const [showLiveAi, setShowLiveAi] = useState(true);
    const [showLiveHeatmap, setShowLiveHeatmap] = useState(false);

    // Device Detail Actions State
    const [logsStatus, setLogsStatus] = useState<'idle' | 'downloading' | 'success'>('idle');
    const [firmwareStatus, setFirmwareStatus] = useState<'idle' | 'updating' | 'success' | 'error'>('idle');
    const [resetStatus, setResetStatus] = useState<'idle' | 'resetting' | 'success'>('idle');

    // Playback State
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackProgress, setPlaybackProgress] = useState(42); // Percentage
    const playbackInterval = useRef<any | null>(null); // Use any to avoid NodeJS type issues

    const selectedCam = CAMERAS.find(c => c.id === selectedCamId) || CAMERAS[0];

    // Filter Logic
    const filteredCameras = CAMERAS.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase()) || c.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = statusFilter === 'all' || c.status === statusFilter || (statusFilter === 'warning' && c.status === 'critical');
        return matchesSearch && matchesFilter;
    });

    const navigateTo = (v: typeof view, camId?: string) => {
        if (camId) setSelectedCamId(camId);
        setView(v);
        // Reset specific view states
        setLogsStatus('idle');
        setFirmwareStatus('idle');
        setResetStatus('idle');
        setIsPlaying(false);
        setIsLivePaused(false); // Ensure live view starts playing
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

    // Live Feed Controls
    const handleLiveRewind = () => {
        setCameraAction({ type: 'seek', message: 'REPLAY -10s' }); 
        setTimeout(() => setCameraAction(null), 1000);
    };

    const handleLiveForward = () => {
        setCameraAction({ type: 'seek', message: 'SYNC LIVE' }); 
        setIsLivePaused(false);
        setTimeout(() => setCameraAction(null), 1000);
    };

    // Device Detail Handlers
    const handleDownloadLogs = () => {
        setLogsStatus('downloading');
        setTimeout(() => {
            setLogsStatus('success');
            setTimeout(() => setLogsStatus('idle'), 2000);
        }, 1500);
    };

    const handleUpdateFirmware = () => {
        setFirmwareStatus('updating');
        setTimeout(() => {
            setFirmwareStatus('success');
            setTimeout(() => setFirmwareStatus('idle'), 3000);
        }, 3000);
    };

    const handleFactoryReset = () => {
        if (window.confirm("WARNING: This will erase all local data and calibration settings. Are you sure?")) {
            setResetStatus('resetting');
            setTimeout(() => {
                setResetStatus('success');
                setTimeout(() => {
                    setResetStatus('idle');
                    setView('dashboard'); // Redirect after reset
                }, 2000);
            }, 3000);
        }
    };

    // Playback Logic
    useEffect(() => {
        if (isPlaying) {
            playbackInterval.current = setInterval(() => {
                setPlaybackProgress(prev => {
                    if (prev >= 100) {
                        setIsPlaying(false);
                        return 100;
                    }
                    return prev + 0.1;
                });
            }, 50);
        } else {
            if (playbackInterval.current) clearInterval(playbackInterval.current);
        }
        return () => {
            if (playbackInterval.current) clearInterval(playbackInterval.current);
        };
    }, [isPlaying]);

    const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.min(100, Math.max(0, (x / rect.width) * 100));
        setPlaybackProgress(percentage);
    };

    const formatPlaybackTime = (progress: number) => {
        // Assume start time is 09:00:00 and duration is 4 hours
        const totalSeconds = 4 * 60 * 60;
        const currentSeconds = (progress / 100) * totalSeconds;
        const date = new Date();
        date.setHours(9, 0, 0, 0);
        date.setSeconds(date.getSeconds() + currentSeconds);
        return date.toLocaleTimeString('en-US', { hour12: false });
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
                            {view === 'dashboard' ? 'Semiconductor Vision Systems' : selectedCam.name}
                        </h2>
                        {view !== 'dashboard' && (
                            <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono mt-0.5">
                                <span>{selectedCam.id}</span>
                                <span>•</span>
                                <span className={selectedCam.status === 'online' ? 'text-green-400' : selectedCam.status === 'critical' ? 'text-red-500' : 'text-orange-400'}>{selectedCam.status.toUpperCase()}</span>
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
                                placeholder="Search Line/Machine..."
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
                            {/* Machine Specific Properties */}
                            {selectedCam.properties && (
                                <div className="pt-4 border-t border-quantum-700">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Machine Config</h3>
                                    <div className="space-y-2">
                                        {Object.entries(selectedCam.properties).map(([key, val]) => (
                                            <div key={key} className="flex justify-between text-[10px]">
                                                <span className="text-slate-500 uppercase">{key}</span>
                                                <span className="text-slate-200 font-mono">{val as string}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Center: Video Feed */}
                        <div className="flex-1 bg-black relative flex items-center justify-center group overflow-hidden">
                            {/* Feed Placeholder */}
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black opacity-80"></div>
                            
                            {/* Simulated Content */}
                            <div className="relative w-full h-full max-w-4xl max-h-[80%] border border-slate-800 bg-slate-900/20 flex items-center justify-center overflow-hidden shadow-2xl">
                                
                                {/* Base Grid Pattern */}
                                <div className={`absolute inset-0 transition-opacity duration-500 ${cameraAction?.type === 'focus' ? 'opacity-20 blur-sm' : 'opacity-100'}`} style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(34, 211, 238, .05) 25%, rgba(34, 211, 238, .05) 26%, transparent 27%, transparent 74%, rgba(34, 211, 238, .05) 75%, rgba(34, 211, 238, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(34, 211, 238, .05) 25%, rgba(34, 211, 238, .05) 26%, transparent 27%, transparent 74%, rgba(34, 211, 238, .05) 75%, rgba(34, 211, 238, .05) 76%, transparent 77%, transparent)', backgroundSize: '50px 50px' }}></div>
                                
                                {/* VISUALIZATION LAYER */}
                                <div className="absolute inset-0 z-0">
                                    <SemiconVisualizer 
                                        type={selectedCam.visualType || 'default'} 
                                        paused={isLivePaused || !!cameraAction} 
                                        showAi={showLiveAi}
                                    />
                                </div>

                                {/* Heatmap Overlay */}
                                {showLiveHeatmap && (
                                    <div className="absolute inset-0 z-0 bg-gradient-to-br from-red-500/10 via-transparent to-blue-500/10 mix-blend-overlay pointer-events-none animate-pulse">
                                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl mix-blend-screen opacity-50"></div>
                                        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-orange-500/20 rounded-full blur-2xl mix-blend-screen opacity-40"></div>
                                    </div>
                                )}

                                {/* Calibration Grid Overlay */}
                                {cameraAction?.type === 'calibrate' && (
                                    <div className="absolute inset-0 z-10 grid grid-cols-4 grid-rows-4 animate-pulse">
                                        {[...Array(16)].map((_, i) => (
                                            <div key={i} className="border border-cyan-500/30"></div>
                                        ))}
                                    </div>
                                )}

                                {/* Content Label */}
                                <div className={`absolute top-4 left-4 text-slate-700 font-mono text-sm font-bold opacity-50 select-none animate-pulse transition-all ${cameraAction?.type === 'focus' ? 'blur-md' : 'blur-0'}`}>
                                    LIVE_FEED :: {selectedCam.name.toUpperCase()}
                                </div>
                                
                                {/* Paused Overlay */}
                                {isLivePaused && !cameraAction && (
                                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                        <div className="flex flex-col items-center text-slate-300">
                                            <Pause className="w-12 h-12 mb-2 opacity-80" />
                                            <span className="text-xs font-mono tracking-widest uppercase">Stream Paused</span>
                                        </div>
                                    </div>
                                )}

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
                            </div>

                            {/* Overlay Controls */}
                            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-quantum-900/90 border border-quantum-700 px-4 py-2 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                                <button 
                                    onClick={handleLiveRewind} 
                                    className="p-2 hover:text-cyan-400 text-white transition-colors"
                                    title="Replay last 10s"
                                >
                                    <Rewind className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={() => setIsLivePaused(!isLivePaused)}
                                    className="p-3 bg-cyan-600 hover:bg-cyan-500 rounded-full text-white shadow-glow-cyan transition-colors"
                                >
                                    {isLivePaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
                                </button>
                                <button 
                                    onClick={handleLiveForward} 
                                    className="p-2 hover:text-cyan-400 text-white transition-colors"
                                    title="Jump to Live"
                                >
                                    <FastForward className="w-5 h-5" />
                                </button>
                                <div className="h-6 w-px bg-slate-600 mx-2"></div>
                                <button 
                                    onClick={() => setShowLiveAi(!showLiveAi)}
                                    className={`text-xs font-bold transition-colors ${showLiveAi ? 'text-cyan-400 hover:text-cyan-300' : 'text-slate-500 hover:text-slate-400'}`}
                                >
                                    AI VIEW: {showLiveAi ? 'ON' : 'OFF'}
                                </button>
                                <button 
                                    onClick={() => setShowLiveHeatmap(!showLiveHeatmap)}
                                    className={`text-xs font-bold transition-colors ${showLiveHeatmap ? 'text-orange-400 hover:text-orange-300' : 'text-slate-500 hover:text-slate-400'}`}
                                >
                                    HEATMAP: {showLiveHeatmap ? 'ON' : 'OFF'}
                                </button>
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
                                            <span className="text-[9px] text-slate-600">{evt.source}</span>
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
                        <div className="bg-black border border-quantum-700 rounded-lg flex-1 relative overflow-hidden mb-4 group">
                            {/* Playback Content */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                {isPlaying ? (
                                    <div className="w-full h-full relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black animate-pulse opacity-50"></div>
                                        <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundImage: 'radial-gradient(circle, #2b3a4a 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
                                            <div className="w-[80%] h-[80%] border-2 border-dashed border-cyan-900/50 rounded-lg flex items-center justify-center relative">
                                                {/* Simulated moving object */}
                                                <div className="absolute w-20 h-20 bg-cyan-500/10 border border-cyan-500/30 rounded-full animate-[spin_4s_linear_infinite]"></div>
                                                <div className="text-cyan-500/50 font-mono text-xl animate-pulse">REPLAYING STREAM...</div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center opacity-30">
                                        <Play className="w-20 h-20 text-slate-600" />
                                        <span className="mt-2 text-slate-500 font-mono">PAUSED</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Timestamp Overlay */}
                            <div className="absolute top-4 left-4 bg-black/70 px-2 py-1 rounded text-xs font-mono text-cyan-400 border border-cyan-900/30">
                                {formatPlaybackTime(playbackProgress)} UTC
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="h-32 bg-quantum-900 border border-quantum-600 rounded-lg p-4 flex flex-col justify-center select-none">
                            <div className="flex justify-between text-xs text-slate-500 font-mono mb-2">
                                <span>09:00</span>
                                <span>10:00</span>
                                <span>11:00</span>
                                <span>12:00</span>
                                <span>13:00</span>
                            </div>
                            <div 
                                className="relative h-12 bg-quantum-950 rounded border border-quantum-800 overflow-hidden cursor-crosshair group"
                                onClick={handleTimelineClick}
                            >
                                {/* Markers */}
                                <div className="absolute left-[15%] top-0 bottom-0 w-0.5 bg-red-500/50 hover:bg-red-400 hover:w-1 transition-all" title="Anomaly"></div>
                                <div className="absolute left-[42%] top-0 bottom-0 w-0.5 bg-orange-500/50 hover:bg-orange-400 hover:w-1 transition-all" title="Warning"></div>
                                <div className="absolute left-[78%] top-0 bottom-0 w-0.5 bg-red-500/50 hover:bg-red-400 hover:w-1 transition-all" title="Anomaly"></div>
                                
                                {/* Progress Bar */}
                                <div className="absolute top-0 bottom-0 left-0 bg-cyan-900/20 pointer-events-none" style={{ width: `${playbackProgress}%` }}></div>

                                {/* Scrubber */}
                                <div 
                                    className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 shadow-[0_0_10px_#22d3ee] z-10 transition-all duration-75"
                                    style={{ left: `${playbackProgress}%` }}
                                >
                                    <div className="absolute -top-1 -left-1.5 w-3.5 h-3.5 bg-cyan-400 rounded-full border-2 border-quantum-900"></div>
                                </div>
                            </div>
                            <div className="flex justify-center space-x-4 mt-2">
                                <button className="p-1 text-slate-400 hover:text-cyan-400" onClick={() => setPlaybackProgress(Math.max(0, playbackProgress - 5))}><Rewind className="w-4 h-4" /></button>
                                <button 
                                    className={`p-1 rounded-full ${isPlaying ? 'text-cyan-400 bg-cyan-900/20' : 'text-slate-300 hover:text-white'}`}
                                    onClick={() => setIsPlaying(!isPlaying)}
                                >
                                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                                </button>
                                <button className="p-1 text-slate-400 hover:text-cyan-400" onClick={() => setPlaybackProgress(Math.min(100, playbackProgress + 5))}><FastForward className="w-4 h-4" /></button>
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
                                        <div className={`text-xs font-bold uppercase mt-1 ${selectedCam.status === 'online' ? 'text-green-400' : selectedCam.status === 'critical' ? 'text-red-500' : 'text-orange-400'}`}>
                                            {selectedCam.status}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-quantum-800">
                                    <DetailRow label="Location" value={selectedCam.location} />
                                    <DetailRow label="Firmware" value="v4.2.1-stable" />
                                    <DetailRow label="IP Address" value="192.168.42.101" />
                                    <DetailRow label="Uptime" value="14d 2h 12m" />
                                    {selectedCam.properties && Object.entries(selectedCam.properties).map(([k, v]) => (
                                        <DetailRow key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} value={v as string} />
                                    ))}
                                </div>

                                <div className="pt-4 border-t border-quantum-800 space-y-2">
                                    <button 
                                        onClick={handleDownloadLogs}
                                        disabled={logsStatus !== 'idle'}
                                        className="w-full py-2 bg-quantum-800 hover:bg-quantum-700 border border-quantum-600 rounded text-xs font-bold text-slate-300 transition-colors flex items-center justify-center disabled:opacity-50"
                                    >
                                        {logsStatus === 'downloading' ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : 
                                         logsStatus === 'success' ? <CheckCircle2 className="w-3 h-3 mr-2 text-green-400" /> :
                                         <Download className="w-3 h-3 mr-2" />}
                                        {logsStatus === 'downloading' ? 'Downloading...' : logsStatus === 'success' ? 'Downloaded' : 'Download Logs'}
                                    </button>
                                    
                                    <button 
                                        onClick={handleUpdateFirmware}
                                        disabled={firmwareStatus !== 'idle'}
                                        className="w-full py-2 bg-quantum-800 hover:bg-quantum-700 border border-quantum-600 rounded text-xs font-bold text-slate-300 transition-colors flex items-center justify-center disabled:opacity-50"
                                    >
                                        {firmwareStatus === 'updating' ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> :
                                         firmwareStatus === 'success' ? <CheckCircle2 className="w-3 h-3 mr-2 text-green-400" /> :
                                         <RefreshCw className="w-3 h-3 mr-2" />}
                                        {firmwareStatus === 'updating' ? 'Updating...' : firmwareStatus === 'success' ? 'Updated to v4.3' : 'Update Firmware'}
                                    </button>
                                    
                                    <button 
                                        onClick={handleFactoryReset}
                                        disabled={resetStatus !== 'idle'}
                                        className="w-full py-2 bg-red-900/20 hover:bg-red-900/30 border border-red-500/30 rounded text-xs font-bold text-red-400 transition-colors flex items-center justify-center disabled:opacity-50"
                                    >
                                        {resetStatus === 'resetting' ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : 
                                         <AlertOctagon className="w-3 h-3 mr-2" />}
                                        {resetStatus === 'resetting' ? 'Resetting...' : 'Factory Reset'}
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
