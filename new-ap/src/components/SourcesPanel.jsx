import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import "./SourcesPanel.css";

function SourcesPanel({ setMessages, contractType }) {
  const [agreementFile, setAgreementFile] = useState(null);
  const [guidelinesFile, setGuidelinesFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  const handleFileChange = (event, setFile) => {
    const file = event.target.files[0];
    if (file && file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }
    setFile(file);
  };

  const handleUpload = async (file, fileType) => {
    if (!file) {
      alert(`${fileType} file is required!`);
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("contractType", contractType);

    try {
      const response = await axios.post("http://127.0.0.1:8000/upload", formData);
      console.log(`${fileType} Upload Response:`, response.data);
      alert(`${fileType} uploaded successfully!`);

      setUploadedDocuments((prevDocs) => [...prevDocs, { name: file.name, type: fileType }]);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "ai", content: `✅ **${fileType} uploaded successfully!**` },
      ]);
    } catch (error) {
      console.error(`Error uploading ${fileType}:`, error);
      alert(`Error uploading ${fileType}`);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeDocuments = async () => {
    if (!agreementFile) {
      alert("Agreement file is required for analysis!");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("contracts", agreementFile);
    if (guidelinesFile) formData.append("guidelines", guidelinesFile);
    formData.append("contractType", contractType);

    try {
      const response = await axios.post("http://127.0.0.1:8000/analyze", formData);
      console.log("Analysis Response:", response.data);

        // Ensure response contains expected data
    const analysisResult = response.data.results?.[0]?.analysis || "⚠️ No valid analysis received.";
    
    const formattedResult = { type: "ai", content: `**Analysis Result**: ${analysisResult}` };

    setMessages((prevMessages) => [...prevMessages, formattedResult,  { type: "ai", content: `**Analysis Result**: ${analysisResult}` },]);

    }
    catch (error) {
      console.error("Error analyzing documents:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "ai", content: `⚠️ Error analyzing documents: ${error.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside className="sources-panel">
      <div className="source-section">
        <h3>Agreement (Required)</h3>
        <input type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, setAgreementFile)} disabled={isLoading} />
        <button onClick={() => handleUpload(agreementFile, "Agreement")} disabled={isLoading}>
          {isLoading ? "Uploading..." : "Add Agreement"}
        </button>
      </div>

      <div className="source-section">
        <h3>Guidelines (Optional)</h3>
        <input type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, setGuidelinesFile)} disabled={isLoading} />
        <button onClick={() => handleUpload(guidelinesFile, "Guidelines")} disabled={isLoading}>
          {isLoading ? "Uploading..." : "Add Guidelines"}
        </button>
      </div>

      <div className="analyze-section">
        <button onClick={analyzeDocuments} disabled={isLoading || !agreementFile}>
          {isLoading ? "Analyzing..." : "Analyze Documents"}
        </button>
      </div>

      <div className="uploaded-documents">
        <h4>Uploaded Documents</h4>
        <ul>
          {uploadedDocuments.length === 0 ? <p>No documents uploaded yet.</p> : uploadedDocuments.map((doc, index) => <li key={index}>{doc.name} ({doc.type})</li>)}
        </ul>
      </div>
    </aside>
  );
}

SourcesPanel.propTypes = {
  setMessages: PropTypes.func.isRequired,
  contractType: PropTypes.string.isRequired,
};

export default SourcesPanel;
