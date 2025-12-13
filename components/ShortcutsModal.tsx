import React from 'react';
import { X, Keyboard, Command, CornerDownLeft, ArrowUp } from 'lucide-react';

interface ShortcutsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-quantum-900 border border-quantum-600 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden relative">
                {/* Header */}
                <div className="px-6 py-4 border-b border-quantum-700 flex justify-between items-center bg-quantum-800/50">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-quantum-950 border border-quantum-700 rounded-lg text-cyan-400">
                            <Keyboard className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-100">Keyboard Shortcuts</h2>
                            <p className="text-xs text-slate-500">Supercharge your workflow with these hotkeys.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 grid grid-cols-2 gap-8 bg-quantum-900/90">
                    <div>
                        <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-4 border-b border-quantum-800 pb-2">Navigation</h3>
                        <div className="space-y-3">
                            <ShortcutItem keys={['Shift', 'D']} description="Go to Dashboard" />
                            <ShortcutItem keys={['Shift', 'L']} description="Go to Logic Graph" />
                            <ShortcutItem keys={['Shift', 'S']} description="Go to Simulation" />
                            <ShortcutItem keys={['Shift', 'A']} description="Go to Analytics" />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4 border-b border-quantum-800 pb-2">Actions</h3>
                        <div className="space-y-3">
                            <ShortcutItem keys={['Space']} description="Toggle Simulation Play/Pause" />
                            <ShortcutItem keys={['Esc']} description="Close Panels / Deselect" />
                            <ShortcutItem keys={['Ctrl', 'S']} description="Save Configuration" />
                            <ShortcutItem keys={['?']} description="Toggle this menu" />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 bg-quantum-950 border-t border-quantum-700 text-center">
                    <p className="text-[10px] text-slate-500">
                        Pro Tip: You can customize these bindings in the <span className="text-cyan-400 hover:underline cursor-pointer">Configuration</span> panel.
                    </p>
                </div>
            </div>
        </div>
    );
};

const ShortcutItem = ({ keys, description }: { keys: string[], description: string }) => (
    <div className="flex justify-between items-center group">
        <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{description}</span>
        <div className="flex space-x-1">
            {keys.map((k, i) => (
                <kbd key={i} className="px-2 py-1 bg-quantum-800 border border-quantum-600 rounded text-xs font-mono text-slate-400 shadow-sm min-w-[24px] text-center">
                    {k}
                </kbd>
            ))}
        </div>
    </div>
);