import React, { useState } from 'react';
import { 
    HelpCircle, Book, MessageSquare, Search, CheckCircle2, Circle, 
    ArrowRight, Lightbulb, ExternalLink, Loader2, Check, ChevronLeft,
    FileText, Code, Cpu, Terminal
} from 'lucide-react';

interface Ticket {
    id: string;
    title: string;
    status: 'In Progress' | 'Resolved' | 'Waiting on You';
    date: string;
    type: string;
    desc: string;
}

const INITIAL_TICKETS: Ticket[] = [
    { id: '#8921', title: 'Simulation Latency Spike', status: 'In Progress', date: '2h ago', type: 'Technical Issue', desc: 'Latency spike in Sector 7.' },
    { id: '#8904', title: 'Billing Inquiry for Oct', status: 'Waiting on You', date: '1d ago', type: 'Billing Question', desc: 'Discrepancy in invoice #442.' },
    { id: '#8812', title: 'Node Connection Timeout', status: 'Resolved', date: '3d ago', type: 'Technical Issue', desc: 'Node 4 disconnected intermittently.' },
];

const KNOWLEDGE_BASE = [
    { id: 'kb1', title: 'Resolving Error 503', category: 'Troubleshooting', docId: 'troubleshooting' },
    { id: 'kb2', title: 'Cooling PID Calibration', category: 'Maintenance', docId: 'api-ref' },
    { id: 'kb3', title: 'API Key Rotation Guide', category: 'Security', docId: 'api-ref' },
    { id: 'kb4', title: 'Node Optimization Techniques', category: 'Performance', docId: 'node-logic' },
    { id: 'kb5', title: 'Understanding Billing Cycles', category: 'Billing', docId: 'api-ref' },
];

const DOC_CONTENT: Record<string, { title: string, content: React.ReactNode }> = {
    'api-ref': {
        title: 'API Reference',
        content: (
            <div className="space-y-6">
                <p>The Quantum Control API allows programmatic access to logic nodes and simulation streams.</p>
                <div className="bg-black/50 p-4 rounded border border-quantum-700 font-mono text-xs">
                    <div className="text-purple-400 mb-2">// Initialize Client</div>
                    <div className="text-slate-300">const client = new QuantumClient('{'{'} apiKey: process.env.KEY {'}'}');</div>
                    <div className="text-slate-300 mt-1">await client.connect();</div>
                </div>
                <h3 className="text-sm font-bold text-slate-200 mt-4">Endpoints</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-400 text-sm">
                    <li><code className="text-cyan-400 bg-quantum-950 px-1 rounded">GET /v1/nodes</code> - List all active nodes</li>
                    <li><code className="text-cyan-400 bg-quantum-950 px-1 rounded">POST /v1/simulate</code> - Trigger a simulation run</li>
                </ul>
            </div>
        )
    },
    'node-logic': {
        title: 'Node Logic Guide',
        content: (
            <div className="space-y-6">
                <p>Logic Nodes are the fundamental building blocks of the control graph. They process input signals and determine actuator states.</p>
                <div className="p-4 bg-quantum-950 border-l-2 border-cyan-500 rounded-r">
                    <h4 className="text-cyan-400 font-bold text-xs uppercase mb-1">Best Practice</h4>
                    <p className="text-xs text-slate-400">Keep node dependencies below 5 per cluster to minimize latency propagation.</p>
                </div>
                <h3 className="text-sm font-bold text-slate-200 mt-4">State Definitions</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border border-quantum-700 rounded bg-quantum-900/50">
                        <div className="text-green-400 font-mono text-xs font-bold">ACTIVE</div>
                        <div className="text-[10px] text-slate-500 mt-1">Processing signals normally.</div>
                    </div>
                    <div className="p-3 border border-quantum-700 rounded bg-quantum-900/50">
                        <div className="text-orange-400 font-mono text-xs font-bold">IDLE</div>
                        <div className="text-[10px] text-slate-500 mt-1">Waiting for input stream.</div>
                    </div>
                </div>
            </div>
        )
    },
    'troubleshooting': {
        title: 'Troubleshooting',
        content: (
            <div className="space-y-6">
                <p>Common issues and their resolutions for the Quantum Control Plane.</p>
                <div className="space-y-4">
                    <div className="border-b border-quantum-700 pb-4">
                        <h4 className="text-slate-200 font-bold text-sm mb-2">Error 503: Bridge Timeout</h4>
                        <p className="text-xs text-slate-400 mb-2">This occurs when the Quantum Core fails to acknowledge a heartbeat.</p>
                        <button className="text-xs text-cyan-400 hover:underline">Run Diagnostic Tool &rarr;</button>
                    </div>
                    <div className="border-b border-quantum-700 pb-4">
                        <h4 className="text-slate-200 font-bold text-sm mb-2">Calibration Drift</h4>
                        <p className="text-xs text-slate-400">If sensor readings fluctuate &gt; 5%, initiate a recalibration sequence via the Resources tab.</p>
                    </div>
                </div>
            </div>
        )
    }
};

