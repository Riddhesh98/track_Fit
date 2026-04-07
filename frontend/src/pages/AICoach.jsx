import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiCpu, FiUser } from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import axios from "axios";
import UserLayout from "../components/UserLayout"; 

const AICoach = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Only the initial greeting is set. Everything else comes from your backend.
  const [messages, setMessages] = useState([
    { 
      role: "ai", 
      text: "Hey! I'm TrackFit AI. I have access to your latest weight, nutrition, and PR logs. What are we focusing on today?" 
    }
  ]);

  const messagesEndRef = useRef(null);

  // Auto-scroll to the newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // --- REAL BACKEND CONNECTION ---
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput(""); 
    
    // 1. Instantly show the user's message
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setIsLoading(true);

    try {
     
      // 3. Live Axios POST Request
      const response = await axios.post(
        "http://localhost:3000/api/ai/ask",
        { message: userText },
        { 
          withCredentials: true
        }
      );

      // 4. Update UI with real AI reply
      if (response.data && response.data.success) {
        setMessages(prev => [...prev, { role: "ai", text: response.data.reply }]);
      } else {
        throw new Error("Invalid response format");
      }

    } catch (error) {
      console.error("Chat API Error:", error);
      
      // Handle actual backend error messages if they exist, otherwise show fallback
      const errorMsg = error.response?.data?.message || "Sorry, I lost my connection to the server. Please try again.";
      
      setMessages(prev => [...prev, { role: "ai", text: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to quickly format basic bold text (**text**) from Gemini
  const formatText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-white font-black">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <UserLayout active="ai-coach">
      <div className="min-h-screen w-full bg-black flex flex-col items-center relative p-4 pb-24 md:pb-6 overflow-hidden">
        
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-3xl flex flex-col h-[85vh] md:h-[90vh] bg-[#09090b] border border-[#27272a] rounded-[2rem] shadow-2xl relative z-10 overflow-hidden mt-4">
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-md z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <BsStars className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-lg font-black italic uppercase text-white tracking-tighter leading-none">
                  TrackFit <span className="text-indigo-500">AI</span>
                </h1>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                  Your Personal Coach
                </p>
              </div>
            </div>
            {/* Pulsing online indicator */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Online</span>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide">
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-end gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {/* AI Avatar */}
                  {msg.role === "ai" && (
                    <div className="w-8 h-8 rounded-full bg-[#121215] border border-[#27272a] flex items-center justify-center shrink-0 mb-1">
                      <FiCpu className="text-indigo-400 text-xs" />
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className={`max-w-[80%] md:max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-indigo-600 text-white rounded-br-sm shadow-lg shadow-indigo-900/20 font-medium" 
                      : "bg-[#121215] border border-[#27272a] text-zinc-300 rounded-bl-sm"
                  }`}>
                    {formatText(msg.text)}
                  </div>

                  {/* User Avatar */}
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-[#27272a] flex items-center justify-center shrink-0 mb-1">
                      <FiUser className="text-white text-xs" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* LOADING ANIMATION */}
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-end gap-3 justify-start"
              >
                <div className="w-8 h-8 rounded-full bg-[#121215] border border-[#27272a] flex items-center justify-center shrink-0 mb-1">
                  <FiCpu className="text-indigo-400 text-xs" />
                </div>
                <div className="bg-[#121215] border border-[#27272a] p-4 rounded-2xl rounded-bl-sm flex items-center gap-1.5 h-[52px]">
                   <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-indigo-500 rounded-full" />
                   <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-indigo-500 rounded-full" />
                   <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-indigo-500 rounded-full" />
                </div>
              </motion.div>
            )}
            
            {/* Invisible div to scroll to */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-[#27272a] bg-[#09090b]">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your diet, workouts, or PRs..."
                disabled={isLoading}
                className="w-full h-14 bg-[#121215] border border-[#27272a] rounded-2xl pl-5 pr-14 text-white placeholder:text-zinc-600 focus:border-indigo-500 outline-none font-medium transition-colors disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 hover:bg-indigo-500"
              >
                <FiSend size={16} className="-ml-1" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </UserLayout>
  );
};

export default AICoach;