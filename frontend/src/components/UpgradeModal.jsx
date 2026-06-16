import React from 'react';
import { X, GraduationCap, CheckCircle } from 'lucide-react';

const UpgradeModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-fadeInUp">
                <div className="relative p-8">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                    >
                        <X size={20} />
                    </button>

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-orange-200">
                            <GraduationCap size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Upgrade to Premium</h2>
                        <p className="text-slate-500 mt-2">Get unlimited access to all features</p>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 bg-green-100 p-1 rounded-full shrink-0">
                                <CheckCircle size={14} className="text-green-600" />
                            </div>
                            <span className="text-sm text-slate-700">Unlimited questions across all subjects</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-1 bg-green-100 p-1 rounded-full shrink-0">
                                <CheckCircle size={14} className="text-green-600" />
                            </div>
                            <span className="text-sm text-slate-700">Access to JEE, NEET, and all competitive exams</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-1 bg-green-100 p-1 rounded-full shrink-0">
                                <CheckCircle size={14} className="text-green-600" />
                            </div>
                            <span className="text-sm text-slate-700">Save and access your complete chat history</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-1 bg-green-100 p-1 rounded-full shrink-0">
                                <CheckCircle size={14} className="text-green-600" />
                            </div>
                            <span className="text-sm text-slate-700">Priority support and faster responses</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center mb-8">
                        <div className="text-slate-500 text-sm mb-1 uppercase tracking-wider font-semibold">Only</div>
                        <div className="text-4xl font-extrabold text-slate-900 mb-1">₹99<span className="text-lg font-medium text-slate-400">/mo</span></div>
                        <div className="text-slate-400 text-sm">Cancel anytime</div>
                    </div>

                    <button
                        className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-200 hover:from-orange-600 hover:to-orange-700 transition-all active:scale-95"
                    >
                        Upgrade Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;
