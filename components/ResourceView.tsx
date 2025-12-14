import React, { useState, useEffect } from 'react';
import { 
    Cpu, Server, Activity, Thermometer, Wind, Zap, 
    Wrench, AlertTriangle, CheckCircle2, Battery, Gauge,
    LayoutGrid, Droplets, Power, RefreshCw, Lock, Settings,
    Play, RotateCcw, Map, List, Search, Filter, ChevronLeft,
    Wifi, WifiOff, FileText, Crosshair, Navigation, Bell, Loader2
} from 'lucide-react';
import { 
    BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, 
    LineChart, Line, CartesianGrid, YAxis, AreaChart, Area 
} from 'recharts';

// --- MOCK DATA ---

const MOCK_POWER_DATA = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    usage: 450 + Math.random() * 150,
    solar: i > 6 && i < 18 ? 200 + Math.random() * 100 : 0
}));

const MOCK_CLUSTER_DATA = [
    { name: 'Core-01', load: 88, temp: 62 },
    { name: 'Core-02', load: 92, temp: 65 },
    { name: 'Core-03', load: 45, temp: 40 },
    { name: 'Core-04', load: 12, temp: 35 },
    { name: 'GPU-Cluster-A', load: 76, temp: 70 },
    { name: 'GPU-Cluster-B', load: 98, temp: 82 },
];

const IOT_DEVICES = [
    { id: 'iot-1', name: 'Bonding Station 2', status: 'online', type: 'Bonding', temp: 142.3, humidity: 38, vibration: 0.02, power: 12.4, location: { x: 20, y: 30 }, zone: 'Zone A' },
    { id: 'iot-2', name: 'Thermal Chamber A', status: 'stabilizing', type: 'Thermal', temp: 85.1, humidity: 12, vibration: 0.15, power: 8.2, location: { x: 45, y: 60 }, zone: 'Zone B' },
    { id: 'iot-3', name: 'Cleanroom Sensor Array', status: 'online', type: 'Sensor', temp: 21.4, humidity: 45, vibration: 0.0, power: 0.5, location: { x: 70, y: 20 }, zone: 'Zone A' },
    { id: 'iot-4', name: 'Etcher-X4', status: 'maintenance', type: 'Etch', temp: 24.0, humidity: 40, vibration: 0.0, power: 0.0, location: { x: 80, y: 80 }, zone: 'Zone C' },
    { id: 'iot-5', name: 'Conveyor Motor 7', status: 'warning', type: 'Motor', temp: 65.2, humidity: 30, vibration: 0.85, power: 3.1, location: { x: 30, y: 85 }, zone: 'Zone C' },
    { id: 'iot-6', name: 'Vac Pump B', status: 'online', type: 'Pump', temp: 42.1, humidity: 20, vibration: 0.12, power: 4.5, location: { x: 15, y: 55 }, zone: 'Zone B' },
];

const DEVICE_HISTORY = Array.from({ length: 24 }, (_, i) => ({
    time: i,
    temp: 140 + Math.random() * 5 - 2.5,
    power: 12 + Math.random() * 1 - 0.5,
    vibration: 0.02 + Math.random() * 0.01
}));

const ALERTS = [
    { id: 'ALT-001', severity: 'critical', device: 'Conveyor Motor 7', type: 'Vibration', msg: 'Harmonic resonance detected', time: '10:42 AM' },
    { id: 'ALT-002', severity: 'warning', device: 'Thermal Chamber A', type: 'Temperature', msg: 'Stabilization period exceeded', time: '10:15 AM' },
    { id: 'ALT-003', severity: 'info', device: 'Etcher-X4', type: 'Maintenance', msg: 'Scheduled calibration due', time: '08:00 AM' },
];

