import PropTypes from "prop-types";

const AnalysisResults = ({ results }) => {
  if (!results || results.length === 0) {
    return <p className="text-gray-500">No results to display.</p>;
  }

  return (
    <div className="p-4 bg-white shadow rounded-lg mt-4">
      <h2 className="text-lg font-semibold mb-2">Analysis Results</h2>
      {results.map((result, index) => (
        <div key={index} className="border-b pb-2 mb-2">
          <h3 className="font-semibold">{result.fileName}</h3>
          <pre className="bg-gray-100 p-2 rounded">{result.analysis}</pre>
        </div>
      ))}
    </div>
  );
};

// ✅ Add PropTypes to validate props
AnalysisResults.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      fileName: PropTypes.string.isRequired,
      analysis: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default AnalysisResults;
