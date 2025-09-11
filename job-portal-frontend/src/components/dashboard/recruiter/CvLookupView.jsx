import { useEffect, useState, useMemo } from "react";
import { apiClient } from "../../../services/api";
import CandidateCard from "./CandidateCard";
import CandidateProfileModal from "./CandidateProfileModal";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaUserSlash, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Button from "../../ui/Button";


// A skeleton component to show while loading
const CandidateCardSkeleton = () => (
  <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200 animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="bg-gray-300 rounded-full h-16 w-16"></div>
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
    <div className="mt-4 h-3 bg-gray-300 rounded w-full"></div>
    <div className="mt-2 h-3 bg-gray-300 rounded w-5/6"></div>
    <div className="mt-6 h-10 bg-gray-300 rounded-lg"></div>
  </div>
);

const CvLookupView = ({ token }) => {
  const [candidates, setCandidates] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [viewingCandidate, setViewingCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const response = await apiClient.getCandidates(token, { page: currentPage, pageSize: 6 });
        setCandidates(response.data); // **FIX: Store the array from the 'data' property**
        setPaginationInfo(response);    // Store the rest of the pagination info
      } catch (error) {
        console.error("Failed to fetch candidates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, [token, currentPage]); // Re-fetch when currentPage changes

  // Memoize filtered candidates to avoid re-calculation on every render
  const filteredCandidates = useMemo(() => {
    if (!Array.isArray(candidates)) return []; // Guard against non-array values
    return candidates.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [candidates, searchTerm]);

  // Animation variants
  const containerVariants = { /* ... (same as before) ... */ };
  const itemVariants = { /* ... (same as before) ... */ };

  const renderContent = () => {
    if (loading) {
      return Array.from({ length: 6 }).map((_, index) => <CandidateCardSkeleton key={index} />);
    }

    if (filteredCandidates.length === 0) {
        return (
            <div className="md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center text-center py-20 bg-gray-50 rounded-2xl">
              <FaUserSlash className="text-6xl text-gray-400 mb-4" />
              <h3 className="text-2xl font-bold text-gray-700">No Candidates Found</h3>
              <p className="text-gray-500 mt-1">
                {searchTerm ? "Try adjusting your search query." : "There are no candidates on this page."}
              </p>
            </div>
          );
    }

    return filteredCandidates.map(c => (
      <motion.div key={c.id} variants={itemVariants}>
        <CandidateCard candidate={c} onViewProfile={() => setViewingCandidate(c)} />
      </motion.div>
    ));
  };

  return (
    <>
      <AnimatePresence>
        {viewingCandidate && (
          <CandidateProfileModal 
            candidate={viewingCandidate} 
            onClose={() => setViewingCandidate(null)} 
          />
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
            {/* ... (same as before) ... */}
        </div>

        {/* Candidates Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {renderContent()}
        </motion.div>

        {/* **NEW: Pagination Controls** */}
        {paginationInfo && paginationInfo.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
                <Button 
                    onClick={() => setCurrentPage(p => p - 1)} 
                    disabled={currentPage === 1}
                    className="flex items-center gap-2"
                >
                    <FaArrowLeft/> Previous
                </Button>
                <span className="font-semibold text-gray-700">
                    Page {paginationInfo.currentPage} of {paginationInfo.totalPages}
                </span>
                <Button 
                    onClick={() => setCurrentPage(p => p + 1)} 
                    disabled={currentPage === paginationInfo.totalPages}
                    className="flex items-center gap-2"
                >
                    Next <FaArrowRight/>
                </Button>
            </div>
        )}
      </div>
    </>
  );
};

export default CvLookupView;