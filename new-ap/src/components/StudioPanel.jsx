import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import "./StudioPanel.css";

function StudioPanel({ analysisData }) {
  const [summary, setSummary] = useState("");
  const [mode, setMode] = useState("3-bullet"); // Default mode
  const [loading, setLoading] = useState(false);
  const [sentiment, setSentiment] = useState("");
  const [typingText, setTypingText] = useState("");
  
  // Generate summary based on the latest analysis data
  const fetchSummary = async () => {
    if (!analysisData || !analysisData.results || analysisData.results.length === 0) {
      alert("No analysis data available. Please analyze a document first.");
      return;
    }
  
    setLoading(true);
    setSummary("");
    setTypingText("");
    setSentiment("");
  
    try {
      // FormData for FastAPI
      const formData = new FormData();
      formData.append("mode", mode);
      formData.append("text", analysisData.results[0].analysis);
  
      const response = await axios.post("http://localhost:8000/generate-summary", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setSummary(response.data.summary);
      setSentiment(response.data.sentiment || "Neutral");
      setTypingText("");
  
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
        <p className={`sentiment ${sentiment.toLowerCase()}`}>
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

// ✅ Add PropTypes validation
StudioPanel.propTypes = {
  analysisData: PropTypes.shape({
    results: PropTypes.arrayOf(
      PropTypes.shape({
        analysis: PropTypes.string.isRequired,
      })
    ),
  }),
};

export default StudioPanel;
