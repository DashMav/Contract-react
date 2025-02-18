import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios";

const FileUpload = ({ onAnalysisComplete }) => {
  const [contractFiles, setContractFiles] = useState([]);
  const [guidelineFile, setGuidelineFile] = useState(null);
  const [contractType, setContractType] = useState("Loan Agreement");
  const [loading, setLoading] = useState(false);

  const handleContractChange = (e) => setContractFiles([...e.target.files]);
  const handleGuidelineChange = (e) => setGuidelineFile(e.target.files[0]);
  const handleContractTypeChange = (e) => setContractType(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contractFiles.length) return alert("Upload at least one contract file.");

    const formData = new FormData();
    formData.append("contractType", contractType);
    contractFiles.forEach((file) => formData.append("contracts", file));
    if (guidelineFile) formData.append("guidelines", guidelineFile);

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onAnalysisComplete(response.data.results); // Call parent function
    } catch (error) {
      console.error("Error analyzing contract:", error);
      alert("Error analyzing contract.");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Upload Contract for Analysis</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Select Contract Type:</label>
        <select value={contractType} onChange={handleContractTypeChange} className="border p-2 rounded w-full mb-3">
          <option>Loan Agreement</option>
          <option>Sales Agreement</option>
          <option>Partnership Agreement</option>
        </select>

        <label className="block mb-2">Upload Contract(s):</label>
        <input type="file" multiple onChange={handleContractChange} className="border p-2 rounded w-full mb-3" />

        <label className="block mb-2">Upload Additional Guidelines (Optional):</label>
        <input type="file" onChange={handleGuidelineChange} className="border p-2 rounded w-full mb-3" />

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full"
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Submit for Analysis"}
        </button>
      </form>
    </div>
  );
};

// ✅ Add PropTypes to validate props
FileUpload.propTypes = {
  onAnalysisComplete: PropTypes.func.isRequired,
};

export default FileUpload;
