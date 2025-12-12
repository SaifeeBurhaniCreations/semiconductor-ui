import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Terminal, AlertCircle, CheckCircle, Info, Cpu } from 'lucide-react';

interface ConsoleLoggerProps {
  logs: LogEntry[];
}

export const ConsoleLogger: React.FC<ConsoleLoggerProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getIcon = (level: string) => {
    switch (level) {
      case 'ERROR': return <AlertCircle className="w-3 h-3 text-quantum-alert" />;
      case 'WARN': return <AlertCircle className="w-3 h-3 text-quantum-warn" />;
      case 'SUCCESS': return <CheckCircle className="w-3 h-3 text-quantum-success" />;
      case 'AI': return <Cpu className="w-3 h-3 text-quantum-400" />;
      default: return <Info className="w-3 h-3 text-slate-500" />;
    }
  };

  const getColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'text-quantum-alert';
      case 'WARN': return 'text-quantum-warn';
      case 'SUCCESS': return 'text-quantum-success';
      case 'AI': return 'text-quantum-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="flex flex-col h-full bg-quantum-900 border border-quantum-600 rounded-lg overflow-hidden relative shadow-lg">
      <div className="flex items-center justify-between px-3 py-2 bg-quantum-800 border-b border-quantum-600">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-quantum-400" />
          <span className="text-xs font-mono uppercase tracking-widest text-slate-300">System Activity Stream</span>
        </div>
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-quantum-500 animate-pulse"></div>
          <span className="text-[10px] font-mono text-quantum-500">LIVE</span>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-1 font-mono text-xs scroll-smooth bg-quantum-950/50"
      >
        {logs.map((log) => (
          <div key={log.id} className="flex items-start space-x-2 opacity-90 hover:opacity-100 transition-opacity">
            <span className="text-slate-600 shrink-0 select-none">[{log.timestamp}]</span>
            <div className="mt-0.5 shrink-0">
               {getIcon(log.level)}
            </div>
            <span className={`break-all ${getColor(log.level)}`}>
              <span className="opacity-70 mr-1">[{log.source}]</span>
              {log.message}
            </span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-slate-600 text-center italic mt-10">Waiting for system signals...</div>
        )}
      </div>
      
      {/* Decorative scanline */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-[10px] w-full animate-[scan_3s_ease-in-out_infinite] opacity-30"></div>
    </div>
  );
};