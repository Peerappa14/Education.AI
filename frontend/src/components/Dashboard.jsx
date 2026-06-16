import React from 'react';
import { Book, GraduationCap, Trophy, LayoutDashboard, Clock, FileText } from 'lucide-react';

const Dashboard = ({ onStartChat }) => {
    const subjects = [
        { name: "Mathematics", icon: <LayoutDashboard size={20} />, status: "Last active: Practice Set 4", color: "bg-blue-100 text-blue-600" },
        { name: "Science", icon: <Book size={20} />, status: "Ready for Chapter 3", color: "bg-green-100 text-green-600" },
        { name: "English", icon: <FileText size={20} />, status: "2 Doubts pending", color: "bg-purple-100 text-purple-600" },
        { name: "Social Studies", icon: <GraduationCap size={20} />, status: "No recent activity", color: "bg-amber-100 text-amber-600" }
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Studying Class 10 (CBSE)</h1>
                    <p className="text-slate-500">Welcome back! Focus on Math today – your exam is in 12 days.</p>
                </div>
                <button onClick={onStartChat} className="btn btn-primary gap-2">
                    <Trophy size={18} /> Solve a Doubt Now
                </button>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-12">
                {subjects.map((sub, idx) => (
                    <div key={idx} className="card bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="card-body p-5">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${sub.color}`}>
                                {sub.icon}
                            </div>
                            <h3 className="font-bold text-lg">{sub.name}</h3>
                            <p className="text-xs text-slate-400">{sub.status}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Exam Prep Card */}
                <div className="card bg-slate-900 text-white shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Trophy size={120} />
                    </div>
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-2">Target: Board Exam 2024</h2>
                        <p className="text-slate-400 mb-6">Complete your revision with AI-powered mock tests and previous year papers.</p>
                        <div className="flex gap-3">
                            <button className="btn btn-primary btn-sm">MOCK TESTS</button>
                            <button className="btn btn-outline btn-white btn-sm">PYQ BANK</button>
                        </div>
                    </div>
                </div>

                {/* Progress Card */}
                <div className="card bg-white border border-slate-100 shadow-sm">
                    <div className="card-body">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="card-title">Weekly Progress</h2>
                            <Clock size={16} className="text-slate-400" />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span>Course Completion</span>
                                    <span className="font-bold">78%</span>
                                </div>
                                <progress className="progress progress-primary w-full" value="78" max="100"></progress>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span>Doubts Solved</span>
                                    <span className="font-bold">45/50 Free</span>
                                </div>
                                <progress className="progress progress-secondary w-full" value="90" max="100"></progress>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-red-50 rounded-lg text-[11px] text-red-600 font-medium">
                            ⚠️ Only 5 free questions left for today. Upgrade to Premium for ₹99!
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
