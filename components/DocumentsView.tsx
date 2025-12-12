import React from 'react';
import { FileText, Folder, Clock, Download, Eye, FileCheck } from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const docs = [
    { name: 'Validation-Report-Lot-742.pdf', type: 'PDF', date: 'Oct 24, 2025', size: '2.4 MB', status: 'verified' },
    { name: 'Safety-Compliance-Audit-Q3.json', type: 'JSON', date: 'Oct 22, 2025', size: '142 KB', status: 'verified' },
    { name: 'Sim-Scenario-Thermal-V4.log', type: 'LOG', date: 'Oct 20, 2025', size: '8.1 MB', status: 'pending' },
    { name: 'Architecture-Diagram-v2.png', type: 'IMG', date: 'Oct 18, 2025', size: '4.2 MB', status: 'verified' },
  ];

  return (
    <div className="flex h-full gap-4">
        {/* Sidebar / Browser */}
        <div className="w-64 bg-quantum-900 border border-quantum-600 rounded-lg flex flex-col">
            <div className="p-3 border-b border-quantum-600">
                <h3 className="text-xs font-bold text-slate-300 uppercase">Repository</h3>
            </div>
            <div className="flex-1 p-2 space-y-1">
                <div className="flex items-center px-2 py-1.5 bg-quantum-800 rounded text-xs text-cyan-400 font-medium cursor-pointer">
                    <Folder className="w-3 h-3 mr-2" /> /system/reports
                </div>
                <div className="flex items-center px-2 py-1.5 hover:bg-quantum-800/50 rounded text-xs text-slate-400 cursor-pointer transition-colors">
                    <Folder className="w-3 h-3 mr-2" /> /compliance/audits
                </div>
                <div className="flex items-center px-2 py-1.5 hover:bg-quantum-800/50 rounded text-xs text-slate-400 cursor-pointer transition-colors">
                    <Folder className="w-3 h-3 mr-2" /> /simulations/logs
                </div>
            </div>
        </div>

        {/* Main List */}
        <div className="flex-1 bg-quantum-900 border border-quantum-600 rounded-lg flex flex-col">
             <div className="p-4 border-b border-quantum-600 flex justify-between items-center">
                 <div className="flex items-center space-x-2 text-sm text-slate-300">
                     <Folder className="w-4 h-4 text-slate-500" />
                     <span>/system/reports</span>
                     <span className="text-slate-600">({docs.length} items)</span>
                 </div>
                 <div className="flex space-x-2">
                     <input type="text" placeholder="Filter..." className="bg-quantum-950 border border-quantum-700 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none" />
                 </div>
             </div>
             
             <div className="flex-1 overflow-auto">
                 <table className="w-full text-left border-collapse">
                     <thead className="bg-quantum-950 text-xs text-slate-500 font-mono uppercase sticky top-0">
                         <tr>
                             <th className="p-3 border-b border-quantum-700">Name</th>
                             <th className="p-3 border-b border-quantum-700">Date Modified</th>
                             <th className="p-3 border-b border-quantum-700">Size</th>
                             <th className="p-3 border-b border-quantum-700">Status</th>
                             <th className="p-3 border-b border-quantum-700 text-right">Actions</th>
                         </tr>
                     </thead>
                     <tbody className="text-sm text-slate-300 divide-y divide-quantum-800">
                         {docs.map((doc, i) => (
                             <tr key={i} className="hover:bg-quantum-800/30 transition-colors group">
                                 <td className="p-3 flex items-center">
                                     <FileText className="w-4 h-4 mr-3 text-cyan-500 opacity-70" />
                                     {doc.name}
                                 </td>
                                 <td className="p-3 text-slate-500 text-xs font-mono">{doc.date}</td>
                                 <td className="p-3 text-slate-500 text-xs font-mono">{doc.size}</td>
                                 <td className="p-3">
                                     {doc.status === 'verified' ? (
                                         <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                             VERIFIED
                                         </span>
                                     ) : (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                             PENDING
                                         </span>
                                     )}
                                 </td>
                                 <td className="p-3 text-right">
                                     <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                         <button className="p-1 hover:text-cyan-400" title="Preview"><Eye className="w-4 h-4" /></button>
                                         <button className="p-1 hover:text-cyan-400" title="Download"><Download className="w-4 h-4" /></button>
                                     </div>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
        </div>
    </div>
  );
};