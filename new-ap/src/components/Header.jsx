import { useState } from "react";
import "./Header.css";
import PropTypes from "prop-types"; // Import PropTypes


function Header({ setContractType }) { // Pass setContractType as prop
  const [contractType, setLocalContractType] = useState("Loan Agreement");

  const handleContractChange = (event) => {
    const selectedType = event.target.value;
    setLocalContractType(selectedType);
    setContractType(selectedType); // Set contract type to parent component
  };

  return (
    <header className="header">
      <h2>Contract Compliance Checker</h2>

      <div className="header-controls">
        <select value={contractType} onChange={handleContractChange} className="contract-dropdown">
          <option value="Loan Agreement">Loan Agreement</option>
          <option value="Sales Agreement">Sales Agreement</option>
          <option value="Partnership Agreement">Partnership Agreement</option>
        </select>

        <div className="button-group">
          <button>Export</button>
          <button>Share</button>
          <button>Settings</button>
        </div>
      </div>
    </header>
  );
}
Header.propTypes = {
  setContractType: PropTypes.func.isRequired, // Ensure setMessages is a required string
};
export default Header;
