
import { CheckCircleIcon } from "./Icons";

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

export default Button
