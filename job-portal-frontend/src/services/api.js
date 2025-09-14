import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

// The single base URL for your consolidated Python backend
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Helper to get the token from localStorage
const getToken = () => localStorage.getItem('token');

// --- API Client ---
export const apiClient = {
  // --- Authentication ---
  login: async (username, password) => {
    // FastAPI's default OAuth2 flow expects form data, not JSON.
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'Invalid credentials' }));
      throw new Error(errorData.detail || 'Invalid credentials');
    }
    const data = await res.json();
    
    // Store token and user data upon successful login
    if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        // We format the user object to be consistent within the app
        const formattedUser = {
            fullName: data.user.FullName,
            email: data.user.Email,
            phone: data.user.Phone,
            linkedInUrl: data.user.LinkedInUrl,
            location: data.user.Location,
            createdAt: data.user.CreatedAt,
        };
        localStorage.setItem('user', JSON.stringify(formattedUser));
    }
    return data;
  },

  register: async (userData) => {
    // Align frontend camelCase with backend snake_case
    const payload = {
        username: userData.username,
        full_name: userData.fullName,
        email: userData.email,
        password: userData.password,
    };

    const res = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'Registration failed' }));
      throw new Error(errorData.detail || 'Registration failed');
    }
    return res.json();
  },

  // --- Dashboard ---
  getDashboardData: async () => {
    const res = await fetch(`${API_BASE_URL}/dashboard`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard data.');
    return res.json();
  },

  // --- Jobs ---
  getAvailableJobs: async () => {
    const res = await fetch(`${API_BASE_URL}/jobs/`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error('Failed to fetch jobs.');
    const jobs = await res.json();
    // Map data to match component expectations
    return jobs.map(job => ({ ...job, position: job.title, id: job._id }));
  },

  postJob: async (jobData) => {
    const res = await fetch(`${API_BASE_URL}/jobs/`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}` 
        },
        body: JSON.stringify(jobData),
    });
    if (!res.ok) throw new Error('Failed to post job.');
    return res.json();
  },
  
  // --- File Parsing ---
  parseFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await fetch(`${API_BASE_URL}/parse-resume/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: 'Failed to parse file.' }));
        throw new Error(errorData.detail || 'Failed to parse file.');
    }
    const data = await res.json();
    return data.parsed_data;
  },

  // --- ATS Score Calculation ---
  calculateAtsScore: (jdData, resumeData) => {
    if (!jdData || !resumeData) return 0;
    const jdSkillsStr = Array.isArray(jdData.skills) ? jdData.skills.join(',') : jdData.skills || '';
    const resumeSkillsStr = Array.isArray(resumeData.skills) ? resumeData.skills.join(',') : resumeData.skills || '';
    
    const jdSkills = new Set(jdSkillsStr.toLowerCase().split(/[\s,]+/).map(s => s.trim()).filter(Boolean));
    const resumeSkills = new Set(resumeSkillsStr.toLowerCase().split(/[\s,]+/).map(s => s.trim()).filter(Boolean));
    
    if (jdSkills.size === 0) return 0;
    
    let matchCount = 0;
    resumeSkills.forEach(skill => {
      if (jdSkills.has(skill)) {
        matchCount++;
      }
    });
    
    return Math.min(100, Math.round((matchCount / jdSkills.size) * 100));
  },
};