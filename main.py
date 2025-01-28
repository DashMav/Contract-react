from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from typing import List
import PyPDF2
import docx
import google.generativeai as genai

# Configure the Generative AI model
genai.configure(api_key="Api_key")
model = genai.GenerativeModel("gemini-1.5-flash")

app = FastAPI()

# Function to extract text from uploaded files
def extract_text(file: UploadFile):
    file_data = file.file.read()
    if file.content_type == "application/pdf":
        pdf_reader = PyPDF2.PdfReader(file_data)
        return "\n".join(page.extract_text() for page in pdf_reader.pages)
    elif file.content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        doc = docx.Document(file_data)
        return "\n".join([paragraph.text for paragraph in doc.paragraphs])
    else:
        return file_data.decode("utf-8")

# Function to combine guidelines and frameworks
def combine_guidelines_and_frameworks(user_guidelines_text, frameworks):
    user_rules = user_guidelines_text.splitlines() if user_guidelines_text else []
    formatted_user_guidelines = "\n".join([f"- {rule.strip()}" for rule in user_rules if rule.strip()])
    formatted_frameworks = "\n".join([f"- {key}: {url}" for key, url in frameworks.items()])
    return f"User Guidelines:\n{formatted_user_guidelines}\n\nFrameworks:\n{formatted_frameworks}"

# Dummy function for framework categories
def get_framework_categories():
    return {
        "Loan Agreement": {
            "Indian Contract Act, 1872": "https://thc.nic.in/Central%20Governmental%20Acts/Contract%20Act,%201872.pdf",
            "Banking Regulation Act, 1949": "https://www.nabard.org/auth/writereaddata/tender/1409164208India_Banking_BankingRegulationAct1949.pdf",
        },
        "Sales Agreement": {
            "Indian Contract Act, 1872": "https://thc.nic.in/Central%20Governmental%20Acts/Contract%20Act,%201872.pdf",
            "Companies Act, 2013": "https://www.mca.gov.in/Ministry/pdf/CompaniesAct2013.pdf",
        },
    }

# Endpoint for analyzing contracts
@app.post("/analyze")
async def analyze(
    contractType: str = Form(...),
    contracts: List[UploadFile] = File(...),
    guidelines: UploadFile = File(None),
):
    try:
        # Get predefined frameworks
        frameworks = get_framework_categories().get(contractType, {})
        user_guidelines_text = ""

        # Extract text from guidelines file
        if guidelines:
            user_guidelines_text = extract_text(guidelines)

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

            [Perform analysis as described in the prompt...]
            """
            response = model.generate_content([prompt])
            results.append({"fileName": contract.filename, "analysis": response.text})

        return JSONResponse({"status": "success", "results": results})
    except Exception as e:
        return JSONResponse({"status": "error", "message": str(e)}, status_code=500)
