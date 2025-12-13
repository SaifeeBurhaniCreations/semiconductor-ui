import React from 'react';
import { Box, Cpu, Activity, Server, Database, Radio, Grab } from 'lucide-react';

export const BuilderPalette: React.FC = () => {
  const nodeTypes = [
    { type: 'LOGIC', icon: <Cpu className="w-4 h-4 text-cyan-400" />, label: 'Logic Controller' },
    { type: 'SENSOR', icon: <Radio className="w-4 h-4 text-green-400" />, label: 'Sensor Input' },
    { type: 'ACTUATOR', icon: <Activity className="w-4 h-4 text-orange-400" />, label: 'Actuator Output' },
    { type: 'AI_CORE', icon: <Box className="w-4 h-4 text-purple-400" />, label: 'AI Processor' },
    { type: 'STORAGE', icon: <Database className="w-4 h-4 text-blue-400" />, label: 'Data Store' },
    { type: 'GATEWAY', icon: <Server className="w-4 h-4 text-slate-400" />, label: 'Network Gateway' },
  ];

  return (
    <div className="w-48 bg-quantum-900 border-r border-quantum-600 flex flex-col shrink-0 animate-in slide-in-from-left-5">
      <div className="p-3 border-b border-quantum-600 bg-quantum-800">
        <h3 className="text-xs font-bold text-slate-200 uppercase flex items-center">
            <Grab className="w-3 h-3 mr-2" /> Component Palette
        </h3>
      </div>
      <div className="p-2 space-y-2 overflow-y-auto flex-1">
        {nodeTypes.map((node, i) => (
          <div 
            key={i}
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData('nodeType', node.type);
                e.dataTransfer.effectAllowed = 'copy';
            }}
            className="flex items-center p-2 rounded bg-quantum-950 border border-quantum-700 hover:border-cyan-500/50 hover:bg-quantum-800 cursor-grab active:cursor-grabbing transition-all group"
          >
            <div className="p-1.5 rounded bg-quantum-900 border border-quantum-800 mr-2 group-hover:border-cyan-500/30">
                {node.icon}
            </div>
            <span className="text-xs font-mono text-slate-300 group-hover:text-cyan-100">{node.label}</span>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-quantum-600 bg-quantum-950/50 text-[10px] text-slate-500 text-center">
        Drag components to canvas
      </div>
    </div>
  );
};