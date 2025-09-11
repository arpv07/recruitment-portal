import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AtsCvUploader from "./AtsCvUploader";
import AtsEditorView from "./AtsEditorView";
import CvLookupView from "./CvLookupView";

// Define the tabs for cleaner management
const tabs = [
  { id: 'lookup', label: 'Candidate Lookup' },
  { id: 'matcher', label: 'ATS Matcher' }
];

const CvManagementView = ({ token, addToast }) => {
  const [mode, setMode] = useState('lookup'); // 'lookup', 'upload', or 'edit'
  const [parsedData, setParsedData] = useState(null);

  // Determine which tab is active based on the current mode
  const activeTab = (mode === 'upload' || mode === 'edit') ? tabs[1] : tabs[0];

  const handleUploadSuccess = (data) => {
    setParsedData(data);
    setMode('edit'); // Switch to the editor view after successful upload
  };
  
  const handleReturnToLookup = () => {
    setParsedData(null);
    setMode('lookup'); // Go back to the lookup view
  };

  const handleTabClick = (tabId) => {
    if (tabId === 'lookup') {
      setMode('lookup');
    } else {
      // Always start the matcher flow from the upload screen
      setParsedData(null); 
      setMode('upload');
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Candidate Management</h1>
          <p className="mt-2 text-lg text-gray-500">Search for candidates or use the ATS matcher to score new resumes.</p>
        </header>

        {/* Modern Tab Navigation */}
        <div className="w-full">
          <nav className="relative flex space-x-2 bg-gray-100 p-1.5 rounded-xl shadow-inner">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`${
                  activeTab.id === tab.id ? "text-gray-900" : "text-gray-600 hover:text-gray-800"
                } relative rounded-lg px-4 py-2.5 text-md font-semibold transition z-10 w-full`}
              >
                {activeTab.id === tab.id && (
                  <motion.span
                    layoutId="bubble"
                    className="absolute inset-0 bg-white shadow-md"
                    style={{ borderRadius: 8 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Animated Content Area */}
        <main className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              {mode === 'lookup' && <CvLookupView token={token} />}
              {mode === 'upload' && <AtsCvUploader onUploadSuccess={handleUploadSuccess} />}
              {mode === 'edit' && (
                <AtsEditorView
                  token={token}
                  initialData={parsedData}
                  onCancel={handleReturnToLookup}
                  addToast={addToast}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default CvManagementView;