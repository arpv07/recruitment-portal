import { useState } from "react";
import { apiClient } from "../../../services/api";
import Button from "../../ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { FaFileUpload, FaFilePdf, FaTimesCircle, FaSpinner } from 'react-icons/fa'; // Example icons

// A reusable and beautifully styled file dropzone component
const FileDropzone = ({ title, file, onFileChange, onFileRemove }) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsHovering(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsHovering(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onFileChange(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  return (
    <div className="text-center">
      <h3 className="text-xl font-semibold mb-3 text-gray-700">{title}</h3>
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
          isHovering ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
        }`}
      >
        <AnimatePresence>
          {file ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center justify-center p-4"
            >
              <FaFilePdf className="text-5xl text-blue-500" />
              <span className="mt-2 text-sm font-medium text-gray-600 truncate max-w-full px-4">{file.name}</span>
              <button
                onClick={(e) => { e.preventDefault(); onFileRemove(); }}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Remove file"
              >
                <FaTimesCircle size={20} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center text-gray-500"
            >
              <FaFileUpload className="text-4xl mb-3" />
              <p className="text-lg font-semibold">Drag & drop a file</p>
              <p className="text-sm">or click to browse</p>
            </motion.div>
          )}
        </AnimatePresence>
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileSelect} className="hidden" />
      </label>
    </div>
  );
};

const AtsCvUploader = ({ onUploadSuccess }) => {
  const [jdFile, setJdFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [error, setError] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const handleParse = async () => {
    if (!jdFile || !resumeFile) {
      setError("Please upload both the Job Description and your Resume.");
      return;
    }
    setError('');
    setIsParsing(true);
    try {
      // Using a delay to simulate the API call for demonstration
      await new Promise(resolve => setTimeout(resolve, 2000));
      const [jdData, resumeData] = await Promise.all([
        apiClient.uploadJD(jdFile),
        apiClient.parseFile(resumeFile)
      ]);
      onUploadSuccess({ jd: jdData, resume: resumeData });
    } catch (err) {
      setError(err.message || "An unexpected error occurred during parsing.");
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center p-4">
      <motion.div
        className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-4xl border border-gray-200"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <AnimatePresence>
          {isParsing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-3xl"
            >
              <FaSpinner className="animate-spin text-5xl text-blue-600" />
              <p className="mt-4 text-xl font-semibold text-gray-700">Analyzing Documents...</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-blue-800">Start Your Analysis</h2>
          <p className="mt-2 text-lg text-gray-500">Upload documents to match your resume against a job description.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <FileDropzone
            title="Job Description"
            file={jdFile}
            onFileChange={(file) => { setJdFile(file); setError(''); }}
            onFileRemove={() => setJdFile(null)}
          />
          <FileDropzone
            title="Your Resume"
            file={resumeFile}
            onFileChange={(file) => { setResumeFile(file); setError(''); }}
            onFileRemove={() => setResumeFile(null)}
          />
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-center text-red-600 font-medium mb-4"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="flex justify-center">
          <Button
            onClick={handleParse}
            disabled={isParsing || !jdFile || !resumeFile}
            className="px-10 py-4 rounded-xl text-lg font-bold bg-blue-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md"
          >
            Analyze & Match
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default AtsCvUploader;