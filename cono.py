import streamlit as st
import PyPDF2
import docx
import google.generativeai as genai


genai.configure(api_key="API_key")

model = genai.GenerativeModel("gemini-1.5-flash")


def get_framework_categories():
    return {
        "Loan Agreement": {
            "Indian Contract Act, 1872": "https://thc.nic.in/Central%20Governmental%20Acts/Contract%20Act,%201872.pdf",
            "Banking Regulation Act, 1949": "https://www.nabard.org/auth/writereaddata/tender/1409164208India_Banking_BankingRegulationAct1949.pdf",
            "Reserve Bank Of India Act, 1934": "https://www.indiacode.nic.in/bitstream/123456789/2398/1/a1934-2.pdf",
            "SARFAESI Act, 2002": "https://www.indiacode.nic.in/bitstream/123456789/2006/1/A2002-54.pdf",
            "Prevention of Money Laundering Act, 2002 (PMLA)": "https://enforcementdirectorate.gov.in/sites/default/files/Act%26rules/THE%20PREVENTION%20OF%20MONEY%20LAUNDERING%20ACT%2C%202002.pdf"
        },
        "Sales Agreement": {
            "Indian Contract Act, 1872": "https://thc.nic.in/Central%20Governmental%20Acts/Contract%20Act,%201872.pdf",
            "Companies Act, 2013": "https://www.mca.gov.in/Ministry/pdf/CompaniesAct2013.pdf",
            "Securities Contracts (Regulation) Act, 1956": "https://www.sebi.gov.in/acts/contractact.pdf",
            "Information Technology Act, 2000": "https://www.indiacode.nic.in/bitstream/123456789/13116/1/it_act_2000_updated.pdf"
        },
        "Partnership Agreement": {
            "Indian Contract Act, 1872": "https://thc.nic.in/Central%20Governmental%20Acts/Contract%20Act,%201872.pdf",
            "Partnership Act, 1932": "https://www.mca.gov.in/Ministry/actsbills/pdf/Partnership_Act_1932.pdf",
            "Indian Trusts Act, 1882": "https://www.indiacode.nic.in/bitstream/123456789/2327/3/A1882-02.pdf",
        }
    }

# Function to extract text from uploaded files
def extract_text(file):
    if file.type == "application/pdf":
        pdf_reader = PyPDF2.PdfReader(file)
        return "\n".join(page.extract_text() for page in pdf_reader.pages)
    elif file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        doc = docx.Document(file)
        return "\n".join([paragraph.text for paragraph in doc.paragraphs])
    else:
        return file.read().decode("utf-8")

# Function to combine frameworks and user guidelines
def combine_guidelines_and_frameworks(user_guidelines_text, frameworks):
    # Format user-uploaded guidelines
    user_rules = user_guidelines_text.splitlines() if user_guidelines_text else []
    formatted_user_guidelines = "\n".join([f"- {rule.strip()}" for rule in user_rules if rule.strip()])
    
    # Format predefined frameworks
    formatted_frameworks = "\n".join([f"- {key}: {url}" for key, url in frameworks.items()])
    
    # Combine both
    combined_guidelines = f"User Guidelines:\n{formatted_user_guidelines}\n\nFrameworks:\n{formatted_frameworks}"
    return combined_guidelines

