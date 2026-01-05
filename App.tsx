import React, { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard,
  Network,
  FileText,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  CheckCircle2,
  CircleDashed,
  AlertCircle,
  Database,
  GitBranch,
  PlayCircle,
  Activity,
  Hammer,
  Monitor,
  BarChart2,
  Server,
  Shield,
  CreditCard,
  HelpCircle,
  HardDrive,
  Factory,
  Link2,
  BrainCircuit,
  Eye,
  Lock,
  Fingerprint,
  ArrowRight,
  ShieldAlert,
  Mail,
  Smartphone,
  RefreshCw,
  Unlock,
  Box,
  CheckSquare,
} from "lucide-react";
import { Dashboard } from "./components/Dashboard";
import { ConsoleLogger } from "./components/ConsoleLogger";
import { LogicGraph } from "./components/LogicGraph";
import { AIOperator } from "./components/AIOperator";
import { NodeInspector } from "./components/NodeInspector";
import { EdgeInspector } from "./components/EdgeInspector";
import { Header } from "./components/Header";
import { LineageView } from "./components/LineageView";
import { SimulationView } from "./components/SimulationView";
import { DocumentsView } from "./components/DocumentsView";
import { ConfigurationView } from "./components/ConfigurationView";
import { AnalyticsView } from "./components/AnalyticsView";
import { ResourceView } from "./components/ResourceView";
import { SecurityView } from "./components/SecurityView";
import { BillingView } from "./components/BillingView";
import { SupportView } from "./components/SupportView";
import { AdminView } from "./components/AdminView";
import { ShortcutsModal } from "./components/ShortcutsModal";
import { CriticalErrorModal } from "./components/CriticalErrorModal";
import { BuilderPalette } from "./components/BuilderPalette";
import { JobQueue } from "./components/JobQueue";
import { ManufacturingView } from "./components/ManufacturingView";
import { IntegrationsView } from "./components/IntegrationsView";
import { AIOversightView } from "./components/AIOversightView";
import { LiveFeedView } from "./components/LiveFeedView";
import { UserProfileView } from "./components/UserProfileView";
import { ObjectRegistryView } from "./components/ObjectRegistryView";
import {
  LogEntry,
  LogicNode,
  SystemMetrics,
  ModuleType,
  NodeDetails,
  EdgeDetails,
  SystemModulesState,
  HandshakeState,
} from "./types";

// --- MOCK DATA GENERATORS ---

const INITIAL_NODES_DATA: LogicNode[] = [
  {
    id: "1",
    label: "Main Controller",
    type: ModuleType.LOGIC,
    status: "active",
    x: 0,
    y: 0,
    connections: ["2", "3", "4"],
  },
  {
    id: "2",
    label: "Sensor Array A",
    type: ModuleType.SENSOR,
    status: "active",
    x: 0,
    y: 0,
    connections: ["5"],
  },
  {
    id: "3",
    label: "AI Inference Engine",
    type: ModuleType.AI_CORE,
    status: "active",
    x: 0,
    y: 0,
    connections: ["5", "6"],
  },
  {
    id: "4",
    label: "Safety Protocol",
    type: ModuleType.LOGIC,
    status: "idle",
    x: 0,
    y: 0,
    connections: ["6"],
  },
  {
    id: "5",
    label: "Actuator Drive",
    type: ModuleType.ACTUATOR,
    status: "active",
    x: 0,
    y: 0,
    connections: [],
  },
  {
    id: "6",
    label: "Data Logger",
    type: ModuleType.LOGIC,
    status: "active",
    x: 0,
    y: 0,
    connections: [],
  },
];

const MOCK_NODE_DETAILS: Record<string, NodeDetails> = {
  default: {
    identity: {
      role: "Process Controller",
      category: "Logic Core",
      version: "v2.4.1",
      dependencies: 3,
    },
    metadata: {
      created: "2023-11-15",
      lastModified: "2h ago",
      owner: "Dr. Vance",
    },
    state: {
      lastExecution: "0ms ago",
      health: 99,
      activeThreads: 12,
      uptime: "48h 12m",
    },
    intelligence: {
      optimizationScore: 92,
      prediction: "Nominal throughput expected for next 4 cycles.",
      anomalyProbability: "Low (<0.1%)",
    },
  },
  "3": {
    // AI Engine specific
    identity: {
      role: "Inference Unit",
      category: "Neural Processor",
      version: "v4.0.0-alpha",
      dependencies: 8,
    },
    metadata: {
      created: "2024-01-10",
      lastModified: "10m ago",
      owner: "Sys_Auto",
    },
    state: {
      lastExecution: "Processing...",
      health: 95,
      activeThreads: 128,
      uptime: "12h 05m",
    },
    intelligence: {
      optimizationScore: 88,
      prediction:
        "Suggesting re-allocation of tensor cores for localized workload.",
      anomalyProbability: "Medium (Logic drift detected)",
    },
  },
};

