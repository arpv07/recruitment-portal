import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeftIcon, ChevronRightIcon } from "../ui/Icons";
import { Logo } from "../ui/Logo";
import Button from "../ui/Button";
import { logout } from "../../store/authSlice";


const DashboardLayout = ({
  navItems,
  activeView,
  setActiveView,
  children
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
      dispatch(logout());
  }

  const NavLink = ({ itemKey, label, icon: Icon }) => (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        setActiveView?.(itemKey);
        setSidebarOpen(false);
      }}
      className={`flex items-center gap-4 px-4 py-3 rounded-lg w-full text-left transition-all duration-300 ${
        activeView === itemKey
          ? "bg-blue-800 text-white shadow-lg"
          : "text-gray-600 hover:bg-blue-100 hover:text-blue-800"
      } ${isCollapsed ? "justify-center" : ""}`}
      title={label}
    >
      <Icon className="w-6 h-6 flex-shrink-0" />
      <span
        className={`whitespace-nowrap transition-opacity duration-200 ${
          isCollapsed ? "md:opacity-0 md:w-0" : "md:opacity-100"
        }`}
      >
        {label}
      </span>
    </a>
  );

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-800">
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`bg-white p-4 flex flex-col fixed top-0 left-0 h-full transform transition-all duration-300 ease-in-out z-40 shadow-2xl md:shadow-lg md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? "md:w-24" : "md:w-64"}`}
      >
        <div
          className={`flex items-center mb-8 px-2 transition-all duration-300 ${
            isCollapsed ? "justify-center" : "justify-start"
          }`}
        >
          <Logo />
        </div>

        <nav className="flex-grow flex flex-col gap-2">
          {navItems && navItems.map((item) => (
            <NavLink key={item.key} itemKey={item.key} label={item.label} icon={item.icon} />
          ))}
        </nav>

        {/* Collapse Button */}
        <div className="flex-shrink-0 mt-4">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden md:flex items-center gap-4 px-4 py-3 rounded-lg w-full text-gray-600 hover:bg-blue-100 hover:text-blue-800 ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            <span
              className={`whitespace-nowrap transition-opacity duration-200 ${
                isCollapsed ? "md:opacity-0 md:w-0" : "md:opacity-100"
              }`}
            >
              Collapse
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white/80 backdrop-blur-lg shadow-sm p-4 flex justify-between items-center z-20 sticky top-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
          >
            {/* Menu Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-700 hidden sm:block">
              Welcome, {user?.fullName || "User"}
            </span>
            <Button onClick={handleLogout} variant="secondary">
              Logout
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;