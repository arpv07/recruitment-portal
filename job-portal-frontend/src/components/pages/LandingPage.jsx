import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import Logo from "../ui/Logo";

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <nav className="p-6"><Logo /></nav>
            <main className="flex-grow flex items-center justify-center p-6">
                <div className="container mx-auto flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2 text-center md:text-left">
                        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                            Welcome to the <span className="text-blue-800">AgreeYa</span> Recruitment Portal
                        </h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Connecting talent with opportunity. Streamlining the hiring process for recruiters and candidates alike.
                        </p>
                        <Button onClick={() => navigate("/auth")}>Login / Register</Button>
                    </div>
                    <div className="md:w-1/2">
                        <div className="relative w-full max-w-lg mx-auto">
                            <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                            <div className="absolute top-0 -right-4 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                            <div className="relative bg-white/60 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-200">
                                <img
                                    src="https://placehold.co/600x400/EBF4FF/0033A0?text=AgreeYa+Hiring&font=inter"
                                    alt="AgreeYa Hiring"
                                    className="rounded-lg shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;