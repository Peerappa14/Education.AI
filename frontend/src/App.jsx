import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import ChatTutor from './components/ChatTutor';
import AuthModal from './components/AuthModal';
import UpgradeModal from './components/UpgradeModal';
import { getRedirectResult } from "firebase/auth";
import { auth } from "./firebase";

function App() {
    const [user, setUser] = useState(null);
    const [view, setView] = useState('landing'); // landing, chat
    const [freeQuestions, setFreeQuestions] = useState(3);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    // Persist user and free trial count
    useEffect(() => {

  getRedirectResult(auth)
    .then((result) => {

      if (result?.user) {

        const userData = {
          name: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL
        };

        setUser(userData);

        localStorage.setItem(
          "ai_tutor_user",
          JSON.stringify(userData)
        );

        setView("chat");

        console.log("Redirect Login Success");
      }

    })
    .catch(console.error);

}, []);
    // useEffect(() => {
    //     const savedUser = localStorage.getItem('ai_tutor_user');
    //     if (savedUser) {
    //         setUser(JSON.parse(savedUser));
    //         setView('chat');
    //     }

    //     const savedCount = localStorage.getItem('ai_tutor_free_questions');
    //     if (savedCount !== null) {
    //         setFreeQuestions(parseInt(savedCount));
    //     }
    // }, []);

    const handleLogin = (userData) => {
         console.log("🔥 handleLogin called");
    console.log("User Received:", userData);
        setUser(userData);
        localStorage.setItem('ai_tutor_user', JSON.stringify(userData));
           console.log(
        "Saved User:",
        JSON.parse(localStorage.getItem("ai_tutor_user"))
         );
        
        setShowAuthModal(false);
        setView('chat');
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('ai_tutor_user');
        setView('landing');
    };

    const handleUseFreeQuestion = () => {
        if (freeQuestions > 0) {
            const newCount = freeQuestions - 1;
            setFreeQuestions(newCount);
            localStorage.setItem('ai_tutor_free_questions', newCount.toString());
            return true;
        }
        return false;
    };

    const onStartFreeChat = () => {
        setView('chat');
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-orange-100 selection:text-orange-900">
            {view === 'landing' ? (
                <LandingPage
                    onStartChat={onStartFreeChat}
                    onOpenAuth={() => setShowAuthModal(true)}
                />
            ) : (
                <ChatTutor
                    user={user}
                    onLogout={handleLogout}
                    freeQuestions={freeQuestions}
                    onUseFreeQuestion={handleUseFreeQuestion}
                    onOpenUpgrade={() => setShowUpgradeModal(true)}
                    onOpenAuth={() => setShowAuthModal(true)}
                />
            )}

            {showAuthModal && (
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                    onLogin={handleLogin}
                />
            )}

            {showUpgradeModal && (
                <UpgradeModal
                    onClose={() => setShowUpgradeModal(false)}
                />
            )}
        </div>
    );
}

export default App;
