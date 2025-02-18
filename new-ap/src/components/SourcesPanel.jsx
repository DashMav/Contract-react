import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import "./SourcesPanel.css";

function SourcesPanel({ setMessages, contractType }) {
  const [agreementFile, setAgreementFile] = useState(null);
  const [guidelinesFile, setGuidelinesFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  const handleAgreementChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type !== "application/pdf") {
      alert("Please upload a valid PDF file for the agreement.");
      return;
    }
    setAgreementFile(file);
  };

  const handleGuidelinesChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type !== "application/pdf") {
      alert("Please upload a valid PDF file for the guidelines.");
      return;
    }
    setGuidelinesFile(file);
  };

  const handleAgreementUpload = async () => {
    if (!agreementFile) {
      alert("Agreement file is required!");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", agreementFile);
    formData.append("contractType", contractType); // Send contract type here

    try {
      const response = await axios.post("http://127.0.0.1:8000/analyze", formData);
      console.log("Agreement uploaded successfully", response.data);
      alert("Agreement uploaded successfully!");

      setUploadedDocuments((prevDocs) => [
        ...prevDocs,
        { name: agreementFile.name, type: "Agreement" },
      ]);
    } catch (error) {
      console.error("Error uploading agreement:", error);
      alert("Error uploading agreement");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuidelinesUpload = async () => {
    if (!guidelinesFile) {
      alert("Guidelines file is required!");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", guidelinesFile);
    formData.append("type", "Guidelines");
    formData.append("contractType", contractType); // Send contract type here

    try {
      const response = await axios.post("http://127.0.0.1:8000/analyze", formData);
      console.log("Guidelines uploaded successfully", response.data);
      alert("Guidelines uploaded successfully!");

      setUploadedDocuments((prevDocs) => [
        ...prevDocs,
        { name: guidelinesFile.name, type: "Guidelines" },
      ]);
    } catch (error) {
      console.error("Error uploading guidelines:", error);
      alert("Error uploading guidelines");
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeDocuments = async () => {
    if (!agreementFile || !guidelinesFile) {
      alert("Both Agreement and Guidelines files are required for analysis!");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("contracts", agreementFile);
    formData.append("guidelines", guidelinesFile);
    formData.append("contractType", contractType); // Send contract type here

    try {
      const response = await axios.post("http://127.0.0.1:8000/analyze", formData);
      console.log("Analysis complete:", response.data);

      const analysisResult = response.data.analysis;
      const formattedResult = [
        { type: "ai", content: `**Analysis Result**: ${analysisResult}` },
      ];
      setMessages((prevMessages) => [...prevMessages, ...formattedResult]);
    } catch (error) {
      console.error("Error analyzing documents:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "ai", content: "Error analyzing documents: ${error.message}" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside className="sources-panel">
      {/* Agreement and Guidelines upload sections */}
      <div className="source-section">
        <h3>Agreement (Required)</h3>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleAgreementChange}
          className="file-input"
          disabled={isLoading}
          required
        />
        <button
          className="add-source"
          onClick={handleAgreementUpload}
          disabled={isLoading}
        >
          {isLoading ? "Uploading Agreement..." : "Add Agreement"}
        </button>
      </div>

      <div className="source-section">
        <h3>Guidelines (Optional)</h3>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleGuidelinesChange}
          className="file-input"
          disabled={isLoading}
        />
        <button
          className="add-Guidelines"
          onClick={handleGuidelinesUpload}
          disabled={isLoading}
        >
          {isLoading ? "Uploading Guidelines..." : "Add Guidelines"}
        </button>
      </div>

      {/* Analyze Button */}
      <div className="analyze-section">
        <button
          className="analyze-btn"
          onClick={analyzeDocuments}
          disabled={isLoading || !agreementFile || !guidelinesFile}
        >
          {isLoading ? "Analyzing..." : "Analyze Documents"}
        </button>
      </div>

      {/* Uploaded Documents Section */}
      <div className="uploaded-documents">
        <h4>Uploaded Documents</h4>
        <div className="uploaded-documents-list">
          {uploadedDocuments.length === 0 ? (
            <p>No documents uploaded yet.</p>
          ) : (
            <ul>
              {uploadedDocuments.map((doc, index) => (
                <li key={index}>
                  {doc.name} ({doc.type})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}

SourcesPanel.propTypes = {
  setMessages: PropTypes.func.isRequired,
  contractType: PropTypes.string.isRequired, // Ensure contractType is passed
};

export default SourcesPanel;
