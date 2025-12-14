import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, Lock, Key, Sliders, RefreshCw, ShieldAlert, CheckSquare, GitPullRequest, UploadCloud, Copy, Loader2, Eye, EyeOff } from 'lucide-react';

interface FeatureFlag {
    id: string;
    label: string;
    desc: string;
    active: boolean;
    rollout?: number;
    rolloutColor?: string;
}

interface Recipe {
    id: string;
    name: string;
    version: string;
    modified: string;
    status: 'LIVE' | 'ARCHIVED' | 'DRAFT';
}

export const ConfigurationView: React.FC = () => {
  // State - Feature Flags
  const [features, setFeatures] = useState<FeatureFlag[]>([
      { id: 'f1', label: 'Experimental Quantum Solver', desc: 'Enable Tier-2 unstable QPU access.', active: true, rollout: 5, rolloutColor: 'bg-purple-500' },
      { id: 'f2', label: 'Auto-Healing Logic', desc: 'Allow AI to rewrite paths automatically.', active: false },
      { id: 'f3', label: 'Verbose Telemetry', desc: 'Stream raw sensor data to archival.', active: true, rollout: 100, rolloutColor: 'bg-cyan-500' },
  ]);

  // State - Keys
  const [keys, setKeys] = useState({
      master: 'sk_live_892349894x',
      bridge: 'qb_v1_8823f2a'
  });
  const [rotating, setRotating] = useState<string | null>(null);
  const [showKey, setShowKey] = useState<string | null>(null);

  // State - Recipes
  const [recipes, setRecipes] = useState<Recipe[]>([
      { id: 'r1', name: 'Reflow-Profile-A7', version: 'v4.2', modified: '2h ago', status: 'LIVE' },
      { id: 'r2', name: 'Etch-Standard-v2', version: 'v2.0', modified: 'Deprecated', status: 'ARCHIVED' },
  ]);

  // State - Toast Notification
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'info'} | null>(null);

  // --- Handlers ---

  const showToast = (msg: string, type: 'success' | 'info' = 'info') => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 3000);
  };

  const toggleFeature = (id: string) => {
      setFeatures(prev => prev.map(f => f.id === id ? { ...f, active: !f.active } : f));
  };

  const rotateKey = (keyType: 'master' | 'bridge') => {
      if (!window.confirm(`Rotate ${keyType.toUpperCase()} key? This will invalidate the old key immediately.`)) return;
      
      setRotating(keyType);
      setTimeout(() => {
          const newKey = keyType === 'master' 
              ? `sk_live_${Math.random().toString(36).substring(2, 12)}x`
              : `qb_v1_${Math.random().toString(36).substring(2, 10)}a`;
          
          setKeys(prev => ({ ...prev, [keyType]: newKey }));
          setRotating(null);
          showToast(`${keyType === 'master' ? 'Master' : 'Bridge'} Key rotated successfully.`, 'success');
      }, 2000);
  };

  const handleFork = (recipe: Recipe) => {
      const newVersion = parseFloat(recipe.version.replace('v', '')) + 0.1;
      const newRecipe: Recipe = {
          id: `r-${Date.now()}`,
          name: `${recipe.name}-Copy`,
          version: `v${newVersion.toFixed(1)}`,
          modified: 'Just now',
          status: 'DRAFT'
      };
      setRecipes([newRecipe, ...recipes]);
      showToast(`Forked ${recipe.name} to ${newRecipe.name}`, 'success');
  };

  const handleDeploy = (id: string) => {
      setRecipes(prev => prev.map(r => {
          if (r.id === id) return { ...r, status: 'LIVE' };
          if (r.status === 'LIVE') return { ...r, status: 'ARCHIVED' };
          return r;
      }));
      showToast('Recipe deployed to production.', 'success');
  };

  const handleManageAll = () => {
      alert("Opening Recipe Manager Module...");
  };

  const handlePRClick = () => {
      alert("Opening Git Pull Request details...");
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-y-auto pr-2 custom-scrollbar relative">
        
        {/* Toast Notification */}
        {toast && (
            <div className="absolute top-4 right-4 z-50 bg-quantum-800 border border-cyan-500/50 text-cyan-400 px-4 py-2 rounded shadow-2xl animate-in slide-in-from-top-5 text-sm font-bold flex items-center">
                <CheckSquare className="w-4 h-4 mr-2" />
                {toast.msg}
            </div>
        )}

        {/* Feature Flags */}
        <div className="bg-quantum-900 border border-quantum-600 rounded-lg p-5">
            <h3 className="text-sm font-bold text-slate-200 uppercase mb-4 flex items-center">
                <Sliders className="w-4 h-4 mr-2 text-purple-400" /> Feature Flags & Rollouts
            </h3>
            <div className="space-y-6">
                {features.map(f => (
                    <div key={f.id}>
                        <ToggleItem 
                            label={f.label} 
                            desc={f.desc} 
                            active={f.active} 
                            onClick={() => toggleFeature(f.id)} 
                        />
                        {f.rollout && f.active && (
                            <div className="mt-2 pl-1 animate-in fade-in">
                                <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                    <span>Rollout: {f.rollout === 100 ? '100%' : `Canary (${f.rollout}%)`}</span>
                                    <span>Target: Global</span>
                                </div>
                                <div className="w-full h-1 bg-quantum-950 rounded-full overflow-hidden">
                                    <div className={`h-full ${f.rolloutColor || 'bg-cyan-500'}`} style={{ width: `${f.rollout}%` }}></div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>

        {/* Process Recipe Library */}
        <div className="bg-quantum-900 border border-quantum-600 rounded-lg p-5">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-200 uppercase flex items-center">
                    <RefreshCw className="w-4 h-4 mr-2 text-cyan-400" /> Process Recipe Library
                </h3>
                <button onClick={handleManageAll} className="text-[10px] text-cyan-400 hover:underline">Manage All</button>
            </div>
            <div className="space-y-3">
                {recipes.map(recipe => (
                    <div key={recipe.id} className={`p-3 bg-quantum-950 border rounded flex flex-col gap-2 transition-all ${recipe.status === 'ARCHIVED' ? 'opacity-60 border-quantum-700' : 'border-quantum-700 hover:border-cyan-500/30'}`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-xs font-bold text-slate-200 flex items-center">
                                    {recipe.name} 
                                    <span className={`ml-2 px-1.5 py-0.5 rounded border text-[9px] ${
                                        recipe.status === 'LIVE' ? 'bg-green-900/20 text-green-400 border-green-500/20' : 
                                        recipe.status === 'DRAFT' ? 'bg-orange-900/20 text-orange-400 border-orange-500/20' :
                                        'bg-slate-800 text-slate-500 border-slate-700'
                                    }`}>
                                        {recipe.status}
                                    </span>
                                </div>
                                <div className="text-[10px] text-slate-500 mt-0.5">{recipe.version} • {recipe.modified}</div>
                            </div>
                            <button onClick={handlePRClick} className="text-slate-500 hover:text-cyan-400" title="View PR"><GitPullRequest className="w-3 h-3" /></button>
                        </div>
                        {recipe.status !== 'ARCHIVED' && (
                            <div className="flex space-x-2 pt-2 border-t border-quantum-800">
                                <button 
                                    onClick={() => handleFork(recipe)}
                                    className="flex-1 py-1 bg-quantum-800 hover:bg-quantum-700 text-[10px] rounded text-slate-300 flex items-center justify-center transition-colors"
                                >
                                    <Copy className="w-3 h-3 mr-1.5" /> Fork
                                </button>
                                <button 
                                    onClick={() => handleDeploy(recipe.id)}
                                    className="flex-1 py-1 bg-cyan-900/20 hover:bg-cyan-900/30 border border-cyan-500/20 text-[10px] rounded text-cyan-400 flex items-center justify-center transition-colors"
                                >
                                    <UploadCloud className="w-3 h-3 mr-1.5" /> Deploy
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>

        {/* Approval Gates */}
        <div className="bg-quantum-900 border border-quantum-600 rounded-lg p-5">
             <h3 className="text-sm font-bold text-slate-200 uppercase mb-4 flex items-center">
                <ShieldAlert className="w-4 h-4 mr-2 text-orange-400" /> Approval Gates
            </h3>
            <div className="space-y-3">
                 <div className="flex items-center justify-between p-3 bg-quantum-950 border border-quantum-700 rounded">
                     <div className="flex items-center">
                         <CheckSquare className="w-4 h-4 text-slate-500 mr-3" />
                         <div>
                             <div className="text-xs font-bold text-slate-200">Production Deployments</div>
                             <div className="text-[10px] text-slate-500">Requires 2 senior engineer signatures.</div>
                         </div>
                     </div>
                     <span className="text-[10px] text-orange-400 font-mono bg-orange-900/20 px-1.5 py-0.5 rounded border border-orange-500/30">STRICT</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-quantum-950 border border-quantum-700 rounded">
                     <div className="flex items-center">
                         <CheckSquare className="w-4 h-4 text-slate-500 mr-3" />
                         <div>
                             <div className="text-xs font-bold text-slate-200">Simulation Parameter Updates</div>
                             <div className="text-[10px] text-slate-500">Requires AI validation pass.</div>
                         </div>
                     </div>
                     <span className="text-[10px] text-cyan-400 font-mono bg-cyan-900/20 px-1.5 py-0.5 rounded border border-cyan-500/30">AUTO</span>
                 </div>
            </div>
        </div>

        {/* Security / Secrets */}
        <div className="bg-quantum-900 border border-quantum-600 rounded-lg p-5">
             <h3 className="text-sm font-bold text-slate-200 uppercase mb-4 flex items-center">
                <Lock className="w-4 h-4 mr-2 text-red-400" /> Access Control & Secrets
            </h3>
            <div className="space-y-4">
                 {/* Master Key */}
                 <div className="p-3 bg-quantum-950 border border-quantum-700 rounded flex flex-col justify-between">
                     <div className="flex items-start justify-between">
                         <span className="text-xs font-mono text-slate-400">API_KEY_MASTER</span>
                         <Key className="w-4 h-4 text-slate-600" />
                     </div>
                     <div className="mt-3 flex items-center justify-between">
                         <div className="flex items-center space-x-2">
                            <span className="text-xs font-mono text-slate-200">
                                {showKey === 'master' ? keys.master : keys.master.substring(0, 8) + '...'}
                            </span>
                            <button onClick={() => setShowKey(showKey === 'master' ? null : 'master')} className="text-slate-600 hover:text-slate-400">
                                {showKey === 'master' ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                         </div>
                         <button 
                            onClick={() => rotateKey('master')}
                            disabled={rotating === 'master'}
                            className="text-[10px] text-red-400 hover:text-red-300 border border-red-900/50 px-2 py-0.5 rounded bg-red-900/10 flex items-center"
                         >
                             {rotating === 'master' ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                             Rotate (MFA)
                         </button>
                     </div>
                 </div>

                 {/* Bridge Token */}
                 <div className="p-3 bg-quantum-950 border border-quantum-700 rounded flex flex-col justify-between">
                     <div className="flex items-start justify-between">
                         <span className="text-xs font-mono text-slate-400">QUANTUM_BRIDGE_TOKEN</span>
                         <Key className="w-4 h-4 text-slate-600" />
                     </div>
                     <div className="mt-3 flex items-center justify-between">
                         <div className="flex items-center space-x-2">
                            <span className="text-xs font-mono text-slate-200">
                                {showKey === 'bridge' ? keys.bridge : keys.bridge.substring(0, 8) + '...'}
                            </span>
                            <button onClick={() => setShowKey(showKey === 'bridge' ? null : 'bridge')} className="text-slate-600 hover:text-slate-400">
                                {showKey === 'bridge' ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                         </div>
                         <button 
                            onClick={() => rotateKey('bridge')}
                            disabled={rotating === 'bridge'}
                            className="text-[10px] text-red-400 hover:text-red-300 border border-red-900/50 px-2 py-0.5 rounded bg-red-900/10 flex items-center"
                         >
                             {rotating === 'bridge' ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                             Rotate (MFA)
                         </button>
                     </div>
                 </div>
            </div>
        </div>
    </div>
  );
};

const ToggleItem = ({ label, desc, active, onClick }: { label: string, desc: string, active: boolean, onClick: () => void }) => (
    <div onClick={onClick} className="flex items-start justify-between group cursor-pointer select-none">
        <div>
            <div className={`text-xs font-bold transition-colors ${active ? 'text-cyan-400' : 'text-slate-200 group-hover:text-cyan-400'}`}>{label}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{desc}</div>
        </div>
        <button className={`text-2xl transition-colors ${active ? 'text-cyan-400' : 'text-slate-700'}`}>
            {active ? <ToggleRight /> : <ToggleLeft />}
        </button>
    </div>
);