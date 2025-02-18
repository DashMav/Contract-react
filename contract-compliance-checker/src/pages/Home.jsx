import { useState } from "react";
import FileUpload from "../components/Fileupload";
import AnalysisResults from "../components/AnalysisResults";

const Home = () => {
  const [results, setResults] = useState([]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Legal Contract Review</h1>
      <FileUpload onAnalysisComplete={setResults} />
      <AnalysisResults results={results} />
    </div>
  );
};

export default Home;
