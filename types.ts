
export enum SystemStatus {
  OPERATIONAL = 'OPERATIONAL',
  OPTIMIZING = 'OPTIMIZING',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
  OFFLINE = 'OFFLINE'
}

export enum ModuleType {
  LOGIC = 'LOGIC_NODE',
  SENSOR = 'SENSOR_INPUT',
  ACTUATOR = 'ACTUATOR_OUTPUT',
  AI_CORE = 'AI_PROCESSING',
  GROUP = 'GROUP_NODE' 
}

export type HandshakeState = 'pending' | 'loading' | 'success' | 'failure';

export interface SystemModulesState {
  quantumCore: HandshakeState;
  simulation: HandshakeState;
  document: HandshakeState;
  configuration: HandshakeState;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS' | 'AI';
  source: string;
  message: string;
}

export interface LogicNode {
  id: string;
  label: string;
  type: ModuleType;
  status: 'active' | 'idle' | 'error';
  x?: number; // For visualization
  y?: number; // For visualization
  connections: string[]; // IDs of connected nodes
  groupChildren?: LogicNode[]; // For grouped nodes
  internalEdges?: string[]; // Store edge info when grouped
}

// New interface for detailed node inspection
export interface NodeDetails {
  identity: {
    role: string;
    category: string;
    version: string;
    dependencies: number;
  };
  metadata: {
    created: string;
    lastModified: string;
    owner: string;
  };
  state: {
    lastExecution: string;
    health: number; // 0-100
    activeThreads: number;
    uptime: string;
  };
  intelligence: {
    optimizationScore: number;
    prediction: string;
    anomalyProbability: string;
  };
}

export interface EdgeDetails {
  id: string;
  source: string;
  target: string;
  type: 'Data Stream' | 'Control Signal' | 'Power' | 'Quantum Link';
  metrics: {
    throughput: string;
    latency: string;
    errorRate: string;
    protocol: string;
  };
  status: 'active' | 'congested' | 'idle';
}

export interface SystemMetrics {
  cpuLoad: number;
  memoryUsage: number;
  quantumCoherence: number;
  networkLatency: number;
  activeThreads: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
}

// --- Production Object System Types ---

export type ProductionObjectCategory = 'Product' | 'Process' | 'Machine' | 'Sensor' | 'AI_Action';

export interface ProductionObjectDefinition {
  id: string;
  name: string;
  category: ProductionObjectCategory;
  variant: string; // e.g., 'wafer-300mm', 'bonder-hybrid'
  specs: Record<string, string>;
  rules: string[];
  version: string;
}
