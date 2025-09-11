import { useEffect, useState } from "react";
import { apiClient } from "../../../services/api";
import Button from "../../ui/Button";
import FormField from "../../ui/FormField";
import TextAreaField from "../../ui/TextAreaField";
import { motion } from "framer-motion";

const AtsEditorView = ({ initialData, token, onCancel }) => {
  const [jdData, setJdData] = useState(initialData.jd);
  const [resumeData, setResumeData] = useState(initialData.resume);
  const [atsScore, setAtsScore] = useState(0);

  useEffect(() => {
    // Simulate API call or actual calculation
    const score = apiClient.calculateAtsScore(jdData, resumeData);
    setAtsScore(score);
  }, [jdData, resumeData]);

  const handleJdChange = (e) => setJdData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleResumeChange = (e) => setResumeData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 font-sans"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 lg:p-12 space-y-8 max-w-7xl mx-auto border border-blue-100"
        variants={itemVariants}
      >
        <h2 className="text-4xl font-extrabold text-center text-blue-800 tracking-tight leading-tight">
          ATS Matcher <span className="text-green-600">&</span> Editor
        </h2>

        <motion.div
          className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg text-center flex flex-col items-center justify-center relative overflow-hidden"
          variants={itemVariants}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-80"></div>
          <p className="relative z-10 text-lg font-semibold opacity-90 mb-1">Current ATS Match Score</p>
          <motion.div
            className="relative z-10 text-7xl font-bold mt-2 tracking-tight"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.2 }}
          >
            {atsScore}<span className="text-5xl">%</span>
          </motion.div>
          <p className="relative z-10 text-sm opacity-70 mt-2">Adjust your resume to improve this score!</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            className="bg-gray-50 p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
            whileHover={{ y: -5 }}
            variants={itemVariants}
          >
            <h3 className="text-2xl font-bold mb-6 text-blue-700">Job Description</h3>
            <div className="space-y-5">
              <FormField
                label="Job Title"
                name="title"
                value={jdData.title}
                onChange={handleJdChange}
                placeholder="e.g., Senior Software Engineer"
              />
              <FormField
                label="Required Experience"
                name="experience"
                value={jdData.experience}
                onChange={handleJdChange}
                placeholder="e.g., 5+ years"
              />
              <TextAreaField
                label="Key Skills (comma-separated)"
                name="skills"
                value={jdData.skills}
                onChange={handleJdChange}
                rows={6}
                placeholder="e.g., React, Node.js, AWS, TypeScript, Agile"
              />
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-50 p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
            whileHover={{ y: -5 }}
            variants={itemVariants}
          >
            <h3 className="text-2xl font-bold mb-6 text-green-700">Candidate Resume</h3>
            <div className="space-y-5">
              <FormField
                label="Your Name"
                name="name"
                value={resumeData.name}
                onChange={handleResumeChange}
                placeholder="e.g., Jane Doe"
              />
              <FormField
                label="Your Current Designation"
                name="designation"
                value={resumeData.designation}
                onChange={handleResumeChange}
                placeholder="e.g., Software Developer"
              />
              <TextAreaField
                label="Your Skills (comma-separated)"
                name="skills"
                value={resumeData.skills}
                onChange={handleResumeChange}
                rows={6}
                placeholder="e.g., React, Python, SQL, REST APIs, Git"
              />
            </div>
          </motion.div>
        </div>

        <motion.div className="flex justify-center md:justify-end gap-4 mt-8" variants={itemVariants}>
          <Button
            className="px-8 py-3 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-200 ease-in-out font-semibold text-lg"
            onClick={onCancel}
          >
            Back
          </Button>
          <Button
            className="px-8 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 ease-in-out shadow-lg hover:shadow-xl font-semibold text-lg"
            onClick={() => apiClient.saveCandidateProfile(token, resumeData, jdData)}
          >
            Save Profile
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AtsEditorView;