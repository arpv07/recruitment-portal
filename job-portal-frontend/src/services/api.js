import { v4 as uuidv4 } from 'uuid';

const API_BASE_URL = 'http://localhost:5210/api'; // ASP.NET backend
const PARSER_API_BASE_URL = 'http://localhost:8000'; // FastAPI backend

// --- MOCK DATA ---
const mockCandidates = [
    { id: 1, name: 'Aarav Sharma', role: 'Frontend Developer', experience: 5, ctc: 25, noticePeriod: 30, skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'GraphQL'], email: 'aarav.s@example.com', phone: '+91 98765 43210', location: 'Bengaluru, KA', linkedIn: 'linkedin.com/in/aaravsharma' },
    { id: 2, name: 'Diya Patel', role: 'Backend Developer', experience: 8, ctc: 32, noticePeriod: 60, skills: ['Node.js', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes'], email: 'diya.p@example.com', phone: '+91 98765 43211', location: 'Pune, MH', linkedIn: 'linkedin.com/in/diyapatel' },
    // ... more candidate data
];

const mockParsedResume = {
    name: "Aarav Sharma",
    designation: "Frontend Developer",
    skills: "React, TypeScript, Redux, Next.js, GraphQL, HTML5, CSS3, Webpack"
};

const mockParsedJD = {
    title: "Senior Frontend Developer",
    experience: "5+ years",
    skills: "React, TypeScript, Next.js, Tailwind CSS, REST APIs, CI/CD",
    description: "We are seeking a passionate Senior Frontend Developer to build beautiful and performant user interfaces..."
};

export const initialJobPostings = [
    {
        id: 'JOB001',
        title: 'Senior Frontend Developer',
        department: 'Engineering',
        location: 'Noida, UP',
        status: 'Open',
        postedDate: '2025-09-01',
        applications: 78,
        employmentType: 'Full-time',
        description: 'Lead the development of our next-generation user interfaces using React and Next.js...',
        experience: '5+ years',
        skills: 'React,Next.js,TypeScript,GraphQL,Tailwind CSS',
        salaryMin: '25',
        salaryMax: '35'
    },
    // ... more job posting data
];


// --- API Client ---
export const apiClient = {
    // **UPDATED: Login / Register with real API calls**
    login: async (username, password) => {
        const res = await fetch(`${API_BASE_URL}/Auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        if (!res.ok) {
            // Try to get error message from backend, otherwise use a default
            const errorData = await res.json().catch(() => ({ message: 'Invalid credentials' }));
            throw new Error(errorData.message || 'Invalid credentials');
        }
        return res.json();
    },
    register: async (userData) => {
        const res = await fetch(`${API_BASE_URL}/Auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: 'Registration failed' }));
            throw new Error(errorData.message || 'Registration failed');
        }
        return res.json();
    },

    // Dashboard
    getDashboardData: async (token) => {
        const res = await fetch(`${API_BASE_URL}/Auth/dashboard`, { 
            headers: { Authorization: `Bearer ${token}` } 
        });
        if (!res.ok) throw new Error('Failed to fetch dashboard data.');
        return res.json();
    },

    // Candidates
    getCandidates: async (token, { page = 1, pageSize = 6 } = {}) => {
        try {
            const res = await fetch(`${API_BASE_URL}/candidates?page=${page}&pageSize=${pageSize}`, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            if (!res.ok) throw new Error('Failed to fetch candidates from API.');
            return res.json();
        } catch (err) {
            console.warn(`API call for candidates failed: ${err.message}. Falling back to paginated mock data.`);
            const totalRecords = mockCandidates.length;
            const totalPages = Math.ceil(totalRecords / pageSize);
            const startIndex = (page - 1) * pageSize;
            const paginatedData = mockCandidates.slice(startIndex, startIndex + pageSize);
            return { data: paginatedData, currentPage: page, totalPages: totalPages, totalRecords: totalRecords };
        }
    },
    getAvailableJobs: async (token) => {
        return new Promise(resolve => {
            setTimeout(() => {
                // Filter for open jobs and map 'title' to 'position' to match the component's expectation
                const openJobs = initialJobPostings
                    .filter(job => job.status === 'Open')
                    .map(job => ({ ...job, position: job.title })); // Ensure data shape is correct
                resolve(openJobs);
            }, 500);
        });
    },

    // Recruiter Stats (still mocked as per previous design)
    getRecruiterStats: async (token) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    opportunities: { open: 42, closed: 128 },
                    pipelineStats: { screening: 152, interview: 68, offer: 12 },
                    metrics: { avgTimeToHire: 34, newPostings: 3 },
                    activeJobs: [
                        { name: 'React Developer', applications: 78, priority: 'High' },
                        { name: 'Data Scientist', applications: 56, priority: 'High' },
                        { name: 'Node.js Engineer', applications: 45, priority: 'Medium' },
                        { name: 'QA Lead', applications: 22, priority: 'Low' },
                    ],
                    upcomingInterviews: [
                        { candidate: 'Diya Patel', role: 'Backend Developer', time: 'Tomorrow, 11:00 AM' },
                        { candidate: 'Rohan Mehta', role: 'Data Scientist', time: `Sep ${new Date().getDate() + 2}, 2025, 2:30 PM` }
                    ]
                });
            }, 500);
        });
    },

    // FastAPI Resume / JD Parsing
    parseFile: async (file, isResume = true) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch(`${PARSER_API_BASE_URL}/parse-resume/`, { method: "POST", body: formData });
            if (!res.ok) throw new Error("Failed to parse file from API.");
            const data = await res.json();
            return data.parsed_data;
        } catch (err) {
            console.warn(`API call for parsing failed: ${err.message}. Falling back to mock data.`);
            return isResume ? mockParsedResume : mockParsedJD;
        }
    },

    uploadJD: async (file) => {
        return apiClient.parseFile(file, false);
    },

    // ATS Score Calculation
    calculateAtsScore: (jdData, resumeData) => {
        const jdSkillsStr = Array.isArray(jdData.skills) ? jdData.skills.join(",") : jdData.skills || "";
        const resumeSkillsStr = Array.isArray(resumeData.skills) ? resumeData.skills.join(",") : resumeData.skills || "";
        const jdSkills = new Set(jdSkillsStr.toLowerCase().split(/[\s,]+/).map(s => s.trim()).filter(Boolean));
        const resumeSkills = new Set(resumeSkillsStr.toLowerCase().split(/[\s,]+/).map(s => s.trim()).filter(Boolean));
        if (!jdSkills.size) return 0;
        let matchCount = 0;
        resumeSkills.forEach(skill => { if (jdSkills.has(skill)) { matchCount++; } });
        return Math.min(100, Math.round((matchCount / jdSkills.size) * 100));
    },

    // Job Postings and Candidate Profiles (mocked)
    saveCandidateProfile: async (token, candidateData, jdData) => Promise.resolve({ success: true, message: "Candidate profile and JD saved." }),
};