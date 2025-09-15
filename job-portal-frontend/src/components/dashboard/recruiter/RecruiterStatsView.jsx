import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { apiClient } from "../../../services/api";
import BarChartCard from "./BarChartCard";
import DonutChart from "./DonutChart";
import CardSkeleton from "../../ui/CardSkeleton";
import { FaUsers, FaBriefcase, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// Mock Data for a great visual presentation
const mockStats = {
    total_jobs: 24,
    active_jobs: 8,
    total_applications: 352,
    reviewed_applications: 120,
    rejected_applications: 45,
    candidates_per_job: [
        { name: "React Frontend Developer", applications: 78, priority: "high"},
        { name: "Node.js Backend Engineer", applications: 52, priority: "high"},
        { name: "Senior QA Tester", applications: 35, priority: "medium"},
        { name: "UX/UI Designer", applications: 28, priority: "medium"},
        { name: "Data Scientist", applications: 19, priority: "low"},
    ]
};

const StatCard = ({ icon, title, value, color, delay }) => (
    <motion.div 
        className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
    >
        <div className="flex items-center gap-4">
            <div className={`text-3xl ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-4xl font-extrabold text-gray-800">{value}</p>
            </div>
        </div>
    </motion.div>
)

const RecruiterStatsView = ({ token }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // We'll use the mock data for now
                setStats(mockStats);
            } catch (error) {
                toast.error("Could not fetch recruiter stats.");
                console.error(error);
            } finally {
                // Simulate a network delay for visual effect
                setTimeout(() => setLoading(false), 800);
            }
        };
        fetchStats();
    }, [token]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
            </div>
        );
    }

    if (!stats) {
        return <div className="text-center text-gray-500">No stats available.</div>
    }

    const {
        total_applications,
        total_jobs,
        active_jobs,
        candidates_per_job
    } = stats;

    const applicationStatusData = {
        labels: ['Pending', 'Reviewed', 'Rejected'],
        datasets: [{
            data: [
                total_applications - (stats.reviewed_applications + stats.rejected_applications),
                stats.reviewed_applications,
                stats.rejected_applications
            ],
            backgroundColor: ['#3B82F6', '#FBBF24', '#EF4444'],
        }]
    };

    return (
        <div className="space-y-6">
            {/* Dashboard Header */}
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold text-gray-800 flex items-center gap-2"
            >
                Dashboard
            
            </motion.h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<FaBriefcase/>} title="Active Jobs" value={active_jobs} color="text-blue-500" delay={0.1} />
                <StatCard icon={<FaUsers/>} title="Total Applications" value={total_applications} color="text-yellow-500" delay={0.2} />
                <StatCard icon={<FaCheckCircle/>} title="Reviewed" value={stats.reviewed_applications} color="text-green-500" delay={0.3} />
                <StatCard icon={<FaTimesCircle/>} title="Rejected" value={stats.rejected_applications} color="text-red-500" delay={0.4} />
                
                <motion.div 
                  className="lg:col-span-2"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5}}
                >
                    <BarChartCard data={candidates_per_job} title="Top Active Jobs" />
                </motion.div>
                
                <motion.div 
                  className="lg:col-span-2"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6}}
                >
                    <DonutChart data={applicationStatusData} title="Application Status Overview" />
                </motion.div>
            </div>
        </div>
    );
};

export default RecruiterStatsView;
