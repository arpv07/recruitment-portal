import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { DocumentPlusIcon, MagnifyingGlassIcon, UserCircleIcon, UserGroupIcon } from "../../ui/Icons";
import { FaClipboardList } from 'react-icons/fa';
import DashboardLayout from "../DashboardLayout";
import RecruiterStatsView from "./RecruiterStatsView";
import CvManagementView from "./CvManagementView";
import JobPostingView from "./JobPostingView";
import AllJobPostingsView from "./AllJobPostingsView";
import { fetchJobs, postJob } from "../../../store/jobSlice";


const RecruiterDashboard = () => {
    const [activeView, setActiveView] = useState('stats');
    const [editingJob, setEditingJob] = useState(null);
    const dispatch = useDispatch();
    const { postings: jobPostings, status } = useSelector(state => state.jobs);
    const { token } = useSelector(state => state.auth);

    useEffect(() => {
        if(status === 'idle') {
            dispatch(fetchJobs());
        }
    }, [status, dispatch]);

    const navItems = [
        { key: 'stats', label: 'Dashboard', icon: UserGroupIcon },
        { key: 'allJobs', label: 'Job Postings', icon: FaClipboardList },
        { key: 'jobPosting', label: 'New Job Posting', icon: DocumentPlusIcon },
        { key: 'cvLookup', label: 'CV Management', icon: MagnifyingGlassIcon },
        { key: 'employeeLookup', label: 'Employee Lookup', icon: UserCircleIcon },
    ];

    const handlePostJob = (newJobData) => {
        dispatch(postJob(newJobData));
        toast.success("Job posted successfully!");
        setActiveView('allJobs');
    };

    const handleUpdateJob = (updatedJobData) => {
        console.log("Update job functionality needs to be implemented in Redux");
        toast.success("Job updated successfully!");
        setEditingJob(null);
        setActiveView('allJobs');
    };

    const handleEditJob = (jobToEdit) => {
        setEditingJob(jobToEdit);
        setActiveView('jobPosting');
    };

    const views = {
        stats: { component: <RecruiterStatsView token={token} /> },
        allJobs: { component: <AllJobPostingsView jobs={jobPostings} setActiveView={setActiveView} onEdit={handleEditJob} /> },
        jobPosting: { component: <JobPostingView onPost={handlePostJob} onUpdate={handleUpdateJob} initialData={editingJob} /> },
        cvLookup: { component: <CvManagementView token={token} /> },
        employeeLookup: { component: <div className="text-center p-10 bg-white rounded-xl shadow-lg">Employee Lookup (Dummy Page)</div> },
    };

    return (
        <DashboardLayout navItems={navItems} activeView={activeView} setActiveView={setActiveView}>
            {activeView !== 'jobPosting' && editingJob && setEditingJob(null)}
            {views[activeView]?.component || <div>View not found.</div>}
        </DashboardLayout>
    );
};

export default RecruiterDashboard;