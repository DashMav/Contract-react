import { useState, useEffect } from "react";
import axios from "axios";
import "./StudioPanel.css";

function StudioPanel() {
  const [summary, setSummary] = useState("");
  const [mode, setMode] = useState("3-bullet"); // Default mode
  const [loading, setLoading] = useState(false);
  const [sentiment, setSentiment] = useState("");
  const [typingText, setTypingText] = useState("");
  
  // Fetch summary from FastAPI
  const fetchSummary = async () => {
    setLoading(true);
    setSummary(""); // Clear previous summary
    setTypingText(""); // Reset typing effect
    
    try {
      const response = await axios.post("http://localhost:8000/generate-summary", {
        mode: mode,
      });
      
      setSummary(response.data.summary);
      setSentiment(response.data.sentiment);
      
      // Typing effect for real-time rendering
      let i = 0;
      const interval = setInterval(() => {
        setTypingText((prev) => prev + response.data.summary[i]);
        i++;
        if (i >= response.data.summary.length) clearInterval(interval);
      }, 50);

    } catch (error) {
      console.error("Error fetching summary:", error);
    } finally {
      setLoading(false);
    }
  };

  // Save last-used mode in localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("summaryMode");
    if (savedMode) setMode(savedMode);
  }, []);

  useEffect(() => {
    localStorage.setItem("summaryMode", mode);
  }, [mode]);

  // Export summary as a text file
  const exportSummary = () => {
    const blob = new Blob([summary], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "summary.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <aside className="studio-panel">
      <h3>AI Summary</h3>

      {/* Mode Selector */}
      <div className="mode-selector">
        <label>Summary Mode:</label>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="3-bullet">3 Bullet Points</option>
          <option value="5-bullet">5 Bullet Points</option>
          <option value="paragraph">Paragraph</option>
        </select>
        <button onClick={fetchSummary} disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {/* Summary Display */}
      <div className="summary-box">
        {loading ? (
          <p>Loading summary...</p>
        ) : (
          <p>{typingText || "Your summary will appear here."}</p>
        )}
      </div>

      {/* Sentiment Analysis */}
      {sentiment && (
        <p className={`sentiment ${sentiment}`}>
          Sentiment: {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
        </p>
      )}

      {/* Export & Copy */}
      <div className="actions">
        <button onClick={fetchSummary}>Regenerate</button>
        <button onClick={exportSummary}>Export</button>
        <button onClick={() => navigator.clipboard.writeText(summary)}>
          Copy to Clipboard
        </button>
      </div>
    </aside>
  );
}

export default StudioPanel;















// // src/components/StudioPanel/StudioPanel.jsx
// import { IconButton, Icon } from '../shared/icons';
// import { api } from '../services/api';

// const StudioPanel = () => {
//   const createNote = async () => {
//     await api.createNote("New note");
//   };

//   return (
//     <div className="w-80 p-4 border-l border-gray-800">
//       <div className="mb-8">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-sm font-medium">Studio</h2>
//           <button className="text-gray-500">
//             <Icon label="upload" />
//           </button>
//         </div>
//         <div className="bg-gray-800 rounded-lg p-4 mb-4">
//           <div className="flex items-center gap-2 mb-2">
//             <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
//               <Icon label="help" />
//             </div>
//             <div>
//               <h3 className="text-sm font-medium">Deep Dive conversation</h3>
//               <p className="text-xs text-gray-500">Two hosts (English only)</p>
//             </div>
//           </div>
//           <div className="flex gap-2 mt-4">
//             <button className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-sm">
//               Customize
//             </button>
//             <button className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-sm">
//               Generate
//             </button>
//           </div>
//         </div>
//       </div>

//       <div>
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-sm font-medium">Notes</h2>
//           <button className="text-gray-500">
//             <Icon label="menu" />
//           </button>
//         </div>
//         <IconButton 
//           className="w-full justify-center px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 mb-4"
//           onClick={createNote}
//         >
//           <Icon label="plus" /> Add note
//         </IconButton>
//         <div className="grid grid-cols-2 gap-2">
//           <IconButton className="p-2 rounded-lg bg-gray-800 text-sm">
//             <Icon label="book" /> Study guide
//           </IconButton>
//           <IconButton className="p-2 rounded-lg bg-gray-800 text-sm">
//             <Icon label="doc" /> Briefing doc
//           </IconButton>
//           <IconButton className="p-2 rounded-lg bg-gray-800 text-sm">
//             <Icon label="help" /> FAQ
//           </IconButton>
//           <IconButton className="p-2 rounded-lg bg-gray-800 text-sm">
//             <Icon label="time" /> Timeline
//           </IconButton>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudioPanel;