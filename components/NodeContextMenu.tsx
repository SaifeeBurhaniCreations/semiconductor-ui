import React, { useEffect, useRef } from 'react';
import { 
  Search, Play, Activity, Copy, Trash2, Link, FileJson, 
  Power, ShieldCheck, Camera
} from 'lucide-react';

interface NodeContextMenuProps {
  x: number;
  y: number;
  nodeId: string;
  onClose: () => void;
  onAction: (action: string, nodeId: string) => void;
}

export const NodeContextMenu: React.FC<NodeContextMenuProps> = ({ x, y, nodeId, onClose, onAction }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleAction = (action: string) => {
    onAction(action, nodeId);
    onClose();
  };

  return (
    <div 
      ref={menuRef}
      className="fixed z-50 w-56 bg-quantum-900 border border-quantum-600 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
      style={{ top: y, left: x }}
    >
      <div className="px-3 py-2 bg-quantum-950 border-b border-quantum-700">
        <span className="text-[10px] font-mono text-slate-500 uppercase">Node Actions: {nodeId}</span>
      </div>
      
      <div className="p-1 space-y-0.5">
        <MenuItem icon={<Search className="w-3 h-3 text-cyan-400" />} label="Inspect Details" onClick={() => handleAction('inspect')} />
        <MenuItem icon={<ShieldCheck className="w-3 h-3 text-green-400" />} label="Validate Integrity" onClick={() => handleAction('validate')} />
        <MenuItem icon={<Play className="w-3 h-3 text-purple-400" />} label="Simulate Flow" onClick={() => handleAction('simulate')} />
        <MenuItem icon={<Activity className="w-3 h-3 text-orange-400" />} label="Run Analytics" onClick={() => handleAction('analytics')} />
      </div>

      <div className="h-px bg-quantum-700 my-1 mx-2"></div>

      <div className="p-1 space-y-0.5">
        <MenuItem icon={<Camera className="w-3 h-3 text-slate-400" />} label="Snapshot State" onClick={() => handleAction('snapshot')} />
        <MenuItem icon={<FileJson className="w-3 h-3 text-slate-400" />} label="Export Configuration" onClick={() => handleAction('export')} />
        <MenuItem icon={<Copy className="w-3 h-3 text-slate-400" />} label="Duplicate Node" onClick={() => handleAction('duplicate')} />
      </div>

      <div className="h-px bg-quantum-700 my-1 mx-2"></div>

      <div className="p-1 space-y-0.5">
        <MenuItem icon={<Link className="w-3 h-3 text-slate-400" />} label="Add Dependency" onClick={() => handleAction('link')} />
        <MenuItem icon={<Power className="w-3 h-3 text-slate-400" />} label="Disable Node" onClick={() => handleAction('disable')} />
        <MenuItem icon={<Trash2 className="w-3 h-3 text-red-400" />} label="Delete" onClick={() => handleAction('delete')} isDanger />
      </div>
    </div>
  );
};

const MenuItem = ({ icon, label, onClick, isDanger }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center px-2 py-1.5 rounded text-xs transition-colors group ${
      isDanger 
        ? 'text-red-400 hover:bg-red-900/20' 
        : 'text-slate-300 hover:bg-quantum-800 hover:text-cyan-400'
    }`}
  >
    <span className="mr-2 opacity-80 group-hover:opacity-100">{icon}</span>
    {label}
  </button>
);