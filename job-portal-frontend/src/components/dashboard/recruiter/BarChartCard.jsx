import React from 'react';
import { FaReact, FaNodeJs, FaBug, FaSearch, FaBriefcase, FaPoll } from 'react-icons/fa';

// Helper to get a relevant icon based on the job title
const getJobIcon = (jobName) => {
  const name = jobName.toLowerCase();
  if (name.includes('react')) return <FaReact className="text-blue-500" />;
  if (name.includes('node')) return <FaNodeJs className="text-green-500" />;
  if (name.includes('qa')) return <FaBug className="text-red-500" />;
  if (name.includes('data scientist')) return <FaSearch className="text-purple-500" />;
  return <FaBriefcase className="text-gray-500" />;
};

// Helper for styling priority tags
const getPriorityStyles = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const BarChartCard = ({ data, title }) => {
  if (!data || data.length === 0) {
    return <div>No active jobs to display.</div>;
  }

  // Find the max number of applications to normalize bar widths
  const maxApplications = Math.max(...data.map(job => job.applications), 0);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <FaPoll className="text-xl text-gray-400" />
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      </div>
      
      <div className="space-y-4 flex-grow">
        {data.map((job) => (
          <div key={job.name}>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getJobIcon(job.name)}</span>
                <span className="text-sm font-semibold text-gray-700">{job.name}</span>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getPriorityStyles(job.priority)}`}>
                {job.priority}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-400 to-indigo-500 h-4 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(job.applications / maxApplications) * 100}%` }}
                />
              </div>
              <span className="text-sm font-bold text-gray-800 w-12 text-right">{job.applications}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChartCard;