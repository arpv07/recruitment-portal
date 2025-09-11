
import { useState } from "react";
import Button from "../../ui/Button";
import FormField from "../../ui/FormField";
import TextAreaField from "../../ui/TextAreaField";

const CandidateOnboarding = ({ onComplete, addToast }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1
        headline: '',
        summary: '',
        // Step 2
        experiences: [{ title: '', company: '', years: '' }],
    });

    const handleChange = (e, index) => {
        if (e.target.name.startsWith('exp_')) {
            const { name, value } = e.target;
            const field = name.split('_')[1];
            const newExperiences = [...formData.experiences];
            newExperiences[index][field] = value;
            setFormData(prev => ({ ...prev, experiences: newExperiences }));
        } else {
            setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        }
    };
    
    const addExperience = () => {
        setFormData(prev => ({...prev, experiences: [...prev.experiences, { title: '', company: '', years: '' }]}));
    }

    const handleSubmit = () => {
        console.log("Submitting Onboarding Data:", formData);
        addToast({ type: 'success', message: 'Profile completed successfully!' });
        onComplete();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg space-y-6">
                <h2 className="text-2xl font-bold text-center text-gray-800">Complete Your Profile</h2>
                <p className="text-center text-gray-500">Step {step} of 2: {step === 1 ? "Professional Information" : "Work Experience"}</p>
                
                {step === 1 && (
                    <div className="space-y-4 animate-fade-in">
                        <FormField label="Professional Headline" name="headline" value={formData.headline} onChange={handleChange} placeholder="e.g., Senior Software Engineer" />
                        <TextAreaField label="Profile Summary" name="summary" value={formData.summary} onChange={handleChange} rows={6} placeholder="Write a brief summary about your professional background..." />
                    </div>
                )}
                
                {step === 2 && (
                    <div className="space-y-4 animate-fade-in">
                        {formData.experiences.map((exp, index) => (
                             <div key={index} className="p-4 border rounded-md space-y-3">
                                <FormField label="Job Title" name={`exp_title`} value={exp.title} onChange={(e) => handleChange(e, index)} />
                                <FormField label="Company" name={`exp_company`} value={exp.company} onChange={(e) => handleChange(e, index)} />
                                <FormField label="Years" type="number" name={`exp_years`} value={exp.years} onChange={(e) => handleChange(e, index)} />
                            </div>
                        ))}
                       <Button onClick={addExperience} variant="secondary">Add Another Experience</Button>
                    </div>
                )}

                <div className="flex justify-between mt-8">
                    <Button variant="secondary" onClick={() => setStep(1)} disabled={step === 1}>Previous</Button>
                    {step === 1 && <Button onClick={() => setStep(2)}>Next</Button>}
                    {step === 2 && <Button onClick={handleSubmit}>Finish & Submit</Button>}
                </div>
            </div>
        </div>
    );
};

export default CandidateOnboarding
