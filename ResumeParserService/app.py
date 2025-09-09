from fastapi import FastAPI, UploadFile, File
import fitz  # PyMuPDF
import docx
from parser import parse_resume

app = FastAPI()

def extract_text_from_pdf(file_path):
    text = ""
    with fitz.open(file_path) as doc:
        for page in doc:
            text += page.get_text()
    return text

def extract_text_from_docx(file_path):
    doc = docx.Document(file_path)
    return "\n".join([para.text for para in doc.paragraphs])

@app.post("/parse-resume/")
async def parse_resume_file(file: UploadFile = File(...)):
    file_path = f"temp_{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())

    if file.filename.endswith(".pdf"):
        text = extract_text_from_pdf(file_path)
    elif file.filename.endswith(".docx"):
        text = extract_text_from_docx(file_path)
    else:
        return {"status": "error", "message": "Unsupported file format"}

    parsed_data = parse_resume(text)
    return {"status": "success", "parsed_data": parsed_data}
