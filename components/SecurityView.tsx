import React, { useState } from 'react';
import { 
    Shield, Lock, Users, Key, FileCheck, AlertOctagon, 
    CheckCircle2, XCircle, RefreshCw, Eye, UserPlus
} from 'lucide-react';

export const SecurityView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'access' | 'audit' | 'compliance'>('access');

  const users = [
    { id: 'USR-001', name: 'Dr. A. Vance', role: 'Admin', mfa: true, lastLogin: '2m ago' },
    { id: 'USR-002', name: 'J. Doe', role: 'Operator', mfa: true, lastLogin: '4h ago' },
    { id: 'USR-003', name: 'System_Auto', role: 'Service', mfa: true, lastLogin: '1s ago' },
    { id: 'USR-004', name: 'K. Lee', role: 'Engineer', mfa: false, lastLogin: '2d ago' },
  ];

  const audits = [
      { id: 'EVT-992', type: 'AUTH_FAIL', source: '192.168.1.42', time: '10:42:01', detail: 'Invalid Token' },
      { id: 'EVT-993', type: 'KEY_ROT', source: 'Admin', time: '09:00:00', detail: 'Master Key Rotated' },
      { id: 'EVT-994', type: 'PERM_CHG', source: 'Admin', time: 'Yesterday', detail: 'Elevated USR-004 to Lead' },
  ];

  return (
    <div className="flex flex-col h-full bg-quantum-900 border border-quantum-600 rounded-lg overflow-hidden">
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
                        <button className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-bold flex items-center shadow-glow-cyan">
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
                                            <button className="text-slate-500 hover:text-cyan-400 transition-colors">Edit</button>
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
                        <div className="p-4 bg-red-900/10 border border-red-500/20 rounded-lg">
                            <h4 className="text-xs font-bold text-red-400 uppercase mb-2">Emergency</h4>
                            <button className="w-full py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded shadow-lg transition-colors">
                                LOCKDOWN SYSTEM
                            </button>
                            <p className="text-[10px] text-red-300/60 mt-2 text-center">Requires Admin Master Key</p>
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