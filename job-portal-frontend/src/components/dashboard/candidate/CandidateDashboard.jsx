import { useState } from "react";
import { BriefcaseIcon, DocumentPlusIcon, MagnifyingGlassIcon } from "../../ui/Icons";
import DashboardLayout from "../DashboardLayout";
import ApplyJobView from "./ApplyJobView";
import CandidateJobsView from "./CandidateJobsView";
import CandidateOnboarding from "./CandidateOnboarding";

const CandidateDashboard = ({ auth, onLogout, addToast }) => {
    // --- All hooks are now at the top level ---
    const [profileComplete, setProfileComplete] = useState(auth.user.profileComplete || false);
    const [activeView, setActiveView] = useState('jobs');
    const [selectedJob, setSelectedJob] = useState(null);

    // The conditional return can now safely happen after all hooks have been called
    if (!profileComplete) {
        return <CandidateOnboarding onComplete={() => setProfileComplete(true)} addToast={addToast} />;
    }

    const handleApply = (job) => { 
        setSelectedJob(job); 
        setActiveView('apply'); 
    };
    
    const navItems = [
        { key: 'jobs', label: 'Available Jobs', icon: MagnifyingGlassIcon },
        { key: 'apply', label: 'Apply for Job', icon: DocumentPlusIcon, requiresJob: true },
        { key: 'applications', label: 'My Applications', icon: BriefcaseIcon },
    ].filter(item => !item.requiresJob || (item.requiresJob && selectedJob));

    const views = {
        jobs: { component: <CandidateJobsView token={auth.token} onApply={handleApply} /> },
        apply: { component: <ApplyJobView token={auth.token} job={selectedJob} /> },
        applications: { component: <div>My Applications List</div> },
    };

    let activeLabel = (activeView === 'apply' && selectedJob) 
        ? `Apply: ${selectedJob.position}` 
        : navItems.find(item => item.key === activeView)?.label || 'Dashboard';
    
    return (
        <DashboardLayout user={auth.user} onLogout={onLogout} navItems={navItems} activeView={activeView} setActiveView={setActiveView}>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">{activeLabel}</h2>
            {views[activeView].component}
        </DashboardLayout>
    );
};

export default CandidateDashboard;