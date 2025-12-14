
import React, { useState } from 'react';
import { ProductionObjectDefinition, ProductionObjectCategory } from '../types';
import { VisualObject } from './VisualObject';
import { Search, Plus, Filter, Save, Trash2, Edit3, Check, Box } from 'lucide-react';

const INITIAL_OBJECTS: ProductionObjectDefinition[] = [
    { id: 'PROD-001', name: 'SiC Power Module', category: 'Product', variant: 'module-sic-gen3', specs: { voltage: '1200V', package: 'TO-247' }, rules: ['Max Temp 250C'], version: 'v3.1' },
    { id: 'PROD-002', name: 'Glass Interposer Wafer', category: 'Product', variant: 'wafer-300mm', specs: { diameter: '300mm', material: 'Glass' }, rules: ['Handle with Vacuum'], version: 'v1.0' },
    { id: 'MACH-101', name: 'Hybrid Bonder X', category: 'Machine', variant: 'bonder', specs: { precision: '200nm', force: '15N' }, rules: ['Cleanroom Class 10'], version: 'v2.4' },
    { id: 'MACH-102', name: 'Plasma Etcher 7', category: 'Machine', variant: 'chamber', specs: { gas: 'SF6', rfPower: '2kW' }, rules: ['Leak Check Daily'], version: 'v4.1' },
    { id: 'SENS-501', name: 'IR Thermal Cam', category: 'Sensor', variant: 'thermal', specs: { range: '-20 to 500C', fps: '60' }, rules: ['Calibrate Weekly'], version: 'v1.2' },
    { id: 'PROC-800', name: 'Sintering Stage', category: 'Process', variant: 'sintering', specs: { atmosphere: 'N2', duration: '45m' }, rules: ['Pressure > 20MPa'], version: 'v2.0' },
    { id: 'AI-900', name: 'Yield Optimizer', category: 'AI_Action', variant: 'optimize', specs: { model: 'Transformer-XL', input: 'Telemetry' }, rules: ['Confidence > 85%'], version: 'v5.0-beta' },
];

