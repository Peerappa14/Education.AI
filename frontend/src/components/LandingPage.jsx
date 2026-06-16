import React from 'react';
import { MessageSquare, GraduationCap, Sparkles, Globe, Zap } from 'lucide-react';

const Target = ({ size = 24, className = "" }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
);

const LandingPage = ({ onStartChat, onOpenAuth }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 overflow-x-hidden">
            {/* Logo Section */}
            <div className="pt-12 px-6 flex justify-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl animate-float">
                        <GraduationCap size={28} />
                    </div>
                    <span className="text-3xl font-extrabold tracking-tight gradient-text">AI Tutor India</span>
                    <p className="text-slate-500 font-medium">Your Personal Study Companion</p>
                </div>
            </div>

            {/* Hero Section */}
            <header className="px-6 py-16 text-center max-w-6xl mx-auto animate-fadeInUp">
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-bold mb-8 shadow-sm">
                    <Sparkles size={16} />
                    Available 24/7 for all subjects
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-slate-800 leading-tight">
                    Master <span className="text-orange-500">JEE, NEET, PUC & SSLC</span><br />
                    with the Power of AI
                </h1>
                <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto font-medium">
                    The smartest way to study in India. Affordable, instant doubt solving
                    in English, Kannada, and Hindi.
                </p>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
                    <div className="glassmorphism p-8 rounded-3xl text-center group hover:scale-105 transition-all duration-300">
                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                            <Target size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">🎯 Exam Focused</h3>
                        <p className="text-slate-500 text-sm">Tailored for Indian competitive exams and board syllabi.</p>
                    </div>
                    <div className="glassmorphism p-8 rounded-3xl text-center group hover:scale-105 transition-all duration-300">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                            <Globe size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">🌐 Multilingual</h3>
                        <p className="text-slate-500 text-sm">Learn in English, Kannada, or Hindi with native support.</p>
                    </div>
                    <div className="glassmorphism p-8 rounded-3xl text-center group hover:scale-105 transition-all duration-300">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <Zap size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">⚡ Instant Answers</h3>
                        <p className="text-slate-500 text-sm">No waiting. Get step-by-step explanations in seconds.</p>
                    </div>
                </div>

                {/* CTAs */}
                <div className="bg-white/40 border border-white/60 p-10 rounded-[2.5rem] backdrop-blur-md shadow-2xl shadow-orange-100 max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-800 mb-3">Start Learning for Free</h2>
                    <p className="text-slate-600 mb-8">Get <span className="text-orange-600 font-bold">3 free questions</span> to try our AI Tutor</p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={onStartChat}
                            className="btn btn-glow flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-extrabold rounded-2xl text-lg min-w-[220px]"
                        >
                            <MessageSquare size={20} />
                            Start Free Chat
                        </button>
                        <div className="flex items-center justify-center font-bold text-slate-400 py-2 sm:py-0">or</div>
                        <button
                            onClick={onOpenAuth}
                            className="flex items-center justify-center gap-3 px-8 py-5 border-2 border-slate-200 text-slate-700 font-bold rounded-2xl text-lg hover:bg-slate-50 hover:border-orange-300 transition-all min-w-[220px]"
                        >
                            <GraduationCap size={22} className="text-slate-500" />
                            Sign in for Access
                        </button>
                    </div>
                </div>
            </header>

            {/* Footer */}
            <footer className="mt-12 py-12 px-6 text-center border-t border-slate-100">
                <p className="text-slate-400 font-bold tracking-wide uppercase text-xs mb-2">Built for India's Future • Affordable AI Tutor</p>
                <p className="text-slate-400 text-sm">Trusted by thousands of students across Karnataka and India.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
