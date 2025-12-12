import React, { useState } from 'react';
import { 
    Webhook, Key, LayoutTemplate, Plus, RefreshCw, Copy, Check, 
    CloudLightning, Shield, Globe, Terminal, Box 
} from 'lucide-react';

export const IntegrationsView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'services' | 'apikeys' | 'presets'>('services');

    return (
        <div className="flex flex-col h-full bg-quantum-900 border border-quantum-600 rounded-lg overflow-hidden">
            {/* Header Tabs */}
            <div className="flex items-center px-4 border-b border-quantum-600 bg-quantum-800 shrink-0 h-12">
                <TabButton 
                    active={activeTab === 'services'} 
                    onClick={() => setActiveTab('services')} 
                    icon={<Webhook className="w-4 h-4" />} 
                    label="Connected Services" 
                />
                <TabButton 
                    active={activeTab === 'apikeys'} 
                    onClick={() => setActiveTab('apikeys')} 
                    icon={<Key className="w-4 h-4" />} 
                    label="API Access" 
                />
                <TabButton 
                    active={activeTab === 'presets'} 
                    onClick={() => setActiveTab('presets')} 
                    icon={<LayoutTemplate className="w-4 h-4" />} 
                    label="Simulation Presets" 
                />
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-quantum-950/50">
                
                {/* --- SERVICES --- */}
                {activeTab === 'services' && (
                    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <h2 className="text-xl font-bold text-slate-200">Integration Hub</h2>
                                <p className="text-xs text-slate-500 mt-1">Manage external webhooks and data pipelines.</p>
                            </div>
                            <button className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-bold flex items-center shadow-glow-cyan transition-colors">
                                <Plus className="w-3 h-3 mr-2" /> Add Integration
                            </button>
                        </div>
                        
                        <div className="grid gap-4">
                            <IntegrationItem 
                                name="Slack Alerts" 
                                type="Webhook" 
                                status="active" 
                                lastSync="2 mins ago" 
                                icon={<div className="w-10 h-10 rounded-lg bg-[#4A154B] flex items-center justify-center text-white font-bold text-xs shadow-lg">SL</div>} 
                            />
                            <IntegrationItem 
                                name="AWS S3 Archival" 
                                type="Storage" 
                                status="active" 
                                lastSync="1 hour ago" 
                                icon={<div className="w-10 h-10 rounded-lg bg-[#FF9900] flex items-center justify-center text-white font-bold text-xs shadow-lg">S3</div>} 
                            />
                            <IntegrationItem 
                                name="JIRA Issue Sync" 
                                type="Sync" 
                                status="error" 
                                lastSync="Failed 4h ago" 
                                icon={<div className="w-10 h-10 rounded-lg bg-[#0052CC] flex items-center justify-center text-white font-bold text-xs shadow-lg">JI</div>} 
                            />
                        </div>
                    </div>
                )}

                {/* --- API KEYS --- */}
                {activeTab === 'apikeys' && (
                    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-quantum-900 border border-quantum-700 rounded-lg p-6 shadow-lg">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-sm font-bold text-slate-200 uppercase flex items-center">
                                    <Shield className="w-4 h-4 mr-2 text-green-400" /> Active API Keys
                                </h3>
                                <button className="text-xs text-red-400 hover:text-red-300 hover:underline">Revoke All Keys</button>
                            </div>
                            <div className="space-y-4">
                                <ApiKeyItem name="Production-Client-01" prefix="pk_live_..." created="Oct 12, 2025" scopes={['read', 'write', 'execute']} />
                                <ApiKeyItem name="Dev-Test-Key" prefix="pk_test_..." created="Oct 20, 2025" scopes={['read']} />
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-quantum-800">
                                <h4 className="text-xs font-bold text-slate-400 mb-4 uppercase">Create New Token</h4>
                                <div className="flex gap-4 items-end">
                                    <div className="flex-1 space-y-1">
                                        <label className="text-[10px] text-slate-500 uppercase font-bold">Token Name</label>
                                        <input type="text" placeholder="e.g. CI/CD Pipeline" className="w-full bg-quantum-950 border border-quantum-700 rounded p-2.5 text-sm text-slate-200 outline-none focus:border-cyan-500 transition-colors" />
                                    </div>
                                    <div className="w-48 space-y-1">
                                        <label className="text-[10px] text-slate-500 uppercase font-bold">Expiration</label>
                                        <select className="w-full bg-quantum-950 border border-quantum-700 rounded p-2.5 text-sm text-slate-200 outline-none focus:border-cyan-500 transition-colors">
                                            <option>Never</option>
                                            <option>30 Days</option>
                                            <option>90 Days</option>
                                        </select>
                                    </div>
                                    <button className="px-6 py-2.5 bg-quantum-800 hover:bg-quantum-700 border border-quantum-600 rounded text-xs text-cyan-400 font-bold transition-colors">
                                        Generate
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 bg-cyan-900/10 border border-cyan-500/20 rounded-lg flex items-start space-x-3">
                            <Terminal className="w-5 h-5 text-cyan-400 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-cyan-400 mb-1">Documentation</h4>
                                <p className="text-xs text-slate-400">
                                    Use these keys to authenticate via the Quantum-Bridge SDK. <br/>
                                    See the <span className="text-cyan-400 hover:underline cursor-pointer">API Reference</span> for endpoints and limits.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- PRESETS --- */}
                {activeTab === 'presets' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <PresetCard 
                            title="Standard Reflow" 
                            desc="Baseline thermal profile for SAC305 solder paste. Optimized for mid-volume." 
                            tags={['Thermal', 'Production']} 
                        />
                        <PresetCard 
                            title="Stress Test Max" 
                            desc="High-load compute simulation for stability verification. Runs on all cores." 
                            tags={['Stress', 'Dev']} 
                        />
                        <PresetCard 
                            title="Low Power Mode" 
                            desc="Optimized logic routing for minimal energy consumption during idle states." 
                            tags={['Logic', 'Green']} 
                        />
                         <PresetCard 
                            title="Quick Diagnostics" 
                            desc="Rapid health check sequence for sensor arrays." 
                            tags={['Maint', 'Fast']} 
                        />
                        
                        {/* Add New Card */}
                        <div className="border-2 border-dashed border-quantum-700 rounded-lg flex flex-col items-center justify-center p-6 text-slate-500 hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-quantum-900/50 transition-all cursor-pointer min-h-[180px] group">
                            <div className="p-3 bg-quantum-900 rounded-full border border-quantum-700 group-hover:border-cyan-500/30 mb-3 transition-colors">
                                <Plus className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider">Create New Preset</span>
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
            ? 'border-cyan-400 text-cyan-400 bg-quantum-900/50' 
            : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-quantum-800'
        }`}
    >
        <span className="mr-2">{icon}</span>
        {label}
    </button>
);

const IntegrationItem = ({ name, type, status, lastSync, icon }: any) => (
    <div className="p-4 bg-quantum-900 border border-quantum-700 rounded-lg flex items-center justify-between group hover:border-cyan-500/30 transition-all">
        <div className="flex items-center space-x-4">
            {icon}
            <div>
                <div className="text-sm font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">{name}</div>
                <div className="text-xs text-slate-500 font-mono">{type} • {lastSync}</div>
            </div>
        </div>
        <div className="flex items-center space-x-4">
            <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                status === 'active' ? 'bg-green-900/20 text-green-400 border-green-500/20' : 'bg-red-900/20 text-red-400 border-red-500/20'
            }`}>
                {status}
            </div>
            <button className="p-2 hover:bg-quantum-800 rounded text-slate-400 hover:text-cyan-400 transition-colors">
                <RefreshCw className="w-4 h-4" />
            </button>
        </div>
    </div>
);