export const ResourceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'iot' | 'compute' | 'env'>('iot');
  
  // IoT Internal State
  const [iotView, setIotView] = useState<'dashboard' | 'detail' | 'map' | 'alerts'>('dashboard');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [mapHeatmap, setMapHeatmap] = useState(false);
  const [deviceAction, setDeviceAction] = useState<{ type: 'restart' | 'calibrate', status: 'idle' | 'running' | 'success' }>({ type: 'restart', status: 'idle' });
  
  // Diagnostic Scan State
  const [diagStatus, setDiagStatus] = useState<'idle' | 'running' | 'complete'>('idle');
  const [diagProgress, setDiagProgress] = useState(0);
  const [diagMessage, setDiagMessage] = useState('');

  const selectedDevice = IOT_DEVICES.find(d => d.id === selectedDeviceId) || IOT_DEVICES[0];

  const handleDeviceSelect = (id: string) => {
      setSelectedDeviceId(id);
      setIotView('detail');
      setDeviceAction({ type: 'restart', status: 'idle' }); // Reset action state
  };

  const handleRestart = () => {
      setDeviceAction({ type: 'restart', status: 'running' });
      setTimeout(() => {
          setDeviceAction({ type: 'restart', status: 'success' });
          setTimeout(() => setDeviceAction({ type: 'restart', status: 'idle' }), 2000);
      }, 2000);
  };

  const handleCalibrate = () => {
      setDeviceAction({ type: 'calibrate', status: 'running' });
      setTimeout(() => {
          setDeviceAction({ type: 'calibrate', status: 'success' });
          setTimeout(() => setDeviceAction({ type: 'calibrate', status: 'idle' }), 2000);
      }, 2500);
  };

  const handleDiagnosticScan = () => {
      if (diagStatus === 'running') return;
      setDiagStatus('running');
      setDiagProgress(0);
      setDiagMessage('Initializing Protocol...');

      const steps = [
          { pct: 20, msg: 'Verifying Sensor Integrity...' },
          { pct: 45, msg: 'Analyzing Frequency Harmonics...' },
          { pct: 70, msg: 'Correlating Logs with AI Core...' },
          { pct: 90, msg: 'Finalizing Report...' },
          { pct: 100, msg: 'Complete' }
      ];

      let stepIndex = 0;
      
      const interval = setInterval(() => {
          stepIndex++;
          if (stepIndex < steps.length) {
              setDiagProgress(steps[stepIndex].pct);
              setDiagMessage(steps[stepIndex].msg);
          } else {
              clearInterval(interval);
              setDiagStatus('complete');
              setDiagMessage('Scan Complete. No Critical Faults.');
              // Reset after a delay
              setTimeout(() => {
                  setDiagStatus('idle');
                  setDiagProgress(0);
              }, 4000);
          }
      }, 800);
  };

  return (
    <div className="flex flex-col h-full bg-quantum-900 border border-quantum-600 rounded-lg overflow-hidden">
        {/* Top Level Tabs */}
        <div className="flex items-center px-4 border-b border-quantum-600 bg-quantum-800 shrink-0 h-12">
            <TabButton 
                active={activeTab === 'iot'} 
                onClick={() => setActiveTab('iot')} 
                icon={<Wrench className="w-4 h-4" />} 
                label="IoT Mesh" 
            />
            <TabButton 
                active={activeTab === 'compute'} 
                onClick={() => setActiveTab('compute')} 
                icon={<Cpu className="w-4 h-4" />} 
                label="Compute Infrastructure" 
            />
            <TabButton 
                active={activeTab === 'env'} 
                onClick={() => setActiveTab('env')} 
                icon={<Zap className="w-4 h-4" />} 
                label="Energy Grid" 
            />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden bg-quantum-950/50 relative">
            
            {/* --- IOT MESH MODULE --- */}
            {activeTab === 'iot' && (
                <div className="flex flex-col h-full">
                    {/* IoT Navigation */}
                    <div className="h-12 border-b border-quantum-700 bg-quantum-900/50 flex items-center justify-between px-4 shrink-0">
                        <div className="flex items-center space-x-2">
                            {iotView === 'detail' && (
                                <button onClick={() => setIotView('dashboard')} className="mr-2 p-1 hover:bg-quantum-800 rounded text-slate-400 hover:text-white transition-colors">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                            )}
                            <div className="flex space-x-1 bg-quantum-950 rounded p-0.5 border border-quantum-700">
                                <SubNavTab active={iotView === 'dashboard'} onClick={() => setIotView('dashboard')} icon={<LayoutGrid className="w-3 h-3" />} label="Overview" />
                                <SubNavTab active={iotView === 'map'} onClick={() => setIotView('map')} icon={<Map className="w-3 h-3" />} label="Facility Map" />
                                <SubNavTab active={iotView === 'alerts'} onClick={() => setIotView('alerts')} icon={<List className="w-3 h-3" />} label="Diagnostics" />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                                {IOT_DEVICES.length} Devices Online
                            </span>
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        
                        {/* 1. OVERVIEW DASHBOARD */}
                        {iotView === 'dashboard' && (
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="relative flex-1 max-w-xs">
                                        <Search className="w-4 h-4 absolute left-3 top-2 text-slate-500" />
                                        <input type="text" placeholder="Search devices..." className="w-full bg-quantum-900 border border-quantum-700 rounded pl-9 pr-3 py-1.5 text-xs text-slate-300 focus:border-cyan-500 outline-none" />
                                    </div>
                                    <div className="flex space-x-2">
                                        <FilterBadge label="Critical" count={1} color="red" />
                                        <FilterBadge label="Warning" count={2} color="orange" />
                                        <FilterBadge label="Maintenance" count={1} color="slate" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {IOT_DEVICES.map(device => (
                                        <div 
                                            key={device.id} 
                                            onClick={() => handleDeviceSelect(device.id)}
                                            className="bg-quantum-900 border border-quantum-700 rounded-lg p-4 cursor-pointer hover:border-cyan-500/50 transition-all group relative overflow-hidden"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`p-2 rounded bg-quantum-950 border border-quantum-800 ${device.status === 'warning' ? 'text-orange-400' : 'text-cyan-400'}`}>
                                                        <Activity className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-200">{device.name}</div>
                                                        <div className="text-[10px] text-slate-500 font-mono">{device.id}</div>
                                                    </div>
                                                </div>
                                                <div className={`w-2 h-2 rounded-full ${
                                                    device.status === 'online' ? 'bg-green-500' : 
                                                    device.status === 'warning' ? 'bg-orange-500 animate-pulse' : 
                                                    'bg-slate-500'
                                                }`}></div>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-2 mb-3">
                                                <MiniMetric label="Temp" value={`${device.temp}°C`} />
                                                <MiniMetric label="Vib" value={`${device.vibration}g`} warning={device.vibration > 0.5} />
                                                <MiniMetric label="Pwr" value={`${device.power}kW`} />
                                                <MiniMetric label="Hum" value={`${device.humidity}%`} />
                                            </div>

                                            <div className="flex justify-between items-center pt-2 border-t border-quantum-800">
                                                <span className="text-[10px] text-slate-500 uppercase">{device.type}</span>
                                                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-1 hover:bg-quantum-800 rounded text-slate-400 hover:text-white" title="Restart"><RotateCcw className="w-3 h-3" /></button>
                                                    <button className="p-1 hover:bg-quantum-800 rounded text-slate-400 hover:text-white" title="Config"><Settings className="w-3 h-3" /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 2. DEVICE DETAIL */}
                        {iotView === 'detail' && selectedDevice && (
                            <div className="h-full flex flex-col space-y-6">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-quantum-800 rounded border border-quantum-700">
                                            <Wrench className="w-6 h-6 text-cyan-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-100">{selectedDevice.name}</h2>
                                            <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                                                <span className="font-mono">{selectedDevice.id}</span>
                                                <span>•</span>
                                                <span>{selectedDevice.zone}</span>
                                                <span>•</span>
                                                <span className={`uppercase font-bold ${selectedDevice.status === 'online' ? 'text-green-400' : 'text-orange-400'}`}>{selectedDevice.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button 
                                            onClick={handleRestart}
                                            disabled={deviceAction.status === 'running'}
                                            className={`px-4 py-2 border rounded text-xs font-bold flex items-center transition-colors min-w-[100px] justify-center ${
                                                deviceAction.type === 'restart' && deviceAction.status === 'success' ? 'bg-green-900/20 border-green-500/30 text-green-400' :
                                                'bg-quantum-900 hover:bg-quantum-800 border-quantum-700 text-slate-300'
                                            }`}
                                        >
                                            {deviceAction.type === 'restart' && deviceAction.status === 'running' ? (
                                                <><Loader2 className="w-3 h-3 mr-2 animate-spin" /> Restarting</>
                                            ) : deviceAction.type === 'restart' && deviceAction.status === 'success' ? (
                                                <><CheckCircle2 className="w-3 h-3 mr-2" /> Done</>
                                            ) : (
                                                <><RotateCcw className="w-3 h-3 mr-2" /> Restart</>
                                            )}
                                        </button>
                                        <button 
                                            onClick={handleCalibrate}
                                            disabled={deviceAction.status === 'running'}
                                            className={`px-4 py-2 rounded text-xs font-bold flex items-center shadow-glow-cyan transition-colors min-w-[100px] justify-center ${
                                                deviceAction.type === 'calibrate' && deviceAction.status === 'success' ? 'bg-green-600 hover:bg-green-500 text-white' :
                                                'bg-cyan-600 hover:bg-cyan-500 text-white'
                                            }`}
                                        >
                                            {deviceAction.type === 'calibrate' && deviceAction.status === 'running' ? (
                                                <><Loader2 className="w-3 h-3 mr-2 animate-spin" /> Calib...</>
                                            ) : deviceAction.type === 'calibrate' && deviceAction.status === 'success' ? (
                                                <><CheckCircle2 className="w-3 h-3 mr-2" /> Synced</>
                                            ) : (
                                                <><RefreshCw className="w-3 h-3 mr-2" /> Calibrate</>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Live Telemetry */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="grid grid-cols-4 gap-4">
                                            <TelemetryCard icon={<Thermometer />} label="Temperature" value={`${selectedDevice.temp}°C`} unit="Target: 140°C" color="text-red-400" />
                                            <TelemetryCard icon={<Droplets />} label="Humidity" value={`${selectedDevice.humidity}%`} unit="RH" color="text-blue-400" />
                                            <TelemetryCard icon={<Activity />} label="Vibration" value={selectedDevice.vibration} unit="RMS" color={selectedDevice.vibration < 0.5 ? 'text-green-400' : 'text-orange-400'} />
                                            <TelemetryCard icon={<Zap />} label="Power" value={`${selectedDevice.power} kW`} unit="Load: 42%" color="text-yellow-400" />
                                        </div>

                                        <div className="bg-quantum-900 border border-quantum-700 rounded-lg p-5 shadow-lg">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-sm font-bold text-slate-200 uppercase flex items-center">
                                                    <Activity className="w-4 h-4 mr-2 text-cyan-400" /> Historical Performance
                                                </h3>
                                                <div className="flex space-x-2">
                                                    <span className="text-[10px] text-slate-500 px-2 py-1 bg-quantum-950 rounded border border-quantum-800">24H</span>
                                                </div>
                                            </div>
                                            <div className="h-64 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={DEVICE_HISTORY}>
                                                        <defs>
                                                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#1c2633" vertical={false} />
                                                        <XAxis dataKey="time" stroke="#475569" fontSize={10} />
                                                        <YAxis stroke="#475569" fontSize={10} domain={['auto', 'auto']} />
                                                        <Tooltip contentStyle={{ backgroundColor: '#0a0f16', borderColor: '#2b3a4a', color: '#e2e8f0' }} />
                                                        <Area type="monotone" dataKey="temp" stroke="#ef4444" fillOpacity={1} fill="url(#colorTemp)" strokeWidth={2} />
                                                        <Line type="monotone" dataKey="power" stroke="#fbbf24" strokeWidth={2} dot={false} />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Panel: Info & Maint */}
                                    <div className="space-y-6">
                                        <div className="bg-quantum-900 border border-quantum-700 rounded-lg p-5">
                                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Device Identity</h3>
                                            <div className="space-y-3">
                                                <DetailRow label="Model" value="Quantum-Bond-X2" />
                                                <DetailRow label="Serial" value="SN-992-842-11" />
                                                <DetailRow label="Firmware" value="v4.2.1 (Stable)" />
                                                <DetailRow label="IP Addr" value="192.168.4.22" />
                                                <DetailRow label="Gateway" value="GTW-01" />
                                            </div>
                                        </div>

                                        <div className="bg-quantum-900 border border-quantum-700 rounded-lg p-5">
                                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Maintenance</h3>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-slate-500">Last Service</span>
                                                    <span className="text-slate-300">14 days ago</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-slate-500">Next Due</span>
                                                    <span className="text-orange-400 font-bold">In 3 days</span>
                                                </div>
                                                <div className="pt-2 border-t border-quantum-800">
                                                    <div className="text-[10px] text-slate-500 mb-1 uppercase">Spare Parts</div>
                                                    <div className="flex flex-wrap gap-1">
                                                        <span className="px-2 py-0.5 bg-quantum-950 border border-quantum-800 rounded text-[10px] text-slate-400">Filter-A2</span>
                                                        <span className="px-2 py-0.5 bg-quantum-950 border border-quantum-800 rounded text-[10px] text-slate-400">O-Ring-Standard</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. MAP VIEW */}
                        {iotView === 'map' && (
                            <div className="h-full flex flex-col relative bg-quantum-950 rounded-lg border border-quantum-700 overflow-hidden group">
                                {/* Map Controls */}
                                <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
                                    <div className="bg-quantum-900/90 backdrop-blur border border-quantum-600 rounded p-2 shadow-lg">
                                        <h3 className="text-xs font-bold text-slate-300 mb-2">Facility: Sector 7</h3>
                                        <div className="space-y-1">
                                            <label className="flex items-center space-x-2 text-xs text-slate-400 cursor-pointer">
                                                <input type="checkbox" checked={mapHeatmap} onChange={() => setMapHeatmap(!mapHeatmap)} className="rounded bg-quantum-950 border-quantum-700 text-cyan-500" />
                                                <span>Thermal Heatmap</span>
                                            </label>
                                            <label className="flex items-center space-x-2 text-xs text-slate-400 cursor-pointer">
                                                <input type="checkbox" defaultChecked className="rounded bg-quantum-950 border-quantum-700 text-cyan-500" />
                                                <span>Show Zones</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* The Map */}
                                <div className="flex-1 relative overflow-hidden" 
                                     style={{ 
                                         backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', 
                                         backgroundSize: '40px 40px' 
                                     }}>
                                    
                                    {/* Heatmap Overlay */}
                                    {mapHeatmap && (
                                        <div className="absolute inset-0 pointer-events-none opacity-30" 
                                             style={{ 
                                                 background: 'radial-gradient(circle at 30% 40%, rgba(239, 68, 68, 0.4), transparent 40%), radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.3), transparent 40%)' 
                                             }}>
                                        </div>
                                    )}

                                    {/* Zone Labels */}
                                    <div className="absolute top-[10%] left-[10%] text-slate-700 font-mono text-4xl font-bold opacity-20 pointer-events-none">ZONE A</div>
                                    <div className="absolute bottom-[10%] right-[10%] text-slate-700 font-mono text-4xl font-bold opacity-20 pointer-events-none">ZONE C</div>

                                    {/* Devices */}
                                    {IOT_DEVICES.map(d => (
                                        <div 
                                            key={d.id}
                                            onClick={() => handleDeviceSelect(d.id)}
                                            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group/node"
                                            style={{ left: `${d.location.x}%`, top: `${d.location.y}%` }}
                                        >
                                            <div className={`w-4 h-4 rounded-full border-2 shadow-[0_0_10px_currentColor] transition-transform group-hover/node:scale-150 ${
                                                d.status === 'online' ? 'bg-green-500 border-green-300 text-green-500' :
                                                d.status === 'warning' ? 'bg-orange-500 border-orange-300 text-orange-500 animate-pulse' :
                                                'bg-slate-500 border-slate-300 text-slate-500'
                                            }`}></div>
                                            
                                            {/* Tooltip */}
                                            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-quantum-900 border border-quantum-600 p-2 rounded shadow-xl whitespace-nowrap opacity-0 group-hover/node:opacity-100 transition-opacity z-20 pointer-events-none">
                                                <div className="text-xs font-bold text-slate-200">{d.name}</div>
                                                <div className="text-[10px] text-slate-400">{d.temp}°C | {d.status}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 4. ALERTS CENTER */}
                        {iotView === 'alerts' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Alert List */}
                                    <div className="lg:col-span-2 bg-quantum-900 border border-quantum-700 rounded-lg overflow-hidden">
                                        <div className="px-4 py-3 bg-quantum-800 border-b border-quantum-700 flex justify-between items-center">
                                            <h3 className="text-sm font-bold text-slate-200 uppercase flex items-center">
                                                <Bell className="w-4 h-4 mr-2 text-red-400" /> Active Alerts
                                            </h3>
                                            <span className="text-[10px] bg-red-900/20 text-red-400 px-2 py-0.5 rounded border border-red-500/20">3 Critical</span>
                                        </div>
                                        <table className="w-full text-left text-xs">
                                            <thead className="bg-quantum-950 text-slate-500 font-mono uppercase">
                                                <tr>
                                                    <th className="px-4 py-3">Severity</th>
                                                    <th className="px-4 py-3">Time</th>
                                                    <th className="px-4 py-3">Device</th>
                                                    <th className="px-4 py-3">Message</th>
                                                    <th className="px-4 py-3 text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-quantum-800 text-slate-300">
                                                {ALERTS.map(alert => (
                                                    <tr key={alert.id} className="hover:bg-quantum-800/50 transition-colors">
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                                alert.severity === 'critical' ? 'bg-red-500 text-white' :
                                                                alert.severity === 'warning' ? 'bg-orange-500 text-black' :
                                                                'bg-slate-700 text-slate-300'
                                                            }`}>{alert.severity}</span>
                                                        </td>
                                                        <td className="px-4 py-3 font-mono text-slate-500">{alert.time}</td>
                                                        <td className="px-4 py-3 font-bold">{alert.device}</td>
                                                        <td className="px-4 py-3">{alert.msg}</td>
                                                        <td className="px-4 py-3 text-right">
                                                            <button className="text-cyan-400 hover:text-cyan-300 hover:underline">Investigate</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Diagnostics Panel */}
                                    <div className="bg-quantum-900 border border-quantum-700 rounded-lg p-5 flex flex-col">
                                        <h3 className="text-sm font-bold text-slate-200 uppercase mb-4 flex items-center">
                                            <Crosshair className="w-4 h-4 mr-2 text-purple-400" /> AI Diagnostics
                                        </h3>
                                        <div className="flex-1 space-y-4">
                                            <div className="p-3 bg-purple-900/10 border border-purple-500/20 rounded">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="text-xs font-bold text-purple-400">Correlation Detected</span>
                                                    <span className="text-[10px] text-slate-500">98% Conf</span>
                                                </div>
                                                <p className="text-[11px] text-slate-300 leading-relaxed">
                                                    Vibration spike in <span className="text-white">Conveyor Motor 7</span> correlates with voltage drop in <span className="text-white">Main Bus B</span>.
                                                </p>
                                            </div>
                                            
                                            {diagStatus === 'idle' || diagStatus === 'complete' ? (
                                                <div>
                                                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-2">Automated Tasks</div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center text-xs text-slate-300">
                                                            <CheckCircle2 className="w-3 h-3 text-green-500 mr-2" />
                                                            Logged to maintenance register
                                                        </div>
                                                        <div className="flex items-center text-xs text-slate-300">
                                                            <CheckCircle2 className="w-3 h-3 text-green-500 mr-2" />
                                                            Notified shift supervisor
                                                        </div>
                                                        <div className="flex items-center text-xs text-slate-500">
                                                            <div className="w-3 h-3 border-2 border-slate-600 rounded-full mr-2"></div>
                                                            Schedule replacement
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-3 py-4">
                                                    <div className="flex justify-between text-xs text-slate-300">
                                                        <span className="animate-pulse">{diagMessage}</span>
                                                        <span className="font-mono text-purple-400">{diagProgress}%</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-quantum-950 rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-purple-500 transition-all duration-300 ease-out" 
                                                            style={{ width: `${diagProgress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <button 
                                            onClick={handleDiagnosticScan}
                                            disabled={diagStatus === 'running'}
                                            className={`w-full mt-4 py-2 text-xs font-bold rounded shadow-lg transition-colors flex items-center justify-center ${
                                                diagStatus === 'running' 
                                                ? 'bg-purple-900/50 text-purple-300 cursor-wait' 
                                                : diagStatus === 'complete'
                                                ? 'bg-green-600 hover:bg-green-500 text-white'
                                                : 'bg-purple-600 hover:bg-purple-500 text-white'
                                            }`}
                                        >
                                            {diagStatus === 'running' ? (
                                                <><Loader2 className="w-3 h-3 mr-2 animate-spin" /> Scanning...</>
                                            ) : diagStatus === 'complete' ? (
                                                <><CheckCircle2 className="w-3 h-3 mr-2" /> Scan Complete</>
                                            ) : (
                                                "Run Full Diagnostic Scan"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}

            {/* --- COMPUTE CLUSTER TAB --- */}
            {activeTab === 'compute' && (
                <div className="p-4 h-full overflow-y-auto custom-scrollbar">
                    <div className="space-y-6">
                        {/* Top Stats */}
                        <div className="grid grid-cols-4 gap-4">
                            <StatCard icon={<Server />} label="Active Nodes" value="142 / 150" sub="98% Uptime" color="text-cyan-400" />
                            <StatCard icon={<Activity />} label="Global Load" value="76%" sub="+12% Peak" color="text-purple-400" />
                            <StatCard icon={<Gauge />} label="Queue Depth" value="4,201" sub="Jobs Pending" color="text-orange-400" />
                            <StatCard icon={<AlertTriangle />} label="Health Alerts" value="3" sub="Non-Critical" color="text-yellow-400" />
                        </div>

                        {/* Cluster Status */}
                        <div className="bg-quantum-900 border border-quantum-700 rounded-lg p-5">
                            <h3 className="text-sm font-bold text-slate-200 uppercase mb-4 flex items-center">
                                <LayoutGrid className="w-4 h-4 mr-2 text-cyan-400" /> Cluster Utilization
                            </h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={MOCK_CLUSTER_DATA}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1c2633" vertical={false} />
                                        <XAxis dataKey="name" stroke="#475569" fontSize={10} />
                                        <YAxis stroke="#475569" fontSize={10} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0a0f16', borderColor: '#2b3a4a', color: '#e2e8f0' }} />
                                        <Bar dataKey="load" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- ENERGY GRID TAB --- */}
            {activeTab === 'env' && (
                <div className="p-4 h-full overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-quantum-900 border border-quantum-700 rounded-lg p-5">
                            <h3 className="text-sm font-bold text-slate-200 uppercase mb-4 flex items-center">
                                <Zap className="w-4 h-4 mr-2 text-yellow-400" /> Power Consumption (24h)
                            </h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={MOCK_POWER_DATA}>
                                        <defs>
                                            <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1c2633" vertical={false} />
                                        <XAxis dataKey="time" stroke="#475569" fontSize={10} />
                                        <YAxis stroke="#475569" fontSize={10} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0a0f16', borderColor: '#2b3a4a', color: '#e2e8f0' }} />
                                        <Area type="monotone" dataKey="usage" stroke="#fbbf24" fillOpacity={1} fill="url(#colorUsage)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-quantum-900 border border-quantum-700 rounded-lg p-5">
                            <h3 className="text-sm font-bold text-slate-200 uppercase mb-4 flex items-center">
                                <Wind className="w-4 h-4 mr-2 text-green-400" /> Environmental Control
                            </h3>
                            <div className="space-y-4">
                                <EnvRow label="Cleanroom Pressure" value="45 Pa" status="optimal" />
                                <EnvRow label="Filtration Efficiency" value="99.99%" status="optimal" />
                                <EnvRow label="Humidity (Global)" value="42%" status="optimal" />
                                <EnvRow label="Cooling Loop Temp" value="18°C" status="warning" />
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

const SubNavTab = ({ active, onClick, icon, label }: any) => (
    <button 
        onClick={onClick}
        className={`flex items-center px-3 py-1 rounded text-xs font-medium transition-colors ${
            active 
            ? 'bg-quantum-700 text-cyan-400 shadow-sm' 
            : 'text-slate-400 hover:text-slate-200 hover:bg-quantum-800'
        }`}
    >
        <span className="mr-1.5">{icon}</span>
        {label}
    </button>
);

const FilterBadge = ({ label, count, color }: any) => {
    const colors = {
        red: 'bg-red-900/20 text-red-400 border-red-500/20',
        orange: 'bg-orange-900/20 text-orange-400 border-orange-500/20',
        slate: 'bg-slate-800 text-slate-400 border-slate-600'
    };
    return (
        <span className={`px-2 py-1 rounded border text-[10px] uppercase font-bold flex items-center cursor-pointer hover:opacity-80 ${(colors as any)[color]}`}>
            {label}
            <span className="ml-1.5 bg-black/20 px-1.5 rounded-full">{count}</span>
        </span>
    );
};

const MiniMetric = ({ label, value, warning }: any) => (
    <div className={`flex justify-between items-center text-xs p-1.5 rounded border ${warning ? 'bg-orange-900/10 border-orange-500/30' : 'bg-quantum-950 border-quantum-800'}`}>
        <span className="text-slate-500">{label}</span>
        <span className={`font-mono font-bold ${warning ? 'text-orange-400' : 'text-slate-300'}`}>{value}</span>
    </div>
);

const TelemetryCard = ({ icon, label, value, unit, color }: any) => (
    <div className="bg-quantum-900 border border-quantum-700 p-4 rounded-lg flex items-center justify-between">
        <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">{label}</div>
            <div className={`text-xl font-mono font-bold ${color}`}>{value}</div>
            <div className="text-[10px] text-slate-500 mt-1">{unit}</div>
        </div>
        <div className={`p-2 rounded bg-quantum-950 border border-quantum-800 text-slate-400`}>
            {icon}
        </div>
    </div>
);

const DetailRow = ({ label, value }: any) => (
    <div className="flex justify-between items-center text-xs border-b border-quantum-800 pb-2 last:border-0 last:pb-0">
        <span className="text-slate-500">{label}</span>
        <span className="font-mono text-slate-300">{value}</span>
    </div>
);

const StatCard = ({ icon, label, value, sub, color }: any) => (
    <div className="bg-quantum-900 border border-quantum-700 p-4 rounded-lg">
        <div className="flex justify-between items-start mb-2">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{label}</div>
            <div className={`text-slate-400`}>{icon}</div>
        </div>
        <div className={`text-2xl font-mono font-bold ${color}`}>{value}</div>
        <div className="text-[10px] text-slate-500 mt-1">{sub}</div>
    </div>
);

const EnvRow = ({ label, value, status }: any) => (
    <div className="flex justify-between items-center p-3 bg-quantum-950 border border-quantum-800 rounded">
        <span className="text-xs text-slate-300">{label}</span>
        <div className="flex items-center space-x-3">
            <span className="text-xs font-mono text-slate-400">{value}</span>
            <div className={`w-2 h-2 rounded-full ${status === 'optimal' ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`}></div>
        </div>
    </div>
);