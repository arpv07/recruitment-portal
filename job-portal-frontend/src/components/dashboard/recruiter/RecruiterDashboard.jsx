import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { DocumentPlusIcon, MagnifyingGlassIcon, UserCircleIcon, UserGroupIcon } from "../../ui/Icons";
import { FaClipboardList } from 'react-icons/fa';
import { AnimatePresence, motion } from "framer-motion"; // ✅ Import Framer Motion
import DashboardLayout from "../DashboardLayout";
import RecruiterStatsView from "./RecruiterStatsView";
import CvManagementView from "./CvManagementView";
import JobPostingView from "./JobPostingView";
import AllJobPostingsView from "./AllJobPostingsView";
import EmployeeLookupView from "./EmployeeLookupView"; 
import { fetchJobs, postJob, updateJob } from "../../../store/jobSlice";

const RecruiterDashboard = () => {
    const [activeView, setActiveView] = useState('stats');
    const [editingJob, setEditingJob] = useState(null);
    const dispatch = useDispatch();
    const { postings: jobPostings, status } = useSelector(state => state.jobs);
    const { token } = useSelector(state => state.auth);

    useEffect(() => {
        if (status === 'idle') {
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

    const handlePostJob = async (newJobData) => {
        try {
            await dispatch(postJob(newJobData)).unwrap();
            toast.success("Job posted successfully!");
            dispatch(fetchJobs());
            setActiveView('allJobs');
        } catch (error) {
            toast.error("Failed to post job.");
        }
    };

    const handleUpdateJob = async (updatedJobData) => {
        try {
            await dispatch(updateJob({ 
                jobId: updatedJobData.id || updatedJobData._id,
                jobData: updatedJobData 
            })).unwrap();
            toast.success("Job updated successfully!");
            setEditingJob(null);
            dispatch(fetchJobs());
            setActiveView('allJobs');
        } catch (err) {
            toast.error("Failed to update job.");
        }
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
        employeeLookup: { component: <EmployeeLookupView /> },
    };

    const pageVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
    };

    return (
        <DashboardLayout navItems={navItems} activeView={activeView} setActiveView={setActiveView}>
            {activeView !== 'jobPosting' && editingJob && setEditingJob(null)}
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeView} // ✅ Key ensures new animation for each view
                    variants={pageVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="w-full"
                >
                    {views[activeView]?.component || <div>View not found.</div>}
                </motion.div>
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default RecruiterDashboard;
