import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { slideIn, fadeIn, staggerContainer } from "../utils/motion";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [particles, setParticles] = useState([]);

  // Generate floating particles for the button
  useEffect(() => {
    if (isOpen) return;
    const newParticles = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 - 40,
      y: Math.random() * 80 - 40,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 2,
      duration: Math.random() * 4 + 3,
    }));
    setParticles(newParticles);
  }, [isOpen]);

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load chat history from localStorage on initial render
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem("chatHistory");
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (e) {
      console.error("Failed to parse chat history from localStorage", e);
      localStorage.removeItem("chatHistory");
    }
  }, []);

  // Save chat history and scroll to bottom whenever messages change
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  // Core function to send a message to the backend
  const sendMessage = async (messageText) => {
    if (!messageText.trim() || loading) return;

    const userMessage = {
      text: messageText,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
        const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: messageText }),
    });

      if (!response.ok) throw new Error(`HTTP error ${response.status}`);

      const data = await response.json();
      const botMessage = {
        text: data.response,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Error:", err);
      const errorMessageText = "I'm sorry, I couldn't process that request. Please try again or ask about Navin B's skills, projects, or experience.";
      setError(errorMessageText);
      const errorMessage = {
        text: errorMessageText,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    sendMessage(input);
    setInput("");
  };

  // Handle clicking a quick question (auto-sends the message)
  const handleQuickQuestionClick = (question) => {
    setInput(question); // Optionally show the question in input briefly
    sendMessage(question);
    setInput("");
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("chatHistory");
  };
  
  const quickQuestions = [
    "What are Navin's skills?",
    "Tell me about a key project",
    "Summarize Navin's experience",
    "Where did Navin study?",
    "Does Navin have certifications?",
  ];

  return (
    <>
      {/* Floating 3D Chatbot Button with Holographic Effect */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white rounded-full p-5 shadow-2xl hover:shadow-purple-600/50 transition-all duration-300 group"
          style={{ boxShadow: "0 0 25px rgba(139, 92, 246, 0.6)" }}
        >
          <motion.div className="absolute inset-0 rounded-full border-2 border-purple-400/30" animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 2.5, repeat: Infinity }} />
          <svg className="w-8 h-8 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          <AnimatePresence>
            {!isOpen && particles.map((p) => (
              <motion.span key={p.id} initial={{ x: p.x, y: p.y, opacity: 0, scale: 0 }} animate={{ x: p.x + (Math.random() * 20 - 10), y: p.y + (Math.random() * 20 - 10), opacity: [0, 0.8, 0], scale: [0, 1, 0] }} transition={{ delay: p.delay, duration: p.duration, repeat: Infinity, repeatType: "reverse" }} className="absolute rounded-full bg-pink-400/70" style={{ width: `${p.size}px`, height: `${p.size}px` }} />
            ))}
          </AnimatePresence>
          {messages.length > 0 && !isOpen && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 bg-pink-500 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md z-20">{messages.length}</motion.span>
          )}
        </button>
      </motion.div>

      {/* Chatbot Window (Glass Morphism with Neon Glow) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            layout="position"
            transition={{ layout: { duration: 0.4, type: "spring", bounce: 0.3 } }}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9, transition: { duration: 0.2 } }}
            className={`fixed bottom-24 right-8 bg-black/60 rounded-3xl shadow-2xl overflow-hidden z-50 border border-purple-500/20 backdrop-blur-xl flex flex-col
              ${isMinimized ? "h-24 w-80 cursor-pointer" : "w-[95%] max-w-md h-[700px]"}
            `}
            style={{ boxShadow: "0 0 40px rgba(139, 92, 246, 0.4)" }}
          >
            {/* Header with Animated Gradient */}
            <motion.div layout className="relative p-5 flex justify-between items-center cursor-pointer overflow-hidden shrink-0" onClick={() => setIsMinimized(!isMinimized)} whileTap={{ scale: 0.98 }}>
              <motion.div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} style={{ backgroundSize: "300% 300%" }} />
              <div className="flex items-center gap-3 z-10">
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8], boxShadow: ["0 0 5px #10B981", "0 0 15px #10B981", "0 0 5px #10B981"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} className="w-3 h-3 bg-green-400 rounded-full" />
                <div>
                  <h3 className="text-white font-bold text-xl font-poppins drop-shadow-md">Navin Assistant</h3>
                  <AnimatePresence mode="wait">
                    <motion.span key={isMinimized ? "min" : "max"} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="text-purple-200 text-xs font-poppins drop-shadow-md">
                      {isMinimized ? "Click to expand" : "Ask me about Navin's portfolio"}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
              <div className="flex items-center gap-3 z-10">
                {!isMinimized && (
                  <motion.button onClick={(e) => { e.stopPropagation(); clearChat(); }} whileHover={{ scale: 1.1, rotate: 10 }} whileTap={{ scale: 0.9 }} className="text-purple-200 hover:text-white transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </motion.button>
                )}
                <motion.button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} whileHover={{ scale: 1.1, rotate: -90 }} whileTap={{ scale: 0.9 }} className="text-white hover:text-purple-200 transition-colors duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </motion.button>
              </div>
            </motion.div>

            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 p-6 overflow-y-auto relative"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(167, 139, 250, 0.2) 1px, transparent 0)',
                    backgroundSize: '20px 20px'
                  }}
                  ref={chatContainerRef}
                >
                  <motion.div variants={staggerContainer(0.2, 0.1)}>
                    {messages.length === 0 && (
                      <motion.div
                        variants={fadeIn("up", "spring", 0.2, 0.7)}
                        // *** MODIFICATION: Centered the welcome content ***
                        className="flex flex-col items-center justify-center text-center text-gray-300 text-sm font-poppins px-4 py-6 h-full"
                      >
                        {/* *** START: INSERTED ANIMATED ORB *** */}
                        <motion.div
                          className="w-48 h-48 mb-6 relative flex items-center justify-center"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        >
                          <div className="absolute inset-0 bg-purple-500 rounded-full opacity-30 blur-2xl"></div>
                          <div className="absolute w-32 h-32 border-2 border-purple-400/50 rounded-full animate-ping"></div>
                          <div className="w-40 h-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-700 via-purple-800 to-gray-900 rounded-full shadow-inner"></div>
                        </motion.div>
                      </motion.div>
                    )}
                    {messages.map((msg, index) => (
                      <motion.div key={index} variants={fadeIn(msg.sender === "user" ? "right" : "left", "spring", 0, 0.6)} className={`mb-4 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl font-poppins text-sm shadow-lg ${msg.sender === "user" ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-none" : "bg-gray-800/80 text-gray-100 border border-purple-500/20 rounded-bl-none"}`}>
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                          <p className="text-xs text-gray-400 mt-2 text-right">{msg.timestamp}</p>
                        </div>
                      </motion.div>
                    ))}
                    {loading && (
                      <motion.div variants={fadeIn("left", "spring", 0.1, 0.5)} className="flex justify-start mb-4">
                        <div className="bg-gray-800/70 p-4 rounded-2xl rounded-bl-none font-poppins text-sm flex items-center gap-2 shadow-lg">
                          {[...Array(3)].map((_, i) => (
                            <motion.div key={i} className="w-2 h-2 bg-purple-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </motion.div>

                  {/* Quick Questions on top of the form */}
                  {messages.length === 0 && (
                    <div className="absolute bottom-24 left-0 right-0 p-4 flex flex-wrap justify-center gap-2">
                       {quickQuestions.map((question, i) => (
                        <motion.button key={i} whileHover={{ scale: 1.05, y: -2, backgroundColor: "rgba(124, 58, 237, 0.3)" }} whileTap={{ scale: 0.95 }}
                          onClick={() => handleQuickQuestionClick(question)}
                          className="text-xs bg-gray-800/50 text-purple-300 px-3 py-2 rounded-lg cursor-pointer hover:bg-purple-900/30 transition-all border border-purple-500/20"
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 + 0.5 }}>
                          {question}
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {error && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-24 left-6 right-6 bg-red-500/90 text-white p-3 rounded-xl text-sm font-poppins text-center shadow-md flex items-center justify-center gap-2 z-20">
                      {error}
                    </motion.div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>

            {!isMinimized && (
              <motion.form onSubmit={handleFormSubmit} className="p-4 bg-gray-900/50 border-t border-purple-500/10 backdrop-blur-sm shrink-0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about Navin..." 
                    className="w-full bg-gray-800/70 py-3 px-4 text-gray-100 rounded-xl outline-none border border-purple-500/20 placeholder:text-gray-400 font-poppins text-sm focus:ring-2 focus:ring-purple-500 focus:shadow-lg focus:shadow-purple-500/30 transition-all duration-300 backdrop-blur-sm" />
                  </div>
                  <motion.button type="submit" disabled={loading || !input.trim()} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-3 rounded-xl hover:shadow-md hover:shadow-purple-500/20 transition-all duration-300 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                    Send
                  </motion.button>
                </div>
              </motion.form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;