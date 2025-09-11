import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { DocumentPlusIcon, MagnifyingGlassIcon, UserCircleIcon, UserGroupIcon } from "../../ui/Icons";
import { FaClipboardList } from 'react-icons/fa';
import DashboardLayout from "../DashboardLayout";
import RecruiterStatsView from "./RecruiterStatsView";
import CvManagementView from "./CvManagementView";
import JobPostingView from "./JobPostingView";
import AllJobPostingsView from "./AllJobPostingsView";

// Moved mock data here to be used as initial state
const initialJobPostings = [
    { id: 'JOB001', title: 'Senior Frontend Developer', department: 'Engineering', location: 'Noida, UP', status: 'Open', postedDate: '2025-09-01', applications: 78, employmentType: 'Full-time', description: 'Lead the development of our next-generation user interfaces.', experience: '5+ years', skills: 'React,Next.js,TypeScript', salaryMin: '25', salaryMax: '35' },
    { id: 'JOB002', title: 'Backend Developer', department: 'Engineering', location: 'Pune, MH', status: 'Open', postedDate: '2025-08-25', applications: 45, employmentType: 'Full-time', description: 'Build and maintain scalable server-side applications.', experience: '3+ years', skills: 'Node.js,PostgreSQL,AWS', salaryMin: '20', salaryMax: '30' },
    { id: 'JOB003', title: 'Data Scientist', department: 'Analytics', location: 'Hyderabad, TS', status: 'Open', postedDate: '2025-08-22', applications: 56, employmentType: 'Full-time', description: 'Analyze large datasets to extract meaningful insights.', experience: '4+ years', skills: 'Python,TensorFlow,SQL', salaryMin: '22', salaryMax: '32' },
    { id: 'JOB004', title: 'UI/UX Designer', department: 'Product', location: 'Bengaluru, KA', status: 'Closed', postedDate: '2025-07-15', applications: 124, employmentType: 'Contract', description: 'Design intuitive and beautiful user experiences.', experience: '2+ years', skills: 'Figma,Adobe XD,Sketch', salaryMin: '15', salaryMax: '25' },
];

const RecruiterDashboard = ({ auth, onLogout, addToast }) => {
    const [activeView, setActiveView] = useState('stats');
    const [jobPostings, setJobPostings] = useState(initialJobPostings);
    const [editingJob, setEditingJob] = useState(null);

    const navItems = [
        { key: 'stats', label: 'Dashboard', icon: UserGroupIcon },
        { key: 'allJobs', label: 'Job Postings', icon: FaClipboardList },
        { key: 'jobPosting', label: 'New Job Posting', icon: DocumentPlusIcon },
        { key: 'cvLookup', label: 'CV Management', icon: MagnifyingGlassIcon },
        { key: 'employeeLookup', label: 'Employee Lookup', icon: UserCircleIcon },
    ];

    // Handler to add a new job
    const handlePostJob = (newJobData) => {
        const newJob = {
            ...newJobData,
            id: uuidv4(),
            postedDate: new Date().toISOString().split('T')[0],
            status: 'Open',
            applications: 0,
        };
        setJobPostings(prevJobs => [newJob, ...prevJobs]);
        addToast({ message: "Job posted successfully!", type: "success" });
        setActiveView('allJobs');
    };

    // Handler to update an existing job
    const handleUpdateJob = (updatedJobData) => {
        setJobPostings(prevJobs =>
            prevJobs.map(job => job.id === updatedJobData.id ? updatedJobData : job)
        );
        addToast({ message: "Job updated successfully!", type: "success" });
        setEditingJob(null);
        setActiveView('allJobs');
    };

    // Handler to initiate editing
    const handleEditJob = (jobToEdit) => {
        setEditingJob(jobToEdit);
        setActiveView('jobPosting');
    };

    const views = {
        stats: { component: <RecruiterStatsView token={auth.token} /> },
        allJobs: { component: <AllJobPostingsView jobs={jobPostings} setActiveView={setActiveView} onEdit={handleEditJob} /> },
        jobPosting: { component: <JobPostingView onPost={handlePostJob} onUpdate={handleUpdateJob} initialData={editingJob} addToast={addToast} /> },
        cvLookup: { component: <CvManagementView token={auth.token} addToast={addToast} /> },
        employeeLookup: { component: <div className="text-center p-10 bg-white rounded-xl shadow-lg">Employee Lookup (Dummy Page)</div> },
    };

    return (
        <DashboardLayout user={auth.user} onLogout={onLogout} navItems={navItems} activeView={activeView} setActiveView={setActiveView}>
            {/* Clear editing state when navigating away from the form */}
            {activeView !== 'jobPosting' && editingJob && setEditingJob(null)}
            {views[activeView]?.component || <div>View not found.</div>}
        </DashboardLayout>
    );
};

export default RecruiterDashboard;