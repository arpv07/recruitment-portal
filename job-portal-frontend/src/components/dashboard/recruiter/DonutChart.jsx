import React from 'react';
import { motion } from 'framer-motion';
import { FaChartPie } from 'react-icons/fa';

const DonutChart = ({ data, title }) => {
  if (!data || !data.datasets?.[0]?.data?.length) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-center h-full">
        <p className="text-gray-500">No data to display</p>
      </div>
    );
  }

  const dataset = data.datasets[0];
  const total = dataset.data.reduce((acc, value) => acc + value, 0);

  let cumulativePercentage = 0;
  const segments = dataset.data.map((value, index) => {
    const percentage = (value / total) * 100;
    const dashArray = 2 * Math.PI * 40; // Circumference of the circle
    const dashOffset = dashArray * (1 - percentage / 100);
    const rotation = cumulativePercentage;
    cumulativePercentage += percentage;

    return {
      ...dataset,
      color: dataset.backgroundColor[index],
      dashArray,
      dashOffset,
      label: data.labels[index],
      value,
      rotation,
    };
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <FaChartPie className="text-xl text-gray-400" />
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      </div>
      <div className="flex-grow flex flex-col md:flex-row items-center justify-center gap-6">
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {segments.map((segment, index) => (
              <motion.circle
                key={index}
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke={segment.color}
                strokeWidth="20"
                strokeDasharray={segment.dashArray}
                initial={{ strokeDashoffset: segment.dashArray }}
                animate={{ strokeDashoffset: segment.dashOffset }}
                transition={{ duration: 1, ease: 'easeOut', delay: index * 0.2 }}
                transform={`rotate(${segment.rotation} 50 50)`}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-extrabold text-gray-800">{total}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="font-semibold text-gray-700">{segment.label}:</span>
              <span className="text-gray-600">{segment.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonutChart;