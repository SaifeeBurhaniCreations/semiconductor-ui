import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, Network, FileText, Settings, 
  ChevronsLeft, ChevronsRight, CheckCircle2, CircleDashed, AlertCircle, Database, GitBranch, PlayCircle, Activity,
  Hammer, Monitor, BarChart2, Server, Shield, CreditCard, HelpCircle, HardDrive, Factory, Link2, BrainCircuit, Eye
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { ConsoleLogger } from './components/ConsoleLogger';
import { LogicGraph } from './components/LogicGraph';
import { AIOperator } from './components/AIOperator';
import { NodeInspector } from './components/NodeInspector';
import { Header } from './components/Header';
import { LineageView } from './components/LineageView';
import { SimulationView } from './components/SimulationView';
import { DocumentsView } from './components/DocumentsView';
import { ConfigurationView } from './components/ConfigurationView';
import { AnalyticsView } from './components/AnalyticsView';
import { ResourceView } from './components/ResourceView';
import { SecurityView } from './components/SecurityView';
import { BillingView } from './components/BillingView';
import { SupportView } from './components/SupportView';
import { AdminView } from './components/AdminView';
import { ShortcutsModal } from './components/ShortcutsModal';
import { CriticalErrorModal } from './components/CriticalErrorModal';
import { BuilderPalette } from './components/BuilderPalette';
import { JobQueue } from './components/JobQueue';
import { ManufacturingView } from './components/ManufacturingView';
import { IntegrationsView } from './components/IntegrationsView';
import { AIOversightView } from './components/AIOversightView';
import { LiveFeedView } from './components/LiveFeedView';
import { LogEntry, LogicNode, SystemMetrics, ModuleType, NodeDetails, SystemModulesState, HandshakeState } from './types';

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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'logic' | 'lineage' | 'sim' | 'analytics' | 'manufacturing' | 'vision' | 'integrations' | 'docs' | 'settings' | 'resources' | 'security' | 'billing' | 'support' | 'admin' | 'oversight'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [builderMode, setBuilderMode] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [criticalErrorOpen, setCriticalErrorOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [autoArrangeTrigger, setAutoArrangeTrigger] = useState(0); // State for auto-arrange
  
  // Handshake State
  const [modulesStatus, setModulesStatus] = useState<SystemModulesState>({
      quantumCore: 'pending',
      simulation: 'pending',
      document: 'pending',
      configuration: 'pending'
  });

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

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        // Toggle Shortcuts Modal
        if (e.key === '?') {
            setShortcutsOpen(prev => !prev);
        }
        // Critical Error Test (Shift + !)
        if (e.key === '!' && e.shiftKey) {
            setCriticalErrorOpen(true);
        }
        // Navigation Shortcuts (Shift + Key)
        if (e.shiftKey) {
            switch(e.key.toLowerCase()) {
                case 'd': setActiveTab('dashboard'); break;
                case 'l': setActiveTab('logic'); break;
                case 's': setActiveTab('sim'); break;
                case 'a': setActiveTab('analytics'); break;
            }
        }
        // Escape to close things
        if (e.key === 'Escape') {
            if (selectedNodeId) handleCloseNodeInspector();
            setShortcutsOpen(false);
            setCriticalErrorOpen(false);
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId]);

  // Initialization Handshake Sequence
  useEffect(() => {
    const runHandshake = async () => {
        // Step 1: Quantum Core
        setModulesStatus(prev => ({...prev, quantumCore: 'loading'}));
        addLog('Initiating handshake with Quantum Core...', 'INFO', 'INIT');
        await new Promise(r => setTimeout(r, 2500));
        setModulesStatus(prev => ({...prev, quantumCore: 'success'}));
        addLog('Quantum Core connection established.', 'SUCCESS', 'INIT');

        // Step 2: Simulation Module
        setModulesStatus(prev => ({...prev, simulation: 'loading'}));
        addLog('Connecting to Digital Twin simulation engine...', 'INFO', 'INIT');
        await new Promise(r => setTimeout(r, 2000));
        setModulesStatus(prev => ({...prev, simulation: 'success'}));
        addLog('Simulation module active.', 'SUCCESS', 'INIT');

        // Step 3 & 4 Parallel: Doc & Config
        setModulesStatus(prev => ({...prev, document: 'loading', configuration: 'loading'}));
        await new Promise(r => setTimeout(r, 1500));
        setModulesStatus(prev => ({...prev, document: 'success', configuration: 'success'}));
        addLog('Document and Configuration stores synchronized.', 'SUCCESS', 'INIT');
    };
    
    runHandshake();
  }, [addLog]);

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    addLog(`Operator selected node ID: ${nodeId}`, 'INFO', 'UI');
  };

  const handleCloseNodeInspector = () => {
      setSelectedNodeId(null);
      // Req 16: UI Recovery Microcopy
      addLog('Node view closed — topology reset in safe mode.', 'INFO', 'UI');
      addLog('Restoring viewport alignment...', 'INFO', 'SYS');
  };

  const handleInspectorAction = (action: string) => {
    addLog(`Initiating ${action.toUpperCase()} on Node ${selectedNodeId}...`, 'AI', 'OPS');
  };

  const toggleHighContrast = () => {
      setHighContrast(!highContrast);
      if (!highContrast) {
          document.documentElement.classList.add('contrast-more');
          document.documentElement.style.filter = "contrast(1.5) saturate(0.8)";
          addLog('High Contrast Mode ENABLED', 'INFO', 'UI');
      } else {
          document.documentElement.classList.remove('contrast-more');
          document.documentElement.style.filter = "";
          addLog('High Contrast Mode DISABLED', 'INFO', 'UI');
      }
  };

  const handleAutoArrange = () => {
      setAutoArrangeTrigger(prev => prev + 1);
      addLog('Auto-arrange sequence initiated.', 'INFO', 'UI');
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

  // Helper component for Module Loading State
  const ModulePlaceholder = ({ label, status }: { label: string, status: HandshakeState }) => {
      if (status === 'success') return null; // Should be replaced by parent logic
      return (
        <div className="flex items-center justify-center h-full flex-col text-slate-600 font-mono text-sm border border-quantum-600 border-dashed rounded-lg bg-quantum-900/30">
            {status === 'failure' ? (
                <>
                   <AlertCircle className="w-12 h-12 mb-4 text-red-500 opacity-80" />
                   <span className="text-red-400">MODULE INITIALIZATION FAILED</span>
                   <button className="mt-4 px-3 py-1 bg-quantum-800 text-xs border border-quantum-600 rounded hover:text-slate-200">Retry Handshake</button>
                </>
            ) : (
                <>
                    <Database className="w-12 h-12 mb-4 opacity-50 animate-pulse" />
                    <span>[ {label.toUpperCase()} MODULE INITIALIZING... ]</span>
                    <span className="text-xs mt-2 text-slate-700">Waiting for Quantum Core handshake</span>
                </>
            )}
        </div>
      );
  };

  return (
    <div className="flex h-screen w-full bg-quantum-950 text-slate-300 font-sans overflow-hidden relative">
      
      {/* Background ambient effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Global Modals */}
      <ShortcutsModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      <CriticalErrorModal isOpen={criticalErrorOpen} onClose={() => setCriticalErrorOpen(false)} />

      {/* Sidebar */}
      <aside 
        className={`
          flex flex-col bg-quantum-900 border-r border-quantum-600 transition-all duration-300 z-30 shadow-xl
          ${sidebarOpen ? 'w-64' : 'w-16'}
        `}
      >
        <div className="h-16 flex items-center px-4 border-b border-quantum-600 bg-quantum-900 shrink-0">
          <Activity className="w-6 h-6 text-cyan-400 shrink-0" />
          <span className={`ml-3 font-bold tracking-widest text-slate-100 transition-opacity duration-300 ${!sidebarOpen && 'opacity-0 hidden'}`}>
            LOGIC<span className="text-cyan-400">FLOW</span>
          </span>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto custom-scrollbar">
          <div className="mb-4">
             {sidebarOpen && <div className="px-3 mb-2 text-[10px] font-mono text-slate-500 uppercase">Operations</div>}
             <SidebarItem icon={<LayoutDashboard />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} collapsed={!sidebarOpen} />
             <SidebarItem icon={<Factory />} label="Manufacturing" active={activeTab === 'manufacturing'} onClick={() => setActiveTab('manufacturing')} collapsed={!sidebarOpen} />
             <SidebarItem icon={<Eye />} label="Vision & Cameras" active={activeTab === 'vision'} onClick={() => setActiveTab('vision')} collapsed={!sidebarOpen} />
             <SidebarItem icon={<Network />} label="Logic Topology" active={activeTab === 'logic'} onClick={() => setActiveTab('logic')} collapsed={!sidebarOpen} />
             <SidebarItem icon={<Server />} label="Infrastructure" active={activeTab === 'resources'} onClick={() => setActiveTab('resources')} collapsed={!sidebarOpen} />
          </div>

          <div className="mb-4">
             {sidebarOpen && <div className="px-3 mb-2 text-[10px] font-mono text-slate-500 uppercase">Analytics</div>}
             <SidebarItem icon={<GitBranch />} label="Data Lineage" active={activeTab === 'lineage'} onClick={() => setActiveTab('lineage')} collapsed={!sidebarOpen} />
             <SidebarItem icon={<PlayCircle />} label="Simulation" active={activeTab === 'sim'} onClick={() => setActiveTab('sim')} collapsed={!sidebarOpen} />
             <SidebarItem icon={<BarChart2 />} label="Analytics & Reports" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} collapsed={!sidebarOpen} />
          </div>

          <div className="mb-4">
             {sidebarOpen && <div className="px-3 mb-2 text-[10px] font-mono text-slate-500 uppercase">Governance</div>}
             <SidebarItem icon={<BrainCircuit />} label="AI Oversight" active={activeTab === 'oversight'} onClick={() => setActiveTab('oversight')} collapsed={!sidebarOpen} />
             <SidebarItem icon={<Shield />} label="Security & Access" active={activeTab === 'security'} onClick={() => setActiveTab('security')} collapsed={!sidebarOpen} />
             <SidebarItem icon={<CreditCard />} label="Billing & Plan" active={activeTab === 'billing'} onClick={() => setActiveTab('billing')} collapsed={!sidebarOpen} />
             <SidebarItem icon={<HardDrive />} label="System Admin" active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} collapsed={!sidebarOpen} />
          </div>

          <div className="mb-4">
             {sidebarOpen && <div className="px-3 mb-2 text-[10px] font-mono text-slate-500 uppercase">System</div>}
             <SidebarItem icon={<Link2 />} label="Integrations" active={activeTab === 'integrations'} onClick={() => setActiveTab('integrations')} collapsed={!sidebarOpen} />
             <SidebarItem icon={<HelpCircle />} label="Help & Support" active={activeTab === 'support'} onClick={() => setActiveTab('support')} collapsed={!sidebarOpen} />
             <SidebarItem icon={<FileText />} label="Documentation" active={activeTab === 'docs'} onClick={() => setActiveTab('docs')} collapsed={!sidebarOpen} />
             <SidebarItem icon={<Settings />} label="Configuration" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} collapsed={!sidebarOpen} />
          </div>
        </nav>

        {/* Sidebar Toggle */}
        <div className="p-4 border-t border-quantum-600 shrink-0 flex justify-center">
            <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-8 h-8 flex items-center justify-center rounded bg-quantum-800 hover:bg-quantum-700 text-slate-400 hover:text-cyan-400 border border-quantum-700 hover:border-cyan-500/30 transition-all shadow-sm"
                title="Toggle Sidebar"
            >
                {sidebarOpen ? <ChevronsLeft className="w-4 h-4" /> : <ChevronsRight className="w-4 h-4" />}
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10 bg-quantum-950/50 h-full overflow-hidden">
        
        {/* Initialization Banner */}
        {Object.values(modulesStatus).some(s => s !== 'success') && (
            <div className="h-8 bg-quantum-900 border-b border-quantum-600 flex items-center justify-between px-4 shrink-0">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider animate-pulse">Lineage Module Initializing...</span>
                <div className="flex space-x-4">
                    <StatusStep label="Quantum Core" status={modulesStatus.quantumCore} />
                    <StatusStep label="Simulation" status={modulesStatus.simulation} />
                    <StatusStep label="Document" status={modulesStatus.document} />
                    <StatusStep label="Configuration" status={modulesStatus.configuration} />
                </div>
            </div>
        )}

        {/* Header */}
        <Header onToggleContrast={toggleHighContrast} />

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
                                <button 
                                    onClick={() => setBuilderMode(!builderMode)}
                                    className={`px-3 py-1 text-xs font-mono rounded border transition-colors flex items-center ${builderMode ? 'bg-cyan-900/50 border-cyan-500 text-cyan-300' : 'bg-quantum-800 border-quantum-600 text-slate-400 hover:text-slate-200'}`}
                                >
                                    {builderMode ? <Hammer className="w-3 h-3 mr-2" /> : <Monitor className="w-3 h-3 mr-2" />}
                                    {builderMode ? 'BUILDER MODE' : 'VIEWER MODE'}
                                </button>
                                <button 
                                    onClick={handleAutoArrange}
                                    className="px-3 py-1 bg-quantum-800 hover:bg-quantum-700 text-xs font-mono rounded text-slate-300 border border-quantum-600 transition-colors"
                                >
                                    AUTO-ARRANGE
                                </button>
                             </div>
                        </div>
                        <div className="flex-1 flex relative overflow-hidden">
                            {builderMode && <BuilderPalette />}
                            <div className="flex-1 relative">
                                <LogicGraph 
                                    nodes={INITIAL_NODES} 
                                    onNodeSelect={handleNodeSelect}
                                    selectedNodeId={selectedNodeId}
                                    builderMode={builderMode}
                                    layoutTrigger={autoArrangeTrigger}
                                />
                            </div>
                        </div>
                        {/* Global Job Queue Panel - Pinned to bottom of Logic View */}
                        <JobQueue />
                    </div>
                )}
                
                {activeTab === 'lineage' && (
                    modulesStatus.document === 'success' && modulesStatus.quantumCore === 'success' 
                    ? <LineageView modulesStatus={modulesStatus} /> 
                    : <ModulePlaceholder label="Lineage" status={modulesStatus.document === 'loading' || modulesStatus.quantumCore === 'loading' ? 'loading' : 'pending'} />
                )}

                {activeTab === 'sim' && (
                    modulesStatus.simulation === 'success' 
                    ? <SimulationView /> 
                    : <ModulePlaceholder label="Simulation" status={modulesStatus.simulation} />
                )}

                {activeTab === 'analytics' && <AnalyticsView />}
                {activeTab === 'resources' && <ResourceView />}
                {activeTab === 'oversight' && <AIOversightView />}
                {activeTab === 'vision' && <LiveFeedView />}
                {activeTab === 'security' && <SecurityView />}
                {activeTab === 'billing' && <BillingView />}
                {activeTab === 'support' && <SupportView />}
                {activeTab === 'admin' && <AdminView />}
                {activeTab === 'manufacturing' && <ManufacturingView />}
                {activeTab === 'integrations' && <IntegrationsView />}

                {activeTab === 'docs' && (
                    modulesStatus.document === 'success' 
                    ? <DocumentsView /> 
                    : <ModulePlaceholder label="Documents" status={modulesStatus.document} />
                )}

                {activeTab === 'settings' && (
                    modulesStatus.configuration === 'success' 
                    ? <ConfigurationView /> 
                    : <ModulePlaceholder label="Configuration" status={modulesStatus.configuration} />
                )}

            </div>

            {/* Right Control Column */}
            <div className="w-80 flex flex-col space-y-4 shrink-0">
                
                {/* Context-Aware Top Panel - uses fixed heights to avoid layout thrashing */}
                <div className="h-[300px] shrink-0 transition-all duration-300 ease-in-out">
                    {selectedNodeId && selectedNode && selectedNodeDetails ? (
                        <NodeInspector 
                            node={selectedNode} 
                            details={selectedNodeDetails}
                            modulesStatus={modulesStatus}
                            onClose={handleCloseNodeInspector}
                            onAction={handleInspectorAction}
                        />
                    ) : (
                        <AIOperator addLog={addLog} />
                    )}
                </div>

                {/* Bottom Panel (Logs) */}
                <div className="flex-1 min-h-0">
                    <ConsoleLogger logs={logs} />
                </div>

            </div>

        </div>

      </main>

    </div>
  );
};

const StatusStep = ({ label, status }: { label: string, status: HandshakeState }) => (
    <div className="flex items-center space-x-1.5 opacity-80">
        {status === 'success' ? <CheckCircle2 className="w-3 h-3 text-quantum-success" /> : 
         status === 'loading' ? <CircleDashed className="w-3 h-3 text-cyan-400 animate-spin" /> :
         <div className="w-3 h-3 rounded-full border border-slate-600"></div>}
        <span className={`text-[10px] font-mono ${status === 'success' ? 'text-slate-300' : 'text-slate-500'}`}>{label}</span>
    </div>
);

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