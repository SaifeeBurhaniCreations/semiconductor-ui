import React, { useState } from 'react';
import { 
    FileText, Folder, Clock, Download, Eye, FileCheck, Shield, ChevronRight, 
    MessageSquare, CheckCircle, XCircle, Send, User, Search, CornerUpLeft, Home
} from 'lucide-react';
import { EmptyState } from './CommonUI';

// Data Types
interface FileSystemItem {
    id: string;
    parentId: string | null;
    name: string;
    type: 'folder' | 'file';
    fileType?: 'PDF' | 'JSON' | 'LOG' | 'IMG'; 
    size?: string;
    date: string;
    status?: 'verified' | 'pending' | 'rejected' | 'approved';
    author?: string;
    content?: string; // Mock content for preview
}

// Mock Data Structure
const INITIAL_FS: FileSystemItem[] = [
    { id: 'f1', name: 'System Reports', type: 'folder', parentId: null, date: 'Oct 24' },
    { id: 'f2', name: 'Compliance Audits', type: 'folder', parentId: null, date: 'Oct 22' },
    { id: 'f3', name: 'Blueprints', type: 'folder', parentId: null, date: 'Oct 20' },
    { id: 'f4', name: 'Archives', type: 'folder', parentId: null, date: 'Jan 01' },
    
    // Inside System Reports
    { id: 'd1', name: 'Validation-Lot-742.pdf', type: 'file', fileType: 'PDF', parentId: 'f1', size: '2.4 MB', date: 'Oct 24', status: 'verified', author: 'SYS-AUTO', content: 'VALIDATION REPORT\n\nLot ID: 742\nYield: 98.2%\nDefects: 0\nStatus: PASSED' },
    { id: 'd2', name: 'Thermal-Log-A9.log', type: 'file', fileType: 'LOG', parentId: 'f1', size: '8.1 MB', date: 'Oct 23', status: 'pending', author: 'Sensor-Net', content: '[10:00:01] Temp: 42.1C\n[10:00:02] Temp: 42.3C\n[10:00:03] Temp: 42.2C\n...' },
    
    // Inside Compliance
    { id: 'd3', name: 'Safety-Audit-Q3.json', type: 'file', fileType: 'JSON', parentId: 'f2', size: '142 KB', date: 'Oct 22', status: 'approved', author: 'Admin', content: '{\n  "audit_id": "AUD-Q3",\n  "compliance": true,\n  "issues": []\n}' },
    
    // Inside Blueprints
    { id: 'f_bp_sub', name: 'Schematics', type: 'folder', parentId: 'f3', date: 'Oct 18' },
    { id: 'd4', name: 'Arch-Diagram-v2.png', type: 'file', fileType: 'IMG', parentId: 'f3', size: '4.2 MB', date: 'Oct 18', status: 'verified', author: 'Eng-Lead', content: '[IMAGE BINARY DATA]' },
    
    // Inside Blueprints/Schematics
    { id: 'd5', name: 'Circuit-Logic.pdf', type: 'file', fileType: 'PDF', parentId: 'f_bp_sub', size: '1.2 MB', date: 'Oct 15', status: 'verified', author: 'Eng-Lead', content: 'Circuit Logic Diagram v1.0' },
];

