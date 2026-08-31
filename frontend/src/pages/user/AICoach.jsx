import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiCpu, FiUser, FiZap } from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import axios from "axios";
import UserLayout from "../../components/layouts/UserLayout";

const AICoach = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [messages, setMessages] = useState([
    { 
      role: "ai", 
      text: "Greetings athlete! I am your TrackFit Gemini Coach. I have synced your latest weight trends, macro intake, and personal record lifts. How can I optimize your training today?" 
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (e, customText) => {
    if (e) e.preventDefault();
    const query = customText || input;
    if (!query.trim()) return;

    const userText = query.trim();
    if (!customText) setInput(""); 
    
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/ai/ask",
        { message: userText },
        { withCredentials: true }
      );

      if (response.data && response.data.success) {
        setMessages(prev => [...prev, { role: "ai", text: response.data.reply }]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Chat API Error:", error);
      const errorMsg = error.response?.data?.message || "Connection interrupted. Please try again.";
      setMessages(prev => [...prev, { role: "ai", text: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-extrabold text-gray-900">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  const quickPrompts = [
    "Analyze my calorie & protein intake",
    "How can I break my Bench Press PR plateau?",
    "Recommend a post-workout recovery routine",
    "Suggest macro adjustments for a lean bulk"
  ];

  return (
    <UserLayout active="ai-coach">
      <div className="space-y-6 pb-12">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FiZap className="text-orange-600" size={18} />
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Gemini Flash Intelligence</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              AI Athlete Advisory Coach
            </h1>
          </div>
          <div className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-2 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" /> AI Sync Active
          </div>
        </div>

        {/* MAIN CONSULTATION CONTAINER */}
        <div className="bg-white border border-gray-200 rounded-xl h-[65vh] flex flex-col overflow-hidden shadow-xs">
          
          {/* Terminal Header */}
          <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                <BsStars size={16} />
              </div>
              <div>
                <h2 className="text-xs font-black text-gray-900 uppercase tracking-wider">
                  Athlete Intelligence Consultation Studio
                </h2>
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Contextual User Data Synced
                </p>
              </div>
            </div>

            <span className="text-[10px] font-bold text-gray-600 bg-white border border-gray-200 px-2.5 py-1 rounded">
              Gemini AI
            </span>
          </div>

          {/* Chat Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "ai" && (
                  <div className="w-7 h-7 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 text-gray-700 mt-1">
                    <FiCpu size={14} />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === "user" 
                    ? "bg-gray-900 text-white font-medium shadow-xs" 
                    : "bg-gray-50 border border-gray-200 text-gray-800"
                }`}>
                  {formatText(msg.text)}
                </div>

                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center shrink-0 text-white mt-1 shadow-xs">
                    <FiUser size={14} />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                <div className="w-7 h-7 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 text-gray-700 mt-1">
                  <FiCpu size={14} />
                </div>
                <div className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-pulse" />
                  <div className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-pulse [animation-delay:150ms]" />
                  <div className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-pulse [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Shortcuts */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider shrink-0">Prompts:</span>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={(e) => handleSend(e, prompt)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-200 text-[11px] font-bold text-gray-700 rounded transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3.5 border-t border-gray-200 bg-white">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about diet, workouts, PRs, or weight goals..."
                disabled={isLoading}
                className="w-full h-11 bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-12 text-gray-900 text-xs sm:text-sm placeholder:text-gray-400 focus:border-orange-600 outline-none font-medium transition-colors"
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-900 hover:bg-gray-800 text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-40"
              >
                <FiSend size={14} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </UserLayout>
  );
};

export default AICoach;