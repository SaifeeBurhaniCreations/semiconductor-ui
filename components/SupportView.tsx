import React, { useState } from 'react';
import { 
    HelpCircle, Book, MessageSquare, Search, CheckCircle2, Circle, 
    ArrowRight, Lightbulb, ExternalLink 
} from 'lucide-react';

export const SupportView: React.FC = () => {
  const [ticketQuery, setTicketQuery] = useState('');

  return (
    <div className="h-full flex gap-4 overflow-hidden">
        
        {/* Left: Onboarding & Quick Links */}
        <div className="w-72 bg-quantum-900 border border-quantum-600 rounded-lg flex flex-col shrink-0 p-5 overflow-y-auto custom-scrollbar">
            <div className="mb-8">
                <div className="w-12 h-12 bg-gradient-to-tr from-cyan-600 to-purple-600 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                    <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-100">Operator Hub</h2>
                <p className="text-xs text-slate-500 mt-1">Resources and diagnostics.</p>
            </div>

            <div className="mb-8">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Onboarding Progress</h3>
                <div className="space-y-3">
                    <OnboardingItem label="System Calibration" completed={true} />
                    <OnboardingItem label="Connect Quantum Core" completed={true} />
                    <OnboardingItem label="First Simulation Run" completed={true} />
                    <OnboardingItem label="Configure Alert Rules" completed={false} />
                    <OnboardingItem label="Invite Team Members" completed={false} />
                </div>
                <div className="mt-4 pt-4 border-t border-quantum-800">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>3 of 5 Complete</span>
                        <span>60%</span>
                    </div>
                    <div className="w-full h-1.5 bg-quantum-950 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 w-[60%]"></div>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Documentation</h3>
                <ul className="space-y-2 text-sm">
                    <li><a href="#" className="flex items-center text-slate-300 hover:text-cyan-400 transition-colors"><Book className="w-3 h-3 mr-2" /> API Reference</a></li>
                    <li><a href="#" className="flex items-center text-slate-300 hover:text-cyan-400 transition-colors"><Book className="w-3 h-3 mr-2" /> Node Logic Guide</a></li>
                    <li><a href="#" className="flex items-center text-slate-300 hover:text-cyan-400 transition-colors"><Book className="w-3 h-3 mr-2" /> Troubleshooting</a></li>
                </ul>
            </div>
        </div>

        {/* Right: Main Support Content */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
            
            {/* Search Banner */}
            <div className="bg-quantum-900 border border-quantum-600 rounded-lg p-8 flex flex-col items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/5 to-transparent pointer-events-none"></div>
                 <h2 className="text-2xl font-bold text-slate-200 mb-6 relative z-10">How can we assist you today?</h2>
                 <div className="w-full max-w-lg relative z-10">
                     <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                     <input 
                        type="text" 
                        placeholder="Search for error codes, guides, or tutorials..." 
                        className="w-full bg-quantum-950 border border-quantum-700 rounded-lg pl-10 pr-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 shadow-xl transition-colors"
                     />
                 </div>
                 <div className="flex space-x-4 mt-4 text-xs text-slate-500 relative z-10">
                     <span className="cursor-pointer hover:text-cyan-400">Popular: "Error 503"</span>
                     <span className="cursor-pointer hover:text-cyan-400">Popular: "Cooling PID"</span>
                     <span className="cursor-pointer hover:text-cyan-400">Popular: "API Keys"</span>
                 </div>
            </div>

            {/* Ticket & FAQ Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
                
                {/* Submit Ticket */}
                <div className="bg-quantum-900 border border-quantum-600 rounded-lg p-6 flex flex-col">
                    <h3 className="text-sm font-bold text-slate-200 uppercase mb-4 flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2 text-cyan-400" /> Submit Support Ticket
                    </h3>
                    <div className="flex-1 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Issue Type</label>
                            <select className="w-full bg-quantum-950 border border-quantum-700 rounded p-2 text-sm text-slate-300 focus:border-cyan-500 outline-none">
                                <option>Technical Issue</option>
                                <option>Billing Question</option>
                                <option>Feature Request</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                            <textarea 
                                className="w-full h-32 bg-quantum-950 border border-quantum-700 rounded p-3 text-sm text-slate-300 focus:border-cyan-500 outline-none resize-none"
                                placeholder="Describe the behavior..."
                                value={ticketQuery}
                                onChange={(e) => setTicketQuery(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="flex items-center space-x-2 p-2 bg-cyan-900/10 border border-cyan-500/20 rounded">
                            <Lightbulb className="w-4 h-4 text-cyan-400" />
                            <span className="text-xs text-slate-400">Diagnostic logs will be automatically attached.</span>
                        </div>
                    </div>
                    <button className="w-full mt-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm rounded shadow-lg transition-colors">
                        Submit Request
                    </button>
                </div>

                {/* Active Tickets */}
                <div className="bg-quantum-900 border border-quantum-600 rounded-lg p-6 flex flex-col">
                    <h3 className="text-sm font-bold text-slate-200 uppercase mb-4 flex items-center">
                        <ExternalLink className="w-4 h-4 mr-2 text-purple-400" /> Your Active Tickets
                    </h3>
                    <div className="flex-1 space-y-3">
                        <TicketItem id="#8921" title="Simulation Latency Spike" status="In Progress" date="2h ago" />
                        <TicketItem id="#8904" title="Billing Inquiry for Oct" status="Waiting on You" date="1d ago" />
                        <TicketItem id="#8812" title="Node Connection Timeout" status="Resolved" date="3d ago" closed />
                    </div>
                    <button className="w-full mt-4 py-2 bg-quantum-800 hover:bg-quantum-700 text-slate-300 font-bold text-sm rounded border border-quantum-600 transition-colors">
                        View All History
                    </button>
                </div>

            </div>
        </div>

    </div>
  );
};

const OnboardingItem = ({ label, completed }: { label: string, completed: boolean }) => (
    <div className="flex items-center justify-between group cursor-pointer">
        <div className={`text-sm ${completed ? 'text-slate-400 line-through decoration-slate-600' : 'text-slate-200 group-hover:text-cyan-400'}`}>
            {label}
        </div>
        {completed ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Circle className="w-4 h-4 text-slate-600 group-hover:text-cyan-500" />}
    </div>
);

const TicketItem = ({ id, title, status, date, closed }: any) => (
    <div className={`p-3 rounded border flex items-center justify-between ${closed ? 'bg-quantum-950/50 border-quantum-800 opacity-60' : 'bg-quantum-950 border-quantum-700'}`}>
        <div>
            <div className="text-sm font-medium text-slate-200">{title}</div>
            <div className="text-xs text-slate-500 font-mono">{id} • {date}</div>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
            status === 'In Progress' ? 'bg-cyan-900/20 text-cyan-400 border-cyan-500/30' :
            status === 'Resolved' ? 'bg-green-900/20 text-green-400 border-green-500/30' :
            'bg-orange-900/20 text-orange-400 border-orange-500/30'
        }`}>
            {status}
        </span>
    </div>
);