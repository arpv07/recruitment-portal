import React from "react";
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HorizontalBarChartCard = ({ data, title }) => {
  const chartData = {
    labels: data.map(d => d.department),
    datasets: [
      {
        label: "Applications",
        data: data.map(d => d.applications),
        backgroundColor: "#10B981", // green
        borderRadius: 8,
      },
    ],
  };

  const options = {
    indexAxis: "y", // horizontal bars
    responsive: true,
    plugins: { legend: { display: false }, title: { display: true, text: title, font: { size: 16 } } },
    scales: { x: { beginAtZero: true }, y: { ticks: { font: { size: 14 } } } },
  };

  return (
    <motion.div className="bg-white p-6 rounded-2xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Bar data={chartData} options={options} />
    </motion.div>
  );
};

export default HorizontalBarChartCard;
