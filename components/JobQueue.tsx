import React, { useState } from 'react';
import { Play, Pause, X, GripVertical, Clock, Cpu, AlertCircle, Activity, Layers, CalendarPlus } from 'lucide-react';

const INITIAL_JOBS = [
    { id: 'JOB-9021', name: 'Simulation: Thermal Stress', priority: 'HIGH', status: 'RUNNING', progress: 45, owner: 'ENG-01', resource: 'Q-Core-A' },
    { id: 'JOB-9022', name: 'Analytics: Weekly Yield', priority: 'NORMAL', status: 'QUEUED', progress: 0, owner: 'SYS-AUTO', resource: 'Cloud-Hybrid' },
    { id: 'JOB-9024', name: 'Validation: Node 742', priority: 'LOW', status: 'QUEUED', progress: 0, owner: 'ENG-03', resource: 'Local' },
];

export const JobQueue: React.FC = () => {
  const [jobs, setJobs] = useState(INITIAL_JOBS);

  const handleCancelAll = () => {
      if (confirm("Are you sure you want to terminate all active and queued jobs?")) {
          setJobs([]);
      }
  };

  const handlePrioritize = () => {
      // Sort by priority: HIGH > NORMAL > LOW
      const priorityMap: Record<string, number> = { 'HIGH': 3, 'NORMAL': 2, 'LOW': 1 };
      const sorted = [...jobs].sort((a, b) => priorityMap[b.priority] - priorityMap[a.priority]);
      setJobs(sorted);
  };

  const handleRemoveJob = (id: string) => {
      setJobs(jobs.filter(j => j.id !== id));
  };

  const handleAddJob = () => {
      const newJob = { 
          id: `JOB-${Math.floor(9025 + Math.random() * 1000)}`, 
          name: 'Manual Task: Diagnostics', 
          priority: 'NORMAL', 
          status: 'QUEUED', 
          progress: 0, 
          owner: 'OP-01', 
          resource: 'Q-Core-B' 
      };
      setJobs([...jobs, newJob]);
  };

  const isEmpty = jobs.length === 0;

  return (
    <div className="h-64 bg-quantum-900 border-t border-quantum-600 flex flex-col shrink-0">
      <div className="px-4 py-2 bg-quantum-800 border-b border-quantum-600 flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Orchestration Queue</h3>
            {!isEmpty && <span className="text-[10px] bg-quantum-950 px-1.5 py-0.5 rounded text-slate-400 border border-quantum-700">{jobs.length} Active</span>}
        </div>
        <div className="flex space-x-2">
            <button 
                onClick={handleCancelAll}
                className="text-[10px] px-2 py-1 bg-quantum-700 hover:bg-quantum-600 rounded text-slate-300 border border-quantum-600 transition-colors"
            >
                Cancel All
            </button>
            <button 
                onClick={handlePrioritize}
                className="text-[10px] px-2 py-1 bg-quantum-700 hover:bg-quantum-600 rounded text-slate-300 border border-quantum-600 transition-colors"
            >
                Prioritize
            </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-0 bg-quantum-950/30">
        {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-3">
                <div className="p-3 bg-quantum-900 rounded-full border border-quantum-700">
                    <Layers className="w-6 h-6 opacity-50" />
                </div>
                <div className="text-center">
                    <p className="text-sm font-medium text-slate-400">No Jobs Queued</p>
                    <p className="text-xs max-w-xs mt-1">The system is idle. Initialize a simulation or analytics task to populate the queue.</p>
                </div>
                <button 
                    onClick={handleAddJob}
                    className="flex items-center px-3 py-1.5 bg-cyan-900/20 hover:bg-cyan-900/40 text-cyan-400 border border-cyan-500/30 rounded text-xs transition-colors"
                >
                    <CalendarPlus className="w-3 h-3 mr-2" /> Schedule Job
                </button>
            </div>
        ) : (
            <table className="w-full text-left text-xs font-mono">
            <thead className="text-slate-500 bg-quantum-950 sticky top-0 uppercase">
                <tr>
                <th className="px-4 py-2 font-normal w-8"></th>
                <th className="px-4 py-2 font-normal">Job ID</th>
                <th className="px-4 py-2 font-normal">Task Name</th>
                <th className="px-4 py-2 font-normal">Priority</th>
                <th className="px-4 py-2 font-normal">Status</th>
                <th className="px-4 py-2 font-normal">Resource</th>
                <th className="px-4 py-2 font-normal text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-quantum-800 text-slate-300">
                {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-quantum-800/50 group transition-colors">
                    <td className="px-4 py-2 text-slate-600 cursor-grab"><GripVertical className="w-3 h-3" /></td>
                    <td className="px-4 py-2 font-bold text-cyan-500">{job.id}</td>
                    <td className="px-4 py-2">{job.name}</td>
                    <td className="px-4 py-2">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                            job.priority === 'HIGH' ? 'bg-orange-900/20 border-orange-500/30 text-orange-400' : 
                            job.priority === 'NORMAL' ? 'bg-cyan-900/20 border-cyan-500/30 text-cyan-400' : 'bg-slate-800 border-slate-600 text-slate-400'
                        }`}>
                            {job.priority}
                        </span>
                    </td>
                    <td className="px-4 py-2">
                        {job.status === 'RUNNING' ? (
                            <div className="flex flex-col w-24">
                                <span className="text-[10px] text-green-400 mb-1 flex items-center"><Activity className="w-3 h-3 mr-1" /> {job.progress}%</span>
                                <div className="w-full h-1 bg-quantum-950 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500" style={{ width: `${job.progress}%` }}></div>
                                </div>
                            </div>
                        ) : (
                            <span className="text-slate-500 flex items-center"><Clock className="w-3 h-3 mr-1" /> QUEUED</span>
                        )}
                    </td>
                    <td className="px-4 py-2 flex items-center text-slate-400">
                        <Cpu className="w-3 h-3 mr-1.5" /> {job.resource}
                    </td>
                    <td className="px-4 py-2 text-right">
                        <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1 hover:text-yellow-400 bg-quantum-950 border border-quantum-700 rounded"><Pause className="w-3 h-3" /></button>
                            <button 
                                onClick={() => handleRemoveJob(job.id)}
                                className="p-1 hover:text-red-400 bg-quantum-950 border border-quantum-700 rounded"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
      </div>
    </div>
  );
};