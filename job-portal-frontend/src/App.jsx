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

// --- HELPERS ---
const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

// --- API INTEGRATION ---
const API_BASE_URL = 'http://localhost:5210/api'; // Corrected port from CORS error

const mockJobs = [
    { id: 1, position: 'Senior React Developer', department: 'Technology', location: 'Noida, India', type: 'full-time', description: 'Seeking a skilled React dev to build amazing UIs.' },
    { id: 2, position: 'Node.js Engineer', department: 'Backend Services', location: 'Remote', type: 'full-time', description: 'Work on our core backend systems.' },
    { id: 3, position: 'Lead QA Engineer', department: 'Quality Assurance', location: 'Noida, India', type: 'full-time', description: 'Lead our QA team to success.' },
];
const mockRecruiterStats = { currentOpportunities: 12, activeRequirements: 5, newPostings: 3 };

const api = {
    login: async (username, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
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
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Registration failed');
        }
        return response.json();
    },
    // Mocked for now, replace with real API calls later
    getRecruiterStats: () => new Promise(resolve => setTimeout(() => resolve(mockRecruiterStats), 500)),
    getAvailableJobs: () => new Promise(resolve => setTimeout(() => resolve(mockJobs), 1000)),
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
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-800 focus:border-blue-800 transition duration-150 ${readOnly ? 'bg-gray-100' : ''}`}
            required={required} readOnly={readOnly}
        />
    </div>
);

const Button = ({ children, onClick, type = "button", variant = "primary", isLoading = false, fullWidth = false, icon: Icon }) => {
    const baseClasses = "font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform transform duration-150 ease-in-out shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
    const variantClasses = {
        primary: "bg-blue-800 text-white hover:bg-blue-900 focus:ring-blue-700",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
    };
    return (
        <button type={type} onClick={onClick} disabled={isLoading} className={`${baseClasses} ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''}`}>
            {isLoading && <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
            {!isLoading && Icon && <Icon />}
            {isLoading ? 'Processing...' : children}
        </button>
    );
};


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
        username: '', 
        password: '', 
        fullName: '', 
        email: '', 
        phone: '', 
        linkedInUrl: '', 
        location: '' 
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            let response;
            if (isLogin) {
                const { username, password } = formData;
                response = await api.login(username, password);
            } else {
                response = await api.register(formData);
            }
            
            // Decode the token to get the role
            const decodedToken = parseJwt(response.token);
            const role = decodedToken ? decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] : 'User';

            // Combine user data from response with the role from the token
            const authPayload = {
                token: response.token,
                user: {
                    ...response.user,
                    role: role
                }
            };
            
            setAuth(authPayload);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg space-y-6">
                <div className="flex justify-center"><Logo /></div>
                <h2 className="text-center text-2xl font-bold text-gray-900">{isLogin ? 'Login to your account' : 'Create an Account'}</h2>
                
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert"><span className="block sm:inline">{error}</span></div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <>
                            <FormField label="Full Name" type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" />
                            <FormField label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" />
                        </>
                    )}
                    <FormField label="Username" type="text" name="username" value={formData.username} onChange={handleChange} placeholder="johndoe" />
                    <FormField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" />
                    {!isLogin && (
                        <>
                            <FormField label="Phone Number" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91-9876543210" />
                            <FormField label="LinkedIn Profile URL" type="url" name="linkedInUrl" value={formData.linkedInUrl} onChange={handleChange} placeholder="https://linkedin.com/in/..." required={false} />
                            <FormField label="Location" type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Noida, India" />
                        </>
                    )}
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
const DashboardLayout = ({ user, onLogout, navLinks, children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className="min-h-screen flex bg-gray-100">
            <aside className={`bg-white w-64 p-6 space-y-8 fixed top-0 left-0 h-full transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-30 shadow-lg md:shadow-none`}>
                <Logo />
                <nav className="flex flex-col gap-2">{navLinks}</nav>
            </aside>
            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow-sm p-4 flex justify-between items-center z-10">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                    </button>
                    <div/>
                    <div className="flex items-center gap-4">
                        <span className="font-medium">Welcome, {user.fullName}</span>
                        <Button onClick={onLogout} variant="secondary">Logout</Button>
                    </div>
                </header>
                <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}

// --- RECRUITER DASHBOARD ---
const RecruiterDashboard = ({ auth, onLogout }) => {
    const [activeView, setActiveView] = useState('stats');
    const views = {
        stats: { label: 'Dashboard', component: <RecruiterStatsView />, icon: UserGroupIcon },
        jobPosting: { label: 'New Job Posting', component: <div>Job Posting Form (from JobDiva)</div>, icon: DocumentPlusIcon },
        cvLookup: { label: 'CV Lookup', component: <div>CV Lookup Interface</div>, icon: MagnifyingGlassIcon },
        employeeLookup: { label: 'Employee Lookup', component: <div>Employee Lookup (Dummy)</div>, icon: UserCircleIcon },
    };
    
    const NavLink = ({ viewKey }) => {
        const Icon = views[viewKey].icon;
        return (
            <button onClick={() => setActiveView(viewKey)} className={`flex items-center gap-4 px-4 py-3 rounded-md w-full text-left transition-colors duration-200 ${activeView === viewKey ? 'bg-blue-800 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}>
                <Icon className="w-5 h-5"/><span>{views[viewKey].label}</span>
            </button>
        );
    };

    return (
        <DashboardLayout user={auth.user} onLogout={onLogout} navLinks={Object.keys(views).map(key => <NavLink key={key} viewKey={key} />)}>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">{views[activeView].label}</h2>
            {views[activeView].component}
        </DashboardLayout>
    );
};

