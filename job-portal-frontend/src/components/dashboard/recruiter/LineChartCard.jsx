import React from "react";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS modules
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChartCard = ({ data, title }) => {
  const chartData = {
    labels: data.map(d => d.month),
    datasets: [
      {
        label: "Applications",
        data: data.map(d => d.applications),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false }, title: { display: true, text: title, font: { size: 16 } } },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <motion.div className="bg-white p-6 rounded-2xl shadow-lg" 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}>
      <Line data={chartData} options={options} />
    </motion.div>
  );
};

export default LineChartCard;
