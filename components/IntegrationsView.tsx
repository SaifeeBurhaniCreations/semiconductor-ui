import React, { useState } from 'react';
import { 
    Webhook, Key, LayoutTemplate, Plus, RefreshCw, Copy, Check, 
    CloudLightning, Shield, Globe, Terminal, Box, Trash2, X, CheckSquare, Square, Loader2,
    Save, FileJson, Edit3, AlertTriangle
} from 'lucide-react';

interface Integration {
    id: string;
    name: string;
    type: string;
    status: 'active' | 'error' | 'syncing';
    lastSync: string;
    iconLabel: string;
    iconColor: string;
}

interface ApiKey {
    id: string;
    name: string;
    prefix: string;
    created: string;
    scopes: string[];
}

interface Preset {
    id: string;
    title: string;
    desc: string;
    tags: string[];
    configJSON: string;
}

const INITIAL_INTEGRATIONS: Integration[] = [
    { id: '1', name: 'Slack Alerts', type: 'Webhook', status: 'active', lastSync: '2 mins ago', iconLabel: 'SL', iconColor: '#4A154B' },
    { id: '2', name: 'AWS S3 Archival', type: 'Storage', status: 'active', lastSync: '1 hour ago', iconLabel: 'S3', iconColor: '#FF9900' },
    { id: '3', name: 'JIRA Issue Sync', type: 'Sync', status: 'error', lastSync: 'Failed 4h ago', iconLabel: 'JI', iconColor: '#0052CC' },
];

const INITIAL_KEYS: ApiKey[] = [
    { id: 'k1', name: 'Production-Client-01', prefix: 'pk_live_8923...', created: 'Oct 12, 2025', scopes: ['read', 'write', 'execute'] },
    { id: 'k2', name: 'Dev-Test-Key', prefix: 'pk_test_4421...', created: 'Oct 20, 2025', scopes: ['read'] },
];

const INITIAL_PRESETS: Preset[] = [
    { id: 'p1', title: "Standard Reflow", desc: "Baseline thermal profile for SAC305 solder paste. Optimized for mid-volume.", tags: ['Thermal', 'Production'], configJSON: '{\n  "temp_max": 245,\n  "ramp_up": 2.5,\n  "soak_time": 60\n}' },
    { id: 'p2', title: "Stress Test Max", desc: "High-load compute simulation for stability verification. Runs on all cores.", tags: ['Stress', 'Dev'], configJSON: '{\n  "load_factor": 1.0,\n  "duration": "48h",\n  "cores": "all"\n}' },
    { id: 'p3', title: "Low Power Mode", desc: "Optimized logic routing for minimal energy consumption during idle states.", tags: ['Logic', 'Green'], configJSON: '{\n  "power_save": true,\n  "wake_on_lan": false\n}' },
    { id: 'p4', title: "Quick Diagnostics", desc: "Rapid health check sequence for sensor arrays.", tags: ['Maint', 'Fast'], configJSON: '{\n  "scan_depth": "shallow",\n  "targets": ["sensors"]\n}' },
];

