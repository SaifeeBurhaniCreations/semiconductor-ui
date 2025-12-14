
import React from 'react';
import { EdgeDetails } from '../types';
import { X, Activity, Zap, Network, ArrowRight, Server } from 'lucide-react';

interface EdgeInspectorProps {
  edge: EdgeDetails;
  onClose: () => void;
}

export const EdgeInspector: React.FC<EdgeInspectorProps> = ({ edge, onClose }) => {
  return (
    <div className="h-full flex flex-col bg-quantum-900 border border-quantum-600 rounded-lg overflow-hidden shadow-2xl relative animate-in slide-in-from-right-5 duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-quantum-800 border-b border-quantum-600 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 bg-purple-500/10 rounded border border-purple-500/30">
            <Network className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 tracking-wide">Connection Details</h3>
            <span className="text-[10px] font-mono text-slate-500 uppercase">LINK ID: {edge.id}</span>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-quantum-900/50">
        
        {/* Connection Visual */}
        <div className="flex items-center justify-between p-3 bg-quantum-950 border border-quantum-700 rounded-lg">
            <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded bg-quantum-900 border border-quantum-600 flex items-center justify-center text-xs font-bold text-slate-300 mb-1">
                    {edge.source}
                </div>
                <span className="text-[9px] text-slate-500">SOURCE</span>
            </div>
            
            <div className="flex-1 px-4 flex flex-col items-center">
                <div className="w-full h-0.5 bg-purple-500/30 relative">
                    <div className="absolute inset-0 bg-purple-500 animate-[shimmer_2s_infinite] w-1/3 opacity-50"></div>
                </div>
                <ArrowRight className="w-3 h-3 text-purple-400 mt-1" />
            </div>

            <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded bg-quantum-900 border border-quantum-600 flex items-center justify-center text-xs font-bold text-slate-300 mb-1">
                    {edge.target}
                </div>
                <span className="text-[9px] text-slate-500">TARGET</span>
            </div>
        </div>

        {/* Status Banner */}
        <div className={`
        flex items-center justify-between p-3 rounded border
        ${edge.status === 'active' ? 'bg-green-500/5 border-green-500/20' : 
            edge.status === 'congested' ? 'bg-orange-500/5 border-orange-500/20' : 'bg-slate-800/30 border-slate-700'}
        `}>
            <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${edge.status === 'active' ? 'bg-green-400 shadow-glow-green' : edge.status === 'congested' ? 'bg-orange-500 animate-pulse' : 'bg-slate-500'}`}></div>
                <span className="text-xs font-mono font-bold uppercase text-slate-300">{edge.status} LINK</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">{edge.type}</span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
            <MetricBox label="Throughput" value={edge.metrics.throughput} icon={<Activity className="w-3 h-3" />} />
            <MetricBox label="Latency" value={edge.metrics.latency} icon={<Zap className="w-3 h-3" />} />
            <MetricBox label="Error Rate" value={edge.metrics.errorRate} icon={<Activity className="w-3 h-3" />} color="text-red-400" />
            <MetricBox label="Protocol" value={edge.metrics.protocol} icon={<Server className="w-3 h-3" />} />
        </div>

        {/* Traffic Chart Placeholder */}
        <div className="p-3 bg-quantum-950 border border-quantum-700 rounded-lg">
            <h4 className="text-[10px] text-slate-500 uppercase font-bold mb-2">Live Traffic Volume</h4>
            <div className="h-16 flex items-end justify-between space-x-1">
                {[40, 60, 45, 70, 85, 60, 50, 75, 90, 65, 55, 80].map((h, i) => (
                    <div key={i} className="flex-1 bg-purple-500/20 hover:bg-purple-500/40 transition-colors rounded-t-sm" style={{ height: `${h}%` }}></div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

const MetricBox = ({ label, value, icon, color = "text-slate-200" }: any) => (
    <div className="p-3 bg-quantum-950 border border-quantum-700 rounded flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-slate-500 uppercase">{label}</span>
            <span className="text-slate-600">{icon}</span>
        </div>
        <div className={`text-sm font-mono font-bold ${color}`}>{value}</div>
    </div>
);
