
import { useState } from "react";
import { apiClient } from "../../services/api";
import { parseJwt } from "../../utils/helpers";
import Button from "../ui/Button";
import FormField from "../ui/FormField";
import { Logo } from "../ui/Logo";


const AuthPage = ({ setAuth }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ 
        username: '', password: '', fullName: '', email: '', phone: '', linkedInUrl: '', location: '' 
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); setError('');
        try {
            const response = isLogin 
                ? await apiClient.login(formData.username, formData.password) 
                : await apiClient.register(formData);
            
            const decodedToken = parseJwt(response.token);
            const role = decodedToken ? decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] : 'User';
            const authPayload = { token: response.token, user: { ...response.user, role: role, profileComplete: false } }; // Assume new users need onboarding
            setAuth(authPayload);
        } catch (err) { setError(err.message); } 
        finally { setIsLoading(false); }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg space-y-6">
                <div className="flex justify-center"><Logo /></div>
                <h2 className="text-center text-2xl font-bold text-gray-900">{isLogin ? 'Login to your account' : 'Create an Account'}</h2>
                
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert"><span className="block sm:inline">{error}</span></div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (<>
                        <FormField label="Full Name" type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" />
                        <FormField label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" />
                    </>)}
                    <FormField label="Username" type="text" name="username" value={formData.username} onChange={handleChange} placeholder="johndoe" />
                    <FormField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" />
                    {!isLogin && (<>
                        <FormField label="Phone Number" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91-9876543210" />
                        <FormField label="LinkedIn Profile URL" type="url" name="linkedInUrl" value={formData.linkedInUrl} onChange={handleChange} placeholder="https://linkedin.com/in/..." required={false} />
                        <FormField label="Location" type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Noida, India" />
                    </>)}
                    <Button type="submit" isLoading={isLoading} fullWidth>{isLogin ? 'Login' : 'Register'}</Button>
                </form>
                <p className="text-center text-sm text-gray-600">
                    {isLogin ? "Don't have an account?" : 'Already a member?'}
                    <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="font-medium text-blue-800 hover:text-blue-700 ml-1">
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage
