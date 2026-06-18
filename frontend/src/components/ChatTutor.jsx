import React, { useState, useRef, useEffect } from 'react';
import {
    Send, LogOut, Menu, X, Plus, ChevronDown,
    MessageSquare, History, Sparkles, BookOpen,
    GraduationCap, Languages, Search, Trash2,
    Settings, HelpCircle, User, Copy, Check, Edit2
} from 'lucide-react';
import axios from 'axios';

// SVG Icons missing from Lucide (Defined at top to avoid ReferenceError)
const Target = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>;
const Activity = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>;
const Book = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>;

const categories = {
    'JEE 🎯': {
        icon: <Target className="w-4 h-4" />,
        subcategories: ['Mathematics', 'Physics', 'Chemistry']
    },
    'NEET 🏥': {
        icon: <Activity className="w-4 h-4" />,
        subcategories: ['Biology', 'Physics', 'Chemistry']
    },
    'Competitive Exams 📚': {
        icon: <BookOpen className="w-4 h-4" />,
        subcategories: ['Aptitude', 'Reasoning', 'General Knowledge', 'Current Affairs']
    },
    'PUC (11-12) 🎓': {
        icon: <GraduationCap className="w-4 h-4" />,
        subcategories: ['Science', 'Commerce', 'Arts']
    },
    'SSLC (10th) 📖': {
        icon: <Book className="w-4 h-4" />,
        subcategories: ['Mathematics', 'Science', 'Social Science', 'English', 'Kannada', 'Hindi']
    },
    'Languages 🌐': {
        icon: <Languages className="w-4 h-4" />,
        subcategories: ['English', 'Kannada', 'Hindi']
    },
    'BE (Engineering) ⚙️': {
        icon: <Settings className="w-4 h-4" />,
        subcategories: ['Computer Science (CSE)', 'Information Science (ISE)', 'Electronics (ECE)', 'Mechanical (ME)', 'Civil (CE)', 'Electrical (EEE)', 'Artificial Intelligence (AI/ML)']
    }
};

const categoryPrompts = {
    'JEE 🎯': ["How to prepare for JEE Mains?", "Important chapters for JEE Physics", "Previous year JEE Math topics", "JEE Advanced exam pattern"],
    'NEET 🏥': ["NEET Biology study plan", "Most weightage topics for NEET Chemistry", "How to score 650+ in NEET?", "NEET Physics formula sheet"],
    'Competitive Exams 📚': ["SSC General Awareness tips", "How to improve logical reasoning?", "Current affairs for bank exams", "Aptitude shortcut tricks"],
    'PUC (11-12) 🎓': ["Karnataka PUC Math important questions", "Explain Class 12 Physics derivations", "How to write PUC English answers?", "Class 11 Chemistry base concepts"],
    'SSLC (10th) 📖': ["10th standard Science notes", "How to solve SSLC Math model paper?", "SSLC Social Science important dates", "Kannada grammar for SSLC"],
    'Languages 🌐': ["Basic English grammar for students", "How to learn Kannada quickly?", "Hindi nibandh (essay) topics", "English letter writing format"],
    'BE (Engineering) ⚙️': ["Explain Data Structures in CSE", "Basics of Thermodynamics for ME", "How to study Network Theory for ECE?", "Java vs Python for Engineering students"]
};

const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' }
];

