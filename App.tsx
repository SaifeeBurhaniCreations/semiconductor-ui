import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, Network, FileText, Settings, Bell, 
  Menu, X, Command, Activity, Layers, GitBranch, Database, Globe, PlayCircle 
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { ConsoleLogger } from './components/ConsoleLogger';
import { LogicGraph } from './components/LogicGraph';
import { AIOperator } from './components/AIOperator';
import { NodeInspector } from './components/NodeInspector';
import { LogEntry, LogicNode, SystemMetrics, ModuleType, NodeDetails } from './types';

// --- MOCK DATA GENERATORS ---

const INITIAL_NODES: LogicNode[] = [
  { id: '1', label: 'Main Controller', type: ModuleType.LOGIC, status: 'active', x: 0, y: 0, connections: ['2', '3', '4'] },
  { id: '2', label: 'Sensor Array A', type: ModuleType.SENSOR, status: 'active', x: 0, y: 0, connections: ['5'] },
  { id: '3', label: 'AI Inference Engine', type: ModuleType.AI_CORE, status: 'active', x: 0, y: 0, connections: ['5', '6'] },
  { id: '4', label: 'Safety Protocol', type: ModuleType.LOGIC, status: 'idle', x: 0, y: 0, connections: ['6'] },
  { id: '5', label: 'Actuator Drive', type: ModuleType.ACTUATOR, status: 'active', x: 0, y: 0, connections: [] },
  { id: '6', label: 'Data Logger', type: ModuleType.LOGIC, status: 'active', x: 0, y: 0, connections: [] },
];

const MOCK_NODE_DETAILS: Record<string, NodeDetails> = {
  'default': {
    identity: { role: 'Process Controller', category: 'Logic Core', version: 'v2.4.1', dependencies: 3 },
    state: { lastExecution: '0ms ago', health: 99, activeThreads: 12, uptime: '48h 12m' },
    intelligence: { optimizationScore: 92, prediction: 'Nominal throughput expected for next 4 cycles.', anomalyProbability: 'Low (<0.1%)' }
  },
  '3': { // AI Engine specific
    identity: { role: 'Inference Unit', category: 'Neural Processor', version: 'v4.0.0-alpha', dependencies: 8 },
    state: { lastExecution: 'Processing...', health: 95, activeThreads: 128, uptime: '12h 05m' },
    intelligence: { optimizationScore: 88, prediction: 'Suggesting re-allocation of tensor cores for localized workload.', anomalyProbability: 'Medium (Logic drift detected)' }
  }
};

