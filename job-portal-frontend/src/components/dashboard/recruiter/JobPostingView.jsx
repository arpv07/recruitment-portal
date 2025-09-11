import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../ui/Button";
import FormField from "../../ui/FormField";
import TextAreaField from "../../ui/TextAreaField";
import {
  FaSignature,
  FaBuilding,
  FaMapMarkerAlt,
  FaFileUpload,
  FaEye,
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import { apiClient } from "../../../services/api";

// Mock data for employment types
const employmentTypes = ["Full-time", "Part-time", "Contract", "Internship"];

const JobPostingView = ({ onPost, onUpdate, initialData, addToast }) => {
  const [step, setStep] = useState(1);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef(null);
  const [jobData, setJobData] = useState({
    title: "",
    department: "",
    location: "",
    employmentType: "Full-time",
    description: "",
    experience: "",
    skills: "",
    salaryMin: "",
    salaryMax: "",
  });

  const isEditMode = !!initialData;

  useEffect(() => {
    if (isEditMode) {
      setJobData(initialData);
    } else {
      setJobData({
        title: "",
        department: "",
        location: "",
        employmentType: "Full-time",
        description: "",
        experience: "",
        skills: "",
        salaryMin: "",
        salaryMax: "",
      });
    }
  }, [initialData, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    setJobData((prev) => ({ ...prev, skills: e.target.value }));
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsParsing(true);
    try {
      const parsedData = await apiClient.uploadJD(file);
      setJobData((prev) => ({ ...prev, ...parsedData }));
      if (addToast) {
        addToast({
          message: "Job Description parsed and filled!",
          type: "success",
        });
      }
    } catch (error) {
      if (addToast) {
        addToast({
          message: error.message || "Failed to parse file.",
          type: "error",
        });
      }
    } finally {
      setIsParsing(false);
      e.target.value = null;
    }
  };

  const handleSubmit = () => {
    if (isEditMode) {
      onUpdate(jobData);
    } else {
      onPost(jobData);
    }
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const pageVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-lg p-8 md:p-10 lg:p-12 w-full mx-auto border border-gray-200">
      <h2 className="text-4xl font-extrabold text-center text-blue-700 tracking-tight leading-tight mb-8">
        {isEditMode ? "Edit Job Posting" : "Create a New Job Posting"}
      </h2>

      {/* Step Indicator */}
      <div className="flex justify-center items-center mb-10">
        {["Job Details", "Requirements", "Preview & Post"].map((label, index) => (
          <React.Fragment key={index}>
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                  step > index
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {step > index ? <FaCheckCircle /> : index + 1}
              </div>
              <p
                className={`ml-3 font-semibold ${
                  step >= index + 1
                    ? "text-blue-700"
                    : "text-gray-400"
                }`}
              >
                {label}
              </p>
            </div>
            {index < 2 && (
              <div
                className={`flex-auto border-t-2 transition-all duration-300 mx-4 ${
                  step > index + 1 ? "border-blue-500" : "border-gray-300"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form Section */}
        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-700">
                    Step 1: Job Details
                  </h3>
                  <FormField
                    icon={<FaSignature />}
                    name="title"
                    label="Job Title"
                    value={jobData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Senior React Developer"
                  />
                  <FormField
                    icon={<FaBuilding />}
                    name="department"
                    label="Department"
                    value={jobData.department}
                    onChange={handleInputChange}
                    placeholder="e.g., Engineering"
                  />
                  <FormField
                    icon={<FaMapMarkerAlt />}
                    name="location"
                    label="Location"
                    value={jobData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Noida, Uttar Pradesh"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Employment Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {employmentTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() =>
                            setJobData({ ...jobData, employmentType: type })
                          }
                          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                            jobData.employmentType === type
                              ? "bg-blue-500 text-white shadow-md"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <TextAreaField
                    name="description"
                    label="Job Description"
                    value={jobData.description}
                    onChange={handleInputChange}
                    rows={8}
                    placeholder="Describe the role, responsibilities, and culture..."
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                  />
                  <Button
                    onClick={handleImportClick}
                    disabled={isParsing}
                    className="w-full flex justify-center items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:bg-gray-200 disabled:cursor-not-allowed"
                  >
                    {isParsing ? (
                      <>
                        <FaSpinner className="animate-spin" /> Parsing JD...
                      </>
                    ) : (
                      <>
                        <FaFileUpload /> Import from JD File
                      </>
                    )}
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-700">
                    Step 2: Skills & Requirements
                  </h3>
                  <FormField
                    name="experience"
                    label="Required Experience (Years)"
                    value={jobData.experience}
                    onChange={handleInputChange}
                    placeholder="e.g., 5+"
                  />
                  <TextAreaField
                    name="skills"
                    label="Required Skills (comma-separated)"
                    value={jobData.skills}
                    onChange={handleSkillsChange}
                    rows={4}
                    placeholder="e.g., React, Node.js, AWS"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      name="salaryMin"
                      label="Minimum Salary (LPA)"
                      value={jobData.salaryMin}
                      onChange={handleInputChange}
                      placeholder="e.g., 20"
                      type="number"
                    />
                    <FormField
                      name="salaryMax"
                      label="Maximum Salary (LPA)"
                      value={jobData.salaryMax}
                      onChange={handleInputChange}
                      placeholder="e.g., 30"
                      type="number"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="text-center">
                  <FaCheckCircle className="text-7xl text-green-500 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-gray-800">
                    Ready to Post?
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Review the job details on the right. If everything looks
                    good, click the button below to make it live.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Live Preview Section */}
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm h-full">
          <h3 className="text-2xl font-bold text-gray-700 mb-4 flex items-center gap-2">
            <FaEye /> Live Preview
          </h3>
          <div className="space-y-4">
            <h4 className="text-2xl font-bold text-gray-900">
              {jobData.title || "Job Title"}
            </h4>
            <p className="text-md text-gray-600">
              {jobData.department || "Department"} • {jobData.location || "Location"}
            </p>
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
              {jobData.employmentType}
            </span>
            <hr className="border-gray-300" />
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {jobData.description || "Job description will appear here..."}
            </p>
            <hr className="border-gray-300" />
            <div>
              <h5 className="font-bold text-gray-800 mb-2">Requirements</h5>
              <p className="text-sm text-gray-600">
                <strong>Experience:</strong> {jobData.experience || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Salary:</strong> ₹{jobData.salaryMin || "..."} - ₹
                {jobData.salaryMax || "..."} LPA
              </p>
            </div>
            <div>
              <h5 className="font-bold text-gray-800 mb-2">Skills</h5>
              <div className="flex flex-wrap gap-2">
                {jobData.skills
                  .split(",")
                  .map(
                    (skill) =>
                      skill.trim() && (
                        <span
                          key={skill}
                          className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full"
                        >
                          {skill.trim()}
                        </span>
                      )
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-10 flex justify-between">
        <Button
          onClick={prevStep}
          disabled={step === 1}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          <FaArrowLeft /> Back
        </Button>
        {step < 3 ? (
          <Button
            onClick={nextStep}
            className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600"
          >
            Next <FaArrowRight />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="bg-green-500 text-white hover:bg-green-600 shadow-lg"
          >
            {isEditMode ? "Update Job Posting" : "Post This Job"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default JobPostingView;