export const DocumentsView: React.FC = () => {
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>(INITIAL_FS);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'preview' | 'comments'>('preview');
  const [commentInput, setCommentInput] = useState('');
  const [filter, setFilter] = useState('');
  const [comments, setComments] = useState<{id: number, user: string, text: string, time: string}[]>([]);

  // Navigation Helpers
  const currentItems = fileSystem.filter(item => item.parentId === currentFolderId && item.name.toLowerCase().includes(filter.toLowerCase()));
  const currentFile = fileSystem.find(item => item.id === selectedFileId);
  const currentFolder = fileSystem.find(item => item.id === currentFolderId);

  // Breadcrumbs
  const getBreadcrumbs = () => {
      const crumbs = [];
      let curr = currentFolderId;
      while (curr) {
          const folder = fileSystem.find(f => f.id === curr);
          if (folder) {
              crumbs.unshift(folder);
              curr = folder.parentId;
          } else {
              break;
          }
      }
      return crumbs;
  };

  // Handlers
  const handleItemClick = (item: FileSystemItem) => {
      if (item.type === 'folder') {
          setCurrentFolderId(item.id);
          setSelectedFileId(null); // Deselect file when changing folder
          setFilter('');
      } else {
          setSelectedFileId(item.id);
          // Mock fetch comments
          setComments([
              { id: 1, user: 'ENG-Lead', text: `Please review ${item.name} for compliance.`, time: '2h ago' },
              { id: 2, user: 'SYS-AUTO', text: ' Automated scan passed.', time: '1h ago' },
          ]);
      }
  };

  const handleNavigateUp = () => {
      if (currentFolder) {
          setCurrentFolderId(currentFolder.parentId);
      }
  };

  const handleNavigateRoot = () => {
      setCurrentFolderId(null);
  };

  const handlePostComment = () => {
      if(!commentInput.trim()) return;
      setComments([...comments, { id: Date.now(), user: 'OP-01', text: commentInput, time: 'Just now' }]);
      setCommentInput('');
  };

  const handleStatusChange = (status: 'approved' | 'rejected') => {
      if (!currentFile) return;
      
      const newStatus = status === 'approved' ? 'approved' : 'rejected';
      
      setFileSystem(prev => prev.map(f => f.id === currentFile.id ? { ...f, status: newStatus } : f));
      
      // Feedback
      alert(`Document ${currentFile.name} marked as ${newStatus.toUpperCase()}.`);
  };

  const handleDownload = () => {
      if (!currentFile) return;
      alert(`Downloading ${currentFile.name}...`);
  };

  return (
    <div className="flex h-full gap-4 overflow-hidden">
        {/* Sidebar / Browser */}
        <div className="w-64 bg-quantum-900 border border-quantum-600 rounded-lg flex flex-col shrink-0">
            <div className="p-3 border-b border-quantum-600 bg-quantum-800">
                <h3 className="text-xs font-bold text-slate-300 uppercase">Quick Access</h3>
            </div>
            <div className="flex-1 p-2 space-y-1 overflow-y-auto">
                <div 
                    onClick={handleNavigateRoot}
                    className={`flex items-center px-2 py-1.5 rounded text-xs cursor-pointer ${currentFolderId === null ? 'bg-quantum-800 text-cyan-400 font-medium' : 'text-slate-400 hover:bg-quantum-800/50'}`}
                >
                    <Home className={`w-3 h-3 mr-2 ${currentFolderId === null ? 'text-cyan-400' : 'text-slate-500'}`} /> 
                    Root
                </div>
                {/* Top Level Folders for Quick Access */}
                {fileSystem.filter(f => f.parentId === null && f.type === 'folder').map((folder) => (
                    <div 
                        key={folder.id} 
                        onClick={() => handleItemClick(folder)}
                        className={`flex items-center px-2 py-1.5 rounded text-xs cursor-pointer ${currentFolderId === folder.id ? 'bg-quantum-800 text-cyan-400 font-medium' : 'text-slate-400 hover:bg-quantum-800/50'}`}
                    >
                        <Folder className={`w-3 h-3 mr-2 ${currentFolderId === folder.id ? 'text-cyan-400' : 'text-slate-500'}`} /> 
                        {folder.name}
                    </div>
                ))}
            </div>
        </div>

        {/* Main List */}
        <div className="flex-1 bg-quantum-900 border border-quantum-600 rounded-lg flex flex-col min-w-0">
             {/* Header with Breadcrumbs & Search */}
             <div className="p-3 border-b border-quantum-600 flex justify-between items-center shrink-0 bg-quantum-800/30">
                 <div className="flex items-center space-x-2 text-sm text-slate-300">
                     <button onClick={handleNavigateRoot} className="p-1 hover:bg-quantum-800 rounded text-slate-500 hover:text-slate-300">
                        <Home className="w-4 h-4" />
                     </button>
                     {getBreadcrumbs().map((folder) => (
                         <React.Fragment key={folder.id}>
                             <span className="text-slate-600">/</span>
                             <button 
                                onClick={() => setCurrentFolderId(folder.id)}
                                className="hover:text-cyan-400 hover:underline transition-colors"
                             >
                                 {folder.name}
                             </button>
                         </React.Fragment>
                     ))}
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
             
             {/* Back Button if not root */}
             {currentFolderId && (
                 <div className="px-3 py-2 border-b border-quantum-800 bg-quantum-950/30">
                     <button onClick={handleNavigateUp} className="flex items-center text-xs text-slate-500 hover:text-cyan-400 transition-colors">
                         <CornerUpLeft className="w-3 h-3 mr-1.5" /> Back to parent
                     </button>
                 </div>
             )}

             <div className="flex-1 overflow-auto">
                 {currentItems.length === 0 ? (
                     <EmptyState 
                        title="Folder is empty" 
                        description={filter ? `No items match "${filter}"` : "This directory contains no files."}
                        icon={<Folder className="w-10 h-10 text-slate-700" />}
                     />
                 ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-quantum-950 text-xs text-slate-500 font-mono uppercase sticky top-0">
                            <tr>
                                <th className="p-3 border-b border-quantum-700">Name</th>
                                <th className="p-3 border-b border-quantum-700">Date</th>
                                <th className="p-3 border-b border-quantum-700">Type</th>
                                <th className="p-3 border-b border-quantum-700">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-300 divide-y divide-quantum-800">
                            {currentItems.map((item) => (
                                <tr 
                                    key={item.id} 
                                    onClick={() => handleItemClick(item)}
                                    className={`cursor-pointer transition-colors ${selectedFileId === item.id ? 'bg-quantum-800/80' : 'hover:bg-quantum-800/30'}`}
                                >
                                    <td className="p-3 flex items-center">
                                        {item.type === 'folder' ? (
                                            <Folder className="w-4 h-4 mr-3 text-cyan-600" />
                                        ) : (
                                            <FileText className={`w-4 h-4 mr-3 ${selectedFileId === item.id ? 'text-cyan-400' : 'text-slate-600'}`} />
                                        )}
                                        <span className={selectedFileId === item.id ? 'text-cyan-100' : 'text-slate-300'}>{item.name}</span>
                                    </td>
                                    <td className="p-3 text-slate-500 text-xs font-mono">{item.date}</td>
                                    <td className="p-3 text-xs text-slate-500">{item.type === 'folder' ? 'Folder' : item.fileType}</td>
                                    <td className="p-3">
                                        {item.status === 'verified' || item.status === 'approved' ? (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-green-900/20 text-green-400 border border-green-500/20">
                                                {item.status.toUpperCase()}
                                            </span>
                                        ) : item.status === 'rejected' ? (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-red-900/20 text-red-400 border border-red-500/20">REJECTED</span>
                                        ) : item.status === 'pending' ? (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-yellow-900/20 text-yellow-400 border border-yellow-500/20">PENDING</span>
                                        ) : (
                                            <span className="text-slate-600">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 )}
             </div>
        </div>

        {/* Right Preview Pane */}
        {currentFile && (
            <div className="w-96 bg-quantum-900 border border-quantum-600 rounded-lg flex flex-col shrink-0 animate-in slide-in-from-right-5">
                {/* Preview Header */}
                <div className="p-4 border-b border-quantum-600 bg-quantum-800/50">
                     <div className="flex items-start space-x-3">
                         <div className="w-10 h-10 bg-quantum-950 rounded flex items-center justify-center shrink-0 border border-quantum-700">
                             <FileText className="w-6 h-6 text-cyan-500" />
                         </div>
                         <div className="overflow-hidden">
                             <h3 className="text-sm font-bold text-slate-200 leading-tight truncate" title={currentFile.name}>{currentFile.name}</h3>
                             <div className="flex items-center space-x-2 mt-1">
                                 <span className="text-xs text-slate-500 font-mono">{currentFile.size}</span>
                                 <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                 <span className="text-xs text-slate-500 font-mono">{currentFile.fileType}</span>
                             </div>
                         </div>
                     </div>
                     
                     {/* Workflow Actions */}
                     <div className="flex space-x-2 mt-4">
                         <button 
                            onClick={() => handleStatusChange('approved')}
                            className="flex-1 py-1.5 bg-green-900/20 hover:bg-green-900/30 text-green-400 border border-green-500/30 rounded text-xs font-bold flex items-center justify-center transition-colors"
                         >
                             <CheckCircle className="w-3 h-3 mr-1.5" /> Approve
                         </button>
                         <button 
                            onClick={() => handleStatusChange('rejected')}
                            className="flex-1 py-1.5 bg-red-900/20 hover:bg-red-900/30 text-red-400 border border-red-500/30 rounded text-xs font-bold flex items-center justify-center transition-colors"
                         >
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
                            <div className="w-full aspect-[3/4] bg-white/5 border border-quantum-700 rounded flex flex-col p-4 text-slate-400 font-mono text-xs overflow-auto">
                                <pre className="whitespace-pre-wrap">{currentFile.content || "No preview available."}</pre>
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500 uppercase font-bold">Metadata</label>
                                <div className="mt-1 space-y-1">
                                    <div className="flex justify-between text-xs text-slate-400"><span>Created</span> <span>{currentFile.date}</span></div>
                                    <div className="flex justify-between text-xs text-slate-400"><span>Author</span> <span>{currentFile.author}</span></div>
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
                    <button 
                        onClick={handleDownload}
                        className="w-full py-2 bg-quantum-800 hover:bg-quantum-700 text-slate-300 border border-quantum-600 text-xs font-bold rounded flex items-center justify-center transition-colors"
                    >
                        <Download className="w-3 h-3 mr-2" /> Download Original
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};