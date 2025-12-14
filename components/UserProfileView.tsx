import React, { useState } from 'react';
import { 
    User, Mail, Phone, MapPin, Briefcase, Camera, Shield, 
    Award, Activity, Clock, Edit3, Save, CheckCircle, X
} from 'lucide-react';

export const UserProfileView: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        name: 'Dr. Sarrah Kirana',
        title: 'Lead Quantum Operator',
        email: 'sarrah.kirana@logicflow.io',
        phone: '+1 (555) 019-2834',
        location: 'Sector 7, Main Control',
        bio: 'Specializing in quantum coherence optimization and neural bridge architecture. 10 years experience in high-energy logic systems.'
    });

    const handleSave = () => {
        setIsEditing(false);
        // Save logic here
    };

    return (
        <div className="h-full flex flex-col p-6 overflow-y-auto custom-scrollbar bg-quantum-950/50">
            
            {/* Header / Banner */}
            <div className="relative h-48 rounded-xl bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-quantum-600 overflow-hidden shrink-0 mb-16 z-0">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute bottom-4 right-4 flex space-x-3 z-20">
                    {isEditing ? (
                        <>
                            <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-quantum-900/80 hover:bg-quantum-800 text-slate-300 text-xs font-bold rounded backdrop-blur border border-quantum-600">Cancel</button>
                            <button onClick={handleSave} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded shadow-lg flex items-center">
                                <Save className="w-3 h-3 mr-2" /> Save Changes
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-quantum-900/80 hover:bg-quantum-800 text-white text-xs font-bold rounded backdrop-blur border border-quantum-600 flex items-center transition-colors">
                            <Edit3 className="w-3 h-3 mr-2" /> Edit Profile
                        </button>
                    )}
                </div>
            </div>

            {/* Profile Content Container (overlapping banner) */}
            <div className="max-w-5xl w-full mx-auto -mt-24 relative px-4 flex flex-col md:flex-row gap-8 z-10">
                
                {/* Left Column: Avatar & Quick Stats */}
                <div className="w-full md:w-80 flex flex-col gap-6">
                    <div className="bg-quantum-900 border border-quantum-700 rounded-xl p-6 flex flex-col items-center text-center shadow-2xl relative">
                        <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-cyan-400 to-purple-600 -mt-20 mb-4 relative group">
                            <div className="w-full h-full rounded-full bg-quantum-950 flex items-center justify-center overflow-hidden">
                                <span className="text-3xl font-bold text-white">SV</span>
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-quantum-800 rounded-full border border-quantum-600 text-slate-300 hover:text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <h2 className="text-xl font-bold text-white">{userData.name}</h2>
                        <p className="text-sm text-cyan-400 mb-4">{userData.title}</p>
                        
                        <div className="w-full grid grid-cols-2 gap-2 text-center py-4 border-t border-b border-quantum-800 mb-4">
                            <div>
                                <div className="text-lg font-mono font-bold text-white">4.2y</div>
                                <div className="text-[10px] text-slate-500 uppercase">Tenure</div>
                            </div>
                            <div>
                                <div className="text-lg font-mono font-bold text-white">Lvl 5</div>
                                <div className="text-[10px] text-slate-500 uppercase">Clearance</div>
                            </div>
                        </div>

                        <div className="w-full space-y-2">
                            <div className="flex items-center justify-between text-xs text-slate-400 bg-quantum-950 p-2 rounded border border-quantum-800">
                                <span>Status</span>
                                <span className="text-green-400 flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span> Active</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-400 bg-quantum-950 p-2 rounded border border-quantum-800">
                                <span>Team</span>
                                <span className="text-slate-200">Logic-Alpha</span>
                            </div>
                        </div>
                    </div>

                    {/* Achievements / Badges */}
                    <div className="bg-quantum-900 border border-quantum-700 rounded-xl p-6">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Certifications</h3>
                        <div className="flex flex-wrap gap-2">
                            <Badge label="Quantum Safety L3" icon={<Shield className="w-3 h-3" />} color="text-green-400 border-green-500/30 bg-green-900/20" />
                            <Badge label="Logic Architect" icon={<Briefcase className="w-3 h-3" />} color="text-purple-400 border-purple-500/30 bg-purple-900/20" />
                            <Badge label="Top Operator 2024" icon={<Award className="w-3 h-3" />} color="text-yellow-400 border-yellow-500/30 bg-yellow-900/20" />
                        </div>
                    </div>
                </div>

                {/* Right Column: Details & Activity */}
                <div className="flex-1 space-y-6">
                    
                    {/* Basic Info Form */}
                    <div className="bg-quantum-900 border border-quantum-700 rounded-xl p-6">
                        <h3 className="text-sm font-bold text-slate-200 uppercase mb-6 flex items-center">
                            <User className="w-4 h-4 mr-2 text-cyan-400" /> Personal Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoField label="Full Name" value={userData.name} isEditing={isEditing} onChange={v => setUserData({...userData, name: v})} icon={<User className="w-4 h-4" />} />
                            <InfoField label="Job Title" value={userData.title} isEditing={isEditing} onChange={v => setUserData({...userData, title: v})} icon={<Briefcase className="w-4 h-4" />} />
                            <InfoField label="Email Address" value={userData.email} isEditing={isEditing} onChange={v => setUserData({...userData, email: v})} icon={<Mail className="w-4 h-4" />} />
                            <InfoField label="Phone Number" value={userData.phone} isEditing={isEditing} onChange={v => setUserData({...userData, phone: v})} icon={<Phone className="w-4 h-4" />} />
                            <div className="md:col-span-2">
                                <InfoField label="Location" value={userData.location} isEditing={isEditing} onChange={v => setUserData({...userData, location: v})} icon={<MapPin className="w-4 h-4" />} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Professional Bio</label>
                                {isEditing ? (
                                    <textarea 
                                        className="w-full bg-quantum-950 border border-quantum-700 rounded p-3 text-sm text-slate-200 focus:border-cyan-500 outline-none resize-none h-24 leading-relaxed"
                                        value={userData.bio}
                                        onChange={(e) => setUserData({...userData, bio: e.target.value})}
                                    />
                                ) : (
                                    <div className="p-3 bg-quantum-950/50 border border-transparent rounded text-sm text-slate-300 leading-relaxed">
                                        {userData.bio}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-quantum-900 border border-quantum-700 rounded-xl p-6">
                        <h3 className="text-sm font-bold text-slate-200 uppercase mb-4 flex items-center">
                            <Activity className="w-4 h-4 mr-2 text-cyan-400" /> Recent Activity
                        </h3>
                        <div className="space-y-4">
                            <ActivityItem 
                                title="Deployed Logic Node #882" 
                                time="2 hours ago" 
                                type="deployment" 
                                details="Successful rollout to production sector." 
                            />
                            <ActivityItem 
                                title="Updated Security Protocol" 
                                time="Yesterday" 
                                type="security" 
                                details="Rotated API keys for dev environment." 
                            />
                            <ActivityItem 
                                title="System Maintenance" 
                                time="3 days ago" 
                                type="maintenance" 
                                details="Performed routine diagnostics on Core B." 
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

const InfoField = ({ label, value, isEditing, onChange, icon }: any) => (
    <div>
        <label className="flex items-center text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
            <span className="mr-2 opacity-70">{icon}</span> {label}
        </label>
        {isEditing ? (
            <input 
                type="text" 
                className="w-full bg-quantum-950 border border-quantum-700 rounded p-2.5 text-sm text-slate-200 focus:border-cyan-500 outline-none transition-colors"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        ) : (
            <div className="p-2.5 bg-quantum-950/50 border border-transparent rounded text-sm text-slate-300 font-medium">
                {value}
            </div>
        )}
    </div>
);

const Badge = ({ label, icon, color }: any) => (
    <div className={`flex items-center px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase ${color}`}>
        <span className="mr-1.5">{icon}</span>
        {label}
    </div>
);

const ActivityItem = ({ title, time, type, details }: any) => {
    const icon = type === 'deployment' ? <CheckCircle className="w-4 h-4 text-green-400" /> :
                 type === 'security' ? <Shield className="w-4 h-4 text-purple-400" /> :
                 <Clock className="w-4 h-4 text-orange-400" />;
    
    return (
        <div className="flex items-start space-x-3 p-3 bg-quantum-950 border border-quantum-800 rounded hover:border-quantum-600 transition-colors">
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1">
                <div className="flex justify-between">
                    <h4 className="text-sm font-bold text-slate-200">{title}</h4>
                    <span className="text-xs text-slate-500">{time}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{details}</p>
            </div>
        </div>
    );
};