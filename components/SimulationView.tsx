import React, { useState } from 'react';
import { Play, RotateCcw, Save, FileBarChart, TerminalSquare, Settings2, Cpu } from 'lucide-react';

export const SimulationView: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>(['System Ready. Load scenario to begin.']);
  const [progress, setProgress] = useState(0);

  const startSim = () => {
    setIsRunning(true);
    setLogs(prev => [...prev, 'Initializing Quantum Core link...', 'Allocating virtual resources...', 'Loading physics model: Thermal-Stress-v4...']);
    let p = 0;
    const interval = setInterval(() => {
        p += 5;
        setProgress(p);
        if (Math.random() > 0.7) {
            setLogs(prev => [...prev, `[T+${p}ms] Computing mesh deformation... delta=${(Math.random()*0.01).toFixed(4)}`]);
        }
        if (p >= 100) {
            clearInterval(interval);
            setIsRunning(false);
            setLogs(prev => [...prev, 'SIMULATION COMPLETE. Yield prediction: 98.7%']);
        }
    }, 200);
  };

  return (
    <div className="h-full flex flex-col gap-4">
        {/* Top Control Panel */}
        <div className="grid grid-cols-12 gap-4 h-1/3 min-h-[200px]">
             {/* Configuration Card */}
             <div className="col-span-12 md:col-span-8 bg-quantum-900 border border-quantum-600 rounded-lg p-4 flex flex-col">
                 <div className="flex justify-between items-center mb-4 border-b border-quantum-700 pb-2">
                     <h3 className="text-sm font-bold text-slate-200 flex items-center">
                         <Settings2 className="w-4 h-4 mr-2 text-cyan-400" /> Simulation Configuration
                     </h3>
                     <div className="flex space-x-2">
                         <button className="text-[10px] px-2 py-1 bg-quantum-800 border border-quantum-600 rounded text-slate-400 hover:text-slate-200">Load Preset</button>
                         <button className="text-[10px] px-2 py-1 bg-quantum-800 border border-quantum-600 rounded text-slate-400 hover:text-slate-200">Save Config</button>
                     </div>
                 </div>
                 <div className="flex-1 grid grid-cols-2 gap-4">
                     <div className="space-y-3">
                         <div>
                             <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Scenario Type</label>
                             <select className="w-full bg-quantum-950 border border-quantum-700 rounded px-2 py-1.5 text-xs text-slate-300 focus:border-cyan-500/50 outline-none">
                                 <option>Thermal Stress Test</option>
                                 <option>Logic Propagation</option>
                                 <option>Throughput Capacity</option>
                             </select>
                         </div>
                         <div>
                             <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Duration (Cycles)</label>
                             <input type="number" defaultValue={1000} className="w-full bg-quantum-950 border border-quantum-700 rounded px-2 py-1.5 text-xs text-slate-300 focus:border-cyan-500/50 outline-none" />
                         </div>
                     </div>
                     <div className="space-y-3">
                         <div>
                             <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Compute Resource</label>
                             <div className="flex items-center space-x-2 p-2 bg-quantum-950 border border-quantum-700 rounded">
                                 <Cpu className="w-4 h-4 text-purple-400" />
                                 <span className="text-xs text-slate-300">Quantum Core (Tier 1)</span>
                             </div>
                         </div>
                         <div className="pt-2">
                             <button 
                                onClick={startSim}
                                disabled={isRunning}
                                className="w-full py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white text-xs font-bold rounded flex items-center justify-center disabled:opacity-50"
                             >
                                 {isRunning ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div> : <Play className="w-3 h-3 mr-2" fill="currentColor" />}
                                 {isRunning ? 'RUNNING SIMULATION...' : 'START SIMULATION'}
                             </button>
                         </div>
                     </div>
                 </div>
             </div>

             {/* Live Metrics Card */}
             <div className="col-span-12 md:col-span-4 bg-quantum-900 border border-quantum-600 rounded-lg p-4 flex flex-col relative overflow-hidden">
                 <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center">
                     <FileBarChart className="w-4 h-4 mr-2 text-purple-400" /> Predicted Yield
                 </h3>
                 <div className="flex-1 flex items-center justify-center relative z-10">
                     <div className="text-center">
                         <div className="text-4xl font-mono font-bold text-slate-100">
                             {isRunning ? (90 + Math.random()*9).toFixed(1) : '--.-'}
                             <span className="text-sm text-slate-500 ml-1">%</span>
                         </div>
                         <div className="text-xs text-slate-500 mt-1">Confidence Score: 94%</div>
                     </div>
                 </div>
                 {isRunning && (
                     <div className="absolute inset-x-0 bottom-0 h-1 bg-quantum-800">
                         <div className="h-full bg-cyan-400 transition-all duration-200" style={{ width: `${progress}%` }}></div>
                     </div>
                 )}
             </div>
        </div>

        {/* Console / Output */}
        <div className="flex-1 bg-quantum-950 border border-quantum-600 rounded-lg flex flex-col overflow-hidden">
            <div className="px-4 py-2 bg-quantum-900 border-b border-quantum-700 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <TerminalSquare className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-mono text-slate-300">LIVE CONSOLE OUTPUT</span>
                </div>
                <div className="flex space-x-2">
                     <button className="p-1 hover:text-cyan-400" title="Clear"><RotateCcw className="w-3 h-3" /></button>
                     <button className="p-1 hover:text-cyan-400" title="Save Log"><Save className="w-3 h-3" /></button>
                </div>
            </div>
            <div className="flex-1 p-4 font-mono text-xs text-slate-400 overflow-y-auto custom-scrollbar space-y-1">
                {logs.map((log, i) => (
                    <div key={i} className="hover:bg-white/5 px-1 rounded cursor-default">
                        <span className="text-slate-600 mr-2">{i+1}</span>
                        {log}
                    </div>
                ))}
                <div className="animate-pulse text-cyan-500">_</div>
            </div>
        </div>
    </div>
  );
};