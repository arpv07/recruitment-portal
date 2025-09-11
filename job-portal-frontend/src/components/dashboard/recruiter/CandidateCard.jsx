import Button from "../../ui/Button";
import { FaBriefcase, FaRupeeSign, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';

// A helper to give skills different colors for visual appeal
const skillColorClasses = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-yellow-100 text-yellow-800',
  'bg-purple-100 text-purple-800',
  'bg-pink-100 text-pink-800',
];

const CandidateCard = ({ candidate, onViewProfile }) => (
  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-in-out overflow-hidden border border-gray-100 flex flex-col group">
    <div className="p-6 flex-grow flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-3xl flex-shrink-0">
          {candidate.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{candidate.name}</h3>
          <p className="text-blue-700 font-semibold">{candidate.role}</p>
        </div>
      </div>
      
      {/* Key Stats */}
      <div className="grid grid-cols-3 gap-2 text-center my-4 bg-gray-50/70 p-3 rounded-lg border border-gray-200/80">
        <div className="flex flex-col items-center">
          <FaBriefcase className="text-gray-400 mb-1" />
          <p className="text-sm text-gray-500">Experience</p>
          <p className="font-bold text-lg text-gray-800">{candidate.experience} Yrs</p>
        </div>
        <div className="flex flex-col items-center">
          <FaRupeeSign className="text-gray-400 mb-1" />
          <p className="text-sm text-gray-500">CTC</p>
          <p className="font-bold text-lg text-gray-800">{candidate.ctc} LPA</p>
        </div>
        <div className="flex flex-col items-center">
          <FaCalendarAlt className="text-gray-400 mb-1" />
          <p className="text-sm text-gray-500">Notice</p>
          <p className="font-bold text-lg text-gray-800">{candidate.noticePeriod} Days</p>
        </div>
      </div>

      {/* Top Skills */}
      <div className="space-y-2 mt-2 flex-grow">
        <p className="text-sm font-semibold text-gray-600">Top Skills:</p>
        <div className="flex flex-wrap gap-2">
          {candidate.skills.slice(0, 3).map((skill, index) => (
            <span 
              key={skill} 
              className={`text-xs font-semibold px-3 py-1 rounded-full ${skillColorClasses[index % skillColorClasses.length]}`}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
    
    {/* Footer Button */}
    <div className="bg-gray-50 p-4 border-t border-gray-100">
      <Button fullWidth variant="primary" onClick={() => onViewProfile(candidate)}>
        <span className="flex items-center justify-center gap-2">
          View Profile <FaArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </span>
      </Button>
    </div>
  </div>
);

export default CandidateCard;