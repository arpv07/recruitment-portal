
import { useRef, useState } from "react";
import { apiClient } from "../../../services/api";
import Button from "../../ui/Button";
import FormField from "../../ui/FormField";
import TextAreaField from "../../ui/TextAreaField";


const ApplyJobView = ({ token, job }) => {
    const [isParsing, setIsParsing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ message: '', error: false });
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', skills: '', ctc: '', notes: '' });
    const resumeEditorRef = useRef(null);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleFileChange = (e) => {
        if (!e.target.files[0]) return;
        setIsParsing(true);
        setTimeout(() => {
            const parsed = { name: "Amit Kumar (from resume)", email: "amit.k@example.com", phone: "9876543210", skills: "React, Node.js, MongoDB", ctc: '', notes: '' };
            setFormData(parsed);
            if(resumeEditorRef.current) {
                resumeEditorRef.current.innerHTML = `<h2 style="font-size: 1.5rem; font-weight: bold;">${parsed.name}</h2><p><strong>Email:</strong> ${parsed.email} | <strong>Phone:</strong> ${parsed.phone}</p><h3>Skills</h3><p>${parsed.skills}</p>`;
            }
            setIsParsing(false);
        }, 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setIsSubmitting(true); setSubmitStatus({ message: '', error: false });
        try {
            const response = await apiClient.applyForJob(token, { jobId: job.id, ...formData });
            setSubmitStatus({ message: response.message, error: false });
        } catch (err) {
            setSubmitStatus({ message: err.message, error: true });
        } finally { setIsSubmitting(false); }
    };

    if (!job) return <div>Please select a job to apply for.</div>

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
            <div className="mb-6 pb-4 border-b">
                <label className="block text-lg font-medium text-gray-800 mb-2">Upload Resume to Auto-fill</label>
                <input type="file" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-800 hover:file:bg-blue-100" />
                {isParsing && <p className="text-blue-800 mt-2 animate-pulse">Parsing your resume...</p>}
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-700">Application Form</h3>
                    <FormField label="Full Name" name="name" value={formData.name} onChange={handleChange} readOnly={!!formData.name}/>
                    <FormField label="Email" name="email" value={formData.email} onChange={handleChange} readOnly={!!formData.email}/>
                    <FormField label="Contact Number" name="phone" value={formData.phone} onChange={handleChange} readOnly={!!formData.phone}/>
                    <FormField label="Key Skills (from resume)" name="skills" value={formData.skills} onChange={handleChange} readOnly={!!formData.skills}/>
                    <FormField label="Current CTC (in LPA)" name="ctc" placeholder="e.g., 12.5" required={true} value={formData.ctc} onChange={handleChange}/>
                    <TextAreaField label="Anything else you want to add?" name="notes" value={formData.notes} onChange={handleChange}/>
                    <Button type="submit" isLoading={isSubmitting}>Submit Application</Button>
                    {submitStatus.message && <p className={`mt-2 text-sm ${submitStatus.error ? 'text-red-600' : 'text-green-600'}`}>{submitStatus.message}</p>}
                </div>
                <div>
                     <h3 className="text-xl font-semibold text-gray-700 mb-2">Your Resume (AgreeYa Format)</h3>
                     <p className="text-sm text-gray-500 mb-4">This is an editable preview.</p>
                     <div ref={resumeEditorRef} contentEditable={true} className="h-96 border rounded-md p-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-800 overflow-y-auto prose max-w-none prose-sm">
                        {!formData.name && <p className="text-gray-400">Your parsed resume will appear here...</p>}
                     </div>
                </div>
            </form>
        </div>
    )
}

export default ApplyJobView
