import { useState, useEffect, useRef } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import "./ChatArea.css";

function ChatArea({ messages, setMessages }) { // Accept messages and setMessages as props
  const [userInput, setUserInput] = useState("");
  const [jsonFile, setJsonFile] = useState(null);
  const chatContainerRef = useRef(null);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = { type: "user", content: userInput };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post("http://127.0.0.1:8000/chat", { query: userInput });

      if (response.data.results) {
        setMessages((prev) => [...prev, formatApiResponse(response.data.results[0])]);
      } else {
        setMessages((prev) => [...prev, { type: "ai", content: response.data.answer }]);
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [...prev, { type: "ai", content: "Error getting response" }]);
    }

    setUserInput("");
  };

  const formatApiResponse = (apiResponse) => {
    const { fileName, analysis } = apiResponse;
    return [
      { type: "ai", content: `**File Name:** ${fileName}` },
      { type: "ai", content: analysis }
    ];
  };

  const handleJsonUpload = (event) => {
    const file = event.target.files[0];
    if (file) setJsonFile(file);
  };

  const renderJsonContent = async () => {
    if (!jsonFile) return;

    try {
      const text = await jsonFile.text();
      const parsedJson = JSON.parse(text);

      if (parsedJson.results) {
        setMessages((prev) => [...prev, ...formatApiResponse(parsedJson.results[0])]);
      } else {
        setMessages((prev) => [...prev, { type: "ai", content: "Invalid JSON format" }]);
      }
    } catch (error) {
      console.error("Error parsing JSON file:", error);
      setMessages((prev) => [...prev, { type: "ai", content: "Error loading JSON" }]);
    }
  };

  useEffect(() => {
    console.log("Messages updated:", messages); // ✅ Debugging step

    // if (chatContainerRef.current) {
    //   chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    // }
  }, [messages]);

  return (
    <section className="chat-area">
      <div className="chat-container" ref={chatContainerRef}>
        {messages.length === 0 ? (
          <p className="empty-chat">Ask a question about your uploaded documents</p>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.type}`} dangerouslySetInnerHTML={{ __html: msg.content }}></div>
          ))
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

      <div className="json-upload">
        <input type="file" accept="application/json" onChange={handleJsonUpload} />
        <button onClick={renderJsonContent}>Load JSON Response</button>
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
