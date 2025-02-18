// App.js
import { useState } from "react";
import { Routes, Route } from 'react-router-dom';
import axios from "axios";
import { Button, Card, Table, Upload, Spin, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ChatArea from "./components/Chatarea";

const { Option } = Select;

const App = () => {
  const [contractFiles, setContractFiles] = useState([]);
  const [guidelinesFile, setGuidelinesFile] = useState(null);
  const [contractType, setContractType] = useState("");
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUploadContracts = (file) => {
    setContractFiles([...contractFiles, file]);
    return false; // Prevent default upload behavior
  };

  <div className="main-content">
                <Routes>
                    {/* <Route path="/" element={<HomePage />} /> */}
                     <Route path="/Chat" element={<ChatArea />} />
                </Routes>
            </div>

              
            

  const handleUploadGuidelines = (file) => {
    setGuidelinesFile(file);
    return false; // Prevent default upload behavior
  };

  const handleAnalyzeContracts = async () => {
    if (!contractType || contractFiles.length === 0) {
      alert("Please select a contract type and upload at least one contract!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("contractType", contractType);
    contractFiles.forEach((file) => formData.append("contracts", file));
    if (guidelinesFile) formData.append("guidelines", guidelinesFile);

    try {
      const response = await axios.post("http://localhost:8000/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAnalysisResults(response.data);
    } catch (error) {
      console.error("Error Response:", error.response ? error.response.data : error.message);
      alert("An error occurred while analyzing contracts. Check console for details.");
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div className="app-container" style={{ padding: "20px" }}>
      <h1>Contract Compliance Checker</h1>
      <Card style={{ marginBottom: "20px" }}>
        <h3>Step 1: Select Contract Type</h3>
        <Select
          style={{ width: "100%" }}
          placeholder="Select contract type"
          onChange={(value) => setContractType(value)}
        >
          <Option value="Loan Agreement">Loan Agreement</Option>
          <Option value="Sales Agreement">Sales Agreement</Option>
          <Option value="Partnership Agreement">Partnership Agreement</Option>
        </Select>
      </Card>

      <Card style={{ marginBottom: "20px" }}>
        <h3>Step 2: Upload Files</h3>
        <Upload
          multiple
          beforeUpload={handleUploadContracts}
          fileList={contractFiles}
          onRemove={(file) =>
            setContractFiles(contractFiles.filter((f) => f.uid !== file.uid))
          }
        >
          <Button icon={<UploadOutlined />}>Upload Contracts</Button>
        </Upload>
        <Upload
          beforeUpload={handleUploadGuidelines}
          fileList={guidelinesFile ? [guidelinesFile] : []}
          onRemove={() => setGuidelinesFile(null)}
        >
          <Button icon={<UploadOutlined />} style={{ marginTop: "10px" }}>
            Upload Guidelines (Optional)
          </Button>
        </Upload>
      </Card>

      <Button
        type="primary"
        onClick={handleAnalyzeContracts}
        disabled={!contractType || contractFiles.length === 0}
        loading={loading}
      >
        Analyze Contracts
      </Button>
      <Card style={{ marginBottom: "20px" }}>
        <h3>Step 3: Chat with Compliance Assistant</h3>
        <ChatArea />
      </Card>
      {loading && <Spin style={{ marginTop: "20px" }} />}

      {analysisResults && analysisResults.results && (
        <Card style={{ marginTop: "20px" }}>
          <h3>Analysis Results</h3>
          <Table
            dataSource={analysisResults.results.map((result, index) => ({
              key: index,
              guideline: result.analysis, // Adjust based on actual API response
              compliance: "N/A", // Modify if API returns compliance details
              reference: "N/A",
              risk: "N/A",
              recommendations: "N/A",
            }))}
            columns={[
              { title: "Guideline", dataIndex: "guideline", key: "guideline" },
              { title: "Compliance", dataIndex: "compliance", key: "compliance" },
              { title: "Contract Reference", dataIndex: "reference", key: "reference" },
              { title: "Risk", dataIndex: "risk", key: "risk" },
              { title: "Recommendations", dataIndex: "recommendations", key: "recommendations" },
            ]}
            pagination={{ pageSize: 5 }}
          />
        </Card>
      )}
    </div>
  );
};




export default App;
