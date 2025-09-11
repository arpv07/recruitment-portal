import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../ui/Button';
import { FaEye, FaPen, FaPlusCircle, FaClipboardList } from 'react-icons/fa';
import JobDetailsModal from './JobDetailsModal';

const AllJobPostingsView = ({ jobs, setActiveView, onEdit }) => {
    const [viewingJob, setViewingJob] = useState(null);

    // Determines the background and text color for the 'Status' pill
    const getStatusStyles = (status) => {
        return status === 'Open'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-200 text-gray-700';
    };

    return (
        <>
            <AnimatePresence>
                {viewingJob && <JobDetailsModal job={viewingJob} onClose={() => setViewingJob(null)} />}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-extrabold text-gray-800">Job Postings</h2>
                    <Button onClick={() => setActiveView('jobPosting')} className="flex items-center gap-2">
                        <FaPlusCircle /> Post a New Job
                    </Button>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-x-auto border border-gray-100">
                    <table className="w-full text-left min-w-max">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Job Title</th>
                                <th className="p-4 font-semibold text-gray-600">Location</th>
                                <th className="p-4 font-semibold text-gray-600">Posted Date</th>
                                <th className="p-4 font-semibold text-gray-600">Status</th>
                                <th className="p-4 font-semibold text-gray-600">Applications</th>
                                <th className="p-4 font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* This logic now checks if the jobs array is empty.
                              If so, it displays a helpful message.
                            */}
                            {!jobs || jobs.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-10">
                                        <div className="flex flex-col items-center">
                                            <FaClipboardList className="text-4xl text-gray-300 mb-4" />
                                            <h3 className="font-semibold text-gray-700">No Job Postings Found</h3>
                                            <p className="text-sm text-gray-500">Click "Post a New Job" to get started.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                jobs.map((job) => (
                                    <tr key={job.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                                        <td className="p-4">
                                            <p className="font-bold text-gray-800">{job.title}</p>
                                            <p className="text-sm text-gray-500">{job.department}</p>
                                        </td>
                                        <td className="p-4 text-gray-700">{job.location}</td>
                                        <td className="p-4 text-gray-700">{new Date(job.postedDate).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyles(job.status)}`}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="p-4 font-bold text-gray-800 text-center">{job.applications}</td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button onClick={() => setViewingJob(job)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-md transition" title="View Details"><FaEye /></button>
                                                <button onClick={() => onEdit(job)} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-100 rounded-md transition" title="Edit Job"><FaPen /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </>
    );
};

export default AllJobPostingsView;