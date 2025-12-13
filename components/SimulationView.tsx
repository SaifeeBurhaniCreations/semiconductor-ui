import React, { useState, useEffect, useRef } from 'react';
import { 
    Play, RotateCcw, Save, FileBarChart, TerminalSquare, Settings2, Cpu, 
    History, Server, Plus, ChevronRight, Pause, FastForward, SkipBack, 
    CheckCircle, AlertTriangle, ArrowRight, Gauge
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

export const SimulationView: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'running' | 'paused' | 'complete'>('idle');
  const [logs, setLogs] = useState<string[]>(['System Ready. Load scenario to begin.']);
  const [progress, setProgress] = useState(0);
  const [telemetry, setTelemetry] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  const startSim = () => {
    setStatus('running');
    setLogs(prev => [...prev, 'Initializing Quantum Core link...', 'Allocating virtual resources...', 'Loading physics model: Thermal-Stress-v4...']);
    setProgress(0);
    setTelemetry([]);
    
    let p = 0;
    const interval = setInterval(() => {
        p += 1;
        setProgress(p);
        
        // Generate mock telemetry
        setTelemetry(prev => {
            const last = prev[prev.length - 1] || { temp: 300, load: 20 };
            return [...prev.slice(-40), { 
                time: p, 
                temp: last.temp + (Math.random() - 0.45) * 5, 
                load: Math.min(100, Math.max(0, last.load + (Math.random() - 0.5) * 10))
            }];
        });

        if (Math.random() > 0.9) {
            setLogs(prev => [...prev, `[T+${p}s] Computing mesh deformation... delta=${(Math.random()*0.01).toFixed(4)}`]);
        }
        
        if (p >= 100) {
            clearInterval(interval);
            setStatus('complete');
            setLogs(prev => [...prev, 'SIMULATION COMPLETE. Yield prediction: 98.7%']);
        }
    }, 100);
  };

  return (
    <div className="h-full flex gap-4 overflow-hidden">
        
        {/* Left: Scenario Library (Preserved) */}
        <div className="w-64 bg-quantum-900 border border-quantum-600 rounded-lg flex flex-col shrink-0">
             <div className="p-3 border-b border-quantum-600 bg-quantum-800 flex justify-between items-center">
                 <h3 className="text-xs font-bold text-slate-200 uppercase">Scenario Library</h3>
                 <button className="text-cyan-400 hover:text-cyan-300"><Plus className="w-4 h-4" /></button>
             </div>
             <div className="flex-1 overflow-y-auto p-2 space-y-1">
                 {['Thermal Stress v4', 'Logic Prop v2', 'Capacity Max', 'Reflow Fail Mode'].map((s, i) => (
                     <div key={i} className={`p-2 rounded text-xs cursor-pointer flex justify-between group ${i===0 ? 'bg-quantum-800 border border-quantum-700 text-cyan-400' : 'text-slate-400 hover:bg-quantum-800/50'}`}>
                         <span>{s}</span>
                         <ChevronRight className={`w-3 h-3 ${i===0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                     </div>
                 ))}
             </div>
             <div className="p-3 border-t border-quantum-600 bg-quantum-950">
                 <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                     <History className="w-3 h-3" />
                     <span>History: 42 Runs</span>
                 </div>
             </div>
        </div>

        {/* Center: Dynamic Main Stage */}
        <div className="flex-1 flex flex-col min-w-0 bg-quantum-900 border border-quantum-600 rounded-lg overflow-hidden relative">
            
            {/* VIEW: IDLE / CONFIGURATOR */}
            {status === 'idle' && (
                <div className="p-8 flex flex-col items-center justify-center h-full animate-in fade-in duration-500">
                    <div className="w-20 h-20 bg-quantum-800 rounded-full flex items-center justify-center mb-6 shadow-glow-cyan border border-quantum-600">
                        <Settings2 className="w-10 h-10 text-cyan-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-100 mb-2">Configure Simulation</h2>
                    <p className="text-slate-500 mb-8 text-center max-w-md">Select compute targets and parameter overrides for the "Thermal Stress v4" scenario.</p>
                    
                    <div className="grid grid-cols-2 gap-6 w-full max-w-2xl bg-quantum-950 p-6 rounded-lg border border-quantum-700">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Compute Target</label>
                            <select className="w-full bg-quantum-900 border border-quantum-600 rounded p-2 text-sm text-slate-200 outline-none focus:border-cyan-500">
                                <option>Quantum Core (High Precision)</option>
                                <option>Standard Cluster (Fast)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Initial Temp (K)</label>
                            <input type="number" defaultValue={298} className="w-full bg-quantum-900 border border-quantum-600 rounded p-2 text-sm text-slate-200 outline-none focus:border-cyan-500" />
                        </div>
                        <div className="col-span-2">
                             <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Active Probes</label>
                             <div className="flex gap-2">
                                 {['Stress', 'Thermal', 'Logic State', 'Power Draw'].map(p => (
                                     <span key={p} className="px-3 py-1 bg-quantum-800 border border-quantum-600 rounded text-xs text-cyan-400">{p}</span>
                                 ))}
                                 <button className="px-2 py-1 bg-quantum-800 border border-quantum-600 rounded text-xs text-slate-400 hover:text-white">+</button>
                             </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button 
                            onClick={startSim}
                            className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold rounded shadow-glow-cyan flex items-center transition-all transform hover:scale-105"
                        >
                            <Play className="w-5 h-5 mr-2" fill="currentColor" /> Initialize Run
                        </button>
                    </div>
                </div>
            )}

            {/* VIEW: RUNNING / LIVE DASHBOARD */}
            {(status === 'running' || status === 'paused') && (
                <div className="flex flex-col h-full">
                    {/* Top Control Bar */}
                    <div className="h-14 border-b border-quantum-600 bg-quantum-800 flex items-center justify-between px-4 shrink-0">
                        <div className="flex items-center space-x-4">
                            <span className="flex items-center text-cyan-400 font-mono text-sm font-bold">
                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse mr-2"></span>
                                LIVE SIMULATION
                            </span>
                            <span className="text-slate-500 font-mono text-xs">ID: SIM-9021</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button className="p-2 hover:bg-quantum-700 rounded text-slate-300"><SkipBack className="w-4 h-4" /></button>
                            <button className="p-2 bg-quantum-700 hover:bg-quantum-600 rounded text-white shadow-sm" onClick={() => setStatus(status === 'running' ? 'paused' : 'running')}>
                                {status === 'running' ? <Pause className="w-4 h-4" fill="currentColor" /> : <Play className="w-4 h-4" fill="currentColor" />}
                            </button>
                            <button className="p-2 hover:bg-quantum-700 rounded text-slate-300"><FastForward className="w-4 h-4" /></button>
                        </div>
                    </div>

                    {/* Main Viz Area */}
                    <div className="flex-1 bg-quantum-950 p-4 relative overflow-hidden">
                        {/* Background Grid Effect */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2b3a4a 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        
                        <div className="grid grid-cols-2 gap-4 h-full relative z-10">
                            {/* Live Chart 1 */}
                            <div className="bg-quantum-900/80 border border-quantum-700 rounded p-4 flex flex-col">
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center"><Gauge className="w-3 h-3 mr-2" /> Core Temperature</h4>
                                <div className="flex-1 min-h-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={telemetry}>
                                            <defs>
                                                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <Area type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={2} fill="url(#colorTemp)" isAnimationActive={false} />
                                            <YAxis hide domain={['auto', 'auto']} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="text-right font-mono text-xl text-red-400 font-bold">
                                    {telemetry.length > 0 ? telemetry[telemetry.length-1].temp.toFixed(1) : '--'} K
                                </div>
                            </div>
                             {/* Live Chart 2 */}
                             <div className="bg-quantum-900/80 border border-quantum-700 rounded p-4 flex flex-col">
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center"><Cpu className="w-3 h-3 mr-2" /> Compute Load</h4>
                                <div className="flex-1 min-h-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={telemetry}>
                                            <defs>
                                                <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <Area type="monotone" dataKey="load" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorLoad)" isAnimationActive={false} />
                                            <YAxis hide domain={[0, 100]} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="text-right font-mono text-xl text-purple-400 font-bold">
                                    {telemetry.length > 0 ? telemetry[telemetry.length-1].load.toFixed(1) : '--'} %
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scrubber / Timeline */}
                    <div className="h-16 bg-quantum-900 border-t border-quantum-600 px-4 flex items-center space-x-4">
                        <span className="text-xs font-mono text-slate-500 w-12 text-right">{progress}s</span>
                        <div className="flex-1 h-2 bg-quantum-950 rounded-full overflow-hidden relative">
                            <div className="absolute inset-y-0 left-0 bg-cyan-500" style={{ width: `${progress}%` }}></div>
                        </div>
                        <span className="text-xs font-mono text-slate-500 w-12">100s</span>
                    </div>

                    {/* Terminal overlay (Collapsed) */}
                    <div className="absolute bottom-16 left-4 right-4 h-32 bg-quantum-950/90 backdrop-blur border border-quantum-600 rounded-t-lg flex flex-col font-mono text-xs overflow-hidden shadow-2xl pointer-events-none">
                        <div className="px-3 py-1 bg-quantum-800/80 border-b border-quantum-700 text-slate-400 flex justify-between">
                            <span>SYSTEM OUTPUT</span>
                        </div>
                        <div className="flex-1 p-2 overflow-y-auto space-y-1 text-slate-500" ref={scrollRef}>
                             {logs.slice(-5).map((l, i) => <div key={i}>{l}</div>)}
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW: RESULT SUMMARY */}
            {status === 'complete' && (
                <div className="flex flex-col h-full bg-quantum-900 p-8 items-center overflow-y-auto custom-scrollbar">
                    <div className="flex items-center space-x-3 mb-6">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                        <h2 className="text-2xl font-bold text-slate-100">Simulation Complete</h2>
                    </div>

                    <div className="grid grid-cols-3 gap-6 w-full max-w-4xl mb-8">
                        <ResultCard label="Predicted Yield" value="98.7%" delta="+2.3%" color="green" />
                        <ResultCard label="Max Temp" value="342.1 K" delta="-5.2 K" color="cyan" />
                        <ResultCard label="Compute Cost" value="$14.20" delta="+0.80" color="orange" />
                    </div>

                    <div className="w-full max-w-4xl bg-quantum-950 border border-quantum-700 rounded-lg p-6 mb-8">
                        <h3 className="text-sm font-bold text-slate-300 uppercase mb-4 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" /> Recommended Parameter Changes
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-quantum-900 border border-quantum-800 rounded">
                                <div>
                                    <div className="text-sm font-medium text-slate-200">Increase Cooling Flow (Node 7)</div>
                                    <div className="text-xs text-slate-500">Predicted to reduce thermal stress by 12%</div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="text-xs font-mono text-slate-400">Curr: 40% <ArrowRight className="inline w-3 h-3 mx-1" /> Rec: 55%</div>
                                    <button className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs rounded">Apply</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <button onClick={() => setStatus('idle')} className="px-6 py-2 border border-quantum-600 rounded text-slate-300 hover:bg-quantum-800">
                            Back to Config
                        </button>
                        <button className="px-6 py-2 bg-quantum-800 hover:bg-quantum-700 text-cyan-400 rounded border border-quantum-600 flex items-center">
                            <Save className="w-4 h-4 mr-2" /> Save Results to Archive
                        </button>
                    </div>
                </div>
            )}

        </div>
    </div>
  );
};

const ResultCard = ({ label, value, delta, color }: any) => {
    const colorClass = color === 'green' ? 'text-green-400' : color === 'cyan' ? 'text-cyan-400' : 'text-orange-400';
    return (
        <div className="bg-quantum-950 border border-quantum-700 p-4 rounded-lg text-center">
            <div className="text-xs font-bold text-slate-500 uppercase mb-1">{label}</div>
            <div className={`text-3xl font-mono font-bold ${colorClass} mb-1`}>{value}</div>
            <div className="text-xs text-slate-400 bg-quantum-900 inline-block px-2 py-0.5 rounded-full">{delta} vs baseline</div>
        </div>
    );
};