import re
import spacy
from datetime import datetime
from collections import defaultdict

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# --------------------------
# Regex patterns
# --------------------------
EMAIL_REGEX = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
PHONE_REGEX = re.compile(r'(\+?\d{1,3}[\s\-\.]?\(?\d{2,4}\)?[\s\-\.]?\d{3,5}[\s\-\.]?\d{3,5})')
DATE_REGEX = re.compile(r"(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\.?\s?\d{4}|\d{4}|Present|Current", re.I)

# Common skills dictionary
SKILL_KEYWORDS = {
    "python", "c#", "java", "javascript", "typescript", "sql", "mysql",
    "mongodb", "aws", "docker", "kubernetes", "react", "angular", "vue",
    "html", "css", "flask", "django", "dotnet", ".net", "asp.net", "redis",
    "pytorch", "tensorflow", "keras", "scikit-learn", "git", "node.js"
}

# Education keywords
EDU_KEYWORDS = [
    "bachelor", "master", "bsc", "msc", "mca", "bca", "phd",
    "diploma", "high school", "intermediate", "university", "college"
]

EXPERIENCE_KEYWORDS = ["intern", "developer", "engineer", "software", "analyst", "associate", "manager"]

# --------------------------
# Helper Functions
# --------------------------
def extract_name(text):
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    # 1. Header heuristic: first line, all caps or title case
    for line in lines[:5]:
        if 2 <= len(line.split()) <= 4 and line[0].isalpha():
            if line.isupper() or line.istitle():
                return line.title()
    # 2. spaCy NER
    doc = nlp(" ".join(lines[:10]))
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            return ent.text
    return None

def extract_emails(text):
    return list(set(EMAIL_REGEX.findall(text)))

def extract_phones(text):
    return list(set(PHONE_REGEX.findall(text)))

def extract_skills(text):
    text_lower = text.lower()
    skills = [skill for skill in SKILL_KEYWORDS if skill in text_lower]
    return list(set(skills))

def extract_education(text):
    # Extract text after "Education"
    match = re.search(r"Education", text, re.I)
    if not match:
        return []
    edu_text = text[match.end():]
    # Stop at next section
    edu_text = re.split(r"(Experience|Skills|Projects|Certifications|INTERNSHIP)", edu_text, re.I)[0]

    lines = [l.strip() for l in edu_text.split("\n") if l.strip()]
    entries, buffer = [], ""

    # Helper function to process one education entry
    def process(line):
        # Extract year (with optional month or range)
        year_match = re.search(r"((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\.?\s?\d{4}(\s?–\s?(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\.?\s?\d{4})?)", line, re.I)
        year = year_match.group().strip() if year_match else None

        # Find degree keyword
        deg_keyword = next((deg for deg in EDU_KEYWORDS if deg.lower() in line.lower()), None)
        if not deg_keyword:
            return None
        deg_match = re.search(deg_keyword, line, re.I)

        # Degree: from degree keyword to next comma or end
        degree = line[deg_match.start():].split(",")[0].strip()
        # Institution: remove degree and year from line
        inst = line.replace(degree, "").replace(year if year else "", "").strip(" ,")
        return {"degree": degree, "institution": inst, "year": year}

    for line in lines:
        if any(deg.lower() in line.lower() for deg in EDU_KEYWORDS):
            if buffer:
                e = process(buffer)
                if e: entries.append(e)
                buffer = line
            else:
                buffer = line
        else:
            buffer += " " + line

    if buffer:
        e = process(buffer)
        if e: entries.append(e)

    return entries

def extract_experience(text):
    experiences = []
    # Look for text after "Experience" or "Internship Experience"
    match = re.search(r"(Experience|Internship Experience)", text, re.I)
    if match:
        exp_text = text[match.end():]
    else:
        exp_text = text

    lines = [l.strip() for l in exp_text.split("\n") if l.strip()]
    current_exp = None

    for line in lines:
        # Check if this line is a new experience entry (has keyword and/or date)
        if any(kw in line.lower() for kw in EXPERIENCE_KEYWORDS) or DATE_REGEX.search(line):
            # Save previous experience
            if current_exp:
                experiences.append(current_exp)
            # Start new experience entry
            duration_match = DATE_REGEX.search(line)
            current_exp = {
                "company_role": line,  # initial line might include company + role
                "duration": duration_match.group() if duration_match else None,
                "description": []
            }
        else:
            # Append bullet points or description lines
            if current_exp:
                current_exp["description"].append(line)

    # Append last experience
    if current_exp:
        experiences.append(current_exp)

    # Join description lines into a single string
    for exp in experiences:
        exp["description"] = "\n".join(exp["description"]).strip()

    return experiences

def calculate_total_experience(experiences):
    total_months = 0
    for exp in experiences:
        if exp["duration"]:
            try:
                start = exp["duration"][0]
                end = exp["duration"][-1]

                if start.lower() == "present" or end.lower() == "present":
                    end_date = datetime.today()
                else:
                    end_date = datetime.strptime(end, "%b %Y")

                start_date = datetime.strptime(start, "%b %Y")
                diff = (end_date.year - start_date.year) * 12 + (end_date.month - start_date.month)
                total_months += max(0, diff)
            except Exception:
                continue
    return round(total_months / 12, 1)

# --------------------------
# Main function
# --------------------------
def parse_resume(text):
    return {
        "name": extract_name(text),
        "emails": extract_emails(text),
        "phones": extract_phones(text),
        "skills": extract_skills(text),
        "education": extract_education(text),
        "experience": extract_experience(text),
        "total_experience_years_estimate": calculate_total_experience(extract_experience(text))
    }