const MOCK_EDGE_DETAILS: Record<string, EdgeDetails> = {
  default: {
    id: "lnk-001",
    source: "Source",
    target: "Target",
    type: "Data Stream",
    status: "active",
    metrics: {
      throughput: "1.2 GB/s",
      latency: "4ms",
      errorRate: "0.001%",
      protocol: "Q-Bus v4",
    },
  },
  "1-3": {
    id: "1-3",
    source: "1",
    target: "3",
    type: "Quantum Link",
    status: "congested",
    metrics: {
      throughput: "45.2 TB/s",
      latency: "0.02ms",
      errorRate: "0%",
      protocol: "Entanglement",
    },
  },
  "2-5": {
    id: "2-5",
    source: "2",
    target: "5",
    type: "Control Signal",
    status: "active",
    metrics: {
      throughput: "12 kb/s",
      latency: "12ms",
      errorRate: "0.1%",
      protocol: "CAN-Bus",
    },
  },
};

const generateMockHistory = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: i,
    stability: 85 + Math.random() * 10,
    throughput: 60 + Math.random() * 30,
    temp: 40 + Math.random() * 20,
  }));
};

// --- COMPONENTS ---

const LockdownOverlay = ({ onUnlock }: { onUnlock: () => void }) => {
  const [step, setStep] = useState<"method" | "sending" | "otp">("method");
  const [otp, setOtp] = useState("");
  const [method, setMethod] = useState<"email" | "sms" | null>(null);
  const [error, setError] = useState(false);

  const handleSendOtp = (selectedMethod: "email" | "sms") => {
    setMethod(selectedMethod);
    setStep("sending");
    // Simulate network delay
    setTimeout(() => {
      setStep("otp");
    }, 2000);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock verification: code must be "123456"
    if (otp === "123456") {
      setError(false);
      onUnlock();
    } else {
      setError(true);
      setOtp("");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-red-950/90 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
      {/* Ambient Red Pulse */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(220,38,38,0.2)_100%)] pointer-events-none animate-pulse"></div>

      {/* Main Alert Box */}
      <div className="w-full max-w-lg bg-black border-2 border-red-600 rounded-lg shadow-[0_0_50px_rgba(220,38,38,0.5)] p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-[pulse_0.5s_infinite]"></div>

        <div className="flex flex-col items-center text-center">
          <div className="p-4 bg-red-900/30 rounded-full border-2 border-red-600 mb-6 animate-bounce">
            <ShieldAlert className="w-12 h-12 text-red-500" />
          </div>

          <h1 className="text-3xl font-black text-red-500 tracking-[0.2em] mb-2 uppercase">
            System Lockdown
          </h1>
          <p className="text-sm text-red-300 mb-8 font-mono">
            Global security protocols engaged. All control surfaces are
            disabled.
            <br />
            Authentication required to restore operations.
          </p>

          {step === "method" && (
            <div className="w-full space-y-3">
              <button
                onClick={() => handleSendOtp("sms")}
                className="w-full flex items-center justify-between px-6 py-4 bg-red-900/20 hover:bg-red-900/40 border border-red-800 hover:border-red-500 rounded group transition-all"
              >
                <div className="flex items-center text-slate-300 group-hover:text-white">
                  <Smartphone className="w-5 h-5 mr-3" />
                  <span className="text-sm font-bold">Send SMS Code</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  ***-***-8842
                </span>
              </button>
              <button
                onClick={() => handleSendOtp("email")}
                className="w-full flex items-center justify-between px-6 py-4 bg-red-900/20 hover:bg-red-900/40 border border-red-800 hover:border-red-500 rounded group transition-all"
              >
                <div className="flex items-center text-slate-300 group-hover:text-white">
                  <Mail className="w-5 h-5 mr-3" />
                  <span className="text-sm font-bold">Send Email Code</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  admin@***.com
                </span>
              </button>
            </div>
          )}

          {step === "sending" && (
            <div className="py-8 flex flex-col items-center">
              <RefreshCw className="w-10 h-10 text-red-500 animate-spin mb-4" />
              <span className="text-xs text-red-300 font-mono tracking-widest uppercase">
                Generating Secure Token...
              </span>
            </div>
          )}

          {step === "otp" && (
            <form
              onSubmit={handleVerify}
              className="w-full animate-in slide-in-from-right-4"
            >
              <div className="mb-6">
                <label className="block text-xs font-bold text-red-400 uppercase mb-2 text-center">
                  Enter 6-Digit Code sent to{" "}
                  {method === "sms" ? "Mobile" : "Email"}
                </label>
                <input
                  type="text"
                  autoFocus
                  maxLength={6}
                  className={`w-full bg-red-950/50 border-2 ${
                    error
                      ? "border-red-500 animate-shake"
                      : "border-red-900 focus:border-red-500"
                  } rounded p-4 text-center text-2xl font-mono text-white tracking-[0.5em] outline-none transition-colors placeholder-red-900/50`}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/[^0-9]/g, ""))
                  }
                />
                {error && (
                  <p className="text-xs text-red-500 mt-2 font-bold text-center">
                    INVALID TOKEN. ACCESS DENIED.
                  </p>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep("method")}
                  className="flex-1 py-3 bg-transparent border border-red-900 text-red-500 text-xs font-bold rounded hover:bg-red-950"
                >
                  BACK
                </button>
                <button
                  type="submit"
                  disabled={otp.length !== 6}
                  className="flex-[2] py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center"
                >
                  <Unlock className="w-4 h-4 mr-2" /> AUTHENTICATE
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="mt-8 font-mono text-xs text-red-900/50">
        SYSTEM ID: Q-OS-742-LCK | SESSION: TERMINATED
      </div>
    </div>
  );
};

