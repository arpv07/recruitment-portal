# jobportal/routers/parser.py

from fastapi import APIRouter, UploadFile, File, HTTPException
import io
import logging
import re
from datetime import datetime
from collections import defaultdict
import asyncio

import docx
import spacy

# ✅ Import real PyMuPDF safely
try:
    import fitz  # PyMuPDF
except ImportError:
    raise ImportError("PyMuPDF (fitz) is not installed. Run `pip install PyMuPDF`.")

router = APIRouter()
logger = logging.getLogger(__name__)

# --------------------------
# Load spaCy model
# --------------------------
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    logger.warning("spaCy model 'en_core_web_sm' not found. Downloading...")
    from spacy.cli import download
    download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

# --------------------------
# Regex patterns
# --------------------------
EMAIL_REGEX = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
PHONE_REGEX = re.compile(r'(\+?\d{1,3}[\s\-\.]?\(?\d{2,4}\)?[\s\-\.]?\d{3,5}[\s\-\.]?\d{3,5})')
DATE_REGEX = re.compile(r"(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\.?\s?\d{4}|\d{4}|Present|Current", re.I)

# --------------------------
# Keyword lists
# --------------------------
SKILL_KEYWORDS = {
    "python", "c#", "java", "javascript", "typescript", "sql", "mysql",
    "mongodb", "aws", "docker", "kubernetes", "react", "angular", "vue",
    "html", "css", "flask", "django", "dotnet", ".net", "asp.net", "redis",
    "pytorch", "tensorflow", "keras", "scikit-learn", "git", "node.js"
}

EDU_KEYWORDS = [
    "bachelor", "master", "bsc", "msc", "mca", "bca", "phd",
    "diploma", "high school", "intermediate", "university", "college"
]

EXPERIENCE_KEYWORDS = ["intern", "developer", "engineer", "software", "analyst", "associate", "manager"]

# --------------------------
# Text Extraction Functions
# --------------------------
def extract_text_from_pdf(file_stream: bytes):
    """Extract text from a PDF file given as bytes."""
    text = ""
    try:
        with fitz.open(stream=file_stream, filetype="pdf") as doc:
            for page in doc:
                text += page.get_text()
    except Exception as e:
        logger.error(f"Error reading PDF: {e}")
        raise HTTPException(status_code=400, detail="Error parsing PDF file.")
    return text

def extract_text_from_docx(file_stream: bytes):
    """Extract text from DOCX file given as bytes."""
    try:
        doc = docx.Document(io.BytesIO(file_stream))
        return "\n".join([para.text for para in doc.paragraphs])
    except Exception as e:
        logger.error(f"Error reading DOCX: {e}")
        raise HTTPException(status_code=400, detail="Error parsing DOCX file.")

# --------------------------
# Parsing Logic
# --------------------------
def extract_name(text: str):
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    for line in lines[:5]:  # check top lines first
        if 2 <= len(line.split()) <= 4 and line[0].isalpha():
            if line.isupper() or line.istitle():
                return line.title()
    doc = nlp(" ".join(lines[:10]))
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            return ent.text
    return None

def extract_emails(text): return list(set(EMAIL_REGEX.findall(text)))
def extract_phones(text): return list(set(PHONE_REGEX.findall(text)))

def extract_skills(text):
    text_lower = text.lower()
    return list({skill for skill in SKILL_KEYWORDS if skill in text_lower})

def extract_education(text):
    entries = []
    for line in text.split('\n'):
        if any(kw in line.lower() for kw in EDU_KEYWORDS):
            entries.append({"degree": line.strip()})
    return entries

def extract_experience(text):
    experiences = []
    for line in text.split('\n'):
        if any(kw in line.lower() for kw in EXPERIENCE_KEYWORDS):
            experiences.append({"company_role": line.strip()})
    return experiences

def parse_resume_text(text):
    return {
        "name": extract_name(text),
        "emails": extract_emails(text),
        "phones": extract_phones(text),
        "skills": extract_skills(text),
        "education": extract_education(text),
        "experience": extract_experience(text),
    }

# --------------------------
# API Endpoint
# --------------------------
@router.post("/parse-jd/")
async def parse_jd_file(file: UploadFile = File(...)):
    """
    Parses a job description and extracts title, required experience, and skills.
    """
    logger.info(f"Received JD file: {file.filename}")
    try:
        file_content = await file.read()

        if file.filename.lower().endswith(".pdf"):
            text = extract_text_from_pdf(file_content)
        elif file.filename.lower().endswith(".docx"):
            text = extract_text_from_docx(file_content)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Upload .pdf or .docx")

        if not text.strip():
            raise HTTPException(status_code=400, detail="No content found in JD.")

        skills = extract_skills(text)
        # very basic title/experience guess
        title = text.splitlines()[0][:80] if text.splitlines() else "Unknown Title"
        experience = "N/A"
        for line in text.splitlines():
            if "year" in line.lower():
                experience = line.strip()
                break

        return {
            "status": "success",
            "parsed_data": {
                "title": title,
                "experience": experience,
                "skills": ", ".join(skills)
            }
        }
    except Exception as e:
        logger.exception(f"JD parsing failed: {e}")
        raise HTTPException(status_code=500, detail=f"JD parsing failed: {str(e)}")


# --- Resume Parsing (updated) ---
@router.post("/parse-resume/")
async def parse_resume_file(file: UploadFile = File(...)):
    """
    Parses the content of an uploaded resume (PDF or DOCX) and returns normalized fields.
    """
    logger.info(f"Received resume: {file.filename}")
    try:
        file_content = await file.read()

        if file.filename.lower().endswith(".pdf"):
            text = extract_text_from_pdf(file_content)
        elif file.filename.lower().endswith(".docx"):
            text = extract_text_from_docx(file_content)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Upload .pdf or .docx")

        if not text.strip():
            raise HTTPException(status_code=400, detail="No text extracted from resume.")

        parsed_data = await asyncio.to_thread(parse_resume_text, text)

        # Normalize to frontend-friendly structure
        return {
            "status": "success",
            "parsed_data": {
                "name": parsed_data.get("name", "Unknown Candidate"),
                "designation": (parsed_data.get("experience", [{}])[0].get("company_role")
                                if parsed_data.get("experience") else "Unknown Role"),
                "skills": ", ".join(parsed_data.get("skills", []))
            }
        }
    except Exception as e:
        logger.exception(f"Error while parsing resume: {e}")
        raise HTTPException(status_code=500, detail=f"Resume parsing failed: {str(e)}")