export const SupportView: React.FC = () => {
  const [activeView, setActiveView] = useState<'home' | 'docs'>('home');
  const [currentDoc, setCurrentDoc] = useState<string>('api-ref');
  
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [ticketQuery, setTicketQuery] = useState('');
  const [ticketType, setTicketType] = useState('Technical Issue');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewAllHistory, setViewAllHistory] = useState(false);

  // Search Logic
  const filteredKB = KNOWLEDGE_BASE.filter(kb => 
      kb.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      kb.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Submit Logic
  const handleSubmitTicket = () => {
      if (!ticketQuery.trim()) return;
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
          const newTicket: Ticket = {
              id: `#${Math.floor(Math.random() * 9000) + 1000}`,
              title: ticketQuery.substring(0, 30) + (ticketQuery.length > 30 ? '...' : ''),
              status: 'In Progress',
              date: 'Just now',
              type: ticketType,
              desc: ticketQuery
          };
          setTickets([newTicket, ...tickets]);
          setTicketQuery('');
          setIsSubmitting(false);
          // Optional: Show success toast/message here
      }, 1500);
  };

  const handleDocClick = (docKey: string) => {
      setCurrentDoc(docKey);
      setActiveView('docs');
      setSearchQuery(''); // Clear search on navigation
  };

  const handleSearchResultClick = (docId: string) => {
      handleDocClick(docId);
  };

  const displayedTickets = viewAllHistory ? tickets : tickets.slice(0, 3);

  return (
    <div className="h-full flex gap-4 overflow-hidden">
        
        {/* Left: Onboarding & Quick Links */}
        <div className="w-72 bg-quantum-900 border border-quantum-600 rounded-lg flex flex-col shrink-0 p-5 overflow-y-auto custom-scrollbar">
            <div className="mb-8 cursor-pointer" onClick={() => setActiveView('home')}>
                <div className="w-12 h-12 bg-gradient-to-tr from-cyan-600 to-purple-600 rounded-lg flex items-center justify-center mb-4 shadow-lg group">
                    <HelpCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                </div>
                <h2 className="text-xl font-bold text-slate-100 hover:text-cyan-400 transition-colors">Operator Hub</h2>
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
                <ul className="space-y-1 text-sm">
                    <li>
                        <button 
                            onClick={() => handleDocClick('api-ref')}
                            className={`flex items-center w-full text-left py-1.5 px-2 rounded transition-colors ${activeView === 'docs' && currentDoc === 'api-ref' ? 'bg-quantum-800 text-cyan-400' : 'text-slate-300 hover:text-cyan-400 hover:bg-quantum-800/50'}`}
                        >
                            <Code className="w-3 h-3 mr-2" /> API Reference
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={() => handleDocClick('node-logic')}
                            className={`flex items-center w-full text-left py-1.5 px-2 rounded transition-colors ${activeView === 'docs' && currentDoc === 'node-logic' ? 'bg-quantum-800 text-cyan-400' : 'text-slate-300 hover:text-cyan-400 hover:bg-quantum-800/50'}`}
                        >
                            <Cpu className="w-3 h-3 mr-2" /> Node Logic Guide
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={() => handleDocClick('troubleshooting')}
                            className={`flex items-center w-full text-left py-1.5 px-2 rounded transition-colors ${activeView === 'docs' && currentDoc === 'troubleshooting' ? 'bg-quantum-800 text-cyan-400' : 'text-slate-300 hover:text-cyan-400 hover:bg-quantum-800/50'}`}
                        >
                            <Terminal className="w-3 h-3 mr-2" /> Troubleshooting
                        </button>
                    </li>
                </ul>
            </div>
        </div>

        {/* Right: Main Content */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
            
            {/* VIEW: SUPPORT HOME */}
            {activeView === 'home' && (
                <>
                    {/* Search Banner - Removed overflow-hidden to allow dropdown to overlap */}
                    <div className="bg-quantum-900 border border-quantum-600 rounded-lg p-8 flex flex-col items-center justify-center relative shrink-0 min-h-[220px] z-10">
                        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/5 to-transparent pointer-events-none rounded-lg"></div>
                        <h2 className="text-2xl font-bold text-slate-200 mb-6 relative z-10">How can we assist you today?</h2>
                        <div className="w-full max-w-lg relative z-20">
                            <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                            <input 
                                type="text" 
                                placeholder="Search for error codes, guides, or tutorials..." 
                                className="w-full bg-quantum-950 border border-quantum-700 rounded-lg pl-10 pr-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 shadow-xl transition-colors"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-quantum-900 border border-quantum-600 rounded-lg shadow-2xl z-50 overflow-hidden max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                                    {filteredKB.length > 0 ? (
                                        filteredKB.map(kb => (
                                            <div 
                                                key={kb.id} 
                                                onClick={() => handleSearchResultClick(kb.docId)}
                                                className="p-3 hover:bg-quantum-800 cursor-pointer flex justify-between items-center group"
                                            >
                                                <div className="text-sm text-slate-200 group-hover:text-cyan-400">{kb.title}</div>
                                                <div className="text-xs text-slate-500 bg-quantum-950 px-2 py-0.5 rounded">{kb.category}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-slate-500 text-sm">No results found for "{searchQuery}".</div>
                                    )}
                                </div>
                            )}
                        </div>
                        {/* Only show tags if NOT searching to avoid visual clutter */}
                        {!searchQuery && (
                            <div className="flex space-x-4 mt-4 text-xs text-slate-500 relative z-10 animate-in fade-in duration-500">
                                <span className="cursor-pointer hover:text-cyan-400" onClick={() => setSearchQuery('Error 503')}>Popular: "Error 503"</span>
                                <span className="cursor-pointer hover:text-cyan-400" onClick={() => setSearchQuery('Cooling PID')}>Popular: "Cooling PID"</span>
                                <span className="cursor-pointer hover:text-cyan-400" onClick={() => setSearchQuery('API Keys')}>Popular: "API Keys"</span>
                            </div>
                        )}
                    </div>

                    {/* Ticket & FAQ Grid */}
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0 relative z-0">
                        
                        {/* Submit Ticket */}
                        <div className="bg-quantum-900 border border-quantum-600 rounded-lg p-6 flex flex-col">
                            <h3 className="text-sm font-bold text-slate-200 uppercase mb-4 flex items-center">
                                <MessageSquare className="w-4 h-4 mr-2 text-cyan-400" /> Submit Support Ticket
                            </h3>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Issue Type</label>
                                    <select 
                                        className="w-full bg-quantum-950 border border-quantum-700 rounded p-2 text-sm text-slate-300 focus:border-cyan-500 outline-none"
                                        value={ticketType}
                                        onChange={(e) => setTicketType(e.target.value)}
                                    >
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
                            <button 
                                onClick={handleSubmitTicket}
                                disabled={isSubmitting || !ticketQuery.trim()}
                                className="w-full mt-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded shadow-lg transition-colors flex items-center justify-center"
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                                ) : (
                                    "Submit Request"
                                )}
                            </button>
                        </div>

                        {/* Active Tickets */}
                        <div className="bg-quantum-900 border border-quantum-600 rounded-lg p-6 flex flex-col overflow-hidden">
                            <h3 className="text-sm font-bold text-slate-200 uppercase mb-4 flex items-center">
                                <ExternalLink className="w-4 h-4 mr-2 text-purple-400" /> Your Active Tickets
                            </h3>
                            <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
                                {displayedTickets.length === 0 ? (
                                    <div className="text-center text-slate-500 text-sm py-8">No tickets found.</div>
                                ) : (
                                    displayedTickets.map(ticket => (
                                        <TicketItem 
                                            key={ticket.id} 
                                            id={ticket.id} 
                                            title={ticket.title} 
                                            status={ticket.status} 
                                            date={ticket.date} 
                                            closed={ticket.status === 'Resolved'}
                                        />
                                    ))
                                )}
                            </div>
                            <button 
                                onClick={() => setViewAllHistory(!viewAllHistory)}
                                className="w-full mt-4 py-2 bg-quantum-800 hover:bg-quantum-700 text-slate-300 font-bold text-sm rounded border border-quantum-600 transition-colors"
                            >
                                {viewAllHistory ? "Show Less" : "View All History"}
                            </button>
                        </div>

                    </div>
                </>
            )}

            {/* VIEW: DOCUMENTATION */}
            {activeView === 'docs' && (
                <div className="bg-quantum-900 border border-quantum-600 rounded-lg flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="px-6 py-4 border-b border-quantum-600 flex items-center space-x-3 bg-quantum-800/50">
                        <button 
                            onClick={() => setActiveView('home')} 
                            className="p-1.5 rounded-full hover:bg-quantum-700 text-slate-400 hover:text-white transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg font-bold text-slate-200 flex items-center">
                            <Book className="w-5 h-5 mr-2 text-purple-400" /> Documentation / {DOC_CONTENT[currentDoc]?.title}
                        </h2>
                    </div>
                    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar text-slate-300 leading-relaxed">
                        <div className="max-w-3xl">
                            {DOC_CONTENT[currentDoc] ? (
                                <>
                                    <h1 className="text-3xl font-bold text-white mb-6">{DOC_CONTENT[currentDoc].title}</h1>
                                    {DOC_CONTENT[currentDoc].content}
                                </>
                            ) : (
                                <div className="text-center py-20 text-slate-500">
                                    Document not found.
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="p-4 border-t border-quantum-600 bg-quantum-950 flex justify-between items-center text-xs text-slate-500">
                        <span>Last updated: Oct 24, 2025</span>
                        <span>Rev 4.2.1</span>
                    </div>
                </div>
            )}

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
    <div className={`p-3 rounded border flex items-center justify-between transition-colors ${closed ? 'bg-quantum-950/50 border-quantum-800 opacity-60' : 'bg-quantum-950 border-quantum-700 hover:border-cyan-500/30'}`}>
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