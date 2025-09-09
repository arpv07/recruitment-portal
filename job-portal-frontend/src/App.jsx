import React, { useState, useEffect, useCallback, useRef } from 'react';

// --- ICONS (as SVG components) ---
const BriefcaseIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.05a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.25a2.25 2.25 0 012.25-2.25h15a2.25 2.25 0 012.25 2.25v.75M15.75 18a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H8.25a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h7.5z" />
    </svg>
);
const UserGroupIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962A3.75 3.75 0 0115 9.75a3.75 3.75 0 01-1.855 3.243m-3.37-3.243a3.75 3.75 0 015.24-3.243m-5.24 3.243L3 15m14.03-9.73a3.75 3.75 0 01-5.24 3.243m5.24-3.243L15 3m-3.07 6.73L6 3m9 15a3.75 3.75 0 01-5.24 3.243m5.24-3.243L15 15" />
    </svg>
);
const DocumentPlusIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);
const MagnifyingGlassIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);
const UserCircleIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const ChevronLeftIcon = ({ className="w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
);
const ChevronRightIcon = ({ className="w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
);
const ArrowUpTrayIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
);
const CheckCircleIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const XCircleIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

// --- HELPERS ---
const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

// --- API INTEGRATION & MOCK DATA ---
const API_BASE_URL = 'http://localhost:5210/api';

const mockJobs = [
    { id: 1, position: 'Senior React Developer', department: 'Technology', location: 'Noida, India', type: 'full-time', description: 'Seeking a skilled React dev to build amazing UIs.' },
    { id: 2, position: 'Node.js Engineer', department: 'Backend Services', location: 'Remote', type: 'full-time', description: 'Work on our core backend systems.' },
];
const mockRecruiterStats = {
    opportunities: { open: 42, closed: 128 },
    activeJobs: [
        { name: 'React Dev', applications: 78 },
        { name: 'Node.js Eng', applications: 45 },
        { name: 'QA Lead', applications: 22 },
        { name: 'UI/UX', applications: 51 },
    ],
    newPostings: 3,
};

const mockCandidates = [
    { id: 1, name: 'Aarav Sharma', role: 'Frontend Developer', experience: 5, ctc: 25, noticePeriod: 30, skills: ['React', 'TypeScript', 'Tailwind CSS'], email: 'aarav.s@example.com', phone: '9876543210', location: 'Noida, India', linkedIn: 'linkedin.com/in/aaravsharma' },
    { id: 2, name: 'Diya Patel', role: 'Backend Developer', experience: 8, ctc: 32, noticePeriod: 60, skills: ['Node.js', 'PostgreSQL', 'AWS'], email: 'diya.p@example.com', phone: '9876543211', location: 'Remote', linkedIn: 'linkedin.com/in/diyapatel' },
    { id: 3, name: 'Vihaan Singh', role: 'Full-Stack Developer', experience: 4, ctc: 22, noticePeriod: 45, skills: ['React', 'Node.js', 'MongoDB'], email: 'vihaan.s@example.com', phone: '9876543212', location: 'Gurgaon, India', linkedIn: 'linkedin.com/in/vihaansingh' },
];

const apiClient = {
    login: async (username, password) => {
        const response = await fetch(`${API_BASE_URL}/Auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Invalid credentials');
        }
        return response.json();
    },
    register: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/Auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        if (!response.ok) throw new Error(await response.text() || 'Registration failed');
        return response.json();
    },
    getDashboardData: async (token) => {
        const response = await fetch(`${API_BASE_URL}/Auth/dashboard`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (!response.ok) throw new Error('Failed to fetch dashboard data.');
        return response.json();
    },
    applyForJob: async (token, applicationData) => {
        const response = await fetch(`${API_BASE_URL}/Auth/apply`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(applicationData)
        });
        if (!response.ok) throw new Error('Failed to submit application.');
        return response.json();
    },
    saveCandidateProfile: async (token, candidateData, jdData) => {
        console.log("SAVING TO DB (simulated):", { candidate: candidateData, jobDescription: jdData });
        return new Promise(resolve => setTimeout(() => resolve({ success: true, message: "Candidate profile and JD saved.", data: {candidateData, jdData} }), 1000));
    },
    getRecruiterStats: async (token) => {
        await apiClient.getDashboardData(token);
        return new Promise(resolve => setTimeout(() => resolve(mockRecruiterStats), 1500));
    },
    getAvailableJobs: (token) => Promise.resolve(mockJobs),
    getCandidates: async (token) => {
        return new Promise(resolve => setTimeout(() => resolve(mockCandidates), 2000));
    }
};

    // --- REUSABLE UI COMPONENTS ---
import logo from './assets/agreeya-logo.png';
 
const Logo = () => (
<div className="flex items-start justify-center md:justify-start h-20 md:h-24">
<img src={logo} alt="Agreeya Logo" className="h-full w-auto object-contain" />
</div>
);

const FormField = ({ label, type, name, value, onChange, placeholder, required = true, readOnly = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input type={type} id={name} name={name} value={value} onChange={onChange} placeholder={placeholder}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:ring-blue-800 focus:border-blue-800 transition duration-150 ${readOnly ? 'bg-gray-100' : ''}`}
            required={required} readOnly={readOnly}
        />
    </div>
);
const TextAreaField = ({ label, name, value, onChange, placeholder, required = false, rows = 4 }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <textarea id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} rows={rows}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:ring-blue-800 focus:border-blue-800 transition duration-150"
        ></textarea>
    </div>
);

const Button = ({ children, onClick, type = "button", variant = "primary", isLoading = false, fullWidth = false, icon: Icon, className = '' }) => {
    const baseClasses = "font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform transform duration-150 ease-in-out shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
    const variantClasses = {
        primary: "bg-blue-800 text-white hover:bg-blue-900 focus:ring-blue-700",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    };
    return (
        <button type={type} onClick={onClick} disabled={isLoading} className={`${baseClasses} ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}>
            {isLoading && <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
            {!isLoading && Icon && <Icon className="w-5 h-5" />}
            {isLoading ? 'Processing...' : children}
        </button>
    );
};

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} transform transition-all animate-fade-in-up`} onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
                    <div>{children}</div>
                </div>
            </div>
        </div>
    );
};


const CardSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col animate-pulse">
        <div className="p-6 flex-grow">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div>
                    <div className="h-5 w-40 bg-gray-200 rounded-md mb-2"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center my-6 border-y py-4">
                <div><div className="h-4 w-20 mx-auto bg-gray-200 rounded"></div><div className="h-5 w-12 mx-auto bg-gray-200 rounded mt-2"></div></div>
                <div><div className="h-4 w-20 mx-auto bg-gray-200 rounded"></div><div className="h-5 w-12 mx-auto bg-gray-200 rounded mt-2"></div></div>
                <div><div className="h-4 w-20 mx-auto bg-gray-200 rounded"></div><div className="h-5 w-12 mx-auto bg-gray-200 rounded mt-2"></div></div>
            </div>
            <div className="space-y-3">
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                <div className="flex flex-wrap gap-2">
                    <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                    <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
                    <div className="h-5 w-24 bg-gray-200 rounded-full"></div>
                </div>
            </div>
        </div>
        <div className="bg-gray-50 p-4"><div className="h-9 w-full bg-gray-200 rounded-md"></div></div>
    </div>
);

