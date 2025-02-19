from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import PyPDF2
import docx
import io
import google.generativeai as genai

# Configure the Generative AI model
genai.configure(api_key="AIzaSyCynKXJaxbF60nm-ZPVd7RhhqAiByzXhLI")
model = genai.GenerativeModel("gemini-1.5-flash")

app = FastAPI()

# Allow frontend to call the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Contract Compliance Checker!"}

# Function to extract text from uploaded files
def extract_text(file: UploadFile):
    file_data = file.file.read()
    if file.content_type == "application/pdf":
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_data))
        return "\n".join(page.extract_text() for page in pdf_reader.pages)
    elif file.content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        doc = docx.Document(io.BytesIO(file_data))
        return "\n".join([paragraph.text for paragraph in doc.paragraphs])
    else:
        return file_data.decode("utf-8")

# Function to get framework categories
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
    

# Function to combine guidelines and frameworks
def combine_guidelines_and_frameworks(user_guidelines_text, frameworks):
    formatted_user_guidelines = "\n".join([f"- {line.strip()}" for line in user_guidelines_text.splitlines() if line.strip()])
    formatted_frameworks = "\n".join([f"- {key}: {url}" for key, url in frameworks.items()])
    return f"User Guidelines:\n{formatted_user_guidelines}\n\nFrameworks:\n{formatted_frameworks}"

# Endpoint for analyzing contracts
@app.post("/analyze")
async def analyze(contractType: str = Form(...), contracts: List[UploadFile] = File(...), guidelines: UploadFile = File(None)):
    print(f"contractType: {contractType}")
    print(f"contracts: {[contract.filename for contract in contracts]}")
    print(f"guidelines: {guidelines.filename if guidelines else 'None'}")
    try:
        frameworks = get_framework_categories().get(contractType, {})
        user_guidelines_text = extract_text(guidelines) if guidelines else ""
        combined_guidelines = combine_guidelines_and_frameworks(user_guidelines_text, frameworks)
        results = []

        for contract in contracts:
            contract_text = extract_text(contract)
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
            results.append({"fileName": contract.filename, "analysis": response.text})

        return JSONResponse({"status": "success", "results": results})
    except Exception as e:
        return JSONResponse({"status": "error", "message": str(e)}, status_code=500)
    return {"analysis": "Analysis complete!"}

# Chat endpoint
@app.post("/chat")
async def chat(message: str):
    try:
        response = model.generate_content([message])
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Summary endpoint
@app.post("/generate-summary")
async def generate_summary(text: str = Form(...), mode: str = Form(...)):
    try:
        # Define summary prompt based on mode
        if mode == "3-bullet":
            prompt = f"Summarize the following text in exactly three bullet points:\n{text}"
        elif mode == "5-bullet":
            prompt = f"Summarize the following text in exactly five bullet points:\n{text}"
        else:  # Default to paragraph mode
            prompt = f"Summarize the following text in a well-structured paragraph:\n{text}"

        # Generate summary using the AI model
        response = model.generate_content([prompt])

        return {"summary": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Upload PDF endpoint
@app.post("/upload_pdf")
async def upload_pdf(file: UploadFile = File(...)):

    # Check file size (example: max size 5MB)
    max_size = 50 * 1024 * 1024  # 5 MB in bytes
    if file.size > max_size:
        return JSONResponse(content={"error": "File is too large"}, status_code=400)
    
    # Process the file
    content = await file.read()

    print(f"Received file: {file.filename}")
    print(f"Received file type: {file.content_type}")
    try:
        print(f"Received file: {file.filename}")
        extracted_text = extract_text(file)
        return {"filename": file.filename, "content": extracted_text}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