const ApiKeyItem = ({ name, prefix, created, scopes }: any) => (
    <div className="p-4 bg-quantum-950 border border-quantum-800 rounded flex justify-between items-center hover:border-quantum-700 transition-colors">
        <div>
            <div className="flex items-center space-x-3">
                <span className="text-sm font-bold text-slate-300">{name}</span>
                <div className="flex space-x-1">
                    {scopes.map((s: string) => (
                        <span key={s} className="text-[9px] uppercase bg-quantum-800 border border-quantum-700 text-slate-400 px-1.5 py-0.5 rounded font-mono">{s}</span>
                    ))}
                </div>
            </div>
            <div className="text-xs font-mono text-slate-500 mt-1">Created: {created}</div>
        </div>
        <div className="flex items-center space-x-3 bg-quantum-900 px-3 py-2 rounded border border-quantum-800 font-mono text-xs">
            <span className="text-cyan-400">{prefix}</span>
            <div className="h-4 w-px bg-quantum-700"></div>
            <button className="text-slate-500 hover:text-white transition-colors" title="Copy Key"><Copy className="w-3 h-3" /></button>
        </div>
    </div>
);

const PresetCard = ({ title, desc, tags }: any) => (
    <div className="bg-quantum-900 border border-quantum-700 rounded-lg p-5 hover:border-cyan-500/30 transition-all cursor-pointer group hover:shadow-lg relative overflow-hidden min-h-[180px] flex flex-col">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Box size={80} />
        </div>
        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2 bg-quantum-950 rounded border border-quantum-700 text-cyan-500 group-hover:text-cyan-400 group-hover:shadow-glow-cyan transition-all">
                <CloudLightning className="w-5 h-5" />
            </div>
            <button className="text-slate-500 hover:text-white"><Copy className="w-4 h-4" /></button>
        </div>
        <h3 className="text-sm font-bold text-slate-200 mb-2 relative z-10">{title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed mb-4 flex-1 relative z-10">{desc}</p>
        <div className="flex flex-wrap gap-2 relative z-10">
            {tags.map((t: string) => (
                <span key={t} className="text-[10px] bg-quantum-800 text-slate-400 px-2 py-0.5 rounded border border-quantum-700">
                    {t}
                </span>
            ))}
        </div>
    </div>
);