const ToastContainer = ({ toasts }) => (
    <div className="fixed bottom-4 right-4 z-[100] space-y-3">
        {toasts.map(toast => {
            const colors = {
                success: 'bg-green-500',
                error: 'bg-red-500',
                info: 'bg-blue-500'
            };
            return (
                <div key={toast.id} className={`${colors[toast.type]} text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-up`}>
                    {toast.message}
                </div>
            )
        })}
    </div>
);

// --- PAGE COMPONENTS ---
const LandingPage = ({ setPage }) => (
    <div className="min-h-screen bg-white flex flex-col">
        <nav className="p-6"><Logo /></nav>
        <main className="flex-grow flex items-center justify-center p-6">
            <div className="container mx-auto flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 text-center md:text-left">
                    <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-4">Welcome to the <span className="text-blue-800">AgreeYa</span> Recruitment Portal</h1>
                    <p className="text-lg text-gray-600 mb-8">Connecting talent with opportunity. Streamlining the hiring process for recruiters and candidates alike.</p>
                    <Button onClick={() => setPage('auth')}>Login / Register</Button>
                </div>
                <div className="md:w-1/2">
                    <div className="relative w-full max-w-lg mx-auto">
                         <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                        <div className="absolute top-0 -right-4 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                        <div className="relative bg-white/60 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-200">
                           <img src="https://placehold.co/600x400/EBF4FF/0033A0?text=AgreeYa+Hiring&font=inter" alt="AgreeYa Hiring" className="rounded-lg shadow-lg"/>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
);

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


