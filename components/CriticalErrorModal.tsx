import React from 'react';
import { X, RefreshCw, Download, ShieldAlert } from 'lucide-react';

interface CriticalErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  error?: string;
}

export const CriticalErrorModal: React.FC<CriticalErrorModalProps> = ({ isOpen, onClose, error }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-quantum-950 border border-red-500/50 rounded-lg shadow-[0_0_50px_rgba(239,68,68,0.2)] w-full max-w-lg overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 animate-pulse"></div>
        <div className="p-8">
           <div className="flex items-start space-x-5">
               <div className="p-4 bg-red-900/20 rounded-full border border-red-500/30 shrink-0">
                   <ShieldAlert className="w-10 h-10 text-red-500" />
               </div>
               <div className="flex-1">
                   <h2 className="text-2xl font-bold text-red-500 mb-2 tracking-wide uppercase">System Critical</h2>
                   <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                       {error || "An unrecoverable state violation was detected in the Logic Core. The safety interlock has engaged to prevent hardware damage."}
                   </p>
                   
                   <div className="bg-black/50 p-4 rounded border border-red-900/50 font-mono text-[10px] text-red-400 mb-6 overflow-x-auto">
                       <div className="flex justify-between border-b border-red-900/30 pb-2 mb-2">
                           <span>ERROR_CODE: Q_COHERENCE_FAILURE_0x992</span>
                           <span>T-MINUS: HALTED</span>
                       </div>
                       <div className="opacity-80 space-y-1">
                           <div>at LogicNode.evaluate (core.ts:42:12)</div>
                           <div>at QuantumBridge.sync (bridge.ts:108:4)</div>
                           <div>at ProcessMonitor.tick (monitor.ts:22:8)</div>
                           <div className="text-red-500 font-bold mt-2">{'>'} FATAL EXCEPTION: NULL_POINTER_REF</div>
                       </div>
                   </div>

                   <div className="flex space-x-3">
                       <button 
                        onClick={() => window.location.reload()}
                        className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded flex items-center justify-center transition-colors shadow-lg"
                       >
                           <RefreshCw className="w-3 h-3 mr-2" /> REBOOT SYSTEM
                       </button>
                       <button className="flex-1 py-2.5 bg-quantum-800 border border-quantum-600 hover:bg-quantum-700 text-slate-300 font-bold text-xs rounded flex items-center justify-center transition-colors">
                           <Download className="w-3 h-3 mr-2" /> DOWNLOAD DUMP
                       </button>
                   </div>
               </div>
           </div>
        </div>
        <button onClick={onClose} className="absolute top-2 right-2 p-2 text-slate-600 hover:text-slate-400 transition-colors">
            <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};