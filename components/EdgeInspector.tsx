
import React from 'react';
import { EdgeDetails } from '../types';
import { X, Activity, Zap, Network, ArrowRight, Server, FileText } from 'lucide-react';

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

        {/* Main Properties (Requested Fields) */}
        <div className="bg-quantum-950 border border-quantum-700 rounded-lg p-4">
            <h4 className="text-[10px] text-slate-500 uppercase font-bold mb-3 border-b border-quantum-800 pb-1">Core Metrics</h4>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center text-slate-400 text-xs">
                        <Activity className="w-3 h-3 mr-2 text-cyan-400" /> Throughput
                    </div>
                    <div className="text-sm font-mono font-bold text-slate-200">{edge.metrics.throughput}</div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center text-slate-400 text-xs">
                        <Zap className="w-3 h-3 mr-2 text-yellow-400" /> Latency
                    </div>
                    <div className="text-sm font-mono font-bold text-slate-200">{edge.metrics.latency}</div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center text-slate-400 text-xs">
                        <FileText className="w-3 h-3 mr-2 text-purple-400" /> Data Type
                    </div>
                    <div className="text-sm font-mono font-bold text-slate-200">{edge.type}</div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center text-slate-400 text-xs">
                        <Server className="w-3 h-3 mr-2 text-slate-500" /> Protocol
                    </div>
                    <div className="text-xs font-mono text-slate-400">{edge.metrics.protocol}</div>
                </div>
            </div>
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
