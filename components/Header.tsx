import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, User, Settings, LogOut, HelpCircle, CreditCard, Users, 
  Shield, CheckCircle2, AlertTriangle, Info, Eye, ChevronRight, Check
} from 'lucide-react';

interface HeaderProps {
    onToggleContrast?: () => void;
    onNavigate?: (view: string) => void;
    onLogout?: () => void;
}

const TEAMS = [
    { id: 't1', name: 'Logic-Alpha', role: 'Admin' },
    { id: 't2', name: 'Dev-Ops-Beta', role: 'Viewer' },
    { id: 't3', name: 'Manufacturing-X', role: 'Editor' },
];

export const Header: React.FC<HeaderProps> = ({ onToggleContrast, onNavigate, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [activeTeamId, setActiveTeamId] = useState('t1');
  const [viewState, setViewState] = useState<'main' | 'teams'>('main');
  
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const activeTeam = TEAMS.find(t => t.id === activeTeamId);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
        setViewState('main'); // Reset sub-menu on close
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNav = (target: string) => {
      if (onNavigate) onNavigate(target);
      setIsProfileOpen(false);
  };

  const handleTeamSwitch = (id: string) => {
      setActiveTeamId(id);
      setViewState('main');
      // Simulate reload or data refresh
      console.log(`Switched to team ${id}`);
  };

  const notifications = [
    {
      id: 1,
      type: "critical",
      title: "Quantum Core Instability",
      time: "2m ago",
      desc: "Coherence dropped below 92% in Sector 4.",
    },
    {
      id: 2,
      type: "success",
      title: "Simulation Complete",
      time: "15m ago",
      desc: "Batch 742 digital twin verified with 99.9% yield.",
    },
    {
      id: 3,
      type: "info",
      title: "New Recipe Available",
      time: "1h ago",
      desc: 'Process Engineering approved "GaN-Etch-v4".',
    },
  ];

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-quantum-900/90 backdrop-blur-md border-b border-quantum-600 z-40 shrink-0 sticky top-0">
        <div className="flex items-center space-x-4">
            <span className="text-xs font-mono text-slate-500 hidden md:inline-block">SYSTEM_ID: <span className="text-slate-300">Q-OS-742</span></span>
            <span className="h-4 w-px bg-quantum-600 hidden md:inline-block"></span>
            <div className="flex items-center space-x-2 px-2 py-1 bg-quantum-800/50 rounded border border-quantum-700">
                <div className="w-1.5 h-1.5 rounded-full bg-quantum-success animate-pulse"></div>
                <span className="text-xs font-mono text-slate-300">SYSTEM NOMINAL</span>
            </div>
        </div>
        
        <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
                <button 
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className={`p-2 transition-colors relative ${isNotifOpen ? 'text-cyan-400' : 'text-slate-400 hover:text-cyan-400'}`}
                >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-quantum-900"></span>
                </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-quantum-900 border border-quantum-600 rounded-lg shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-3 border-b border-quantum-600 flex justify-between items-center bg-quantum-950">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Notifications
                </span>
                <span className="text-[10px] text-cyan-400 cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 border-b border-quantum-700/50 hover:bg-quantum-800 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5">
                        {n.type === "critical" ? (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        ) : n.type === "success" ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <Info className="w-4 h-4 text-cyan-500" />
                        )}
                      </div>
                      <div>
                        <div className="flex justify-between w-full">
                          <h4 className="text-sm font-medium text-slate-200 group-hover:text-cyan-400 transition-colors">
                            {n.title}
                          </h4>
                          <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2">
                            {n.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                          {n.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 bg-quantum-950 border-t border-quantum-600 text-center">
                <button className="text-[10px] text-slate-500 hover:text-slate-300">
                  View All History
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-8 h-8 rounded bg-gradient-to-tr from-cyan-600 to-purple-700 flex items-center justify-center font-bold text-white text-xs shadow-glow-cyan cursor-pointer hover:ring-2 ring-cyan-500/50 transition-all select-none"
          >
            OP
          </div>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-quantum-900 border border-quantum-600 rounded-lg shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                        
                        {/* MAIN MENU VIEW */}
                        {viewState === 'main' && (
                            <>
                                <div className="px-4 py-4 bg-quantum-950 border-b border-quantum-600">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded bg-gradient-to-tr from-cyan-600 to-purple-700 flex items-center justify-center font-bold text-white text-sm shadow-glow-cyan">
                                            OP
                                        </div>
                                        <div className="overflow-hidden">
                                            <div className="text-sm font-bold text-slate-200 truncate">Lead Operator</div>
                                            <div className="text-xs text-slate-500 font-mono truncate">{activeTeam?.name}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="py-2">
                                    <MenuItem 
                                        icon={<Users className="w-4 h-4" />} 
                                        label="Switch Team" 
                                        onClick={() => setViewState('teams')}
                                        sublabel={activeTeam?.name}
                                        hasSubmenu
                                    />
                                    <MenuItem icon={<Eye className="w-4 h-4" />} label="Toggle High Contrast" onClick={onToggleContrast} />
                                    <MenuItem icon={<User className="w-4 h-4" />} label="My Profile" onClick={() => handleNav('profile')} />
                                    <MenuItem icon={<Shield className="w-4 h-4" />} label="Security & Keys" onClick={() => handleNav('security')} />
                                    <MenuItem icon={<CreditCard className="w-4 h-4" />} label="Billing" onClick={() => handleNav('billing')} />
                                    <div className="my-1 border-t border-quantum-700 mx-2"></div>
                                    <MenuItem icon={<Settings className="w-4 h-4" />} label="Preferences" onClick={() => handleNav('settings')} />
                                    <MenuItem icon={<HelpCircle className="w-4 h-4" />} label="Help & Support" onClick={() => handleNav('support')} />
                                </div>
                                <div className="p-2 bg-quantum-950 border-t border-quantum-600">
                                     <button 
                                        onClick={onLogout}
                                        className="flex items-center w-full px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                     >
                                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                                     </button>
                                </div>
                            </>
                        )}

                        {/* TEAM SWITCHER VIEW */}
                        {viewState === 'teams' && (
                            <>
                                <div className="px-2 py-3 bg-quantum-950 border-b border-quantum-600 flex items-center space-x-2">
                                    <button onClick={() => setViewState('main')} className="p-1 hover:bg-quantum-800 rounded text-slate-400 hover:text-white">
                                        <ChevronRight className="w-4 h-4 rotate-180" />
                                    </button>
                                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">Select Team</span>
                                </div>
                                <div className="py-2 max-h-60 overflow-y-auto">
                                    {TEAMS.map(team => (
                                        <button
                                            key={team.id}
                                            onClick={() => handleTeamSwitch(team.id)}
                                            className="w-full text-left px-4 py-3 hover:bg-quantum-800 transition-colors flex items-center justify-between group"
                                        >
                                            <div>
                                                <div className={`text-sm font-medium ${activeTeamId === team.id ? 'text-cyan-400' : 'text-slate-300 group-hover:text-white'}`}>
                                                    {team.name}
                                                </div>
                                                <div className="text-[10px] text-slate-500 font-mono capitalize">{team.role}</div>
                                            </div>
                                            {activeTeamId === team.id && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                                        </button>
                                    ))}
                                    <div className="px-4 pt-2 mt-2 border-t border-quantum-700">
                                        <button className="w-full py-2 border border-dashed border-quantum-600 rounded text-xs text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
                                            + Create New Team
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                    </div>
                )}
            </div>
        </div>
    </header>
  );
};

const MenuItem = ({ icon, label, onClick, hasSubmenu, sublabel }: { icon: React.ReactNode, label: string, onClick?: () => void, hasSubmenu?: boolean, sublabel?: string }) => (
    <button onClick={onClick} className="flex items-center justify-between w-full px-4 py-2 text-sm text-slate-300 hover:bg-quantum-800 hover:text-cyan-400 transition-colors group">
        <div className="flex items-center">
            <span className="mr-3 text-slate-500 group-hover:text-cyan-400 transition-colors">{icon}</span>
            {label}
        </div>
        <div className="flex items-center">
            {sublabel && <span className="text-[10px] text-slate-500 mr-2 font-mono hidden group-hover:inline-block">{sublabel}</span>}
            {hasSubmenu && <ChevronRight className="w-3 h-3 text-slate-600" />}
        </div>
    </button>
);
