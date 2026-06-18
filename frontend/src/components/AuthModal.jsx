import React from 'react';
import { X, GraduationCap } from 'lucide-react';
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

const AuthModal = ({ onClose, onLogin }) => {
const handleGoogleLogin = async () => {
    console.log("🔥 Google button clicked");

    try {
        console.log("🚀 Starting Firebase Login");

     const result = await signInWithPopup(auth, provider);

        console.log("✅ Firebase Login Success");
        console.log("User Object:", result.user);
        console.log("UID:", result.user.uid);
        console.log("Name:", result.user.displayName);
        console.log("Email:", result.user.email);
        console.log("Photo URL:", result.user.photoURL);

        const userData = {
            name: result.user.displayName,
            email: result.user.email,
            avatar: result.user.photoURL
        };

        console.log("📦 User Data:", userData);

        onLogin(userData);

        console.log("✅ onLogin Executed");
        console.log(
            "📂 Local Storage:",
            localStorage.getItem("ai_tutor_user")
        );

        onClose();

        console.log("✅ Modal Closed");

    } catch (error) {
        console.error("❌ FIREBASE LOGIN ERROR");
        console.error("Full Error:", error);
        console.error("Code:", error.code);
        console.error("Message:", error.message);

        alert(error.message);
    }
};

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
                        <h2 className="text-2xl font-bold text-slate-800">Sign In</h2>
                        <p className="text-slate-500 mt-2">To save your progress and get unlimited access</p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 py-4 border-2 border-slate-100 rounded-2xl hover:bg-slate-50 hover:border-orange-200 transition-all group"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="font-semibold text-slate-700 group-hover:text-slate-900">Continue with Google</span>
                        </button>

                        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mt-6">
                            <h3 className="text-orange-800 font-semibold mb-3 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-orange-500" />
                                Premium Benefits:
                            </h3>
                            <ul className="space-y-2 text-sm text-orange-700">
                                <li className="flex items-center gap-2">✓ Unlimited questions</li>
                                <li className="flex items-center gap-2">✓ All subjects & exams</li>
                                <li className="flex items-center gap-2">✓ Chat history saved</li>
                                <li className="flex items-center gap-2">✓ Priority support</li>
                            </ul>
                        </div>
                    </div>

                    <p className="text-center text-xs text-slate-400 mt-8">
                        By signing in, you agree to our <span className="underline cursor-pointer">Terms & Privacy Policy</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

// Add Sparkles icon missing from earlier import if needed or just use simple SVG
const Sparkles = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" />
        <path d="M19 17v4" />
        <path d="M3 5h4" />
        <path d="M17 19h4" />
    </svg>
);

export default AuthModal;
