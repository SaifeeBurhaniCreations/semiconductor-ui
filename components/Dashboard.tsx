import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { SystemMetrics } from '../types';
import { Activity, Cpu, Zap, Box, Server } from 'lucide-react';

interface DashboardProps {
  metrics: SystemMetrics;
  history: any[]; // History data for charts
}

const formatMetric = (num: number, suffix: string = ''): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k' + suffix;
  }
  // Convert to string to check length
  const str = num.toString();
  if (str.length > 4) {
    return num.toPrecision(4) + suffix;
  }
  return num + suffix;
};

export const Dashboard: React.FC<DashboardProps> = ({ metrics, history }) => {
  return (
    <div className="h-full w-full overflow-y-auto pr-2 pb-10 custom-scrollbar">
      
      {/* Top Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* Card 1: Coherence */}
        <div className="bg-quantum-900 border border-quantum-600 rounded-lg p-4 relative overflow-hidden group hover:border-cyan-500/50 transition-colors duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Quantum Coherence</span>
            <Activity className="w-4 h-4 text-quantum-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-100 font-mono">{formatMetric(metrics.quantumCoherence, '%')}</span>
            <span className="text-xs text-quantum-success font-mono">+0.4%</span>
          </div>
          <div className="w-full bg-quantum-800 h-1 mt-3 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" style={{ width: `${metrics.quantumCoherence}%` }}></div>
          </div>
        </div>

        {/* Card 2: CPU Load */}
        <div className="bg-quantum-900 border border-quantum-600 rounded-lg p-4 relative overflow-hidden group hover:border-purple-500/50 transition-colors duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Logic Processor</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-100 font-mono">{formatMetric(metrics.cpuLoad, '%')}</span>
            <span className="text-xs text-quantum-warn font-mono">HIGH</span>
          </div>
          <div className="w-full bg-quantum-800 h-1 mt-3 rounded-full overflow-hidden">
             <div className="h-full bg-purple-500" style={{ width: `${metrics.cpuLoad}%` }}></div>
          </div>
        </div>

        {/* Card 3: Memory */}
        <div className="bg-quantum-900 border border-quantum-600 rounded-lg p-4 relative overflow-hidden group hover:border-emerald-500/50 transition-colors duration-300">
           <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Memory Buffer</span>
            <Server className="w-4 h-4 text-emerald-400" />
          </div>
           <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-100 font-mono">{formatMetric(metrics.memoryUsage)} TB</span>
            <span className="text-xs text-slate-500 font-mono">/ 128</span>
          </div>
           <div className="w-full bg-quantum-800 h-1 mt-3 rounded-full overflow-hidden">
             <div className="h-full bg-emerald-500" style={{ width: `${(metrics.memoryUsage / 128) * 100}%` }}></div>
          </div>
        </div>

        {/* Card 4: Threads */}
        <div className="bg-quantum-900 border border-quantum-600 rounded-lg p-4 relative overflow-hidden group hover:border-orange-500/50 transition-colors duration-300">
           <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Active Threads</span>
            <Box className="w-4 h-4 text-orange-400" />
          </div>
           <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-100 font-mono">{formatMetric(metrics.activeThreads)}</span>
            <span className="text-xs text-slate-500 font-mono">Procs</span>
          </div>
           <div className="flex space-x-1 mt-3">
             {[...Array(5)].map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full ${i < 3 ? 'bg-orange-500' : 'bg-quantum-800'}`}></div>
             ))}
          </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[300px] mb-6">
        
        {/* Main Process Graph */}
        <div className="lg:col-span-2 bg-quantum-900 border border-quantum-600 rounded-lg p-4 shadow-lg flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
                <Activity size={100} />
            </div>
            <div className="flex justify-between items-center mb-4 z-10">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center tracking-wide">
                    <Zap className="w-4 h-4 mr-2 text-cyan-400" />
                    PROCESS STABILITY & THROUGHPUT
                </h3>
                <div className="flex space-x-2">
                    <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_5px_#22d3ee]"></span>
                        <span className="text-[10px] text-slate-500 font-mono">STABILITY</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_5px_#8b5cf6]"></span>
                        <span className="text-[10px] text-slate-500 font-mono">THROUGHPUT</span>
                    </div>
                </div>
            </div>
            <div className="flex-1 w-full min-h-0 z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history}>
                        <defs>
                            <linearGradient id="colorStability" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1c2633" vertical={false} />
                        <XAxis dataKey="time" hide />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0a0f16', borderColor: '#2b3a4a', color: '#e2e8f0', fontSize: '12px', fontFamily: 'Fira Code' }}
                            itemStyle={{ color: '#22d3ee' }}
                        />
                        <Area type="monotone" dataKey="stability" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#colorStability)" />
                        <Area type="monotone" dataKey="throughput" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorThroughput)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Secondary Metric */}
        <div className="bg-quantum-900 border border-quantum-600 rounded-lg p-4 shadow-lg flex flex-col relative overflow-hidden">
             <div className="flex justify-between items-center mb-4 z-10">
                <h3 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">Logic Core Temp</h3>
            </div>
            <div className="flex-1 w-full min-h-0 relative z-10">
               <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={history}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1c2633" vertical={false} />
                        <XAxis dataKey="time" hide />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0a0f16', borderColor: '#2b3a4a', color: '#e2e8f0', fontSize: '12px', fontFamily: 'Fira Code' }}
                        />
                        <Line type="stepAfter" dataKey="temp" stroke="#ef4444" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
                {/* Overlay Text for Industrial Feel */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-mono font-bold text-slate-700/20 select-none">
                    345.2K
                </div>
            </div>
             {/* Decorative Corner */}
             <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-quantum-600"></div>
        </div>

      </div>

      <div className="grid grid-cols-1 gap-4">
          <div className="p-4 rounded-lg bg-quantum-800/50 border border-quantum-600 border-dashed flex items-center justify-between text-slate-400 text-sm font-mono group hover:border-cyan-500/30 transition-colors cursor-pointer">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-quantum-warn rounded-full animate-pulse mr-3"></span>
                SYSTEM ANALYSIS: OPTIMIZATION REQUIRED IN SECTOR 7G
              </span>
              <span className="text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                [CLICK TO APPROVE AI INTERVENTION]
              </span>
          </div>
      </div>
    </div>
  );
};