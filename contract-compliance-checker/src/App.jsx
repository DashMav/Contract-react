// App.js
import  { useState } from "react";
import axios from "axios";
import { Button, Card,  Table, Upload, Spin, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";

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
      console.error(error);
      alert("An error occurred while analyzing contracts.");
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

      {loading && <Spin style={{ marginTop: "20px" }} />}

      {analysisResults && (
        <Card style={{ marginTop: "20px" }}>
          <h3>Analysis Results</h3>
          <Table
            dataSource={analysisResults}
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
