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
  AI_CORE = 'AI_PROCESSING'
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
}

// New interface for detailed node inspection
export interface NodeDetails {
  identity: {
    role: string;
    category: string;
    version: string;
    dependencies: number;
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