# Function to check contract compliance using Gemini
def check_contract_compliance_gemini(contract_text, combined_guidelines):
    try:
        prompt = f"""
        You are tasked with reviewing the following agreement for compliance with legal standards and guidelines.

        Contract:
        {contract_text}

        Guidelines:
        {combined_guidelines}

       Provide:
          You are a Banker tasked with reviewing a agreement for compliance with the  guidelines and frameworks. Carefully analyze the contract against the uploaded guidelines, and provide a detailed assessment for each guideline.
        Keep it domain specific 
        where it is high ,medium and low make it bold.
        Give a table for the introduction containing the following which are taken from the response by checking it thoroughly at the starting of the response 
        1.the name of the document taken,
        2.the name of the guidelines taken or framework taken, 
        3.how many of the compliances are complaint in numerical value
        4.how many of the compliances are not complaint in numerical value
        5.how many of the compliances are partial compliant in numerical value 
        following this give the overview
        
        Mention Overview : [ highlighting the confidence level, limitations, or uncertainties in the beginning and don't make it generic make it facts related to table Highlight clause which is non- complaint ,humanize with good english] at the starting then confidence score : A numerical value (e.g., percentage or probability) indicating the algorithm's confidence in its assessment and ention reason also why confidence score is this much .[in next line by keeping it bold]  and then write here are the detailed findings then provide table
        Provide a detailed analysis for each guideline in a structured tabular format.[always provide 5 columns]
     
        **Output Format:**
                Provide the results in a structured tabular format and with proper alignmnet with the following columns:
                1. **Guideline**: The specific guideline being evaluated.
                2. **Contract Compliance**: Mention Compliant: The contract adheres to the guideline.,Non-Compliant: The contract does not adhere to the guideline.,Partial Compliance: The contract partially adheres to the guideline with specific exceptions.[complaint,Non-complaint and Partial Compliance]
                3. **Contract Reference**: Section/Clause: Specific or Mention section no. or clause no. in the contract that is relevant to the guideline.
                4. **Risk Assessment**:Potential Risks: Description of the potential legal, financial, or operational risks associated with non-compliance.
                                        Example: "Failure to specify governing law can lead to jurisdictional disputes and increased legal uncertainty."
                                        Impact Severity: Assessment of the potential impact of the risk (e.g., low, medium, high).
                                        According to Legal frameworks.
                5. **Recommendations**: Corrective Actions: Specific, actionable suggestions for improving the contract to comply with the guideline.
                                        Example: "Insert a clause specifying that the governing law is [Jurisdiction]."
                                        Alternative Approaches: If applicable, suggest alternative approaches that achieve the same objective while addressing the specific circumstances of the contract.
        At the end of the table, include *paragraphs with page number and clause number with *contract references* explaining specific sections which is not complaint quote verbatim from the contract document. For each reference, add the following details:
            - *Exact Quote*: A direct quote from the provided contract.
            - *Explanation*: How the quote relates to the specific guideline.
            - *Guideline*: The guideline it corresponds to. 
        4. Highlight missing clauses or additional legal frameworks required.
        if any framework is not applicable related to contract user is uploading skip that framework and check with others.
        """
        response = model.generate_content([prompt])
        return response.text
    except Exception as e:
        st.error(f"An error occurred: {e}")
        return None

def app():
    st.title("Contract Compliance Checker")
    st.markdown("Upload agreements and guidelines to check compliance with relevant legal frameworks and user-provided rules.")

    # Contract type selection
    contract_type = st.selectbox("Select the type of contract", list(get_framework_categories().keys()))

    # File uploaders
    uploaded_guidelines = st.file_uploader("Upload Guidelines (Optional)", type=["txt", "pdf", "docx"])
    uploaded_contracts = st.file_uploader("Upload Agreement", type=["pdf", "docx"], accept_multiple_files=True)

    if contract_type and uploaded_contracts:
        # Get predefined frameworks for the selected category
        selected_frameworks = get_framework_categories().get(contract_type, {})

        
        user_guidelines_text = ""
        if uploaded_guidelines:
            user_guidelines_text = extract_text(uploaded_guidelines)

        # Combine uploaded guidelines and frameworks
        combined_guidelines = combine_guidelines_and_frameworks(user_guidelines_text, selected_frameworks)

        # Analyze each uploaded contract
        for i, contract in enumerate(uploaded_contracts):
            contract_text = extract_text(contract)
            st.write(f"**Analyzing Contract {i + 1}: {contract.name}**")

            # Check compliance
            analysis_results = check_contract_compliance_gemini(contract_text, combined_guidelines)
            st.markdown(analysis_results)

if __name__ == "__main__":
    app()
