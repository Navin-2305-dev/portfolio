import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, staggerContainer } from "../utils/motion";

// ── API URL ───────────────────────────────────────────────────────────────────
// Use Vite environment variable – must be set in Vercel:
//   VITE_API_URL = https://your-backend.up.railway.app
const API_BASE = "https://chatbot-portfolio-production.up.railway.app" || "http://127.0.0.1:5000";
const API_URL  = `${API_BASE}/api/chatbot`;

// Log the API URL in development to verify correct value
if (import.meta.env.DEV) {
  console.log("Chatbot API URL:", API_URL);
}

// ── Constants ─────────────────────────────────────────────────────────────────
const QUICK_QUESTIONS = [
  "What are Navin's skills?",
  "Tell me about a key project",
  "Summarize Navin's experience",
  "Where did Navin study?",
  "Tell me about Navin's certifications?",
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const getTimestamp = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const loadFromStorage = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
};

const removeFromStorage = (key) => {
  try { localStorage.removeItem(key); } catch {}
};

// ── Component ─────────────────────────────────────────────────────────────────
const Chatbot = () => {
  const [isOpen, setIsOpen]           = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages]       = useState(() => loadFromStorage("chatHistory", []));
  const [sessionId, setSessionId]     = useState(() => loadFromStorage("chatSessionId", null));
  const [input, setInput]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [particles, setParticles]     = useState([]);

  const messagesEndRef   = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef         = useRef(null);

  // Generate particles only when button is visible (chat closed)
  useEffect(() => {
    if (isOpen) return;
    setParticles(
      Array.from({ length: 10 }, (_, i) => ({
        id:       i,
        x:        Math.random() * 80 - 40,
        y:        Math.random() * 80 - 40,
        size:     Math.random() * 3 + 1,
        delay:    Math.random() * 2,
        duration: Math.random() * 4 + 3,
      }))
    );
  }, [isOpen]);

  // Persist messages to localStorage
  useEffect(() => {
    saveToStorage("chatHistory", messages);
  }, [messages]);

  // Persist session ID to localStorage
  useEffect(() => {
    if (sessionId) saveToStorage("chatSessionId", sessionId);
    else removeFromStorage("chatSessionId");
  }, [sessionId]);

  // Scroll to bottom on new messages or typing indicator
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto-focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  // ── Core send function ──────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { text: trimmed, sender: "user", timestamp: getTimestamp() }]);
    setLoading(true);
    setError(null);

    try {
      const headers = { "Content-Type": "application/json" };
      if (sessionId) headers["X-Session-ID"] = sessionId;

      const res = await fetch(API_URL, {
        method:      "POST",
        headers,
        body:        JSON.stringify({ query: trimmed }),
        credentials: "include",
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `Server responded with ${res.status}`);
      }

      const data = await res.json();

      // Capture session ID so conversation memory works across messages
      if (data.session_id && data.session_id !== sessionId) {
        setSessionId(data.session_id);
      }

      setMessages((prev) => [
        ...prev,
        { text: data.response || "Sorry, I didn't get a response.", sender: "bot", timestamp: getTimestamp() },
      ]);

    } catch (err) {
      console.error("Chatbot error:", err);
      const errText = "I'm sorry, I couldn't process that. Please try again or ask about Navin's skills, projects, or experience.";
      setError(errText);
      setMessages((prev) => [...prev, { text: errText, sender: "bot", timestamp: getTimestamp() }]);
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  }, [loading, sessionId]);

  // ── Event handlers ──────────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
    setInput("");
  };

  const handleQuickQuestion = (q) => sendMessage(q);

  const clearChat = () => {
    setMessages([]);
    setSessionId(null);
    removeFromStorage("chatHistory");
    removeFromStorage("chatSessionId");
  };

  // ── Render (unchanged from your original, kept as is) ────────────────────────
  return (
    <>
      {/* ── Floating Button ────────────────────────────────────────────────── */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <button
          onClick={() => { setIsOpen((v) => !v); setIsMinimized(false); }}
          aria-label="Toggle chat"
          className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white rounded-full p-5 shadow-2xl transition-all duration-300"
          style={{ boxShadow: "0 0 25px rgba(139, 92, 246, 0.6)" }}
        >
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-purple-400/30"
            animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          <svg className="w-8 h-8 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>

          {/* Floating particles */}
          <AnimatePresence>
            {!isOpen && particles.map((p) => (
              <motion.span
                key={p.id}
                className="absolute rounded-full bg-pink-400/70 pointer-events-none"
                style={{ width: p.size, height: p.size }}
                initial={{ x: p.x, y: p.y, opacity: 0, scale: 0 }}
                animate={{ x: p.x + (Math.random() * 20 - 10), y: p.y + (Math.random() * 20 - 10), opacity: [0, 0.8, 0], scale: [0, 1, 0] }}
                transition={{ delay: p.delay, duration: p.duration, repeat: Infinity, repeatType: "reverse" }}
              />
            ))}
          </AnimatePresence>

          {/* Unread badge */}
          {messages.length > 0 && !isOpen && (
            <motion.span
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-pink-500 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md z-20"
            >
              {messages.length}
            </motion.span>
          )}
        </button>
      </motion.div>

      {/* ── Chat Window ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0,  scale: 1   }}
            exit={{    opacity: 0, y: 50, scale: 0.9, transition: { duration: 0.2 } }}
            className={`fixed bottom-24 right-8 z-50 flex flex-col rounded-3xl border border-purple-500/20 backdrop-blur-xl overflow-hidden bg-black/60
              ${isMinimized ? "h-20 w-80" : "w-[95vw] max-w-md h-[700px]"}
            `}
            style={{ boxShadow: "0 0 40px rgba(139, 92, 246, 0.4)" }}
          >
            {/* Header */}
            <div
              className="relative p-4 flex justify-between items-center cursor-pointer overflow-hidden shrink-0 select-none"
              onClick={() => setIsMinimized((v) => !v)}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: "300% 300%" }}
              />
              <div className="flex items-center gap-3 z-10">
                <motion.div
                  className="w-3 h-3 bg-green-400 rounded-full"
                  animate={{ scale: [1,1.2,1], opacity: [0.8,1,0.8], boxShadow: ["0 0 5px #10B981","0 0 15px #10B981","0 0 5px #10B981"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">Navin Assistant</h3>
                  <span className="text-purple-200 text-xs">
                    {isMinimized ? "Click to expand" : "Ask me about Navin's portfolio"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 z-10">
                {!isMinimized && (
                  <motion.button
                    onClick={(e) => { e.stopPropagation(); clearChat(); }}
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    aria-label="Clear chat"
                    className="text-purple-200 hover:text-white transition-colors duration-200"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </motion.button>
                )}
                <motion.button
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  aria-label="Close chat"
                  className="text-white hover:text-purple-200 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Body */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  key="chat-body"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{    opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  {/* Messages scroll area */}
                  <div
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto p-5 relative"
                    style={{
                      backgroundImage: "radial-gradient(circle at 1px 1px, rgba(167,139,250,0.15) 1px, transparent 0)",
                      backgroundSize: "20px 20px",
                    }}
                  >
                    {/* Empty state */}
                    {messages.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col items-center justify-center text-center h-full gap-6 pb-8"
                      >
                        <motion.div
                          className="w-36 h-36 relative flex items-center justify-center"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                          <div className="absolute inset-0 bg-purple-500 rounded-full opacity-30 blur-2xl" />
                          <div className="absolute w-24 h-24 border-2 border-purple-400/50 rounded-full animate-ping" />
                          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-700 via-purple-800 to-gray-900 shadow-inner" />
                        </motion.div>
                        <p className="text-gray-400 text-sm px-4">
                          Hi! Ask me anything about Navin's portfolio.
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 px-2">
                          {QUICK_QUESTIONS.map((q, i) => (
                            <motion.button
                              key={q}
                              onClick={() => handleQuickQuestion(q)}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.08 + 0.2 }}
                              whileHover={{ scale: 1.04, backgroundColor: "rgba(124,58,237,0.3)" }}
                              whileTap={{ scale: 0.96 }}
                              className="text-xs bg-gray-800/60 text-purple-300 px-3 py-2 rounded-lg border border-purple-500/20 transition-colors duration-150"
                            >
                              {q}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Message list */}
                    {messages.length > 0 && (
                      <motion.div
                        variants={staggerContainer(0.05, 0.1)}
                        initial="hidden"
                        animate="show"
                      >
                        {messages.map((msg, i) => (
                          <motion.div
                            key={i}
                            variants={fadeIn(msg.sender === "user" ? "right" : "left", "spring", 0, 0.5)}
                            className={`mb-3 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-md leading-relaxed
                              ${msg.sender === "user"
                                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-none"
                                : "bg-gray-800/80 text-gray-100 border border-purple-500/20 rounded-bl-none"
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{msg.text}</p>
                              <p className="text-xs text-gray-400 mt-1 text-right">{msg.timestamp}</p>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}

                    {/* Typing indicator */}
                    <AnimatePresence>
                      {loading && (
                        <motion.div
                          key="typing"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{    opacity: 0, y: 6 }}
                          className="flex justify-start mb-3"
                        >
                          <div className="bg-gray-800/70 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-1.5 shadow-md">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                className="w-2 h-2 bg-purple-400 rounded-full"
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Error toast */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          key="error-toast"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{    opacity: 0, y: 8 }}
                          className="mt-2 bg-red-500/90 text-white px-4 py-2 rounded-xl text-xs text-center shadow-md"
                        >
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input bar */}
                  <form
                    onSubmit={handleSubmit}
                    className="p-3 bg-gray-900/60 border-t border-purple-500/10 backdrop-blur-sm shrink-0"
                  >
                    <div className="flex gap-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about Navin..."
                        disabled={loading}
                        className="flex-1 bg-gray-800/70 py-3 px-4 text-gray-100 rounded-xl outline-none border border-purple-500/20 placeholder:text-gray-500 text-sm focus:ring-2 focus:ring-purple-500 transition-all duration-200 disabled:opacity-50"
                      />
                      <motion.button
                        type="submit"
                        disabled={loading || !input.trim()}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-3 rounded-xl font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-opacity duration-200"
                      >
                        Send
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;