export const ObjectRegistryView: React.FC = () => {
    const [objects, setObjects] = useState(INITIAL_OBJECTS);
    const [selectedCategory, setSelectedCategory] = useState<ProductionObjectCategory | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedObject, setSelectedObject] = useState<ProductionObjectDefinition | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const filteredObjects = objects.filter(o => 
        (selectedCategory === 'All' || o.category === selectedCategory) &&
        (o.name.toLowerCase().includes(searchQuery.toLowerCase()) || o.id.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleSave = () => {
        if (!selectedObject) return;
        setObjects(prev => prev.map(o => o.id === selectedObject.id ? selectedObject : o));
        setIsEditing(false);
    };

    const handleAddDefinition = () => {
        const newObj: ProductionObjectDefinition = {
            id: `NEW-${Math.floor(Math.random() * 1000)}`,
            name: 'New Object Definition',
            category: 'Product',
            variant: 'default',
            specs: { 'key': 'value' },
            rules: [],
            version: 'v0.1'
        };
        setObjects([...objects, newObj]);
        setSelectedObject(newObj);
        setIsEditing(true);
    };

    return (
        <div className="flex h-full gap-4 overflow-hidden">
            {/* Sidebar List */}
            <div className="w-80 bg-quantum-900 border border-quantum-600 rounded-lg flex flex-col shrink-0">
                <div className="p-4 border-b border-quantum-600 bg-quantum-800/50">
                    <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wide mb-3 flex items-center">
                        <Box className="w-4 h-4 mr-2 text-cyan-400" /> Object Registry
                    </h2>
                    <div className="relative mb-3">
                        <Search className="absolute left-2.5 top-2 w-3 h-3 text-slate-500" />
                        <input 
                            type="text" 
                            placeholder="Search definition..." 
                            className="w-full bg-quantum-950 border border-quantum-700 rounded pl-8 pr-2 py-1.5 text-xs text-slate-300 focus:border-cyan-500 outline-none"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {['All', 'Product', 'Machine', 'Sensor', 'Process', 'AI_Action'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat as any)}
                                className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors ${selectedCategory === cat ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-500/30' : 'bg-quantum-950 text-slate-500 border border-transparent hover:border-quantum-700'}`}
                            >
                                {cat.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {filteredObjects.map(obj => (
                        <div 
                            key={obj.id} 
                            onClick={() => { setSelectedObject(obj); setIsEditing(false); }}
                            className={`p-3 rounded border cursor-pointer transition-all flex items-center gap-3 ${selectedObject?.id === obj.id ? 'bg-quantum-800 border-cyan-500/50 shadow-glow-cyan' : 'bg-quantum-950/30 border-quantum-700 hover:border-quantum-600'}`}
                        >
                            <div className="p-2 bg-quantum-900 rounded border border-quantum-700 text-slate-300">
                                <VisualObject category={obj.category} variant={obj.variant} size={20} />
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-xs font-bold text-slate-200 truncate">{obj.name}</div>
                                <div className="text-[10px] text-slate-500 font-mono flex items-center">
                                    {obj.id} • <span className="ml-1 opacity-70">{obj.category}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="p-3 border-t border-quantum-600 bg-quantum-950">
                    <button 
                        onClick={handleAddDefinition}
                        className="w-full py-2 bg-quantum-800 hover:bg-quantum-700 border border-quantum-600 rounded text-xs font-bold text-slate-300 flex items-center justify-center transition-colors"
                    >
                        <Plus className="w-3 h-3 mr-2" /> Add Definition
                    </button>
                </div>
            </div>

            {/* Main Detail Editor */}
            <div className="flex-1 bg-quantum-900 border border-quantum-600 rounded-lg flex flex-col overflow-hidden relative">
                {selectedObject ? (
                    <>
                        {/* Header */}
                        <div className="h-16 border-b border-quantum-600 bg-quantum-800/50 flex justify-between items-center px-6 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-cyan-900/20 rounded-lg border border-cyan-500/30 text-cyan-400">
                                    <VisualObject category={selectedObject.category} variant={selectedObject.variant} size={32} />
                                </div>
                                <div>
                                    {isEditing ? (
                                        <input 
                                            className="bg-quantum-950 border border-quantum-700 rounded px-2 py-1 text-lg font-bold text-slate-100 outline-none focus:border-cyan-500"
                                            value={selectedObject.name}
                                            onChange={(e) => setSelectedObject({...selectedObject, name: e.target.value})}
                                        />
                                    ) : (
                                        <h1 className="text-lg font-bold text-slate-100">{selectedObject.name}</h1>
                                    )}
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-1">
                                        <span className="bg-quantum-950 px-1.5 py-0.5 rounded border border-quantum-700">{selectedObject.id}</span>
                                        <span>Version: {selectedObject.version}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {isEditing ? (
                                    <>
                                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-quantum-950 border border-quantum-700 rounded text-xs font-bold text-slate-400 hover:text-slate-200">Cancel</button>
                                        <button onClick={handleSave} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded text-xs font-bold flex items-center shadow-lg"><Save className="w-3 h-3 mr-2" /> Save Changes</button>
                                    </>
                                ) : (
                                    <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-bold flex items-center shadow-lg"><Edit3 className="w-3 h-3 mr-2" /> Edit Object</button>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8">
                            <div className="grid grid-cols-2 gap-8">
                                {/* Visual Preview */}
                                <div className="col-span-2 md:col-span-1">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Visual Token Representation</h3>
                                    <div className="aspect-square bg-quantum-950 rounded-xl border border-quantum-700 flex items-center justify-center relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e293b_1px,_transparent_1px)] bg-[length:20px_20px] opacity-20"></div>
                                        <VisualObject category={selectedObject.category} variant={selectedObject.variant} size={180} className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute bottom-4 right-4 text-[10px] font-mono text-slate-600">SVG: {selectedObject.variant}.svg</div>
                                    </div>
                                    {isEditing && (
                                        <div className="mt-4">
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Variant Type</label>
                                            <input 
                                                className="w-full bg-quantum-950 border border-quantum-700 rounded p-2 text-slate-200 outline-none focus:border-cyan-500 text-xs font-mono"
                                                value={selectedObject.variant}
                                                onChange={(e) => setSelectedObject({...selectedObject, variant: e.target.value})}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Metadata Form */}
                                <div className="col-span-2 md:col-span-1 space-y-6">
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Core Specifications</h3>
                                        <div className="bg-quantum-950 border border-quantum-700 rounded-lg overflow-hidden">
                                            {Object.entries(selectedObject.specs).map(([key, val], i) => (
                                                <div key={key} className={`flex justify-between items-center p-3 text-xs ${i !== 0 ? 'border-t border-quantum-800' : ''}`}>
                                                    <span className="text-slate-500 uppercase">{key}</span>
                                                    {isEditing ? (
                                                        <input 
                                                            className="bg-quantum-900 border border-quantum-700 rounded px-2 py-1 text-slate-200 w-32 text-right outline-none focus:border-cyan-500" 
                                                            value={val} 
                                                            onChange={(e) => {
                                                                const newSpecs = {...selectedObject.specs, [key]: e.target.value};
                                                                setSelectedObject({...selectedObject, specs: newSpecs});
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="font-mono text-slate-200">{val}</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Validation Rules</h3>
                                        <div className="space-y-2">
                                            {selectedObject.rules.map((rule, i) => (
                                                <div key={i} className="flex items-center p-3 bg-quantum-950 border border-quantum-700 rounded text-xs text-slate-300">
                                                    <Check className="w-3 h-3 text-green-500 mr-3" />
                                                    {rule}
                                                </div>
                                            ))}
                                            {isEditing && (
                                                <button className="w-full py-2 border border-dashed border-quantum-700 rounded text-xs text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors">+ Add Rule</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500">
                        <Box className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-sm">Select an object definition to view details.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
