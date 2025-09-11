import { useEffect, useState, useMemo } from "react";
import { apiClient } from "../../../services/api";
import Button from "../../ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt, FaBuilding, FaBriefcase, FaSearch, FaArrowRight, FaExclamationTriangle } from "react-icons/fa";

// Skeleton Component for Loading State
const JobCardSkeleton = () => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 animate-pulse">
        <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
        <div className="flex flex-wrap gap-4 mb-6">
            <div className="h-4 bg-gray-300 rounded w-28"></div>
            <div className="h-4 bg-gray-300 rounded w-28"></div>
        </div>
        <div className="h-10 bg-gray-300 rounded-lg w-32 ml-auto"></div>
    </div>
);

const CandidateJobsView = ({ token, onApply }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        apiClient.getAvailableJobs(token)
            .then(setJobs)
            .catch(err => {
                console.error("Failed to fetch available jobs:", err);
                setError("Could not load jobs. Please try again later.");
            })
            .finally(() => setLoading(false));
    }, [token]);

    const filteredJobs = useMemo(() =>
        jobs.filter(job =>
            job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location.toLowerCase().includes(searchTerm.toLowerCase())
        ), [jobs, searchTerm]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    const ErrorState = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="md:col-span-2 text-center py-20 bg-red-50 rounded-xl shadow-lg border border-red-200">
            <FaExclamationTriangle className="text-5xl text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-700">Something Went Wrong</h3>
            <p className="text-red-600">{error}</p>
        </motion.div>
    );

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by job title or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
            </div>

            {/* Job Listings */}
            <AnimatePresence>
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => <JobCardSkeleton key={i} />)
                    ) : error ? (
                        <ErrorState />
                    ) : filteredJobs.length > 0 ? (
                        filteredJobs.map(job => (
                            <motion.div key={job.id} variants={itemVariants} className="bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 border border-gray-200 flex flex-col group">
                                <div className="p-6 flex-grow">
                                    <h3 className="text-xl font-extrabold text-gray-800">{job.position}</h3>
                                    <p className="text-blue-700 font-semibold mb-4">{job.department}</p>
                                    
                                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 mb-6">
                                        <span className="flex items-center gap-2"><FaMapMarkerAlt /> {job.location}</span>
                                        <span className="flex items-center gap-2"><FaBuilding /> {job.employmentType}</span>
                                        <span className="flex items-center gap-2"><FaBriefcase /> {job.experience} Exp.</span>
                                    </div>

                                    {/* This is one of the <p> tags where the error likely occurred. 
                                        I have ensured it does NOT have contentEditable. 
                                    */}
                                    <p className="text-gray-500 text-sm line-clamp-2">{job.description}</p>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-b-xl mt-auto flex justify-end">
                                    <Button onClick={() => onApply(job)} className="flex items-center gap-2">
                                        Apply Now <FaArrowRight className="transform transition-transform duration-300 group-hover:translate-x-1" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="md:col-span-2 text-center py-20 bg-white rounded-xl shadow-lg border border-gray-200">
                             <FaSearch className="text-5xl text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-700">No Jobs Found</h3>
                            <p className="text-gray-500">Your search for "{searchTerm}" did not match any available jobs.</p>
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default CandidateJobsView;