// --- DASHBOARD CONTAINER ---
const DashboardLayout = ({ user, onLogout, navItems, activeView, setActiveView, children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const NavLink = ({ itemKey, label, icon: Icon }) => (
        <a href="#" onClick={(e) => { e.preventDefault(); setActiveView(itemKey); setSidebarOpen(false); }} 
            className={`flex items-center gap-4 px-4 py-3 rounded-lg w-full text-left transition-all duration-300 ${activeView === itemKey ? 'bg-blue-800 text-white shadow-lg' : 'text-gray-600 hover:bg-blue-100 hover:text-blue-800'} ${isCollapsed ? 'justify-center' : ''}`} title={label}>
            <Icon className="w-6 h-6 flex-shrink-0"/>
            <span className={`whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'md:opacity-0 md:w-0' : 'md:opacity-100'}`}>{label}</span>
        </a>
    );
    
    return (
        <div className="min-h-screen flex bg-gray-50 text-gray-800">
            {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setSidebarOpen(false)}></div>}
            
            <aside className={`bg-white p-4 flex flex-col fixed top-0 left-0 h-full transform transition-all duration-300 ease-in-out z-40 shadow-2xl md:shadow-lg md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isCollapsed ? 'md:w-24' : 'md:w-64'}`}>
                <div className={`flex items-center mb-8 px-2 transition-all duration-300 ${isCollapsed ? 'justify-center' : 'justify-start'}`}><Logo /></div>
                <nav className="flex-grow flex flex-col gap-2">{navItems.map(item => <NavLink key={item.key} itemKey={item.key} label={item.label} icon={item.icon} />)}</nav>
                <div className="flex-shrink-0 mt-4">
                    <button onClick={() => setIsCollapsed(!isCollapsed)} className={`hidden md:flex items-center gap-4 px-4 py-3 rounded-lg w-full text-gray-600 hover:bg-blue-100 hover:text-blue-800 ${isCollapsed ? 'justify-center' : ''}`} title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
                        {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        <span className={`whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'md:opacity-0 md:w-0' : 'md:opacity-100'}`}>Collapse</span>
                    </button>
                </div>
            </aside>
            
            <div className="flex-1 flex flex-col">
                <header className="bg-white/80 backdrop-blur-lg shadow-sm p-4 flex justify-between items-center z-20 sticky top-0">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                    </button>
                    <div className="flex-1"></div>
                    <div className="flex items-center gap-4">
                        <span className="font-medium text-gray-700 hidden sm:block">Welcome, {user.fullName}</span>
                        <Button onClick={onLogout} variant="secondary">Logout</Button>
                    </div>
                </header>
                <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
};

// --- RECRUITER DASHBOARD ---
const RecruiterDashboard = ({ auth, onLogout, addToast }) => {
    const [activeView, setActiveView] = useState('stats');
    
    const navItems = [
        { key: 'stats', label: 'Dashboard', icon: UserGroupIcon },
        { key: 'jobPosting', label: 'New Job Posting', icon: DocumentPlusIcon },
        { key: 'cvLookup', label: 'CV Management', icon: MagnifyingGlassIcon },
        { key: 'employeeLookup', label: 'Employee Lookup', icon: UserCircleIcon },
    ];
    
    const views = {
        stats: { component: <RecruiterStatsView token={auth.token} /> },
        jobPosting: { component: <div>Job Posting Form (from JobDiva)</div> },
        cvLookup: { component: <CvManagementView token={auth.token} addToast={addToast} /> },
        employeeLookup: { component: <div>Employee Lookup (Dummy)</div> },
    };

    const activeLabel = navItems.find(item => item.key === activeView)?.label || 'Dashboard';
    
    return (
        <DashboardLayout user={auth.user} onLogout={onLogout} navItems={navItems} activeView={activeView} setActiveView={setActiveView}>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">{activeLabel}</h2>
            {views[activeView].component}
        </DashboardLayout>
    );
};

const DonutChart = ({ value, total, colorClass, size = 100 }) => {
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / total * circumference);

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                <circle className="text-gray-200" stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" r={radius} cx={size/2} cy={size/2}/>
                <circle className={colorClass} stroke="currentColor" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" fill="transparent" r={radius} cx={size/2} cy={size/2}/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-800">{value}</span>
            </div>
        </div>
    );
};

