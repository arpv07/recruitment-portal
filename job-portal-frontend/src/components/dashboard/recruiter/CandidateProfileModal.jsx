import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaBriefcase, FaRupeeSign, FaCalendarAlt } from 'react-icons/fa';

const skillColorClasses = [
  'bg-blue-100 text-blue-800', 'bg-green-100 text-green-800', 'bg-yellow-100 text-yellow-800',
  'bg-purple-100 text-purple-800', 'bg-pink-100 text-pink-800', 'bg-indigo-100 text-indigo-800',
];

const CandidateProfileModal = ({ candidate, onClose }) => {
  if (!candidate) return null;

  const modalContentVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { scale: 0.95, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }
  };
  
  const InfoItem = ({ icon, label, value, href }) => (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-gray-400">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline break-all">{value}</a>
        ) : (
          <p className="font-semibold text-gray-800 break-all">{value}</p>
        )}
      </div>
    </div>
  );

  return (
    <Modal isOpen={!!candidate} onClose={onClose} size="3xl">
      <motion.div variants={modalContentVariants} initial="hidden" animate="visible" exit="exit">
        {/* Profile Header */}
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-t-xl flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="w-28 h-28 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full flex items-center justify-center text-blue-800 font-bold text-5xl flex-shrink-0">
            {candidate.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">{candidate.name}</h2>
            <p className="text-xl font-medium text-blue-700 mt-1">{candidate.role}</p>
          </div>
        </div>
        
        <div className="p-6">
          {/* Professional Summary */}
          <div className="grid md:grid-cols-3 gap-6 text-center bg-gray-50 p-4 rounded-lg border mb-6">
              <InfoItem icon={<FaBriefcase/>} label="Experience" value={`${candidate.experience} Yrs`} />
              <InfoItem icon={<FaRupeeSign/>} label="Expected CTC" value={`${candidate.ctc} LPA`} />
              <InfoItem icon={<FaCalendarAlt/>} label="Notice Period" value={`${candidate.noticePeriod} Days`} />
          </div>

          {/* Contact & Skills */}
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2 space-y-4">
              <h4 className="font-bold text-lg text-gray-800 border-b pb-2 mb-3">Contact Information</h4>
              <InfoItem icon={<FaEnvelope />} label="Email" value={candidate.email} href={`mailto:${candidate.email}`} />
              <InfoItem icon={<FaPhone />} label="Phone" value={candidate.phone} href={`tel:${candidate.phone}`} />
              <InfoItem icon={<FaMapMarkerAlt />} label="Location" value={candidate.location} />
              <InfoItem icon={<FaLinkedin />} label="LinkedIn" value={candidate.linkedIn} href={`https://${candidate.linkedIn}`} />
            </div>

            <div className="md:col-span-3">
              <h4 className="font-bold text-lg text-gray-800 border-b pb-2 mb-3">Top Skills</h4>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, index) => (
                  <span
                    key={skill}
                    className={`text-sm font-semibold px-3 py-1.5 rounded-full ${skillColorClasses[index % skillColorClasses.length]}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t flex justify-end">
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </motion.div>
    </Modal>
  );
};

export default CandidateProfileModal;