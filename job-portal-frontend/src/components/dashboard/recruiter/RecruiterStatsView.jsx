import { useEffect, useState } from "react";
import { apiClient } from "../../../services/api";
import BarChartCard from "./BarChartCard";
import { motion } from "framer-motion";
import { FaBriefcase, FaUsers, FaClock, FaCalendarPlus, FaUserCheck, FaUserClock, FaUserTie } from 'react-icons/fa';

// A reusable, stylish KPI card component
const StatCard = ({ icon, title, value, subtitle, colorClass }) => (
  <motion.div
    variants={itemVariants}
    className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
  >
    <div className={`text-3xl p-3 inline-block rounded-full bg-opacity-10 ${colorClass}`}>
      {icon}
    </div>
    <p className="text-3xl font-extrabold text-gray-800 mt-4">{value}</p>
    <p className="text-sm font-semibold text-gray-500">{title}</p>
    {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
  </motion.div>
);

// Animation variants for a staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

const RecruiterStatsView = ({ token }) => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient.getRecruiterStats(token)
      .then(setStats)
      .catch(err => {
        setError('Could not load dashboard stats. You may not have permission.');
        console.error(err);
      });
  }, [token]);

  if (error) {
    return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
        </div>
    );
  }
  
  if (!stats) {
    // A skeleton loader that better matches the final layout
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        <div className="h-36 bg-gray-200 rounded-2xl"></div>
        <div className="h-36 bg-gray-200 rounded-2xl"></div>
        <div className="h-36 bg-gray-200 rounded-2xl"></div>
        <div className="h-36 bg-gray-200 rounded-2xl"></div>
        <div className="lg:col-span-2 h-80 bg-gray-200 rounded-2xl"></div>
        <div className="lg:col-span-2 h-80 bg-gray-200 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* KPI Cards */}
      <StatCard icon={<FaBriefcase />} title="Open Opportunities" value={stats.opportunities.open} colorClass="text-blue-500 bg-blue-100" />
      <StatCard icon={<FaUsers />} title="Candidates in Pipeline" value={Object.values(stats.pipelineStats).reduce((a, b) => a + b, 0)} colorClass="text-green-500 bg-green-100" />
      <StatCard icon={<FaClock />} title="Avg. Time to Hire" value={`${stats.metrics.avgTimeToHire}d`} subtitle="in days" colorClass="text-yellow-500 bg-yellow-100" />
      <StatCard icon={<FaCalendarPlus />} title="New Postings" value={stats.metrics.newPostings} subtitle="this month" colorClass="text-purple-500 bg-purple-100" />

      {/* Main Dashboard Panels */}
      <motion.div variants={itemVariants} className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <BarChartCard data={stats.activeJobs} title="Top Active Jobs by Applications" />
      </motion.div>

      <motion.div variants={itemVariants} className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Candidate Pipeline</h3>
        <div className="space-y-4">
          <div className="flex items-center bg-gray-50 p-4 rounded-lg">
            <FaUserTie className="text-3xl text-blue-500 mr-4"/>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.pipelineStats.screening}</p>
              <p className="text-sm font-medium text-gray-500">Screening</p>
            </div>
          </div>
          <div className="flex items-center bg-gray-50 p-4 rounded-lg">
            <FaUserClock className="text-3xl text-yellow-500 mr-4"/>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.pipelineStats.interview}</p>
              <p className="text-sm font-medium text-gray-500">Interview Stage</p>
            </div>
          </div>
          <div className="flex items-center bg-gray-50 p-4 rounded-lg">
            <FaUserCheck className="text-3xl text-green-500 mr-4"/>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.pipelineStats.offer}</p>
              <p className="text-sm font-medium text-gray-500">Offer Extended</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Upcoming Interviews Panel */}
      <motion.div variants={itemVariants} className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Upcoming Interviews</h3>
          <div className="space-y-3">
              {stats.upcomingInterviews.length > 0 ? (
                  stats.upcomingInterviews.map((interview, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                          <div>
                              <p className="font-bold text-gray-800">{interview.candidate}</p>
                              <p className="text-sm text-gray-600">{interview.role}</p>
                          </div>
                          <p className="text-sm font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">{interview.time}</p>
                      </div>
                  ))
              ) : (
                  <p className="text-gray-500 text-center py-4">No interviews scheduled.</p>
              )}
          </div>
      </motion.div>
    </motion.div>
  );
};

export default RecruiterStatsView;