const generateMockHistory = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: i,
    stability: 85 + Math.random() * 10,
    throughput: 60 + Math.random() * 30,
    temp: 40 + Math.random() * 20
  }));
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'logic' | 'lineage' | 'sim' | 'docs' | 'settings'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpuLoad: 45,
    memoryUsage: 64.2,
    quantumCoherence: 98.2,
    networkLatency: 12,
    activeThreads: 142
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [history, setHistory] = useState(generateMockHistory());
  
  // Helper to add logs
  const addLog = useCallback((message: string, level: LogEntry['level'] = 'INFO', source: string = 'SYS') => {
    setLogs(prev => [
      ...prev.slice(-99), // Keep last 100
      {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toLocaleTimeString([], { hour12: false }),
        level,
        source,
        message
      }
    ]);
  }, []);

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    addLog(`Operator selected node ID: ${nodeId}`, 'INFO', 'UI');
  };

  const handleInspectorAction = (action: string) => {
    addLog(`Initiating ${action.toUpperCase()} on Node ${selectedNodeId}...`, 'AI', 'OPS');
  };

  // Simulate System Activity
  useEffect(() => {
    const interval = setInterval(() => {
      // Update Metrics
      setMetrics(prev => ({
        cpuLoad: Math.min(100, Math.max(0, prev.cpuLoad + (Math.random() - 0.5) * 5)),
        memoryUsage: Math.min(128, Math.max(40, prev.memoryUsage + (Math.random() - 0.5) * 2)),
        quantumCoherence: Math.min(100, Math.max(90, prev.quantumCoherence + (Math.random() - 0.5))),
        networkLatency: Math.max(1, prev.networkLatency + (Math.random() - 0.5) * 2),
        activeThreads: Math.floor(prev.activeThreads + (Math.random() - 0.5) * 5)
      }));

      // Update History
      setHistory(prev => [
        ...prev.slice(1),
        {
          time: prev[prev.length - 1].time + 1,
          stability: 85 + Math.random() * 10,
          throughput: 60 + Math.random() * 30,
          temp: 40 + Math.random() * 20
        }
      ]);

      // Random Logs
      if (Math.random() > 0.8) {
        const messages = [
          "Optimizing qubit states in sector 4...",
          "Garbage collection triggered on Node 3.",
          "Incoming telemetry stream verified.",
          "Logic Gate 7 re-calibrated.",
          "Cooling system nominal."
        ];
        addLog(messages[Math.floor(Math.random() * messages.length)], 'INFO', 'AUTO');
      }
      if (Math.random() > 0.98) {
        addLog("Minor fluctuation detected in power grid.", "WARN", "PWR");
      }

    }, 2000);

    return () => clearInterval(interval);
  }, [addLog]);

  const selectedNode = INITIAL_NODES.find(n => n.id === selectedNodeId);
  const selectedNodeDetails = selectedNode ? (MOCK_NODE_DETAILS[selectedNode.id] || MOCK_NODE_DETAILS['default']) : null;

  return (
    <div className="flex h-dvh w-full bg-quantum-950 text-slate-300 font-sans overflow-hidden relative">
      
      {/* Background ambient effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Sidebar */}
      <aside 
        className={`
          flex flex-col bg-quantum-900 border-r border-quantum-600 transition-all duration-300 z-20 shadow-xl
          ${sidebarOpen ? 'w-64' : 'w-16'}
        `}
      >
        <div className="h-16 flex items-center px-4 border-b border-quantum-600 bg-quantum-900">
          <Activity className="w-6 h-6 text-cyan-400 shrink-0" />
          <span className={`ml-3 font-bold tracking-widest text-slate-100 transition-opacity duration-300 ${!sidebarOpen && 'opacity-0 hidden'}`}>
            LOGIC<span className="text-cyan-400">FLOW</span>
          </span>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto custom-scrollbar">
          <div className="mb-4">
             {sidebarOpen && <div className="px-3 mb-2 text-[10px] font-mono text-slate-500 uppercase">Operations</div>}
             <SidebarItem icon={<LayoutDashboard />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} collapsed={!sidebarOpen} />
             <SidebarItem icon={<Network />} label="Logic Topology" active={activeTab === 'logic'} onClick={() => setActiveTab('logic')} collapsed={!sidebarOpen} />
          </div>

          <div className="mb-4">
             {sidebarOpen && <div className="px-3 mb-2 text-[10px] font-mono text-slate-500 uppercase">Analytics</div>}
             <SidebarItem icon={<GitBranch />} label="Data Lineage" active={activeTab === 'lineage'} onClick={() => setActiveTab('lineage')} collapsed={!sidebarOpen} />
             <SidebarItem icon={<PlayCircle />} label="Simulation" active={activeTab === 'sim'} onClick={() => setActiveTab('sim')} collapsed={!sidebarOpen} />
          </div>

          <div className="mb-4">
             {sidebarOpen && <div className="px-3 mb-2 text-[10px] font-mono text-slate-500 uppercase">System</div>}
             <SidebarItem icon={<FileText />} label="Documentation" active={activeTab === 'docs'} onClick={() => setActiveTab('docs')} collapsed={!sidebarOpen} />
             <SidebarItem icon={<Settings />} label="Configuration" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} collapsed={!sidebarOpen} />
          </div>
        </nav>

        {/* Improved Toggle Switch */}
        <div className="p-3 bg-quantum-950 border-t border-quantum-600">
            <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-full flex items-center justify-center p-2 rounded-md bg-quantum-800 hover:bg-quantum-700 text-slate-400 hover:text-cyan-400 transition-colors border border-quantum-700 hover:border-cyan-500/30 group"
            >
                {sidebarOpen ? (
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono uppercase tracking-wide">Collapse</span>
                        <div className="w-1 h-4 border-r border-slate-600"></div>
                        <X className="w-3 h-3 group-hover:rotate-90 transition-transform" />
                    </div>
                ) : (
                    <Menu className="w-4 h-4 group-hover:scale-110 transition-transform" />
                )}
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10 bg-quantum-950/50">
        
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-quantum-900/90 backdrop-blur-md border-b border-quantum-600 z-20 shrink-0">
            <div className="flex items-center space-x-4">
                <span className="text-xs font-mono text-slate-500 hidden md:inline-block">SYSTEM_ID: <span className="text-slate-300">Q-OS-742</span></span>
                <span className="h-4 w-px bg-quantum-600 hidden md:inline-block"></span>
                <div className="flex items-center space-x-2 px-2 py-1 bg-quantum-800/50 rounded border border-quantum-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-quantum-success animate-pulse"></div>
                    <span className="text-xs font-mono text-slate-300">SYSTEM NOMINAL</span>
                </div>
            </div>
            
            <div className="flex items-center space-x-4">
                <button className="p-2 text-slate-400 hover:text-cyan-400 transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-quantum-900"></span>
                </button>
                <div className="w-8 h-8 rounded bg-gradient-to-tr from-cyan-600 to-purple-700 flex items-center justify-center font-bold text-white text-xs shadow-glow-cyan cursor-pointer hover:ring-2 ring-cyan-500/50 transition-all">
                    OP
                </div>
            </div>
        </header>

        {/* Dynamic Viewport */}
        <div className="flex-1 flex overflow-hidden p-4 gap-4">
            
            {/* Center/Main Stage */}
            <div className="flex-1 flex flex-col min-w-0 bg-transparent rounded-lg overflow-hidden relative">
                
                {/* View Content */}
                {activeTab === 'dashboard' && <Dashboard metrics={metrics} history={history} />}
                
                {activeTab === 'logic' && (
                    <div className="flex-1 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-4 shrink-0">
                             <div className="flex items-center space-x-2">
                                <Network className="w-5 h-5 text-cyan-400" />
                                <h2 className="text-lg font-bold text-slate-200">Logic Topology</h2>
                             </div>
                             <div className="flex space-x-2">
                                <button className="px-3 py-1 bg-quantum-700 hover:bg-quantum-600 text-xs font-mono rounded text-cyan-400 border border-quantum-500/30 transition-colors">
                                    + ADD NODE
                                </button>
                                <button className="px-3 py-1 bg-quantum-800 hover:bg-quantum-700 text-xs font-mono rounded text-slate-300 border border-quantum-600 transition-colors">
                                    AUTO-ARRANGE
                                </button>
                             </div>
                        </div>
                        <div className="flex-1 relative">
                            <LogicGraph 
                                nodes={INITIAL_NODES} 
                                onNodeSelect={handleNodeSelect}
                                selectedNodeId={selectedNodeId}
                            />
                        </div>
                    </div>
                )}
                
                {(activeTab === 'lineage' || activeTab === 'sim' || activeTab === 'docs' || activeTab === 'settings') && (
                    <div className="flex items-center justify-center h-full flex-col text-slate-600 font-mono text-sm border border-quantum-600 border-dashed rounded-lg bg-quantum-900/30">
                        <Database className="w-12 h-12 mb-4 opacity-50" />
                        <span>[ {activeTab.toUpperCase()} MODULE INITIALIZING... ]</span>
                        <span className="text-xs mt-2 text-slate-700">Waiting for Quantum Core handshake</span>
                    </div>
                )}
            </div>

            {/* Right Control Column */}
            <div className="w-80 flex flex-col space-y-4 shrink-0 transition-all duration-500">
                
                {/* Context-Aware Top Panel */}
                <div className={`${selectedNodeId ? 'h-[60%]' : 'h-[50%]'} transition-all duration-500`}>
                    {selectedNodeId && selectedNode && selectedNodeDetails ? (
                        <NodeInspector 
                            node={selectedNode} 
                            details={selectedNodeDetails} 
                            onClose={() => setSelectedNodeId(null)}
                            onAction={handleInspectorAction}
                        />
                    ) : (
                        <AIOperator addLog={addLog} />
                    )}
                </div>

                {/* Bottom Panel (Logs or collapsed AI) */}
                <div className={`${selectedNodeId ? 'h-[40%]' : 'h-[50%]'} transition-all duration-500`}>
                    {selectedNodeId ? (
                         // If Node Inspector is active, we can show a compacted AI or Logs. Let's show Logs.
                         <ConsoleLogger logs={logs} />
                    ) : (
                         <ConsoleLogger logs={logs} />
                    )}
                </div>

            </div>

        </div>

      </main>

    </div>
  );
};

const SidebarItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  collapsed: boolean;
  onClick: () => void;
}> = ({ icon, label, active, collapsed, onClick }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center p-2.5 my-0.5 rounded-md transition-all duration-200 group relative
      ${active 
        ? 'bg-quantum-800 text-cyan-400 shadow-[inset_3px_0_0_0_#22d3ee]' 
        : 'text-slate-400 hover:bg-quantum-800/50 hover:text-slate-200'
      }
    `}
  >
    <div className={`${active ? 'text-cyan-400' : 'group-hover:text-cyan-200'} transition-colors`}>{icon}</div>
    <span className={`
      ml-3 text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300
      ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}
    `}>
      {label}
    </span>
    {active && !collapsed && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-glow-cyan"></div>
    )}
  </button>
);

export default App;