export const IntegrationsView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'services' | 'apikeys' | 'presets'>('services');

    // --- Services State ---
    const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);
    const [refreshingId, setRefreshingId] = useState<string | null>(null);
    const [showAddService, setShowAddService] = useState(false);
    const [newServiceData, setNewServiceData] = useState({ name: '', type: 'Webhook' });

    // --- API Keys State ---
    const [apiKeys, setApiKeys] = useState<ApiKey[]>(INITIAL_KEYS);
    const [newTokenName, setNewTokenName] = useState('');
    const [newTokenExpiry, setNewTokenExpiry] = useState('Never');
    const [newTokenScopes, setNewTokenScopes] = useState<string[]>(['read']);
    const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showRevokeModal, setShowRevokeModal] = useState(false);

    // --- Presets State ---
    const [presets, setPresets] = useState<Preset[]>(INITIAL_PRESETS);
    const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
    const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
    const [isCreatingPreset, setIsCreatingPreset] = useState(false);
    const [presetFormData, setPresetFormData] = useState({ title: '', desc: '', tags: '', configJSON: '{\n  \n}' });
    const [presetCopiedId, setPresetCopiedId] = useState<string | null>(null);

    // --- Service Handlers ---

    const handleAddIntegration = () => {
        if (!newServiceData.name) return;
        
        const newIntegration: Integration = {
            id: Date.now().toString(),
            name: newServiceData.name,
            type: newServiceData.type,
            status: 'active',
            lastSync: 'Just now',
            iconLabel: newServiceData.name.substring(0, 2).toUpperCase(),
            iconColor: '#10b981'
        };

        setIntegrations(prev => [...prev, newIntegration]);
        setNewServiceData({ name: '', type: 'Webhook' });
        setShowAddService(false);
    };

    const handleRefreshService = (id: string) => {
        setRefreshingId(id);
        setTimeout(() => {
            setIntegrations(prev => prev.map(i => i.id === id ? { ...i, lastSync: 'Just now', status: 'active' } : i));
            setRefreshingId(null);
        }, 1500);
    };

    // --- API Key Handlers ---

    const handleRevokeAllKeys = () => {
        setShowRevokeModal(true);
    };

    const confirmRevokeAll = () => {
        setApiKeys([]);
        setShowRevokeModal(false);
    };

    const handleCopyKey = (id: string, keyString: string) => {
        const fullKey = keyString.replace('...', '') + Math.random().toString(36).substring(7); 
        navigator.clipboard.writeText(fullKey);
        setCopiedKeyId(id);
        setTimeout(() => setCopiedKeyId(null), 2000);
    };

    const toggleScope = (scope: string) => {
        setNewTokenScopes(prev => 
            prev.includes(scope) ? prev.filter(s => s !== scope) : [...prev, scope]
        );
    };

    const handleGenerateToken = () => {
        if (!newTokenName) return;
        setIsGenerating(true);

        setTimeout(() => {
            const newKey: ApiKey = {
                id: `k-${Date.now()}`,
                name: newTokenName,
                prefix: `pk_${newTokenName.toLowerCase().includes('test') ? 'test' : 'live'}_${Math.floor(Math.random()*10000)}...`,
                created: 'Just now',
                scopes: newTokenScopes
            };
            setApiKeys(prev => [...prev, newKey]);
            setNewTokenName('');
            setNewTokenScopes(['read']);
            setIsGenerating(false);
        }, 1000);
    };

    // --- Preset Handlers ---

    const handleOpenCreatePreset = () => {
        setIsCreatingPreset(true);
        setPresetFormData({ title: '', desc: '', tags: '', configJSON: '{\n  "parameter": "value"\n}' });
        setIsPresetModalOpen(true);
    };

    const handleOpenPresetDetail = (preset: Preset) => {
        setIsCreatingPreset(false);
        setSelectedPreset(preset);
        setPresetFormData({ 
            title: preset.title, 
            desc: preset.desc, 
            tags: preset.tags.join(', '), 
            configJSON: preset.configJSON 
        });
        setIsPresetModalOpen(true);
    };

    const handleSavePreset = () => {
        if (!presetFormData.title) return;

        if (isCreatingPreset) {
            const newPreset: Preset = {
                id: `p-${Date.now()}`,
                title: presetFormData.title,
                desc: presetFormData.desc,
                tags: presetFormData.tags.split(',').map(t => t.trim()).filter(t => t),
                configJSON: presetFormData.configJSON
            };
            setPresets(prev => [...prev, newPreset]);
        } else if (selectedPreset) {
            setPresets(prev => prev.map(p => p.id === selectedPreset.id ? {
                ...p,
                title: presetFormData.title,
                desc: presetFormData.desc,
                tags: presetFormData.tags.split(',').map(t => t.trim()).filter(t => t),
                configJSON: presetFormData.configJSON
            } : p));
        }
        setIsPresetModalOpen(false);
    };

    const handleCopyPresetConfig = (e: React.MouseEvent, config: string, id: string) => {
        e.stopPropagation();
        navigator.clipboard.writeText(config);
        setPresetCopiedId(id);
        setTimeout(() => setPresetCopiedId(null), 2000);
    };

    return (
        <div className="flex flex-col h-full bg-quantum-900 border border-quantum-600 rounded-lg overflow-hidden relative">
            
            {/* General Modal Overlay (Add Service) */}
            {showAddService && (
                <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-quantum-900 border border-quantum-600 rounded-lg w-full max-w-md p-6 shadow-2xl">
                        <h3 className="text-lg font-bold text-slate-200 mb-4">Connect New Service</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Service Name</label>
                                <input 
                                    autoFocus
                                    type="text" 
                                    className="w-full bg-quantum-950 border border-quantum-700 rounded p-2 text-slate-200 focus:border-cyan-500 outline-none"
                                    placeholder="e.g. Datadog Metrics"
                                    value={newServiceData.name}
                                    onChange={e => setNewServiceData({...newServiceData, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Integration Type</label>
                                <select 
                                    className="w-full bg-quantum-950 border border-quantum-700 rounded p-2 text-slate-200 focus:border-cyan-500 outline-none"
                                    value={newServiceData.type}
                                    onChange={e => setNewServiceData({...newServiceData, type: e.target.value})}
                                >
                                    <option>Webhook</option>
                                    <option>Storage</option>
                                    <option>Sync</option>
                                    <option>Analytics</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button onClick={() => setShowAddService(false)} className="px-4 py-2 text-xs text-slate-400 hover:text-white">Cancel</button>
                            <button 
                                onClick={handleAddIntegration}
                                disabled={!newServiceData.name}
                                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold rounded shadow-glow-cyan"
                            >
                                Connect
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Revoke All Keys Modal */}
            {showRevokeModal && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-quantum-950 border border-red-500/50 rounded-lg w-full max-w-sm p-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse"></div>
                        <div className="flex flex-col items-center text-center">
                            <div className="p-3 bg-red-900/20 rounded-full border border-red-500/30 mb-4">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-100 mb-2">Revoke All Keys?</h3>
                            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                                DANGER: This will immediately invalidate all active API keys. Production services relying on these keys will stop working. This action cannot be undone.
                            </p>
                            <div className="flex w-full space-x-3">
                                <button 
                                    onClick={() => setShowRevokeModal(false)} 
                                    className="flex-1 py-2 bg-quantum-900 border border-quantum-700 hover:bg-quantum-800 text-slate-300 text-xs font-bold rounded transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={confirmRevokeAll}
                                    className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded shadow-lg transition-colors flex items-center justify-center"
                                >
                                    <Trash2 className="w-3 h-3 mr-2" /> Revoke All
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Preset Modal Overlay */}
            {isPresetModalOpen && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-quantum-900 border border-quantum-600 rounded-xl w-full max-w-2xl p-6 shadow-2xl flex flex-col max-h-[90%]">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-purple-900/20 rounded border border-purple-500/30 text-purple-400">
                                    {isCreatingPreset ? <Plus className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                                </div>
                                <h3 className="text-lg font-bold text-slate-200">
                                    {isCreatingPreset ? 'Create New Preset' : 'Edit Preset Configuration'}
                                </h3>
                            </div>
                            <button onClick={() => setIsPresetModalOpen(false)} className="text-slate-500 hover:text-white"><X className="w-6 h-6" /></button>
                        </div>
                        
                        <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Preset Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-quantum-950 border border-quantum-700 rounded p-2 text-slate-200 focus:border-cyan-500 outline-none text-sm"
                                        placeholder="e.g. High Performance Mode"
                                        value={presetFormData.title}
                                        onChange={e => setPresetFormData({...presetFormData, title: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tags (comma separated)</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-quantum-950 border border-quantum-700 rounded p-2 text-slate-200 focus:border-cyan-500 outline-none text-sm"
                                        placeholder="e.g. Production, Verified"
                                        value={presetFormData.tags}
                                        onChange={e => setPresetFormData({...presetFormData, tags: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                                <textarea 
                                    className="w-full bg-quantum-950 border border-quantum-700 rounded p-2 text-slate-200 focus:border-cyan-500 outline-none text-sm resize-none h-20"
                                    placeholder="Describe the purpose of this simulation preset..."
                                    value={presetFormData.desc}
                                    onChange={e => setPresetFormData({...presetFormData, desc: e.target.value})}
                                />
                            </div>
                            <div className="flex-1 flex flex-col">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase">Configuration (JSON)</label>
                                    <button className="text-[10px] text-cyan-400 hover:underline flex items-center">
                                        <FileJson className="w-3 h-3 mr-1" /> Load Template
                                    </button>
                                </div>
                                <textarea 
                                    className="w-full bg-black/50 border border-quantum-700 rounded p-3 text-cyan-300 font-mono text-xs focus:border-cyan-500 outline-none resize-none h-48 leading-relaxed"
                                    value={presetFormData.configJSON}
                                    onChange={e => setPresetFormData({...presetFormData, configJSON: e.target.value})}
                                    spellCheck={false}
                                />
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-quantum-800 flex justify-end space-x-3">
                            <button onClick={() => setIsPresetModalOpen(false)} className="px-4 py-2 text-xs text-slate-400 hover:text-white">Cancel</button>
                            <button 
                                onClick={handleSavePreset}
                                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded shadow-glow-cyan flex items-center"
                            >
                                <Save className="w-3 h-3 mr-2" /> Save Preset
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                            <button 
                                onClick={() => setShowAddService(true)}
                                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-bold flex items-center shadow-glow-cyan transition-colors"
                            >
                                <Plus className="w-3 h-3 mr-2" /> Add Integration
                            </button>
                        </div>
                        
                        <div className="grid gap-4">
                            {integrations.map(integration => (
                                <IntegrationItem 
                                    key={integration.id}
                                    data={integration}
                                    isRefreshing={refreshingId === integration.id}
                                    onRefresh={() => handleRefreshService(integration.id)}
                                />
                            ))}
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
                                <button 
                                    onClick={handleRevokeAllKeys}
                                    className="text-xs text-red-400 hover:text-red-300 hover:bg-red-900/10 px-2 py-1 rounded transition-colors"
                                >
                                    Revoke All Keys
                                </button>
                            </div>
                            <div className="space-y-4">
                                {apiKeys.length === 0 ? (
                                    <div className="text-center py-8 text-slate-500 text-xs italic border border-dashed border-quantum-700 rounded">
                                        No active keys found. Generate one below.
                                    </div>
                                ) : (
                                    apiKeys.map(key => (
                                        <ApiKeyItem 
                                            key={key.id} 
                                            data={key} 
                                            onCopy={() => handleCopyKey(key.id, key.prefix)} 
                                            isCopied={copiedKeyId === key.id}
                                        />
                                    ))
                                )}
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-quantum-800">
                                <h4 className="text-xs font-bold text-slate-400 mb-4 uppercase">Create New Token</h4>
                                
                                <div className="space-y-4 bg-quantum-950/50 p-4 rounded border border-quantum-800">
                                    <div className="flex gap-4 items-end">
                                        <div className="flex-1 space-y-1">
                                            <label className="text-[10px] text-slate-500 uppercase font-bold">Token Name</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. CI/CD Pipeline" 
                                                className="w-full bg-quantum-900 border border-quantum-700 rounded p-2.5 text-sm text-slate-200 outline-none focus:border-cyan-500 transition-colors"
                                                value={newTokenName}
                                                onChange={(e) => setNewTokenName(e.target.value)}
                                            />
                                        </div>
                                        <div className="w-48 space-y-1">
                                            <label className="text-[10px] text-slate-500 uppercase font-bold">Expiration</label>
                                            <select 
                                                className="w-full bg-quantum-900 border border-quantum-700 rounded p-2.5 text-sm text-slate-200 outline-none focus:border-cyan-500 transition-colors"
                                                value={newTokenExpiry}
                                                onChange={(e) => setNewTokenExpiry(e.target.value)}
                                            >
                                                <option>Never</option>
                                                <option>30 Days</option>
                                                <option>90 Days</option>
                                                <option>1 Year</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] text-slate-500 uppercase font-bold block mb-2">Permissions</label>
                                        <div className="flex gap-4">
                                            {['read', 'write', 'execute'].map(scope => (
                                                <button 
                                                    key={scope}
                                                    onClick={() => toggleScope(scope)}
                                                    className={`flex items-center space-x-2 text-xs px-3 py-1.5 rounded border transition-all ${
                                                        newTokenScopes.includes(scope) 
                                                        ? 'bg-cyan-900/20 border-cyan-500/50 text-cyan-400' 
                                                        : 'bg-quantum-900 border-quantum-700 text-slate-400 hover:border-slate-500'
                                                    }`}
                                                >
                                                    {newTokenScopes.includes(scope) ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                                                    <span className="uppercase">{scope}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-2">
                                        <button 
                                            onClick={handleGenerateToken}
                                            disabled={!newTokenName || isGenerating}
                                            className="px-6 py-2.5 bg-quantum-800 hover:bg-quantum-700 border border-quantum-600 rounded text-xs text-cyan-400 font-bold transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isGenerating ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Plus className="w-3 h-3 mr-2" />}
                                            Generate Token
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- PRESETS --- */}
                {activeTab === 'presets' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {presets.map(preset => (
                            <PresetCard 
                                key={preset.id}
                                title={preset.title} 
                                desc={preset.desc} 
                                tags={preset.tags} 
                                onClick={() => handleOpenPresetDetail(preset)}
                                onCopy={(e: React.MouseEvent) => handleCopyPresetConfig(e, preset.configJSON, preset.id)}
                                isCopied={presetCopiedId === preset.id}
                            />
                        ))}
                        
                        {/* Add New Card */}
                        <div 
                            onClick={handleOpenCreatePreset}
                            className="border-2 border-dashed border-quantum-700 rounded-lg flex flex-col items-center justify-center p-6 text-slate-500 hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-quantum-900/50 transition-all cursor-pointer min-h-[180px] group"
                        >
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

const IntegrationItem: React.FC<{ data: Integration, isRefreshing: boolean, onRefresh: () => void }> = ({ data, isRefreshing, onRefresh }) => (
    <div className="p-4 bg-quantum-900 border border-quantum-700 rounded-lg flex items-center justify-between group hover:border-cyan-500/30 transition-all">
        <div className="flex items-center space-x-4">
            <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg"
                style={{ backgroundColor: data.iconColor }}
            >
                {data.iconLabel}
            </div>
            <div>
                <div className="text-sm font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">{data.name}</div>
                <div className="text-xs text-slate-500 font-mono">{data.type} • {data.lastSync}</div>
            </div>
        </div>
        <div className="flex items-center space-x-4">
            <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                data.status === 'active' ? 'bg-green-900/20 text-green-400 border-green-500/20' : 'bg-red-900/20 text-red-400 border-red-500/20'
            }`}>
                {data.status}
            </div>
            <button 
                onClick={onRefresh}
                disabled={isRefreshing}
                className={`p-2 hover:bg-quantum-800 rounded text-slate-400 hover:text-cyan-400 transition-colors ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`}
            >
                <RefreshCw className="w-4 h-4" />
            </button>
        </div>
    </div>
);

const ApiKeyItem: React.FC<{ data: ApiKey, onCopy: () => void, isCopied: boolean }> = ({ data, onCopy, isCopied }) => (
    <div className="p-4 bg-quantum-950 border border-quantum-800 rounded flex justify-between items-center hover:border-quantum-700 transition-colors">
        <div>
            <div className="flex items-center space-x-3">
                <span className="text-sm font-bold text-slate-300">{data.name}</span>
                <div className="flex space-x-1">
                    {data.scopes.map((s: string) => (
                        <span key={s} className="text-[9px] uppercase bg-quantum-800 border border-quantum-700 text-slate-400 px-1.5 py-0.5 rounded font-mono">{s}</span>
                    ))}
                </div>
            </div>
            <div className="text-xs font-mono text-slate-500 mt-1">Created: {data.created}</div>
        </div>
        <div className="flex items-center space-x-3 bg-quantum-900 px-3 py-2 rounded border border-quantum-800 font-mono text-xs">
            <span className="text-cyan-400">{data.prefix}</span>
            <div className="h-4 w-px bg-quantum-700"></div>
            <button 
                onClick={onCopy}
                className="text-slate-500 hover:text-white transition-colors flex items-center" 
                title="Copy Key"
            >
                {isCopied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            </button>
        </div>
    </div>
);

const PresetCard = ({ title, desc, tags, onClick, onCopy, isCopied }: any) => (
    <div 
        onClick={onClick}
        className="bg-quantum-900 border border-quantum-700 rounded-lg p-5 hover:border-cyan-500/30 transition-all cursor-pointer group hover:shadow-lg relative overflow-hidden min-h-[180px] flex flex-col"
    >
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Box size={80} />
        </div>
        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2 bg-quantum-950 rounded border border-quantum-700 text-cyan-500 group-hover:text-cyan-400 group-hover:shadow-glow-cyan transition-all">
                <CloudLightning className="w-5 h-5" />
            </div>
            <button 
                onClick={onCopy} 
                className="text-slate-500 hover:text-white transition-colors p-1" 
                title="Copy Configuration JSON"
            >
                {isCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
        </div>
        <h3 className="text-sm font-bold text-slate-200 mb-2 relative z-10">{title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed mb-4 flex-1 relative z-10 line-clamp-3">{desc}</p>
        <div className="flex flex-wrap gap-2 relative z-10">
            {tags.map((t: string) => (
                <span key={t} className="text-[10px] bg-quantum-800 text-slate-400 px-2 py-0.5 rounded border border-quantum-700">
                    {t}
                </span>
            ))}
        </div>
    </div>
);