const RecruiterStatCard = ({ title, count, icon, color }) => (
    <div className={`bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-t-4 ${color}`}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-500">{title}</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">{count}</p>
            </div>
            {icon}
        </div>
    </div>
);

const RecruiterStatsView = () => {
    const [stats, setStats] = useState(null);
    useEffect(() => { api.getRecruiterStats().then(setStats); }, []);
    if (!stats) return <div>Loading...</div>
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RecruiterStatCard title="Current Opportunities" count={stats.currentOpportunities} icon={<BriefcaseIcon className="w-8 h-8 text-blue-800"/>} color="border-blue-800"/>
            <RecruiterStatCard title="Active Job Requirements" count={stats.activeRequirements} icon={<DocumentPlusIcon className="w-8 h-8 text-red-600"/>} color="border-red-600"/>
            <RecruiterStatCard title="New Postings This Week" count={stats.newPostings} icon={<MagnifyingGlassIcon className="w-8 h-8 text-gray-500"/>} color="border-gray-500"/>
        </div>
    )
}

// --- CANDIDATE DASHBOARD ---
const CandidateDashboard = ({ auth, onLogout }) => {
    const [activeView, setActiveView] = useState('jobs');
    const [selectedJob, setSelectedJob] = useState(null);

    const handleApply = (job) => {
        setSelectedJob(job);
        setActiveView('apply');
    };

    const views = {
        jobs: { label: 'Available Jobs', component: <CandidateJobsView onApply={handleApply} />, icon: MagnifyingGlassIcon },
        apply: { label: `Apply: ${selectedJob?.position || ''}`, component: <ApplyJobView job={selectedJob} />, icon: DocumentPlusIcon },
        applications: { label: 'My Applications', component: <div>My Applications List</div>, icon: BriefcaseIcon },
    };

    const NavLink = ({ viewKey }) => {
        if (viewKey === 'apply' && !selectedJob) return null;
        const Icon = views[viewKey].icon;
        return (
            <button onClick={() => setActiveView(viewKey)} className={`flex items-center gap-4 px-4 py-3 rounded-md w-full text-left transition-colors duration-200 ${activeView === viewKey ? 'bg-blue-800 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}>
                <Icon className="w-5 h-5"/><span>{views[viewKey].label}</span>
            </button>
        );
    }
    
    return (
        <DashboardLayout user={auth.user} onLogout={onLogout} navLinks={Object.keys(views).map(key => <NavLink key={key} viewKey={key} />)}>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">{views[activeView].label}</h2>
            {views[activeView].component}
        </DashboardLayout>
    );
};

const CandidateJobsView = ({ onApply }) => {
    const [jobs, setJobs] = useState([]);
    useEffect(() => { api.getAvailableJobs().then(setJobs) }, []);

    return (
        <div className="space-y-6">
            {jobs.map(job => (
                <div key={job.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-blue-800">{job.position}</h3>
                            <p className="text-gray-600">{job.department} - {job.location}</p>
                            <p className="mt-2 text-sm text-gray-500">{job.description}</p>
                        </div>
                        <Button onClick={() => onApply(job)}>Apply Now</Button>
                    </div>
                </div>
            ))}
        </div>
    )
}

const ApplyJobView = ({ job }) => {
    const [isParsing, setIsParsing] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', skills: '', ctc: '', notes: ''
    });
    const resumeEditorRef = useRef(null);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleFileChange = (e) => {
        if (!e.target.files[0]) return;
        setIsParsing(true);
        setTimeout(() => {
            const parsed = {
                name: "Amit Kumar (from resume)",
                email: "amit.k@example.com",
                phone: "9876543210",
                skills: "React, Node.js, MongoDB",
                ctc: '',
                notes: ''
            };
            setFormData(parsed);
            if(resumeEditorRef.current) {
                resumeEditorRef.current.innerHTML = `
                    <h2 style="font-size: 1.5rem; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-bottom: 8px;">${parsed.name}</h2>
                    <p><strong>Email:</strong> ${parsed.email} | <strong>Phone:</strong> ${parsed.phone}</p>
                    <h3 style="font-size: 1.2rem; font-weight: bold; margin-top: 12px;">Skills</h3>
                    <p>${parsed.skills}</p>
                    <h3 style="font-size: 1.2rem; font-weight: bold; margin-top: 12px;">Experience</h3>
                    <p><em>(Experience details from resume would go here...)</em></p>
                `;
            }
            setIsParsing(false);
        }, 2000);
    };

    if (!job) return <div>Please select a job to apply for.</div>

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="mb-6 pb-4 border-b">
                <label className="block text-lg font-medium text-gray-800 mb-2">Upload Resume to Auto-fill</label>
                <input type="file" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-800 hover:file:bg-blue-100" />
                {isParsing && <p className="text-blue-800 mt-2 animate-pulse">Parsing your resume...</p>}
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-700">Application Form</h3>
                    <FormField label="Full Name" name="name" value={formData.name} onChange={handleChange} readOnly={!!formData.name}/>
                    <FormField label="Email" name="email" value={formData.email} onChange={handleChange} readOnly={!!formData.email}/>
                    <FormField label="Contact Number" name="phone" value={formData.phone} onChange={handleChange} readOnly={!!formData.phone}/>
                    <FormField label="Key Skills (from resume)" name="skills" value={formData.skills} onChange={handleChange} readOnly={!!formData.skills}/>
                    <FormField label="Current CTC (in LPA)" name="ctc" placeholder="e.g., 12.5" required={true} value={formData.ctc} onChange={handleChange}/>
                    <FormField label="Anything else you want to add?" name="notes" required={false} value={formData.notes} onChange={handleChange}/>
                    <Button type="submit" isLoading={isParsing}>Submit Application</Button>
                </div>

                <div>
                     <h3 className="text-xl font-semibold text-gray-700 mb-2">Your Resume (AgreeYa Format)</h3>
                     <p className="text-sm text-gray-500 mb-4">This is an editable preview. Make any changes before submitting.</p>
                     <div ref={resumeEditorRef} contentEditable={true} className="h-96 border rounded-md p-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-800 overflow-y-auto">
                        {!formData.name && <p className="text-gray-400">Your parsed resume will appear here...</p>}
                     </div>
                </div>
            </form>
        </div>
    )
}

// --- MAIN APP ---
export default function App() {
    const [page, setPage] = useState('loading'); // Start with loading state
    const [auth, setAuth] = useState(null);

    // Check for saved session on initial load
    useEffect(() => {
        try {
            const savedAuth = localStorage.getItem('auth');
            if (savedAuth) {
                setAuth(JSON.parse(savedAuth));
            } else {
                setPage('landing');
            }
        } catch (error) {
            console.error("Could not parse saved auth data", error);
            setPage('landing');
        }
    }, []);

    // Navigate based on auth state and save to local storage
    useEffect(() => {
        if (auth && auth.token && auth.user) {
            localStorage.setItem('auth', JSON.stringify(auth));
            setPage('dashboard');
        } else {
            localStorage.removeItem('auth');
            if(page !== 'auth') {
               setPage('landing');
            }
        }
    }, [auth, page]);

    const handleLogout = () => {
        setAuth(null);
    };

    if (page === 'loading') return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (page === 'landing') return <LandingPage setPage={setPage} />;
    if (page === 'auth') return <AuthPage setAuth={setAuth} />;
    
    if (page === 'dashboard' && auth) {
        // Route to dashboards based on backend roles
        const userRole = auth.user.role;
        if (userRole === 'Admin' || userRole === 'SuperAdmin') {
            return <RecruiterDashboard auth={auth} onLogout={handleLogout} />;
        }
        if (userRole === 'User') {
            return <CandidateDashboard auth={auth} onLogout={handleLogout} />;
        }
        // Fallback for any other roles
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p>You are logged in but your role '{userRole}' does not have a dashboard.</p>
                <Button onClick={handleLogout} variant="secondary">Logout</Button>
            </div>
        );
    }
    
    return <LandingPage setPage={setPage} />;
}

