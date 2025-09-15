import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaUser } from "react-icons/fa";

const mockEmployees = [
  { id: 1, name: "Alice Johnson", role: "Software Engineer", department: "Engineering", location: "Noida" },
  { id: 2, name: "Bob Smith", role: "Product Manager", department: "Product", location: "Bangalore" },
  { id: 3, name: "Charlie Brown", role: "UI/UX Designer", department: "Design", location: "Pune" },
  { id: 4, name: "Diana Prince", role: "HR Manager", department: "Human Resources", location: "Mumbai" },
  { id: 5, name: "Ethan Hunt", role: "DevOps Engineer", department: "Engineering", location: "Chennai" },
];

const EmployeeLookupView = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter(emp =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="relative p-6 w-full min-h-screen bg-gray-50 overflow-hidden">
      {/* Background Animation */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          background: "linear-gradient(135deg, #a5b4fc 0%, #c7d2fe 50%, #e0e7ff 100%)",
          filter: "blur(100px)",
          zIndex: -1,
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-800 mb-6 text-center relative z-10"
      >
        Employee Lookup
      </motion.h2>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex justify-center mb-8 relative z-10"
      >
        <div className="relative w-full max-w-md">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, role, or department..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        <AnimatePresence>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map(emp => (
              <motion.div
                key={emp.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 transform transition-transform"
              >
                <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                  <FaUser className="text-indigo-600 text-2xl" />
                </div>
                <h3 className="font-bold text-xl text-gray-800">{emp.name}</h3>
                <p className="text-gray-500">{emp.role}</p>
                <p className="text-gray-400 text-sm">{emp.department} • {emp.location}</p>
              </motion.div>
            ))
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full text-center text-gray-500 py-10"
            >
              No employees found.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EmployeeLookupView;