const ChatTutor = ({ user, onLogout, freeQuestions, onUseFreeQuestion, onOpenUpgrade, onOpenAuth }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [selectedLang, setSelectedLang] = useState(languages[0]);
    const [selectedCategory, setSelectedCategory] = useState(null); // General Mode by default
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [copiedId, setCopiedId] = useState(null);
    const [editMsgId, setEditMsgId] = useState(null);
    const [editText, setEditText] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleEdit = (msg) => {
        setEditMsgId(msg.id);
        setEditText(msg.text);
    };

    const submitEdit = async () => {
        if (!editText.trim() || loading) return;

        setMessages(prev => prev.map(msg => (
            msg.id === editMsgId ? { ...msg, text: editText } : msg
        )));
        setInput(editText);
        setEditMsgId(null);
        setEditText("");
    };

    const startNewChat = () => {
        setMessages([{
            id: Date.now(),
            text: "Hi! I'm your AI Assistant. Ask me anything - homework, concepts, exam prep, or anything else! 💡",
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    // Auto-reset chat when category changes
    useEffect(() => {
        if (messages.length > 1) { // Only reset if there's an actual conversation
            startNewChat();
        }
    }, [selectedCategory]);

    // Initial message
    useEffect(() => {
        if (messages.length === 0) {
            startNewChat();
        }
    }, []);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        if (!user && freeQuestions <= 0) {
            onOpenAuth();
            return;
        }

        const userMsg = {
            id: Date.now(),
            text: input,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        const categoryPayload = selectedCategory?.cat && selectedCategory?.sub
            ? { cat: selectedCategory.cat, sub: selectedCategory.sub }
            : null;

        if (!user) {
            onUseFreeQuestion();
        }

        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const response = await axios.post(`${API_URL}/api/chat`, {
                message: input,
                language: selectedLang.code,
                category: categoryPayload,
                history: messages.map(msg => ({
                    role: msg.sender === 'bot' ? 'assistant' : 'user',
                    content: msg.text
                })),
                model: 'gemini'
            });

            const botMsg = {
                id: Date.now() + 1,
                text: response.data.reply,
                provider: response.data.provider,
                sender: 'bot',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botMsg]);
            setLoading(false);

            if (messages.length <= 1) {
                const newChat = { id: Date.now(), title: input.substring(0, 30) + (input.length > 30 ? '...' : '') };
                setChatHistory(prev => [newChat, ...prev]);
            }
        } catch (error) {
            console.error("API Error:", error);
            const errorMessage = error.response?.data?.reply || "I'm having trouble connecting to my brain right now. Please ensure the backend server is running.";
            const errorMsg = {
                id: Date.now() + 1,
                text: errorMessage,
                sender: 'bot',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMsg]);
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden relative">
            {/* Mobile Overlay */}
            {!isSidebarOpen && window.innerWidth < 768 ? null : (
                <div
                    className={`fixed inset-0 bg-slate-900/40 z-40 md:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed md:relative z-50 w-72 h-full bg-gradient-to-b from-slate-800 to-slate-900 text-white transition-all duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:-ml-72'}`}>
                <div className="flex flex-col h-full p-4">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-8 px-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                            <GraduationCap size={24} />
                        </div>
                        <div>
                            <div className="font-bold text-lg leading-none">AI Tutor</div>
                            <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">India</div>
                        </div>
                    </div>

                    {/* New Chat Button */}
                    <button
                        onClick={startNewChat}
                        className="flex items-center gap-3 w-full p-4 mb-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl font-bold shadow-lg shadow-orange-900/20 hover:scale-[1.02] transition-all active:scale-95"
                    >
                        <Plus size={20} />
                        New Chat
                    </button>

                    {/* History */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-4">
                        <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-4 px-2">Chat History</div>
                        {chatHistory.length === 0 ? (
                            <div className="text-sm text-slate-500 italic px-2">No previous chats</div>
                        ) : (
                            <div className="space-y-1">
                                {chatHistory.map(chat => (
                                    <button key={chat.id} className="flex items-center gap-3 w-full p-3 rounded-xl text-left text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors group">
                                        <MessageSquare size={16} className="text-slate-500 group-hover:text-orange-400" />
                                        <span className="truncate">{chat.title}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bottom Section */}
                    <div className="pt-4 border-t border-white/5 space-y-2">
                        {!user && (
                            <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4 mb-4">
                                <div className="text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-1">Free Trial</div>
                                <div className="text-sm text-orange-100 mb-3">{freeQuestions} questions remaining</div>
                                <button
                                    onClick={onOpenUpgrade}
                                    className="text-xs font-bold text-orange-500 bg-white px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors"
                                >
                                    Upgrade Now
                                </button>
                            </div>
                        )}

                        <button className="flex items-center gap-3 w-full p-3 rounded-xl text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
                            <Settings size={18} /> Settings
                        </button>
                        <button className="flex items-center gap-3 w-full p-3 rounded-xl text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
                            <HelpCircle size={18} /> Help & FAQ
                        </button>
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-3 w-full p-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg md:hidden"
                        >
                            <Menu size={24} />
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => { setIsCategoryOpen(!isCategoryOpen); setIsLangOpen(false); }}
                                className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                            >
                                <BookOpen size={16} className="text-orange-500" />
                                <span className="hidden sm:inline">
                                    {selectedCategory 
                                        ? `${selectedCategory.cat} - ${selectedCategory.sub}`
                                        : "General Mode"}
                                </span>
                                <span className="sm:hidden text-xs">
                                    {selectedCategory ? "Cat" : "Gen"}
                                </span>
                                <ChevronDown size={14} className={`transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isCategoryOpen && (
                                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-fadeInUp z-[60]">
                                    <div className="max-h-[70vh] overflow-y-auto">
                                        {/* General Mode Option */}
                                        <div className="p-2 border-b border-slate-100">
                                            <button
                                                onClick={() => { setSelectedCategory(null); setIsCategoryOpen(false); }}
                                                className={`w-full text-left px-3 py-3 rounded-xl text-sm font-bold transition-colors ${selectedCategory === null ? 'bg-purple-50 text-purple-600' : 'text-slate-600 hover:bg-slate-50'}`}
                                            >
                                                💬 General Mode (Ask Anything)
                                            </button>
                                        </div>

                                        {/* Exam Categories */}
                                        {Object.entries(categories).map(([cat, info]) => (
                                            <div key={cat} className="p-2">
                                                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    {cat}
                                                </div>
                                                <div className="grid grid-cols-1 gap-1">
                                                    {info.subcategories.map(sub => (
                                                        <button
                                                            key={sub}
                                                            onClick={() => { setSelectedCategory({ cat, sub }); setIsCategoryOpen(false); }}
                                                            className={`text-left px-3 py-2 rounded-xl text-sm transition-colors ${selectedCategory?.cat === cat && selectedCategory?.sub === sub ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                                                        >
                                                            {sub}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Selected Subcategory Badge (desktop) */}
                        <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-slate-400">
                            {selectedCategory && (
                                <>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                    <div className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md border border-blue-100">
                                        {selectedCategory.sub}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <button
                                onClick={() => { setIsLangOpen(!isLangOpen); setIsCategoryOpen(false); }}
                                className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:border-orange-300 transition-all"
                            >
                                <Languages size={16} />
                                <span className="hidden md:inline">{selectedLang.native}</span>
                                <ChevronDown size={14} className={isLangOpen ? 'rotate-180' : ''} />
                            </button>

                            {isLangOpen && (
                                <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-[60]">
                                    {languages.map(lang => (
                                        <button
                                            key={lang.code}
                                            onClick={() => { setSelectedLang(lang); setIsLangOpen(false); }}
                                            className={`w-full text-right px-4 py-2 text-sm transition-colors ${selectedLang.code === lang.code ? 'text-orange-500 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            {lang.native}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

            {user ? (
  <div className="w-10 h-10">
    {user.avatar && user.avatar.trim() !== "" ? (
      <img
        src={user.avatar}
        alt={user.name}
        className="w-10 h-10 rounded-full border-2 border-slate-200 object-cover"
        onError={(e) => {
          e.target.style.display = "none";
          e.target.nextSibling.style.display = "flex";
        }}
      />
    ) : null}

    <div
      style={{
        display: user.avatar ? "none" : "flex"
      }}
      className="w-10 h-10 rounded-full bg-orange-500 text-white items-center justify-center font-bold"
    >
      {user.name
        ?.split(" ")
        .map(word => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()}
    </div>
  </div>
) : (
  // Sign In button
                            <button
                                onClick={onOpenAuth}
                                className="hidden sm:block text-sm font-bold text-orange-500 border-2 border-orange-500 px-4 py-1.5 rounded-xl hover:bg-orange-50"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </header>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-4 md:px-6 py-8">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {messages.length === 1 && (
                            <div className="text-center py-12 animate-fadeInUp">
                                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-purple-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-orange-100">
                                    <Sparkles size={40} />
                                </div>
                                <h2 className="text-3xl font-extrabold text-slate-800 mb-2">How can I help you today?</h2>
                                <p className="text-slate-500 mb-8 font-medium">Ask me anything about your studies - I'm here 24/7!</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                                    {(selectedCategory 
                                        ? categoryPrompts[selectedCategory.cat] 
                                        : [
                                            "Explain photosynthesis",
                                            "How does AI work?",
                                            "What is Python?",
                                            "Help with math"
                                        ]
                                    ).map(prompt => (
                                        <button
                                            key={prompt}
                                            onClick={() => setInput(prompt)}
                                            className="text-left p-4 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-600 hover:border-orange-400 hover:bg-orange-50 transition-all shadow-sm"
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((m, idx) => (
                            <div key={m.id} className={`flex gap-4 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} chat-message group`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${m.sender === 'user' ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}>
                                    {m.sender === 'user' ? <User size={20} /> : <Sparkles size={20} className="text-orange-500" />}
                                </div>
                                <div className={`max-w-[85%] md:max-w-[70%] relative`}>
                                    <div className={`p-5 rounded-2xl shadow-md relative ${m.sender === 'user' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>
                                        {m.sender === 'bot' && (
                                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleCopy(m.text, m.id)}
                                                    className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 transition-colors"
                                                    title="Copy response"
                                                >
                                                    {copiedId === m.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                                </button>
                                            </div>
                                        )}

                                        {m.sender === 'bot' && m.provider && (
                                            <div className="text-[10px] font-bold text-orange-500 mb-1 flex items-center gap-1">
                                                <Sparkles size={10} />
                                                {m.provider}
                                            </div>
                                        )}

                                        {editMsgId === m.id ? (
                                            <div className="space-y-3">
                                                <textarea
                                                    className="w-full bg-orange-400/20 border border-orange-300 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                                                    value={editText}
                                                    onChange={(e) => setEditText(e.target.value)}
                                                    autoFocus
                                                />
                                                <div className="flex gap-2">
                                                    <button onClick={submitEdit} className="bg-white text-orange-600 px-3 py-1 rounded-md text-xs font-bold hover:bg-orange-50">Save & Submit</button>
                                                    <button onClick={() => setEditMsgId(null)} className="bg-orange-700/30 text-white px-3 py-1 rounded-md text-xs font-bold hover:bg-orange-700/50">Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
                                                {m.text}
                                            </p>
                                        )}

                                        {m.sender === 'user' && editMsgId !== m.id && (
                                            <div className="flex gap-2 mt-3 pt-2 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleCopy(m.text, m.id)}
                                                    className="p-1 hover:bg-white/10 rounded text-orange-200 transition-colors flex items-center gap-1 text-[10px]"
                                                >
                                                    {copiedId === m.id ? <Check size={12} /> : <Copy size={12} />}
                                                    Copy
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(m)}
                                                    className="p-1 hover:bg-white/10 rounded text-orange-200 transition-colors flex items-center gap-1 text-[10px]"
                                                >
                                                    <Edit2 size={12} />
                                                    Edit
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className={`mt-2 px-1 text-[10px] font-bold tracking-widest uppercase ${m.sender === 'user' ? 'text-right text-orange-300' : 'text-slate-400'}`}>
                                        {m.time}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex gap-4 chat-message">
                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
                                    <Sparkles size={20} className="text-orange-500" />
                                </div>
                                <div className="bg-white border border-slate-100 p-5 rounded-2xl rounded-tl-none shadow-md">
                                    <div className="typing-indicator">
                                        <span /> <span /> <span />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <footer className="p-4 md:p-6 bg-slate-50">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative group">
                            <textarea
                                rows="1"
                                placeholder="Ask a question about Math, Science, English..."
                                className="w-full bg-white border border-slate-200 rounded-[1.5rem] py-4 pl-6 pr-16 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 text-slate-700 shadow-xl transition-all resize-none overflow-hidden min-h-[58px]"
                                value={input}
                                onChange={(e) => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || loading}
                                className={`absolute right-3 bottom-2.5 p-3 rounded-2xl transition-all ${input.trim() && !loading ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 hover:bg-orange-600 scale-100' : 'text-slate-300 scale-90'}`}
                            >
                                <Send size={20} />
                            </button>
                        </div>
                        <div className="mt-3 flex justify-between items-center px-4">
                            {!user && (
                                <div className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                                    {freeQuestions} free questions remaining
                                </div>
                            )}
                            <div className="text-[11px] text-slate-400 font-medium ml-auto">
                                Press Enter to send, Shift + Enter for new line
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default ChatTutor;