import axios from "axios";

const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, SetFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    onLogin();
    // setError(null);
    // try {
    //   const response = await axios.post(
    //     "http://localhost:8000/api/v1/login",
    //     formData
    //   );
    //   console.log(response.data);
    //   if (formData.username !== "" && formData.password !== "") {
    //     if (response.data.success === true) {
    //       setTimeout(() => {
    //         onLogin();
    //       }, 1000);
    //     } else {
    //       setIsLoading(false);
    //       setError("Credentials are incorrect");
    //     }
    //   }
    //   else{
    //     setError("Please fill required details")
    //   }
    // } catch (err) {
    //   setIsLoading(false);
    //   setError("Credentials are incorrect");
    // }
  };

  return (
    <div className="min-h-screen w-full bg-quantum-950 flex items-center justify-center relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>

      <div className="w-full max-w-md bg-quantum-900/80 backdrop-blur-md border border-quantum-600 rounded-2xl p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-cyan-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-glow-cyan">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-widest">
            LOGIC<span className="text-cyan-400">FLOW</span>
          </h1>
          <p className="text-xs text-slate-500 mt-2 font-mono">
            QUANTUM OPERATIONS CONTROL PLANE
          </p>
        </div>
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400 font-mono animate-in fade-in">
            ⚠️ {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="group">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
                Operator ID
              </label>
              <div className="flex items-center bg-quantum-950 border border-quantum-700 rounded-lg px-4 py-3 group-focus-within:border-cyan-500 transition-colors">
                <Fingerprint className="w-5 h-5 text-slate-500 mr-3" />
                <input
                  type="text"
                  defaultValue="OP-742-ALPHA"
                  autoComplete="off"
                  // value={formData.username}
                  // onChange={(e) => {
                  //   SetFormData((prev) => ({
                  //     ...prev,
                  //     username: e.target.value,
                  //   }));
                  //   setError(null);
                  // }}
                  className="bg-transparent border-none text-slate-200 w-full focus:outline-none text-sm font-mono"
                />
              </div>
            </div>
            <div className="group">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
                Access Key
              </label>
              <div className="flex items-center bg-quantum-950 border border-quantum-700 rounded-lg px-4 py-3 group-focus-within:border-cyan-500 transition-colors">
                <Lock className="w-5 h-5 text-slate-500 mr-3" />
                <input
                  type="password"
                  defaultValue="password"
                  autoComplete="off"
                  // value={formData.password}
                  // onChange={(e) => {
                  //   SetFormData((prev) => ({
                  //     ...prev,
                  //     password: e.target.value,
                  //   }));
                  //   setError(null);
                  // }}
                  className="bg-transparent border-none text-slate-200 w-full focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-glow-cyan transition-all transform active:scale-95 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <CircleDashed className="w-5 h-5 mr-2 animate-spin" />{" "}
                AUTHENTICATING...
              </>
            ) : (
              <>
                INITIALIZE SESSION <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button> */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 font-bold rounded-lg transition-all transform active:scale-95 flex items-center justify-center
    ${
      error
        ? "bg-red-600 hover:bg-red-500 shadow-glow-red"
        : "bg-cyan-600 hover:bg-cyan-500 shadow-glow-cyan"
    }
    ${isLoading ? "opacity-80 cursor-not-allowed" : ""}
  `}
          >
            {isLoading ? (
              <>
                <CircleDashed className="w-5 h-5 mr-2 animate-spin" />{" "}
                AUTHENTICATING...
              </>
            ) : (
              <>
                INITIALIZE SESSION <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-quantum-700 text-center">
          <p className="text-[10px] text-slate-600">
            Unauthorized access is a Class A felony under the Quantum Security
            Act of 2032.
            <br />
            System ID: Q-OS-742
          </p>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "logic"
    | "lineage"
    | "sim"
    | "analytics"
    | "manufacturing"
    | "vision"
    | "integrations"
    | "docs"
    | "settings"
    | "resources"
    | "security"
    | "billing"
    | "support"
    | "admin"
    | "oversight"
    | "profile"
    | "registry"
  >("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Graph State
  const [nodes, setNodes] = useState<LogicNode[]>(INITIAL_NODES_DATA);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const [builderMode, setBuilderMode] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [criticalErrorOpen, setCriticalErrorOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [autoArrangeTrigger, setAutoArrangeTrigger] = useState(0);

  // Global Lockdown State
  const [isSystemLocked, setIsSystemLocked] = useState(false);

  // Handshake State
  const [modulesStatus, setModulesStatus] = useState<SystemModulesState>({
    quantumCore: "pending",
    simulation: "pending",
    document: "pending",
    configuration: "pending",
  });

  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpuLoad: 45,
    memoryUsage: 64.2,
    quantumCoherence: 98.2,
    networkLatency: 12,
    activeThreads: 142,
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [history, setHistory] = useState(generateMockHistory());

  // Helper to add logs
  const addLog = useCallback(
    (
      message: string,
      level: LogEntry["level"] = "INFO",
      source: string = "SYS"
    ) => {
      setLogs((prev) => [
        ...prev.slice(-99), // Keep last 100
        {
          id: Math.random().toString(36).substring(7),
          timestamp: new Date().toLocaleTimeString([], { hour12: false }),
          level,
          source,
          message,
        },
      ]);
    },
    []
  );

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // SECURITY CHECK: Disable hotkeys if locked
      if (isSystemLocked) return;

      // Toggle Shortcuts Modal
      if (e.key === "?") {
        setShortcutsOpen((prev) => !prev);
      }
      // Critical Error Test (Shift + !)
      if (e.key === "!" && e.shiftKey) {
        setCriticalErrorOpen(true);
      }
      // Navigation Shortcuts (Shift + Key)
      if (e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case "d":
            setActiveTab("dashboard");
            break;
          case "l":
            setActiveTab("logic");
            break;
          case "s":
            setActiveTab("sim");
            break;
          case "a":
            setActiveTab("analytics");
            break;
        }
      }
      // Escape to close things
      if (e.key === "Escape") {
        if (selectedNodeIds.length > 0 || selectedEdgeId)
          handleCloseInspector();
        setShortcutsOpen(false);
        setCriticalErrorOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNodeIds, selectedEdgeId, isSystemLocked]);

  // Initialization Handshake Sequence
  useEffect(() => {
    if (!isLoggedIn) return;

    const runHandshake = async () => {
      // Step 1: Quantum Core
      setModulesStatus((prev) => ({ ...prev, quantumCore: "loading" }));
      addLog("Initiating handshake with Quantum Core...", "INFO", "INIT");
      await new Promise((r) => setTimeout(r, 2500));
      setModulesStatus((prev) => ({ ...prev, quantumCore: "success" }));
      addLog("Quantum Core connection established.", "SUCCESS", "INIT");

      // Step 2: Simulation Module
      setModulesStatus((prev) => ({ ...prev, simulation: "loading" }));
      addLog("Connecting to Digital Twin simulation engine...", "INFO", "INIT");
      await new Promise((r) => setTimeout(r, 2000));
      setModulesStatus((prev) => ({ ...prev, simulation: "success" }));
      addLog("Simulation module active.", "SUCCESS", "INIT");

      // Step 3 & 4 Parallel: Doc & Config
      setModulesStatus((prev) => ({
        ...prev,
        document: "loading",
        configuration: "loading",
      }));
      await new Promise((r) => setTimeout(r, 1500));
      setModulesStatus((prev) => ({
        ...prev,
        document: "success",
        configuration: "success",
      }));
      addLog(
        "Document and Configuration stores synchronized.",
        "SUCCESS",
        "INIT"
      );
    };

    runHandshake();
  }, [addLog, isLoggedIn]);

  const handleNodeSelect = (nodeId: string, multi: boolean) => {
    if (!nodeId) {
      setSelectedNodeIds([]);
      return;
    }

    if (multi) {
      setSelectedNodeIds((prev) => {
        if (prev.includes(nodeId)) {
          return prev.filter((id) => id !== nodeId);
        }
        return [...prev, nodeId];
      });
    } else {
      setSelectedNodeIds([nodeId]);
    }

    setSelectedEdgeId(null);
    addLog(`Operator selected node ID: ${nodeId}`, "INFO", "UI");
  };

  const handleEdgeSelect = (edgeId: string) => {
    if (!edgeId) {
      setSelectedEdgeId(null);
    } else {
      setSelectedEdgeId(edgeId);
      setSelectedNodeIds([]);
      addLog(`Operator inspected connection: ${edgeId}`, "INFO", "UI");
    }
  };

  const handleCloseInspector = () => {
    setSelectedNodeIds([]);
    setSelectedEdgeId(null);
    addLog("Inspector closed — viewport focus reset.", "INFO", "UI");
  };

  const handleInspectorAction = (action: string) => {
    addLog(
      `Initiating ${action.toUpperCase()} on Node Selection...`,
      "AI",
      "OPS"
    );
  };

  // Grouping Logic
  const handleGroupNodes = () => {
    if (selectedNodeIds.length < 2) return;

    const groupChildren = nodes.filter((n) => selectedNodeIds.includes(n.id));
    const remainingNodes = nodes.filter((n) => !selectedNodeIds.includes(n.id));

    const groupNode: LogicNode = {
      id: `grp-${Date.now()}`,
      label: "Logic Cluster",
      type: ModuleType.GROUP,
      status: "active",
      x: groupChildren[0].x,
      y: groupChildren[0].y,
      connections: [],
      groupChildren: groupChildren,
    };

    // Redirect connections
    // 1. Edges pointing to children from outside -> point to group
    // 2. Edges from children to outside -> point from group
    // Internal edges are effectively hidden inside group children

    const newNodes = remainingNodes.map((n) => {
      const newConnections = n.connections.map((targetId) => {
        if (selectedNodeIds.includes(targetId)) return groupNode.id;
        return targetId;
      });
      // Unique connections
      return { ...n, connections: [...new Set(newConnections)] };
    });

    // Group outgoing connections
    const childOutgoing = new Set<string>();
    groupChildren.forEach((child) => {
      child.connections.forEach((targetId) => {
        if (!selectedNodeIds.includes(targetId)) {
          childOutgoing.add(targetId);
        }
      });
    });
    groupNode.connections = Array.from(childOutgoing);

    setNodes([...newNodes, groupNode]);
    setSelectedNodeIds([groupNode.id]);
    addLog(
      `Grouped ${groupChildren.length} nodes into cluster ${groupNode.id}`,
      "SUCCESS",
      "TOPO"
    );
  };

  const handleUngroupNode = (groupId: string) => {
    const groupNode = nodes.find((n) => n.id === groupId);
    if (!groupNode || !groupNode.groupChildren) return;

    const remainingNodes = nodes.filter((n) => n.id !== groupId);

    // Restore children
    // Need to fix incoming connections that pointed to group -> point to specific children?
    // Simplified: Just dumping them back. In a real system, would need robust edge re-mapping.

    // Restore connections from outside to children is hard without edge state.
    // For visual prototype, we just put children back.

    setNodes([...remainingNodes, ...groupNode.groupChildren]);
    setSelectedNodeIds([]);
    addLog(`Ungrouped cluster ${groupId}`, "INFO", "TOPO");
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    if (!highContrast) {
      document.documentElement.classList.add("contrast-more");
      document.documentElement.style.filter = "contrast(1.5) saturate(0.8)";
      addLog("High Contrast Mode ENABLED", "INFO", "UI");
    } else {
      document.documentElement.classList.remove("contrast-more");
      document.documentElement.style.filter = "";
      addLog("High Contrast Mode DISABLED", "INFO", "UI");
    }
  };

  const handleAutoArrange = () => {
    setAutoArrangeTrigger((prev) => prev + 1);
    addLog("Auto-arrange sequence initiated.", "INFO", "UI");
  };

  // Simulate System Activity
  useEffect(() => {
    if (!isLoggedIn) return;

    const interval = setInterval(() => {
      // Update Metrics
      setMetrics((prev) => ({
        cpuLoad: Math.min(
          100,
          Math.max(0, prev.cpuLoad + (Math.random() - 0.5) * 5)
        ),
        memoryUsage: Math.min(
          128,
          Math.max(40, prev.memoryUsage + (Math.random() - 0.5) * 2)
        ),
        quantumCoherence: Math.min(
          100,
          Math.max(90, prev.quantumCoherence + (Math.random() - 0.5))
        ),
        networkLatency: Math.max(
          1,
          prev.networkLatency + (Math.random() - 0.5) * 2
        ),
        activeThreads: Math.floor(
          prev.activeThreads + (Math.random() - 0.5) * 5
        ),
      }));

      // Update History
      setHistory((prev) => [
        ...prev.slice(1),
        {
          time: prev[prev.length - 1].time + 1,
          stability: 85 + Math.random() * 10,
          throughput: 60 + Math.random() * 30,
          temp: 40 + Math.random() * 20,
        },
      ]);

      // Random Logs
      if (Math.random() > 0.8) {
        const messages = [
          "Optimizing qubit states in sector 4...",
          "Garbage collection triggered on Node 3.",
          "Incoming telemetry stream verified.",
          "Logic Gate 7 re-calibrated.",
          "Cooling system nominal.",
        ];
        addLog(
          messages[Math.floor(Math.random() * messages.length)],
          "INFO",
          "AUTO"
        );
      }
      if (Math.random() > 0.98) {
        addLog("Minor fluctuation detected in power grid.", "WARN", "PWR");
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [addLog, isLoggedIn]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSidebarOpen(true);
    setActiveTab("dashboard");
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  // Derived state for inspector
  const primaryNodeId =
    selectedNodeIds.length === 1 ? selectedNodeIds[0] : null;
  const selectedNode = primaryNodeId
    ? nodes.find((n) => n.id === primaryNodeId)
    : null;
  const selectedNodeDetails = selectedNode
    ? MOCK_NODE_DETAILS[selectedNode.id] || MOCK_NODE_DETAILS["default"]
    : null;

  const selectedEdgeDetails = selectedEdgeId
    ? MOCK_EDGE_DETAILS[selectedEdgeId] || {
        ...MOCK_EDGE_DETAILS["default"],
        id: selectedEdgeId,
        source: selectedEdgeId.split("-")[0],
        target: selectedEdgeId.split("-")[1],
      }
    : null;

  // Helper component for Module Loading State
  const ModulePlaceholder = ({
    label,
    status,
  }: {
    label: string;
    status: HandshakeState;
  }) => {
    if (status === "success") return null; // Should be replaced by parent logic
    return (
      <div className="flex items-center justify-center h-full flex-col text-slate-600 font-mono text-sm border border-quantum-600 border-dashed rounded-lg bg-quantum-900/30">
        {status === "failure" ? (
          <>
            <AlertCircle className="w-12 h-12 mb-4 text-red-500 opacity-80" />
            <span className="text-red-400">MODULE INITIALIZATION FAILED</span>
            <button className="mt-4 px-3 py-1 bg-quantum-800 text-xs border border-quantum-600 rounded hover:text-slate-200">
              Retry Handshake
            </button>
          </>
        ) : (
          <>
            <Database className="w-12 h-12 mb-4 opacity-50 animate-pulse" />
            <span>[ {label.toUpperCase()} MODULE INITIALIZING... ]</span>
            <span className="text-xs mt-2 text-slate-700">
              Waiting for Quantum Core handshake
            </span>
          </>
        )}
      </div>
    );
  };

  console.log(
    "document.body.scrollHeight > window.innerHeight",
    document.body.scrollHeight > window.innerHeight
  );

  return (
    <div className="flex h-screen w-full bg-quantum-950 text-slate-300 font-sans overflow-hidden relative">
      {/* Global Lockdown Overlay */}
      {isSystemLocked && (
        <LockdownOverlay
          onUnlock={() => {
            setIsSystemLocked(false);
            addLog(
              "System lockdown lifted by authorized user.",
              "SUCCESS",
              "SEC"
            );
          }}
        />
      )}

      {/* Background ambient effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[100px]" />
      </div>

      {/* Global Modals */}
      <ShortcutsModal
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />
      <CriticalErrorModal
        isOpen={criticalErrorOpen}
        onClose={() => setCriticalErrorOpen(false)}
      />

      {/* APPLICATION CONTENT CONTAINER (Protected by inert/blur when locked) */}
      <div
        className={`flex flex-1 h-full overflow-hidden transition-all duration-500 ${
          isSystemLocked
            ? "blur-sm grayscale pointer-events-none select-none opacity-50"
            : ""
        }`}
      >
        {/* Sidebar */}
        <aside
          className={`
              flex flex-col bg-quantum-900 border-r border-quantum-600 transition-all duration-300 z-30 shadow-xl
              ${sidebarOpen ? "w-64" : "w-16"}
            `}
        >
          <div className="h-16 flex items-center px-4 border-b border-quantum-600 bg-quantum-900 shrink-0">
            <Activity className="w-6 h-6 text-cyan-400 shrink-0" />
            <span
              className={`ml-3 font-bold tracking-widest text-slate-100 transition-opacity duration-300 ${
                !sidebarOpen && "opacity-0 hidden"
              }`}
            >
              LOGIC<span className="text-cyan-400">FLOW</span>
            </span>
          </div>

          <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto custom-scrollbar">
            <div className="mb-4">
              {sidebarOpen && (
                <div className="px-3 mb-2 text-[10px] font-mono text-slate-500 uppercase">
                  Operations
                </div>
              )}
              <SidebarItem
                icon={<LayoutDashboard />}
                label="Dashboard"
                active={activeTab === "dashboard"}
                onClick={() => setActiveTab("dashboard")}
                collapsed={!sidebarOpen}
              />
              <SidebarItem
                icon={<Factory />}
                label="Manufacturing"
                active={activeTab === "manufacturing"}
                onClick={() => setActiveTab("manufacturing")}
                collapsed={!sidebarOpen}
              />
              <SidebarItem
                icon={<Eye />}
                label="Vision & Cameras"
                active={activeTab === "vision"}
                onClick={() => setActiveTab("vision")}
                collapsed={!sidebarOpen}
              />
              <SidebarItem
                icon={<Network />}
                label="Logic Topology"
                active={activeTab === "logic"}
                onClick={() => setActiveTab("logic")}
                collapsed={!sidebarOpen}
              />
              <SidebarItem
                icon={<Server />}
                label="Infrastructure"
                active={activeTab === "resources"}
                onClick={() => setActiveTab("resources")}
                collapsed={!sidebarOpen}
              />
            </div>

            <div className="mb-4">
              {sidebarOpen && (
                <div className="px-3 mb-2 text-[10px] font-mono text-slate-500 uppercase">
                  Analytics
                </div>
              )}
              <SidebarItem
                icon={<GitBranch />}
                label="Data Lineage"
                active={activeTab === "lineage"}
                onClick={() => setActiveTab("lineage")}
                collapsed={!sidebarOpen}
              />
              <SidebarItem
                icon={<PlayCircle />}
                label="Simulation"
                active={activeTab === "sim"}
                onClick={() => setActiveTab("sim")}
                collapsed={!sidebarOpen}
              />
              <SidebarItem
                icon={<BarChart2 />}
                label="Analytics & Reports"
                active={activeTab === "analytics"}
                onClick={() => setActiveTab("analytics")}
                collapsed={!sidebarOpen}
              />
            </div>

            <div className="mb-4">
              {sidebarOpen && (
                <div className="px-3 mb-2 text-[10px] font-mono text-slate-500 uppercase">
                  Governance
                </div>
              )}
              <SidebarItem
                icon={<BrainCircuit />}
                label="AI Oversight"
                active={activeTab === "oversight"}
                onClick={() => setActiveTab("oversight")}
                collapsed={!sidebarOpen}
              />
              <SidebarItem
                icon={<Shield />}
                label="Security & Access"
                active={activeTab === "security"}
                onClick={() => setActiveTab("security")}
                collapsed={!sidebarOpen}
              />
              <SidebarItem
                icon={<CreditCard />}
                label="Billing & Plan"
                active={activeTab === "billing"}
                onClick={() => setActiveTab("billing")}
                collapsed={!sidebarOpen}
              />
              <SidebarItem
                icon={<HardDrive />}
                label="System Admin"
                active={activeTab === "admin"}
                onClick={() => setActiveTab("admin")}
                collapsed={!sidebarOpen}
              />
            </div>

            <div className="mb-4">
              {sidebarOpen && (
                <div className="px-3 mb-2 text-[10px] font-mono text-slate-500 uppercase">
                  System
                </div>
              )}
              <SidebarItem
                icon={<Box />}
                label="Object Registry"
                active={activeTab === "registry"}
                onClick={() => setActiveTab("registry")}
                collapsed={!sidebarOpen}
              />
              <SidebarItem
                icon={<Link2 />}
                label="Integrations"
                active={activeTab === "integrations"}
                onClick={() => setActiveTab("integrations")}
                collapsed={!sidebarOpen}
              />
              <SidebarItem
                icon={<HelpCircle />}
                label="Help & Support"
                active={activeTab === "support"}
                onClick={() => setActiveTab("support")}
                collapsed={!sidebarOpen}
              />
              <SidebarItem
                icon={<FileText />}
                label="Documentation"
                active={activeTab === "docs"}
                onClick={() => setActiveTab("docs")}
                collapsed={!sidebarOpen}
              />
              <SidebarItem
                icon={<Settings />}
                label="Configuration"
                active={activeTab === "settings"}
                onClick={() => setActiveTab("settings")}
                collapsed={!sidebarOpen}
              />
            </div>
          </nav>

          {/* Sidebar Toggle */}
          <div className="p-4 border-t border-quantum-600 shrink-0 flex justify-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-8 h-8 flex items-center justify-center rounded bg-quantum-800 hover:bg-quantum-700 text-slate-400 hover:text-cyan-400 border border-quantum-700 hover:border-cyan-500/30 transition-all shadow-sm"
              title="Toggle Sidebar"
            >
              {sidebarOpen ? (
                <ChevronsLeft className="w-4 h-4" />
              ) : (
                <ChevronsRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 relative z-10 bg-quantum-950/50 h-full overflow-hidden">
          {/* Initialization Banner */}
          {Object.values(modulesStatus).some((s) => s !== "success") && (
            <div className="h-8 bg-quantum-900 border-b border-quantum-600 flex items-center justify-between px-4 shrink-0">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider animate-pulse">
                Lineage Module Initializing...
              </span>
              <div className="flex space-x-4">
                <StatusStep
                  label="Quantum Core"
                  status={modulesStatus.quantumCore}
                />
                <StatusStep
                  label="Simulation"
                  status={modulesStatus.simulation}
                />
                <StatusStep label="Document" status={modulesStatus.document} />
                <StatusStep
                  label="Configuration"
                  status={modulesStatus.configuration}
                />
              </div>
            </div>
          )}

          {/* Header */}
          <Header
            onToggleContrast={toggleHighContrast}
            onNavigate={(tab) => setActiveTab(tab as any)}
            onLogout={handleLogout}
          />

          {/* Dynamic Viewport */}
          <div className="flex-1 flex overflow-hidden p-4 gap-4">
            {/* Center/Main Stage */}
            <div className="flex-1 flex flex-col min-w-0 bg-transparent rounded-lg overflow-hidden relative">
              {/* View Content */}
              {activeTab === "dashboard" && (
                <Dashboard metrics={metrics} history={history} />
              )}

              {activeTab === "logic" && (
                <div className="flex-1 flex flex-col h-full">
                  <div className="flex justify-between items-center mb-4 shrink-0">
                    <div className="flex items-center space-x-2">
                      <Network className="w-5 h-5 text-cyan-400" />
                      <h2 className="text-lg font-bold text-slate-200">
                        Logic Topology
                      </h2>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setBuilderMode(!builderMode)}
                        className={`px-3 py-1 text-xs font-mono rounded border transition-colors flex items-center ${
                          builderMode
                            ? "bg-cyan-900/50 border-cyan-500 text-cyan-300"
                            : "bg-quantum-800 border-quantum-600 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {builderMode ? (
                          <Hammer className="w-3 h-3 mr-2" />
                        ) : (
                          <Monitor className="w-3 h-3 mr-2" />
                        )}
                        {builderMode ? "BUILDER MODE" : "VIEWER MODE"}
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
                        nodes={nodes}
                        onNodeSelect={handleNodeSelect}
                        onEdgeSelect={handleEdgeSelect}
                        selectedNodeIds={selectedNodeIds}
                        selectedEdgeId={selectedEdgeId}
                        builderMode={builderMode}
                        layoutTrigger={autoArrangeTrigger}
                        onUngroup={handleUngroupNode}
                      />
                    </div>
                  </div>
                  {/* Global Job Queue Panel - Pinned to bottom of Logic View */}
                  <JobQueue />
                </div>
              )}

              {activeTab === "lineage" &&
                (modulesStatus.document === "success" &&
                modulesStatus.quantumCore === "success" ? (
                  <LineageView modulesStatus={modulesStatus} />
                ) : (
                  <ModulePlaceholder
                    label="Lineage"
                    status={
                      modulesStatus.document === "loading" ||
                      modulesStatus.quantumCore === "loading"
                        ? "loading"
                        : "pending"
                    }
                  />
                ))}

              {activeTab === "sim" &&
                (modulesStatus.simulation === "success" ? (
                  <SimulationView />
                ) : (
                  <ModulePlaceholder
                    label="Simulation"
                    status={modulesStatus.simulation}
                  />
                ))}

              {activeTab === "analytics" && <AnalyticsView />}
              {activeTab === "resources" && <ResourceView />}
              {activeTab === "oversight" && <AIOversightView />}
              {activeTab === "vision" && <LiveFeedView />}
              {activeTab === "security" && (
                <SecurityView
                  isSystemLocked={isSystemLocked}
                  onToggleLockdown={(locked) => {
                    setIsSystemLocked(locked);
                    addLog(
                      locked
                        ? "System entered LOCKDOWN mode."
                        : "System lockdown released.",
                      locked ? "WARN" : "INFO",
                      "SEC"
                    );
                  }}
                />
              )}
              {activeTab === "billing" && <BillingView />}
              {activeTab === "support" && <SupportView />}
              {activeTab === "admin" && <AdminView />}
              {activeTab === "manufacturing" && <ManufacturingView />}
              {activeTab === "integrations" && <IntegrationsView />}
              {activeTab === "profile" && <UserProfileView />}
              {activeTab === "registry" && <ObjectRegistryView />}

              {activeTab === "docs" &&
                (modulesStatus.document === "success" ? (
                  <DocumentsView />
                ) : (
                  <ModulePlaceholder
                    label="Documents"
                    status={modulesStatus.document}
                  />
                ))}

              {activeTab === "settings" &&
                (modulesStatus.configuration === "success" ? (
                  <ConfigurationView />
                ) : (
                  <ModulePlaceholder
                    label="Configuration"
                    status={modulesStatus.configuration}
                  />
                ))}
            </div>

            {/* Right Control Column */}
            <div className="w-80 flex flex-col space-y-4 shrink-0">
              {/* Context-Aware Top Panel - uses fixed heights to avoid layout thrashing */}
              <div className="h-[300px] shrink-0 transition-all duration-300 ease-in-out">
                {selectedNodeIds.length > 0 ? (
                  <NodeInspector
                    node={selectedNode}
                    details={selectedNodeDetails}
                    modulesStatus={modulesStatus}
                    selectedNodeIds={selectedNodeIds}
                    onClose={handleCloseInspector}
                    onAction={handleInspectorAction}
                    onGroup={handleGroupNodes}
                    onLogAction={(msg, type) =>
                      addLog(msg, type === "success" ? "SUCCESS" : "INFO", "UI")
                    }
                  />
                ) : selectedEdgeId && selectedEdgeDetails ? (
                  <EdgeInspector
                    edge={selectedEdgeDetails}
                    onClose={handleCloseInspector}
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
    </div>
  );
};

const StatusStep = ({
  label,
  status,
}: {
  label: string;
  status: HandshakeState;
}) => (
  <div className="flex items-center space-x-1.5 opacity-80">
    {status === "success" ? (
      <CheckCircle2 className="w-3 h-3 text-quantum-success" />
    ) : status === "loading" ? (
      <CircleDashed className="w-3 h-3 text-cyan-400 animate-spin" />
    ) : (
      <div className="w-3 h-3 rounded-full border border-slate-600"></div>
    )}
    <span
      className={`text-[10px] font-mono ${
        status === "success" ? "text-slate-300" : "text-slate-500"
      }`}
    >
      {label}
    </span>
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
      ${
        active
          ? "bg-quantum-800 text-cyan-400 shadow-[inset_3px_0_0_0_#22d3ee]"
          : "text-slate-400 hover:bg-quantum-800/50 hover:text-slate-200"
      }
    `}
  >
    <div
      className={`${
        active ? "text-cyan-400" : "group-hover:text-cyan-200"
      } transition-colors`}
    >
      {icon}
    </div>
    <span
      className={`
      ml-3 text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300
      ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}
    `}
    >
      {label}
    </span>
    {active && !collapsed && (
      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-glow-cyan"></div>
    )}
  </button>
);

export default App;
