import React, { useState } from 'react';
import { 
    Shield, Lock, Users, Key, FileCheck, AlertOctagon, 
    CheckCircle2, XCircle, RefreshCw, Eye, UserPlus, X, Save, AlertTriangle, Loader2, ArrowRight
} from 'lucide-react';

interface UserData {
    id: string;
    name: string;
    role: string;
    mfa: boolean;
    lastLogin: string;
}

const INITIAL_USERS: UserData[] = [
    { id: 'USR-001', name: 'Dr. A. Vance', role: 'Admin', mfa: true, lastLogin: '2m ago' },
    { id: 'USR-002', name: 'J. Doe', role: 'Operator', mfa: true, lastLogin: '4h ago' },
    { id: 'USR-003', name: 'System_Auto', role: 'Service', mfa: true, lastLogin: '1s ago' },
    { id: 'USR-004', name: 'K. Lee', role: 'Engineer', mfa: false, lastLogin: '2d ago' },
];

interface SecurityViewProps {
    isSystemLocked?: boolean;
    onToggleLockdown?: (locked: boolean) => void;
}

export const SecurityView: React.FC<SecurityViewProps> = ({ isSystemLocked = false, onToggleLockdown }) => {
  const [activeTab, setActiveTab] = useState<'access' | 'audit' | 'compliance'>('access');
  
  // Access Control State
  const [users, setUsers] = useState<UserData[]>(INITIAL_USERS);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({ name: '', role: 'Operator' });

  // Security Center State
  const [lockdownProcessing, setLockdownProcessing] = useState(false);
  const [showLockdownModal, setShowLockdownModal] = useState(false);
  
  // Master Key Logic (Mocked)
  const [tempMasterKey, setTempMasterKey] = useState<string | null>(null);
  const [keyInput, setKeyInput] = useState('');
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);

  const audits = [
      { id: 'EVT-992', type: 'AUTH_FAIL', source: '192.168.1.42', time: '10:42:01', detail: 'Invalid Token' },
      { id: 'EVT-993', type: 'KEY_ROT', source: 'Admin', time: '09:00:00', detail: 'Master Key Rotated' },
      { id: 'EVT-994', type: 'PERM_CHG', source: 'Admin', time: 'Yesterday', detail: 'Elevated USR-004 to Lead' },
  ];

  // --- Handlers ---

  const handleOpenInvite = () => {
      setEditingUser(null);
      setFormData({ name: '', role: 'Operator' });
      setIsUserModalOpen(true);
  };

  const handleOpenEdit = (user: UserData) => {
      setEditingUser(user);
      setFormData({ name: user.name, role: user.role });
      setIsUserModalOpen(true);
  };

  const handleSaveUser = () => {
      if (!formData.name) return;

      if (editingUser) {
          setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, name: formData.name, role: formData.role } : u));
      } else {
          const newUser: UserData = {
              id: `USR-${Math.floor(Math.random() * 1000)}`,
              name: formData.name,
              role: formData.role,
              mfa: false,
              lastLogin: 'Never'
          };
          setUsers(prev => [...prev, newUser]);
      }
      setIsUserModalOpen(false);
  };

  const handleLockdownClick = () => {
      // If lockdown is active, we trigger the unlock flow (which might be handled by App level, 
      // but if we are here, we can also trigger it)
      if (isSystemLocked) {
          // Typically this view wouldn't be accessible if locked, 
          // but if we are in a 'view-only' mode:
          setLockdownProcessing(true);
          setTimeout(() => {
              if(onToggleLockdown) onToggleLockdown(false);
              setLockdownProcessing(false);
          }, 1000);
      } else {
          setKeyInput('');
          setShowLockdownModal(true);
      }
  };

  const generateMasterKey = () => {
      setIsGeneratingKey(true);
      setTimeout(() => {
          const key = `MK-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now().toString().substring(8)}`;
          setTempMasterKey(key);
          setIsGeneratingKey(false);
      }, 2000);
  };

  const confirmLockdown = () => {
      if (keyInput !== tempMasterKey) {
          alert("Invalid Master Key");
          return;
      }
      setShowLockdownModal(false);
      setLockdownProcessing(true);
      
      setTimeout(() => {
          if (onToggleLockdown) onToggleLockdown(true);
          setLockdownProcessing(false);
      }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-quantum-900 border border-quantum-600 rounded-lg overflow-hidden relative">
        
        {/* Lockdown Overlay (Local view feedback, though global covers it usually) */}
        {isSystemLocked && !lockdownProcessing && (
            <div className="absolute top-0 left-0 right-0 z-50 bg-red-600/90 text-white px-4 py-2 flex justify-between items-center shadow-2xl animate-pulse">
                <div className="flex items-center space-x-2 font-bold uppercase tracking-widest">
                    <AlertTriangle className="w-5 h-5" />
                    <span>System Lockdown Active</span>
                </div>
                <div className="text-xs">Access Restricted</div>
            </div>
        )}

        {/* Lockdown Authentication Modal */}
        {showLockdownModal && (
            <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-quantum-950 border border-red-500/50 rounded-lg w-full max-w-md p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse"></div>
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                            <Lock className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-100 uppercase tracking-wide">Initiate Lockdown</h3>
                        <p className="text-xs text-red-400 mt-2">Requires System Master Key Authorization</p>
                    </div>

                    {!tempMasterKey ? (
                        <div className="space-y-4">
                            <p className="text-xs text-slate-400 text-center mb-4 leading-relaxed">
                                No active session key found. Please generate a temporary Master Key using multi-factor authentication simulation.
                            </p>
                            <button 
                                onClick={generateMasterKey}
                                disabled={isGeneratingKey}
                                className="w-full py-3 bg-quantum-800 hover:bg-quantum-700 border border-quantum-600 text-slate-200 font-mono text-sm rounded flex items-center justify-center transition-all"
                            >
                                {isGeneratingKey ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Key className="w-4 h-4 mr-2" />}
                                {isGeneratingKey ? "Verifying MFA..." : "Generate Master Key"}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in slide-in-from-bottom-2">
                            <div className="bg-black/50 p-3 rounded border border-quantum-700 text-center">
                                <div className="text-[10px] text-slate-500 uppercase mb-1">Your Session Key</div>
                                <div className="text-lg font-mono font-bold text-cyan-400 tracking-widest select-all">{tempMasterKey}</div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Confirm Key to Lock</label>
                                <input 
                                    autoFocus
                                    type="text" 
                                    className="w-full bg-quantum-900 border border-red-900/50 rounded p-3 text-slate-100 text-center font-mono tracking-widest focus:border-red-500 outline-none transition-colors"
                                    placeholder="ENTER-KEY-HERE"
                                    value={keyInput}
                                    onChange={(e) => setKeyInput(e.target.value)}
                                />
                            </div>
                            <button 
                                onClick={confirmLockdown}
                                disabled={keyInput !== tempMasterKey}
                                className="w-full py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all flex items-center justify-center"
                            >
                                <AlertTriangle className="w-4 h-4 mr-2" /> EXECUTE LOCKDOWN
                            </button>
                        </div>
                    )}

                    <button 
                        onClick={() => setShowLockdownModal(false)}
                        className="absolute top-4 right-4 text-slate-600 hover:text-slate-400"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        )}

        {/* User Modal */}
        {isUserModalOpen && (
            <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-quantum-900 border border-quantum-600 rounded-lg w-full max-w-md p-6 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-200">{editingUser ? 'Edit User' : 'Invite New User'}</h3>
                        <button onClick={() => setIsUserModalOpen(false)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                            <input 
                                type="text" 
                                className="w-full bg-quantum-950 border border-quantum-700 rounded p-2 text-slate-200 focus:border-cyan-500 outline-none"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                placeholder="e.g. Sarah Connor"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role Permission</label>
                            <select 
                                className="w-full bg-quantum-950 border border-quantum-700 rounded p-2 text-slate-200 focus:border-cyan-500 outline-none"
                                value={formData.role}
                                onChange={e => setFormData({...formData, role: e.target.value})}
                            >
                                <option>Admin</option>
                                <option>Engineer</option>
                                <option>Operator</option>
                                <option>Auditor</option>
                                <option>Service</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 text-xs text-slate-400 hover:text-white">Cancel</button>
                        <button 
                            onClick={handleSaveUser}
                            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded flex items-center shadow-glow-cyan"
                        >
                            <Save className="w-3 h-3 mr-2" /> {editingUser ? 'Save Changes' : 'Send Invite'}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Header Tabs */}
        <div className="flex items-center px-4 border-b border-quantum-600 bg-quantum-800 shrink-0 h-12">
            <TabButton 
                active={activeTab === 'access'} 
                onClick={() => setActiveTab('access')} 
                icon={<Users className="w-4 h-4" />} 
                label="Access Control" 
            />
            <TabButton 
                active={activeTab === 'audit'} 
                onClick={() => setActiveTab('audit')} 
                icon={<Shield className="w-4 h-4" />} 
                label="Security Center" 
            />
            <TabButton 
                active={activeTab === 'compliance'} 
                onClick={() => setActiveTab('compliance')} 
                icon={<FileCheck className="w-4 h-4" />} 
                label="Compliance" 
            />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-quantum-950/50">
            
            {/* --- ACCESS CONTROL --- */}
            {activeTab === 'access' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold text-slate-200">User Roles & Permissions</h2>
                            <p className="text-xs text-slate-500 mt-1">Manage RBAC policies for the Quantum Control Plane.</p>
                        </div>
                        <button 
                            onClick={handleOpenInvite}
                            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-bold flex items-center shadow-glow-cyan transition-colors"
                        >
                            <UserPlus className="w-3 h-3 mr-2" /> Invite User
                        </button>
                    </div>

                    <div className="bg-quantum-900 border border-quantum-700 rounded-lg overflow-hidden">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-quantum-950 text-slate-500 font-mono uppercase border-b border-quantum-700">
                                <tr>
                                    <th className="px-4 py-3">Identity</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3">MFA Status</th>
                                    <th className="px-4 py-3">Last Active</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-quantum-800 text-slate-300">
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-quantum-800/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="font-bold">{u.name}</div>
                                            <div className="text-[10px] text-slate-500 font-mono">{u.id}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-bold ${
                                                u.role === 'Admin' ? 'bg-purple-900/20 text-purple-400 border-purple-500/30' :
                                                u.role === 'Service' ? 'bg-slate-800 text-slate-400 border-slate-600' :
                                                'bg-cyan-900/20 text-cyan-400 border-cyan-500/30'
                                            }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {u.mfa ? (
                                                <span className="flex items-center text-green-400"><CheckCircle2 className="w-3 h-3 mr-1.5" /> Enabled</span>
                                            ) : (
                                                <span className="flex items-center text-orange-400"><AlertOctagon className="w-3 h-3 mr-1.5" /> Disabled</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-slate-400">{u.lastLogin}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button 
                                                onClick={() => handleOpenEdit(u)}
                                                className="text-slate-500 hover:text-cyan-400 transition-colors"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- SECURITY CENTER --- */}
            {activeTab === 'audit' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-quantum-900 border border-quantum-700 rounded-lg p-5">
                            <h3 className="text-sm font-bold text-slate-200 uppercase mb-4 flex items-center">
                                <Eye className="w-4 h-4 mr-2 text-cyan-400" /> Recent Security Events
                            </h3>
                            <div className="space-y-2">
                                {audits.map(evt => (
                                    <div key={evt.id} className="flex items-center justify-between p-3 bg-quantum-950 border border-quantum-800 rounded hover:border-quantum-600 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-1.5 rounded bg-quantum-900 border border-quantum-800 ${evt.type === 'AUTH_FAIL' ? 'text-red-400' : 'text-slate-400'}`}>
                                                {evt.type === 'AUTH_FAIL' ? <AlertOctagon className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-200">{evt.type}</div>
                                                <div className="text-[10px] text-slate-500">{evt.detail} • {evt.source}</div>
                                            </div>
                                        </div>
                                        <div className="text-xs font-mono text-slate-500">{evt.time}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                         <div className="bg-quantum-900 border border-quantum-700 rounded-lg p-5">
                            <h3 className="text-sm font-bold text-slate-200 uppercase mb-4 flex items-center">
                                <Lock className="w-4 h-4 mr-2 text-green-400" /> System Health
                            </h3>
                            <div className="space-y-4">
                                <SecurityCheck label="Data Encryption (At Rest)" status="pass" />
                                <SecurityCheck label="TLS 1.3 Enforcement" status="pass" />
                                <SecurityCheck label="Intrusion Detection" status="warning" desc="Heuristic sensitivity low" />
                                <SecurityCheck label="Backup Integrity" status="pass" />
                            </div>
                        </div>
                        <div className={`p-4 border rounded-lg transition-all duration-300 ${isSystemLocked ? 'bg-red-950 border-red-500' : 'bg-red-900/10 border-red-500/20'}`}>
                            <h4 className={`text-xs font-bold uppercase mb-2 ${isSystemLocked ? 'text-white' : 'text-red-400'}`}>Emergency Protocols</h4>
                            <button 
                                onClick={handleLockdownClick}
                                disabled={lockdownProcessing}
                                className={`w-full py-2 text-xs font-bold rounded shadow-lg transition-all flex items-center justify-center ${
                                    isSystemLocked 
                                    ? 'bg-white text-red-600 hover:bg-slate-200' 
                                    : 'bg-red-600 hover:bg-red-500 text-white'
                                }`}
                            >
                                {lockdownProcessing ? (
                                    <><Loader2 className="w-3 h-3 mr-2 animate-spin" /> {isSystemLocked ? 'LIFTING...' : 'PROCESSING...'}</>
                                ) : (
                                    <>{isSystemLocked ? 'LIFT LOCKDOWN' : 'LOCKDOWN SYSTEM'}</>
                                )}
                            </button>
                            <p className={`text-[10px] mt-2 text-center ${isSystemLocked ? 'text-red-200' : 'text-red-300/60'}`}>
                                {isSystemLocked ? 'System is frozen. Auth required.' : 'Requires Master Key Authorization'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* --- COMPLIANCE --- */}
            {activeTab === 'compliance' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                        <ComplianceCard std="ISO 9001" status="certified" date="Exp: Dec 2026" />
                        <ComplianceCard std="SOC 2 Type II" status="pending" date="Audit Scheduled: Nov 15" />
                        <ComplianceCard std="ITAR" status="certified" date="Exp: Jun 2026" />
                    </div>

                    <div className="bg-quantum-900 border border-quantum-700 rounded-lg p-5">
                        <h3 className="text-sm font-bold text-slate-200 uppercase mb-4">Pending Audit Items</h3>
                        <div className="space-y-2">
                            <AuditItem id="AUD-104" task="Verify user offboarding logs for Q3" due="2 days" owner="HR_Sys" />
                            <AuditItem id="AUD-105" task="Patch CVE-2025-992 on Node Cluster B" due="Today" owner="SecOps" />
                        </div>
                    </div>
                </div>
            )}

        </div>
    </div>
  );
};

// --- Sub-components ---

const TabButton = ({ active, onClick, icon, label }: any) => (
    <button 
        onClick={onClick}
        className={`flex items-center px-4 h-full border-b-2 transition-colors text-xs font-bold uppercase tracking-wide ${
            active 
            ? 'border-cyan-400 text-cyan-400 bg-quantum-900' 
            : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-quantum-700'
        }`}
    >
        <span className="mr-2">{icon}</span>
        {label}
    </button>
);

const SecurityCheck = ({ label, status, desc }: any) => (
    <div className="flex items-start justify-between">
        <div>
            <div className="text-xs font-medium text-slate-300">{label}</div>
            {desc && <div className="text-[10px] text-slate-500 mt-0.5">{desc}</div>}
        </div>
        {status === 'pass' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertOctagon className="w-4 h-4 text-orange-500" />}
    </div>
);

const ComplianceCard = ({ std, status, date }: any) => (
    <div className={`p-4 rounded-lg border ${status === 'certified' ? 'bg-green-900/10 border-green-500/30' : 'bg-quantum-900 border-quantum-700'}`}>
        <div className="flex justify-between items-start mb-3">
            <div className={`p-1.5 rounded ${status === 'certified' ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-400'}`}>
                <FileCheck className="w-5 h-5" />
            </div>
            {status === 'certified' && <span className="text-[10px] font-bold bg-green-500 text-quantum-950 px-1.5 py-0.5 rounded">VALID</span>}
        </div>
        <h4 className="text-lg font-bold text-slate-200">{std}</h4>
        <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{status}</div>
        <div className="text-[10px] text-slate-400 mt-4 pt-2 border-t border-quantum-700/50">{date}</div>
    </div>
);

const AuditItem = ({ id, task, due, owner }: any) => (
    <div className="flex items-center justify-between p-3 bg-quantum-950 border border-quantum-800 rounded">
        <div className="flex items-center space-x-3">
             <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></div>
             <div>
                 <div className="text-xs font-medium text-slate-200">{task}</div>
                 <div className="text-[10px] text-slate-500 font-mono">{id} • Owner: {owner}</div>
             </div>
        </div>
        <div className="text-xs text-orange-400 font-bold bg-orange-900/10 px-2 py-1 rounded border border-orange-500/20">
            Due: {due}
        </div>
    </div>
);