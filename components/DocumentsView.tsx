import React, { useState } from 'react';
import { 
    FileText, Folder, Clock, Download, Eye, FileCheck, Shield, ChevronRight, 
    MessageSquare, CheckCircle, XCircle, Send, User, Search 
} from 'lucide-react';
import { EmptyState } from './CommonUI';

export const DocumentsView: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'preview' | 'comments'>('preview');
  const [commentInput, setCommentInput] = useState('');
  const [filter, setFilter] = useState('');
  
  const allDocs = [
    { id: 0, name: 'Validation-Report-Lot-742.pdf', type: 'PDF', date: 'Oct 24, 2025', size: '2.4 MB', status: 'verified', author: 'SYS-AUTO' },
    { id: 1, name: 'Safety-Compliance-Audit-Q3.json', type: 'JSON', date: 'Oct 22, 2025', size: '142 KB', status: 'verified', author: 'Admin' },
    { id: 2, name: 'Sim-Scenario-Thermal-V4.log', type: 'LOG', date: 'Oct 20, 2025', size: '8.1 MB', status: 'pending', author: 'User-04' },
    { id: 3, name: 'Architecture-Diagram-v2.png', type: 'IMG', date: 'Oct 18, 2025', size: '4.2 MB', status: 'verified', author: 'Eng-Lead' },
  ];

  const docs = allDocs.filter(d => d.name.toLowerCase().includes(filter.toLowerCase()));
  const currentDoc = allDocs.find(d => d.id === selectedDoc);

  const [comments, setComments] = useState([
      { id: 1, user: 'ENG-Lead', text: 'Please verify the thermal variance figures on page 3.', time: '2h ago' },
      { id: 2, user: 'SYS-AUTO', text: 'Variance within acceptable limits (0.4%).', time: '1h ago' },
  ]);

  const handlePostComment = () => {
      if(!commentInput.trim()) return;
      setComments([...comments, { id: Date.now(), user: 'OP-01', text: commentInput, time: 'Just now' }]);
      setCommentInput('');
  };

  return (
    <div className="flex h-full gap-4 overflow-hidden">
        {/* Sidebar / Browser */}
        <div className="w-64 bg-quantum-900 border border-quantum-600 rounded-lg flex flex-col shrink-0">
            <div className="p-3 border-b border-quantum-600 bg-quantum-800">
                <h3 className="text-xs font-bold text-slate-300 uppercase">Repository</h3>
            </div>
            <div className="flex-1 p-2 space-y-1 overflow-y-auto">
                {['/system/reports', '/compliance/audits', '/simulations/logs', '/blueprints', '/archived'].map((folder, i) => (
                    <div key={i} className={`flex items-center px-2 py-1.5 rounded text-xs cursor-pointer ${i===0 ? 'bg-quantum-800 text-cyan-400 font-medium' : 'text-slate-400 hover:bg-quantum-800/50'}`}>
                        <Folder className={`w-3 h-3 mr-2 ${i===0 ? 'text-cyan-400' : 'text-slate-500'}`} /> 
                        {folder}
                    </div>
                ))}
            </div>
        </div>

        {/* Main List */}
        <div className="flex-1 bg-quantum-900 border border-quantum-600 rounded-lg flex flex-col min-w-0">
             <div className="p-3 border-b border-quantum-600 flex justify-between items-center shrink-0">
                 <div className="flex items-center space-x-2 text-sm text-slate-300">
                     <Folder className="w-4 h-4 text-slate-500" />
                     <span>/system/reports</span>
                     <span className="text-slate-600">({docs.length})</span>
                 </div>
                 <div className="relative">
                    <Search className="w-3 h-3 absolute left-2 top-2 text-slate-500" />
                    <input 
                        type="text" 
                        placeholder="Filter..." 
                        className="bg-quantum-950 border border-quantum-700 rounded pl-7 pr-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50 w-40" 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                 </div>
             </div>
             
             <div className="flex-1 overflow-auto">
                 {docs.length === 0 ? (
                     <EmptyState 
                        title="No documents found" 
                        description={`No files match "${filter}". Try adjusting your filters or search query.`}
                        icon={<FileText className="w-10 h-10 text-slate-600" />}
                     />
                 ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-quantum-950 text-xs text-slate-500 font-mono uppercase sticky top-0">
                            <tr>
                                <th className="p-3 border-b border-quantum-700">Name</th>
                                <th className="p-3 border-b border-quantum-700">Date</th>
                                <th className="p-3 border-b border-quantum-700">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-300 divide-y divide-quantum-800">
                            {docs.map((doc) => (
                                <tr 
                                    key={doc.id} 
                                    onClick={() => setSelectedDoc(doc.id)}
                                    className={`cursor-pointer transition-colors ${selectedDoc === doc.id ? 'bg-quantum-800/80' : 'hover:bg-quantum-800/30'}`}
                                >
                                    <td className="p-3 flex items-center">
                                        <FileText className={`w-4 h-4 mr-3 ${selectedDoc === doc.id ? 'text-cyan-400' : 'text-slate-600'}`} />
                                        <span className={selectedDoc === doc.id ? 'text-cyan-100' : 'text-slate-300'}>{doc.name}</span>
                                    </td>
                                    <td className="p-3 text-slate-500 text-xs font-mono">{doc.date}</td>
                                    <td className="p-3">
                                        {doc.status === 'verified' ? (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-green-900/20 text-green-400 border border-green-500/20">VERIFIED</span>
                                        ) : (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-yellow-900/20 text-yellow-400 border border-yellow-500/20">PENDING</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 )}
             </div>
        </div>

        {/* Right Preview Pane (Collaboration) */}
        {currentDoc && (
            <div className="w-80 bg-quantum-900 border border-quantum-600 rounded-lg flex flex-col shrink-0 animate-in slide-in-from-right-5">
                {/* Preview Header */}
                <div className="p-4 border-b border-quantum-600 bg-quantum-800/50">
                     <div className="flex items-start space-x-3">
                         <div className="w-10 h-10 bg-quantum-950 rounded flex items-center justify-center shrink-0 border border-quantum-700">
                             <FileText className="w-6 h-6 text-cyan-500" />
                         </div>
                         <div className="overflow-hidden">
                             <h3 className="text-sm font-bold text-slate-200 leading-tight truncate" title={currentDoc.name}>{currentDoc.name}</h3>
                             <div className="flex items-center space-x-2 mt-1">
                                 <span className="text-xs text-slate-500 font-mono">{currentDoc.size}</span>
                                 <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                 <span className="text-xs text-slate-500 font-mono">{currentDoc.type}</span>
                             </div>
                         </div>
                     </div>
                     
                     {/* Workflow Actions */}
                     <div className="flex space-x-2 mt-4">
                         <button className="flex-1 py-1.5 bg-green-900/20 hover:bg-green-900/30 text-green-400 border border-green-500/30 rounded text-xs font-bold flex items-center justify-center transition-colors">
                             <CheckCircle className="w-3 h-3 mr-1.5" /> Approve
                         </button>
                         <button className="flex-1 py-1.5 bg-red-900/20 hover:bg-red-900/30 text-red-400 border border-red-500/30 rounded text-xs font-bold flex items-center justify-center transition-colors">
                             <XCircle className="w-3 h-3 mr-1.5" /> Reject
                         </button>
                     </div>
                </div>
                
                {/* Tabs */}
                <div className="flex border-b border-quantum-600 bg-quantum-950">
                    <button 
                        onClick={() => setActiveTab('preview')}
                        className={`flex-1 py-2 text-xs font-medium border-b-2 transition-colors ${activeTab === 'preview' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                    >
                        Preview
                    </button>
                    <button 
                        onClick={() => setActiveTab('comments')}
                        className={`flex-1 py-2 text-xs font-medium border-b-2 transition-colors flex items-center justify-center ${activeTab === 'comments' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                    >
                        Comments
                        <span className="ml-1.5 bg-quantum-800 text-slate-400 px-1.5 rounded-full text-[9px]">{comments.length}</span>
                    </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto bg-quantum-900 relative">
                    {activeTab === 'preview' ? (
                        <div className="p-4 space-y-4">
                            <div className="w-full aspect-[3/4] bg-white/5 border border-quantum-700 rounded flex flex-col items-center justify-center text-slate-600">
                                <FileText className="w-12 h-12 opacity-50 mb-2" />
                                <span className="text-xs font-mono">PREVIEW GENERATING...</span>
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500 uppercase font-bold">Metadata</label>
                                <div className="mt-1 space-y-1">
                                    <div className="flex justify-between text-xs text-slate-400"><span>Created</span> <span>{currentDoc.date}</span></div>
                                    <div className="flex justify-between text-xs text-slate-400"><span>Author</span> <span>{currentDoc.author}</span></div>
                                    <div className="flex justify-between text-xs text-slate-400"><span>Hash</span> <span className="font-mono">0x7f...a9</span></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                                {comments.map(c => (
                                    <div key={c.id} className="flex space-x-3">
                                        <div className="w-6 h-6 rounded bg-gradient-to-tr from-cyan-600 to-purple-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                                            {c.user.substring(0,2)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-slate-300">{c.user}</span>
                                                <span className="text-[10px] text-slate-500">{c.time}</span>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed bg-quantum-800/50 p-2 rounded rounded-tl-none border border-quantum-700">
                                                {c.text}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 bg-quantum-950 border-t border-quantum-700">
                                <div className="flex items-center space-x-2 bg-quantum-900 border border-quantum-700 rounded px-2 py-1.5 focus-within:border-cyan-500/50 transition-colors">
                                    <input 
                                        type="text" 
                                        className="flex-1 bg-transparent border-none outline-none text-xs text-slate-200 placeholder-slate-600"
                                        placeholder="Add a comment..."
                                        value={commentInput}
                                        onChange={(e) => setCommentInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                                    />
                                    <button onClick={handlePostComment} disabled={!commentInput.trim()} className="text-cyan-400 hover:text-cyan-300 disabled:opacity-50">
                                        <Send className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-quantum-600 space-y-2 bg-quantum-950/30">
                    <button className="w-full py-2 bg-quantum-800 hover:bg-quantum-700 text-slate-300 border border-quantum-600 text-xs font-bold rounded flex items-center justify-center">
                        <Download className="w-3 h-3 mr-2" /> Download Original
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};