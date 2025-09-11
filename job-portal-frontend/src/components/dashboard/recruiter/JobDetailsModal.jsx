// src/components/dashboard/recruiter/JobDetailsModal.js

import React from 'react';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import { FaBuilding, FaMapMarkerAlt, FaBriefcase, FaRupeeSign, FaTools, FaInfoCircle } from 'react-icons/fa';

const InfoPill = ({ icon, text }) => (
    <div className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm">
        {icon}
        <span className="font-semibold">{text}</span>
    </div>
);

const JobDetailsModal = ({ job, onClose }) => {
    if (!job) return null;

    return (
        <Modal isOpen={!!job} onClose={onClose} title="Job Posting Details" size="2xl">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900">{job.title}</h2>
                    <div className="flex flex-wrap gap-4 mt-2">
                        <InfoPill icon={<FaBuilding className="text-gray-500" />} text={job.department} />
                        <InfoPill icon={<FaMapMarkerAlt className="text-gray-500" />} text={job.location} />
                        <InfoPill icon={<FaBriefcase className="text-gray-500" />} text={job.employmentType} />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 border-b pb-2 flex items-center gap-2"><FaInfoCircle/> Description</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{job.description}</p>
                </div>
                
                {/* Requirements */}
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 border-b pb-2 flex items-center gap-2"><FaTools/> Requirements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoPill icon={<FaBriefcase/>} text={`Experience: ${job.experience}`} />
                        <InfoPill icon={<FaRupeeSign/>} text={`Salary: ₹${job.salaryMin} - ₹${job.salaryMax} LPA`} />
                    </div>
                    <div className="mt-4">
                        <h4 className="font-semibold text-gray-700 mb-2">Skills:</h4>
                        <div className="flex flex-wrap gap-2">
                            {job.skills.split(',').map(skill => skill.trim() && (
                                <span key={skill} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">{skill.trim()}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 flex justify-end">
                <Button variant="secondary" onClick={onClose}>Close</Button>
            </div>
        </Modal>
    );
};

export default JobDetailsModal;