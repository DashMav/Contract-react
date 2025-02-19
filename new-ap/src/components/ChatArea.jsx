import { useState, useEffect, useRef } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Enables tables, strikethrough, etc.
import "./ChatArea.css";

function ChatArea({ messages, setMessages }) {
  const [userInput, setUserInput] = useState("");
  const [typingMessage, setTypingMessage] = useState(null);
  const [typingIndex, setTypingIndex] = useState(0); // ✅ NEW: Track index state
  const chatContainerRef = useRef(null);
  const typingIntervalRef = useRef(null); // ✅ NEW: Store interval reference

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = { type: "user", content: userInput };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post("http://127.0.0.1:8000/chat", { query: userInput });

      if (response.data.results) {
        displayTypingEffect(response.data.results[0]);
      } else {
        displayTypingEffect({ content: response.data.answer || "No response received" });
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      displayTypingEffect({ content: "Error getting response" });
    }
  
    setUserInput("");
  };

  const handleAnalyze = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/analyze");
  
      console.log("API Response:", response.data);
  
      if (response.data && response.data.results && response.data.results.length > 0) {
        displayTypingEffect(response.data.results[0]);
      } else {
        displayTypingEffect({ content: "⚠️ Invalid API response format." });
      }
    } catch (error) {
      console.error("Error analyzing document:", error);
      displayTypingEffect({ content: "❌ Error processing the request." });
    }
  };

  useEffect(() => {
    console.log("Messages updated:", messages);
    console.log("Typing message updated:", typingMessage);

    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [typingMessage, messages]);

  // ✅ Improved Typing Effect
  const displayTypingEffect = (apiResponse) => {
    if (!apiResponse) {
      setMessages((prev) => [...prev, { type: "ai", content: "⚠️ No valid analysis received." }]);
      return;
    }
  
    const fullText = `**File Name:** ${apiResponse.fileName || "Unknown File"}\n\n**Analysis Result:**\n${apiResponse.analysis || "No analysis available"}`;
    
    setTypingMessage({ type: "ai", content: "" });
    setTypingIndex(0); // ✅ Reset typing index
  
    console.log("Starting Typing Animation...");
  
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }
  
    typingIntervalRef.current = setInterval(() => {
      setTypingIndex((prevIndex) => {
        if (prevIndex >= fullText.length - 1) {
          clearInterval(typingIntervalRef.current);
          setMessages((prev) => [...prev, { type: "ai", content: fullText }]);
          setTimeout(() => setTypingMessage(null), 100);
          return prevIndex;
        }
        setTypingMessage({ type: "ai", content: fullText.slice(0, prevIndex + 1) });
        return prevIndex + 1;
      });
    }, 30);
  };

  return (
    <section className="chat-area">
      <div className="chat-container" ref={chatContainerRef}>
        {messages.length === 0 ? (
          <p className="empty-chat">Ask a question about your uploaded documents</p>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.type}`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
            </div>
          ))
        )}
        {typingMessage && (
          <div className="message ai">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{typingMessage.content}</ReactMarkdown>
          </div>
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <div className="analyze-button">
        <button onClick={handleAnalyze}>Analyze Agreement</button>
      </div>
    </section>
  );
}

// Add PropTypes validation
ChatArea.propTypes = {
  messages: PropTypes.array.isRequired,
  setMessages: PropTypes.func.isRequired
};

export default ChatArea;
