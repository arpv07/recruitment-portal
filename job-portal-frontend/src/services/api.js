import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const getToken = () => localStorage.getItem("token");

export const apiClient = {
  // --- Authentication ---
  login: async (username, password) => {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);

  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: "Invalid credentials" }));
    throw new Error(errorData.detail || "Invalid credentials");
  }

  const data = await res.json();

  const token = data.access_token || null;  // <-- use access_token
  const user = {
    fullName: username, // or fetch user details from backend if available
  };

  if (token) localStorage.setItem("token", token);
  if (user) localStorage.setItem("user", JSON.stringify(user));

  return { token, user };
},

register: async (userData) => {
  const payload = {
    username: userData.username,
    full_name: userData.fullName,
    email: userData.email,
    password: userData.password,
    phone: userData.phone || "",
    location: userData.location || "",
    linkedin_url: userData.linkedInUrl || ""
  };

  const res = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: "Registration failed" }));
    throw new Error(errorData.detail || "Registration failed");
  }
  return res.json();
},


  // --- Dashboard ---
  getRecruiterStats: async () => {
    const res = await fetch(`${API_BASE_URL}/dashboard`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Failed to fetch dashboard data.");
    return res.json();
  },

  // --- Jobs ---
  getAvailableJobs: async () => {
    const res = await fetch(`${API_BASE_URL}/jobs/`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (!res.ok) throw new Error("Failed to fetch jobs.");
    const jobs = await res.json();

    return jobs.map((job) => ({
      id: job._id,
      title: job.title,
      department: job.company || "N/A",
      location: job.location || "N/A",
      postedDate: job.posted_date
        ? new Date(job.posted_date).toLocaleDateString()
        : "N/A",
      status: "Open",
      applications: 0,
    }));
  },

  postJob: async (jobData) => {
    const payload = {
      title: jobData.title,
      description: jobData.description,
      company: jobData.department || "Unknown Company",
      location: jobData.location,
      experience: jobData.experience,
      skills: (jobData.skills || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      salary_min: jobData.salaryMin,
      salary_max: jobData.salaryMax,
    };

    const res = await fetch(`${API_BASE_URL}/jobs/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: "Failed to post job." }));
      throw new Error(errorData.detail || "Failed to post job.");
    }

    const job = await res.json();
    return {
      id: job._id,
      title: job.title,
      department: job.company || "N/A",
      location: job.location || "N/A",
      postedDate: job.posted_date
        ? new Date(job.posted_date).toLocaleDateString()
        : "N/A",
      status: "Open",
      applications: 0,
    };
  },

  updateJob: async (jobId, jobData) => {
    const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(jobData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: "Failed to update job." }));
      throw new Error(errorData.detail || "Failed to update job.");
    }

    const job = await res.json();
    return {
      id: job._id,
      title: job.title,
      department: job.company || "N/A",
      location: job.location || "N/A",
      postedDate: job.posted_date
        ? new Date(job.posted_date).toLocaleDateString()
        : "N/A",
      status: "Open",
      applications: 0,
    };
  },

 uploadJD: async (jdFile) => {
  const formData = new FormData();
  formData.append("file", jdFile);

  const response = await fetch(`${API_BASE_URL}/parse-jd/`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Failed to parse JD");
  }
  const data = await response.json();
  return data.parsed_data;
},

parseFile: async (resumeFile) => {
  const formData = new FormData();
  formData.append("file", resumeFile);

  const response = await fetch(`${API_BASE_URL}/parse-resume/`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Failed to parse resume");
  }
  const data = await response.json();
  return data.parsed_data;
},


  // --- ATS Score Calculation ---
  calculateAtsScore: (jdData, resumeData) => {
    if (!jdData || !resumeData) return 0;
    const jdSkillsStr = Array.isArray(jdData.skills)
      ? jdData.skills.join(",")
      : jdData.skills || "";
    const resumeSkillsStr = Array.isArray(resumeData.skills)
      ? resumeData.skills.join(",")
      : resumeData.skills || "";

    const jdSkills = new Set(
      jdSkillsStr.toLowerCase().split(/[\s,]+/).map((s) => s.trim()).filter(Boolean)
    );
    const resumeSkills = new Set(
      resumeSkillsStr.toLowerCase().split(/[\s,]+/).map((s) => s.trim()).filter(Boolean)
    );

    if (jdSkills.size === 0) return 0;

    let matchCount = 0;
    resumeSkills.forEach((skill) => {
      if (jdSkills.has(skill)) matchCount++;
    });

    return Math.min(100, Math.round((matchCount / jdSkills.size) * 100));
  },
};