const BarChartCard = ({ data, title }) => {
    const maxValue = Math.max(...data.map(d => d.applications));
    return (
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">{title}</h3>
            <div className="flex justify-around items-end h-32">
                {data.map(item => (
                    <div key={item.name} className="flex flex-col items-center w-1/5">
                        <div className="bg-blue-800 w-full rounded-t-md transition-all duration-500" style={{ height: `${(item.applications / maxValue) * 100}%` }}></div>
                        <span className="text-xs text-gray-500 mt-2">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const RecruiterStatsView = ({ token }) => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState('');
    
    useEffect(() => {
        apiClient.getRecruiterStats(token)
            .then(setStats)
            .catch(err => {
                setError('Could not load dashboard stats. You may not have permission.');
                console.error(err);
            });
    }, [token]);
    
    if (error) return <div className="text-red-500">{error}</div>;
    if (!stats) return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(3)].map((_, i) => <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>)}
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Opportunities</h3>
                <DonutChart value={stats.opportunities.open} total={stats.opportunities.open + stats.opportunities.closed} colorClass="text-blue-800" size={120} />
                <p className="mt-4 text-gray-600">{stats.opportunities.open} Open / {stats.opportunities.open + stats.opportunities.closed} Total</p>
            </div>
            <BarChartCard data={stats.activeJobs} title="Top Active Jobs" />
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-center items-center">
                 <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">New Postings</p>
                <p className="text-6xl font-bold text-gray-800 mt-2">{stats.newPostings}</p>
                <p className="text-gray-500">this month</p>
            </div>
        </div>
    )
}

// --- CV MANAGEMENT ---
const CvManagementView = ({ token, addToast }) => {
    const [mode, setMode] = useState('lookup');
    const [parsedData, setParsedData] = useState(null);

    const handleUploadSuccess = (data) => {
        setParsedData(data);
        setMode('edit');
    };
    
    const handleReturnToLookup = () => {
        setParsedData(null);
        setMode('lookup');
    }

    return (
        <div className="space-y-6">
            <div className="flex border-b border-gray-200">
                <button onClick={() => setMode('lookup')} className={`px-4 py-2 text-sm font-medium transition-colors ${mode === 'lookup' ? 'border-b-2 border-blue-800 text-blue-800' : 'text-gray-500'}`}>Candidate Lookup</button>
                <button onClick={() => setMode('upload')} className={`px-4 py-2 text-sm font-medium transition-colors ${mode.startsWith('upload') || mode ==='edit' ? 'border-b-2 border-blue-800 text-blue-800' : 'text-gray-500'}`}>ATS Matcher</button>
            </div>

            {mode === 'lookup' && <CvLookupView token={token} />}
            {mode === 'upload' && <AtsCvUploader onUploadSuccess={handleUploadSuccess} />}
            {mode === 'edit' && <AtsEditorView token={token} initialData={parsedData} onCancel={handleReturnToLookup} addToast={addToast} />}
        </div>
    );
};

// --- ATS & CV UPLOADER VIEW (NEW) ---
const AtsCvUploader = ({ onUploadSuccess }) => {
    const [jdFile, setJdFile] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [error, setError] = useState('');
    const [isParsing, setIsParsing] = useState(false);

    const handleFileChange = (selectedFile, type) => {
        if (!selectedFile) return;
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        const ALLOWED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        setError('');
        if (selectedFile.size > MAX_SIZE) { setError(`File is too large (${type}). Max 5MB.`); return; }
        if (!ALLOWED_TYPES.includes(selectedFile.type)) { setError(`Invalid file type (${type}). Use PDF/DOC.`); return; }
        
        if (type === 'jd') setJdFile(selectedFile);
        if (type === 'resume') setResumeFile(selectedFile);
    };

    const handleParse = () => {
        if (!jdFile || !resumeFile) {
            setError('Please upload both a Job Description and a Resume.');
            return;
        }
        setIsParsing(true);
        setTimeout(() => {
            const parsedData = { 
                jd: {
                    title: 'Senior React Developer (Parsed)',
                    experience: '5+ years',
                    skills: 'React, JavaScript, TypeScript, Node.js, REST APIs, Agile',
                },
                resume: {
                    name: 'ARPIT VISHWAKARMA (Parsed)',
                    designation: 'Web Developer',
                    professionalExpertise: '• Experience in React.js, JavaScript (ES6+), HTML5, CSS3, and Tailwind CSS.\n• Experience in Node.js, Express.js, MongoDB, and RESTful API development.\n• Familiar with Redux, Firebase, CI/CD pipelines, and deployment on platforms like Vercel.',
                    technicalEnvironment: 'Languages: JavaScript, TypeScript, HTML5, CSS3\nWeb Technologies: React.js, Next.js, Node.js, Express.js, Tailwind CSS\nRDBMS: MongoDB, MySQL',
                    education: 'MCA, Pondicherry University, 2022-2024\nB.Sc (Hons) in Physics, Vivekananda Global University, 2019-2022',
                    skills: 'React, Node.js, MongoDB, Express.js, RESTful APIs, Tailwind CSS, Git, GitHub'
                }
            };
            onUploadSuccess(parsedData);
            setIsParsing(false);
        }, 2500);
    };

    const FileDropzone = ({ file, onFileChange, title, type }) => {
        const handleDragEvent = (e, isOver) => { e.preventDefault(); e.stopPropagation(); if (isOver) e.currentTarget.classList.add('border-blue-800'); else e.currentTarget.classList.remove('border-blue-800'); };
        const handleDrop = (e) => { handleDragEvent(e, false); if (e.dataTransfer.files && e.dataTransfer.files[0]) { onFileChange(e.dataTransfer.files[0], type); } };
        return (
            <div>
                 <h3 className="font-semibold text-lg mb-2 text-gray-700">{title}</h3>
                <div onDragOver={e => handleDragEvent(e, true)} onDragLeave={e => handleDragEvent(e, false)} onDrop={handleDrop} className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-800 transition-colors" onClick={() => document.getElementById(`${type}-upload-input`).click()}>
                    <ArrowUpTrayIcon className="mx-auto h-10 w-10 text-gray-400" />
                    {file ? (
                        <p className="mt-2 text-green-600 font-medium">{file.name}</p>
                    ) : (
                        <p className="mt-2 text-gray-600"><span className="font-semibold text-blue-800">Click to upload</span> or drag and drop</p>
                    )}
                     <p className="text-xs text-gray-500 mt-1">PDF or DOC, up to 5MB</p>
                    <input type="file" id={`${type}-upload-input`} className="hidden" onChange={(e) => onFileChange(e.target.files[0], type)} accept=".pdf,.doc,.docx" />
                </div>
            </div>
        );
    };
    
    return (
        <div className="bg-white p-8 rounded-lg shadow-lg animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FileDropzone file={jdFile} onFileChange={handleFileChange} title="Upload Job Description" type="jd"/>
                <FileDropzone file={resumeFile} onFileChange={handleFileChange} title="Upload Candidate Resume" type="resume"/>
            </div>
            {error && <p className="mt-4 text-center text-red-600">{error}</p>}
            {(jdFile && resumeFile) && (
                <div className="mt-8 text-center">
                    <Button onClick={handleParse} isLoading={isParsing}>Analyze & Match</Button>
                </div>
            )}
        </div>
    );
};

// --- ATS EDITOR VIEW (NEW) ---
const AtsEditorView = ({ token, initialData, onCancel, addToast }) => {
    const [jdData, setJdData] = useState(initialData.jd);
    const [resumeData, setResumeData] = useState(initialData.resume);
    const [atsScore, setAtsScore] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    
    const calculateAtsScore = useCallback(() => {
        const jdSkills = new Set((jdData.skills || '').toLowerCase().split(',').map(s => s.trim()).filter(Boolean));
        const resumeSkills = new Set((resumeData.skills || '').toLowerCase().split(',').map(s => s.trim()).filter(Boolean));
        if (jdSkills.size === 0) return 0;
        
        let matchCount = 0;
        resumeSkills.forEach(skill => {
            if (jdSkills.has(skill)) {
                matchCount++;
            }
        });
        
        const score = Math.round((matchCount / jdSkills.size) * 100);
        setAtsScore(score > 100 ? 100 : score);
    }, [jdData.skills, resumeData.skills]);

    useEffect(() => {
        calculateAtsScore();
    }, [calculateAtsScore]);

    const handleJdChange = (e) => setJdData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleResumeChange = (e) => setResumeData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    
    const handleValidate = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.saveCandidateProfile(token, resumeData, jdData);
            addToast({ type: 'success', message: response.message });
        } catch (error) {
            addToast({ type: 'error', message: error.message || "Failed to save data." });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDownload = () => {
         const resumeHtml = `<div style="font-family: Inter, sans-serif; color: #333;"><h1 style="font-size: 1.8rem; font-weight: bold; color: #0033A0; border-bottom: 2px solid #0033A0; padding-bottom: 5px; margin-bottom: 0;">${resumeData.name}</h1><p style="font-size: 1.2rem; font-weight: 500; color: #E31837; margin-top: 5px;">${resumeData.designation}</p><h2 style="font-size: 1.3rem; font-weight: bold; color: #0033A0; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin-top: 1.5rem;">Professional Expertise</h2><div style="font-size: 0.9rem; line-height: 1.6;">${(resumeData.professionalExpertise || '').replace(/\n/g, '<br/>')}</div><h2 style="font-size: 1.3rem; font-weight: bold; color: #0033A0; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin-top: 1.5rem;">Technical Environment</h2><div style="font-size: 0.9rem; line-height: 1.6;">${(resumeData.technicalEnvironment || '').replace(/\n/g, '<br/>')}</div><h2 style="font-size: 1.3rem; font-weight: bold; color: #0033A0; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin-top: 1.5rem;">Education & Certifications</h2><div style="font-size: 0.9rem; line-height: 1.6;">${(resumeData.education || '').replace(/\n/g, '<br/>')}</div></div>`;
        const blob = new Blob([resumeHtml], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${resumeData.name}_AgreeYa_Format.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addToast({ type: 'info', message: 'Downloading resume...' });
    };

    const scoreColor = atsScore > 75 ? 'text-green-500' : atsScore > 50 ? 'text-yellow-500' : 'text-red-500';

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg animate-fade-in space-y-8">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">ATS Matcher & Editor</h3>
                <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">ATS Score</p>
                    <p className={`text-5xl font-bold ${scoreColor}`}>{atsScore}%</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h4 className="font-semibold text-lg mb-2">Job Description Details</h4>
                    <div className="space-y-4 p-4 border rounded-md">
                        <FormField label="Job Title" name="title" value={jdData.title} onChange={handleJdChange} />
                        <FormField label="Required Experience" name="experience" value={jdData.experience} onChange={handleJdChange} />
                        <TextAreaField label="Required Skills (comma-separated)" name="skills" value={jdData.skills} onChange={handleJdChange} rows={4} />
                    </div>
                </div>
                 <div>
                    <h4 className="font-semibold text-lg mb-2">Candidate Resume Details</h4>
                    <div className="space-y-4 p-4 border rounded-md">
                        <FormField label="Full Name" name="name" value={resumeData.name} onChange={handleResumeChange} />
                        <FormField label="Designation" name="designation" value={resumeData.designation} onChange={handleResumeChange} />
                        <TextAreaField label="Candidate Skills (comma-separated)" name="skills" value={resumeData.skills} onChange={handleResumeChange} rows={4} />
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-end gap-4 items-center">
                <Button variant="secondary" onClick={onCancel}>Back</Button>
                <Button variant="secondary" onClick={handleDownload}>Download Resume</Button>
                <Button variant="success" icon={CheckCircleIcon} onClick={handleValidate} isLoading={isLoading}>Validate & Save</Button>
            </div>
        </div>
    );
};


// --- CV LOOKUP VIEW ---
const CandidateCard = ({ candidate, index, onViewProfile }) => (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out overflow-hidden border border-gray-100 flex flex-col animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
        <div className="p-6 flex-grow">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-bold text-2xl">{candidate.name.charAt(0)}</div>
                <div>
                    <h3 className="text-xl font-bold text-gray-800">{candidate.name}</h3>
                    <p className="text-blue-800 font-semibold">{candidate.role}</p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center my-6 border-y border-gray-100 py-4">
                <div><p className="text-sm text-gray-500">Experience</p><p className="font-bold text-lg text-gray-800">{candidate.experience} Yrs</p></div>
                <div><p className="text-sm text-gray-500">CTC</p><p className="font-bold text-lg text-gray-800">₹{candidate.ctc} LPA</p></div>
                <div><p className="text-sm text-gray-500">Notice</p><p className="font-bold text-lg text-gray-800">{candidate.noticePeriod} Days</p></div>
            </div>
            <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600">Top Skills:</p>
                <div className="flex flex-wrap gap-2">{candidate.skills.slice(0, 3).map(skill => (<span key={skill} className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">{skill}</span>))}</div>
            </div>
        </div>
        <div className="bg-gray-50 p-4"><Button fullWidth variant="primary" onClick={() => onViewProfile(candidate)}>View Profile</Button></div>
    </div>
);

const CandidateProfileModal = ({ candidate, onClose }) => {
    if (!candidate) return null;
    return (
        <Modal isOpen={!!candidate} onClose={onClose} title="Candidate Profile" size="2xl">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0 text-center">
                    <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-bold text-5xl mx-auto">
                        {candidate.name.charAt(0)}
                    </div>
                    <h2 className="text-2xl font-bold mt-4 text-gray-800">{candidate.name}</h2>
                    <p className="text-blue-800 font-semibold">{candidate.role}</p>
                </div>
                <div className="flex-grow">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Email</p>
                            <p className="font-semibold">{candidate.email}</p>
                        </div>
                         <div>
                            <p className="text-gray-500">Phone</p>
                            <p className="font-semibold">{candidate.phone}</p>
                        </div>
                         <div>
                            <p className="text-gray-500">Location</p>
                            <p className="font-semibold">{candidate.location}</p>
                        </div>
                         <div>
                            <p className="text-gray-500">LinkedIn</p>
                            <a href={`https://${candidate.linkedIn}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">{candidate.linkedIn}</a>
                        </div>
                    </div>
                    <hr className="my-4"/>
                    <h4 className="font-bold text-lg mb-2 text-gray-800">Top Skills</h4>
                    <div className="flex flex-wrap gap-2">
                        {candidate.skills.map(skill => (
                            <span key={skill} className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">{skill}</span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-6 flex justify-end">
                <Button variant="secondary" onClick={onClose}>Close</Button>
            </div>
        </Modal>
    );
};


const CvLookupView = ({ token }) => {
    const [allCandidates, setAllCandidates] = useState([]);
    const [filteredCandidates, setFilteredCandidates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ experience: 'all', role: 'all' });
    const [viewingCandidate, setViewingCandidate] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        apiClient.getCandidates(token).then(data => {
            setAllCandidates(data);
            setFilteredCandidates(data);
            setIsLoading(false);
        });
    }, [token]);
    
    useEffect(() => {
        let result = allCandidates;
        if (searchTerm) { result = result.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))); }
        if (filters.experience !== 'all') { const minExp = parseInt(filters.experience, 10); result = result.filter(c => c.experience >= minExp); }
        if (filters.role !== 'all') { result = result.filter(c => c.role === filters.role); }
        setFilteredCandidates(result);
    }, [searchTerm, filters, allCandidates]);

    const handleFilterChange = (e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const uniqueRoles = [...new Set(allCandidates.map(c => c.role))];

    return (<>
        <CandidateProfileModal candidate={viewingCandidate} onClose={() => setViewingCandidate(null)} />
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="relative md:col-span-1">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Search by name or skill..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-800 focus:border-blue-800 bg-white"/>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:col-span-2">
                     <select name="experience" onChange={handleFilterChange} value={filters.experience} className="w-full bg-white px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-800 focus:border-blue-800">
                        <option value="all">All Experience Levels</option><option value="2">2+ Years</option><option value="5">5+ Years</option><option value="8">8+ Years</option><option value="10">10+ Years</option>
                    </select>
                    <select name="role" onChange={handleFilterChange} value={filters.role} className="w-full bg-white px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-800 focus:border-blue-800">
                        <option value="all">All Roles</option>
                        {uniqueRoles.map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                </div>
            </div>

            {isLoading ? (
                 <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
                    {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
                </div>
            ) : filteredCandidates.length > 0 ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
                    {filteredCandidates.map((candidate, index) => (<CandidateCard key={candidate.id} candidate={candidate} index={index} onViewProfile={setViewingCandidate} />))}
                </div>
            ) : (<div className="text-center py-12 bg-white rounded-lg shadow-sm"><p className="text-gray-500">No candidates found.</p></div>)}
        </div>
    </>);
};


// --- CANDIDATE DASHBOARD ---
const CandidateDashboard = ({ auth, onLogout, addToast }) => {
    const [profileComplete, setProfileComplete] = useState(auth.user.profileComplete || false);

    if (!profileComplete) {
        return <CandidateOnboarding onComplete={() => setProfileComplete(true)} addToast={addToast} />;
    }

    const [activeView, setActiveView] = useState('jobs');
    const [selectedJob, setSelectedJob] = useState(null);

    const handleApply = (job) => { setSelectedJob(job); setActiveView('apply'); };
    
    const navItems = [
        { key: 'jobs', label: 'Available Jobs', icon: MagnifyingGlassIcon },
        { key: 'apply', label: 'Apply for Job', icon: DocumentPlusIcon, requiresJob: true },
        { key: 'applications', label: 'My Applications', icon: BriefcaseIcon },
    ].filter(item => !item.requiresJob || (item.requiresJob && selectedJob));

    const views = {
        jobs: { component: <CandidateJobsView token={auth.token} onApply={handleApply} /> },
        apply: { component: <ApplyJobView token={auth.token} job={selectedJob} /> },
        applications: { component: <div>My Applications List</div> },
    };

    let activeLabel = (activeView === 'apply' && selectedJob) ? `Apply: ${selectedJob.position}` : navItems.find(item => item.key === activeView)?.label || 'Dashboard';
    
    return (
        <DashboardLayout user={auth.user} onLogout={onLogout} navItems={navItems} activeView={activeView} setActiveView={setActiveView}>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">{activeLabel}</h2>
            {views[activeView].component}
        </DashboardLayout>
    );
};

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


const CandidateJobsView = ({ token, onApply }) => {
    const [jobs, setJobs] = useState([]);
    useEffect(() => { apiClient.getAvailableJobs(token).then(setJobs); }, [token]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Job Title</th>
                            <th scope="col" className="px-6 py-3">Department</th>
                            <th scope="col" className="px-6 py-3">Location</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map(job => (
                             <tr key={job.id} className="bg-white border-b hover:bg-gray-50">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{job.position}</th>
                                <td className="px-6 py-4">{job.department}</td>
                                <td className="px-6 py-4">{job.location}</td>
                                <td className="px-6 py-4 text-center">
                                     <Button onClick={() => onApply(job)}>Apply</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

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

// --- MAIN APP ---
export default function App() {
    const [page, setPage] = useState('loading');
    const [auth, setAuth] = useState(null);
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        try {
            const savedAuth = localStorage.getItem('auth');
            if (savedAuth) { setAuth(JSON.parse(savedAuth)); } 
            else { setPage('landing'); }
        } catch (error) {
            console.error("Could not parse saved auth data", error);
            setPage('landing');
        }
    }, []);

    useEffect(() => {
        try {
            if (auth && auth.token && auth.user) {
                localStorage.setItem('auth', JSON.stringify(auth));
                setPage('dashboard');
            } else {
                localStorage.removeItem('auth');
                if(page !== 'auth') { setPage('landing'); }
            }
        } catch(error) {
            console.error("Could not update auth in localStorage", error);
        }
    }, [auth, page]);

    const addToast = (toast) => {
        const id = Date.now();
        setToasts(prev => [...prev, { ...toast, id }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);
    };

    const handleLogout = () => { setAuth(null); };

    return (
        <>
            <ToastContainer toasts={toasts} />
            {(() => {
                if (page === 'loading') return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
                if (page === 'landing') return <LandingPage setPage={setPage} />;
                if (page === 'auth') return <AuthPage setAuth={setAuth} />;
                if (page === 'dashboard' && auth) {
                    const userRole = auth.user.role;
                    if (userRole === 'Admin' || userRole === 'SuperAdmin') {
                        return <RecruiterDashboard auth={auth} onLogout={handleLogout} addToast={addToast} />;
                    }
                    if (userRole === 'User') {
                        return <CandidateDashboard auth={auth} onLogout={handleLogout} addToast={addToast}/>;
                    }
                    return (
                        <div className="min-h-screen flex flex-col items-center justify-center">
                            <p>You are logged in but your role '{userRole}' does not have a dashboard.</p>
                            <Button onClick={handleLogout} variant="secondary">Logout</Button>
                        </div>
                    );
                }
                return <LandingPage setPage={setPage} />;
            })()}
        </>
    );
}

