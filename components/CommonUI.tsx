import React from 'react';
import { AlertCircle, Box, RefreshCcw } from 'lucide-react';

interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
    title = "No data available for this view.", 
    description = "Start by selecting a node or launching a simulation.", 
    icon, 
    action 
}) => {
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="p-4 bg-quantum-900 rounded-full border border-quantum-700 mb-4 shadow-lg">
                {icon || <Box className="w-8 h-8 text-slate-500" />}
            </div>
            <h3 className="text-lg font-bold text-slate-300 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed mb-6">
                {description}
            </p>
            {action && (
                <div className="mt-2">
                    {action}
                </div>
            )}
        </div>
    );
};

interface ErrorBlockProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

export const ErrorBlock: React.FC<ErrorBlockProps> = ({
    title = "Operation Failed",
    message = "Something went wrong — run diagnostics for more details.",
    onRetry
}) => {
    return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-red-900/5 border border-red-500/20 rounded-lg">
            <AlertCircle className="w-10 h-10 text-red-500 mb-3 opacity-80" />
            <h3 className="text-sm font-bold text-red-400 uppercase tracking-wide mb-1">{title}</h3>
            <p className="text-xs text-slate-400 mb-4 max-w-sm">{message}</p>
            {onRetry && (
                <button 
                    onClick={onRetry}
                    className="px-4 py-2 bg-quantum-900 border border-quantum-700 hover:border-red-500/50 text-slate-300 text-xs font-bold rounded flex items-center transition-colors"
                >
                    <RefreshCcw className="w-3 h-3 mr-2" /> Retry Operation
                </button>
            )}
        </div>
    );
};