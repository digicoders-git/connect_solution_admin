// dash/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
// import DPsize from "../assets/DPsize.jpg";
import dummy from "../assets/dummy.png";
import { useDarkMode } from "../DarkModeContext.jsx";
import API from "../api/api";
import { Button } from "@chakra-ui/react";
import Swal from "sweetalert2";

const icons = {
  dashboard: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12h6v9H3v-9zM9 3h6v18H9V3zM15 8h6v13h-6V8z"
      />
    </svg>
  ),
  Contacts: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5
           a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
      />

      <line x1="8" y1="9" x2="16" y2="9" />
      <line x1="8" y1="13" x2="14" y2="13" />
    </svg>
  ),
  jobApplications: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
  profile: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),

  logout: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"
      />
    </svg>
  ),
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile overlay
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // compact view (icons only)

  const location = useLocation();
  const navigate = useNavigate();

  const { darkMode, setDarkMode } = useDarkMode(); // global
  const [time, setTime] = useState(new Date());
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        // console.log("Fetching admin data...");
        const res = await API.get(import.meta.env.VITE_BASE_URL + "/admin/get");
        setAdmin(res.data.data[0]);
      } catch (error) {
        // console.error("Failed to fetch admin data", error);
      }
    };
    fetchAdmin();

    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const sidebarButtons = [
    {
      id: "dashboard",
      to: "/dashboard",
      label: "Dashboard",
      icon: icons.dashboard,
    },
    {
      id: "contacts",
      to: "/contacts",
      label: "Contacts",
      icon: icons.Contacts,
    },
    {
      id: "jobApplications",
      to: "/job-applications",
      label: "Job Applications",
      icon: icons.jobApplications,
    },
    { id: "profile", to: "/profile", label: "Profile", icon: icons.profile },
  ];

  const navLinkClass = ({ isActive }) => {
    // base classes
    const base =
      "flex items-center gap-3 mb-2 px-3 py-2 rounded-lg transition-all duration-150 text-sm relative overflow-hidden";
    if (isActive) {
      // active: left accent + bold
      return `${base} ${
        darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"
      } font-semibold before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-r before:${
        darkMode ? "bg-indigo-400" : "bg-indigo-600"
      }`;
    } else {
      // not active
      return `${base} ${
        darkMode
          ? "text-gray-300 hover:bg-gray-800 hover:text-white"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`;
    }
  };

  const doLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
      zIndex: 9999,
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          localStorage.removeItem("authToken");
          localStorage.removeItem("authUser");
        } catch (e) {
          // console.warn("Error clearing localStorage on logout", e);
        }
        navigate("/login", { replace: true });

        setSidebarOpen(false);
      }
    });
  };

  return (
    <div
      className={`flex min-h-screen ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 transform transition-all duration-200 ease-in-out ${
          sidebarCollapsed ? "w-20" : "w-64"
        } ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
        style={{ padding: sidebarCollapsed ? "1rem 0.5rem" : undefined }}
        aria-hidden={
          !sidebarOpen &&
          typeof window !== "undefined" &&
          window.innerWidth < 768
        }
      >
        <div
          className={`flex flex-col h-full ${
            sidebarCollapsed ? "items-center" : "items-stretch"
          } px-4 py-6 ${
            darkMode
              ? "bg-linear-to-b from-gray-800 to-gray-900 text-gray-100"
              : "bg-white text-gray-900 shadow-md"
          } border-r ${darkMode ? "border-gray-700" : "border-gray-100"}`}
        >
          <div
            className={`flex items-center ${
              sidebarCollapsed ? "flex-col gap-3" : "justify-between mb-6"
            }`}
          >
            <div
              className={`flex items-center ${
                sidebarCollapsed ? "justify-center" : "gap-3"
              }`}
            >
              <h2
                className={`text-2xl font-bold tracking-tight text-center ${
                  sidebarCollapsed ? "hidden" : ""
                } ${darkMode ? "text-gray-100" : "text-gray-900"}`}
              >
                Admin Panel
              </h2>
            </div>

            <button
              aria-label={
                sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
              onClick={() => setSidebarCollapsed((s) => !s)}
              className={`ml-auto md:ml-0 p-2 rounded ${
                darkMode
                  ? "text-gray-300 hover:text-white hover:bg-gray-800/60"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
              title={sidebarCollapsed ? "Expand" : "Collapse"}
            >
              {sidebarCollapsed ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M13.293 15.707a1 1 0 010-1.414L15.586 12H4a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.707 4.293a1 1 0 010 1.414L4.414 8H16a1 1 0 110 2H4.414l2.293 2.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col grow mt-2">
            {sidebarButtons.map((btn) => (
              <NavLink key={btn.id} to={btn.to} className={navLinkClass}>
                <div className="flex items-center gap-3 w-full">
                  <div
                    className={`${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    } shrink-0`}
                  >
                    {btn.icon}
                  </div>
                  <span className={`${sidebarCollapsed ? "hidden" : "block"}`}>
                    {btn.label}
                  </span>
                </div>
              </NavLink>
            ))}
          </nav>

          {/* Bottom area: copyright + logout */}
          <div className="mt-6">
            <div
              className={`text-center text-xs mb-3 ${
                sidebarCollapsed ? "hidden" : ""
              } ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              &copy; 2025 Designed & Developed by{" "}
              <a
                href="https://digicoders.in"
                target="_blank"
                rel="noopener noreferrer"
              >
                #TeamDigiCoders
              </a>
            </div>

            <Button
              onClick={doLogout}
              colorScheme="red"
              variant="solid"
              width="full"
              justifyContent={sidebarCollapsed ? "center" : "flex-start"}
              leftIcon={icons.logout}
              mb={2}
            >
              {!sidebarCollapsed && "Logout"}
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          className={`fixed inset-0 z-30 md:hidden ${
            darkMode ? "bg-black/60" : "bg-black/40"
          }`}
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div
        className={`flex-1 ${
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        } min-h-screen flex flex-col transition-all w-[80%]`}
      >
        {/* Topbar */}
        <header
          className={`fixed top-0 right-0 z-20 px-4 py-3 border-b flex items-center justify-between backdrop-blur-sm transition-all duration-200 left-0 ${
            sidebarCollapsed ? "md:left-20" : "md:left-64"
          } ${
            darkMode
              ? "bg-gray-900/80 border-gray-800"
              : "bg-white/80 border-gray-100"
          }`}
        >
          <div className="flex items-center gap-3">
            {/* hamburger for mobile */}
            <button
              className={`md:hidden p-2 rounded-md ${
                darkMode ? "hover:bg-gray-800/60" : "hover:bg-gray-100"
              }`}
              onClick={() => setSidebarOpen((s) => !s)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div>
              <h1
                className={`text-lg md:text-2xl font-semibold ${
                  darkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Admin Panel
              </h1>
              <p
                className={`mt-0.5 hidden sm:block text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Welcome back,{" "}
                <span className="font-medium">{admin?.name || "Admin"}</span>
              </p>
            </div>
          </div>

          {/* Centered Clock */}
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 font-mono text-lg font-bold hidden md:block ${
              darkMode ? "text-indigo-400" : "text-indigo-600"
            }`}
          >
            {time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </div>

          <div className="relative flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode((d) => !d)}
              aria-label="Toggle dark mode"
              title={darkMode ? "Switch to light" : "Switch to dark"}
              className={`p-2 rounded-md border ${
                darkMode ? "border-gray-700" : "border-gray-200"
              } shadow-sm`}
            >
              {darkMode ? (
                // sun icon
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="5"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <line
                    x1="12"
                    y1="1"
                    x2="12"
                    y2="4"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <line
                    x1="12"
                    y1="20"
                    x2="12"
                    y2="23"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <line
                    x1="4.22"
                    y1="4.22"
                    x2="6.34"
                    y2="6.34"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <line
                    x1="17.66"
                    y1="17.66"
                    x2="19.78"
                    y2="19.78"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <line
                    x1="1"
                    y1="12"
                    x2="4"
                    y2="12"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <line
                    x1="20"
                    y1="12"
                    x2="23"
                    y2="12"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <line
                    x1="4.22"
                    y1="19.78"
                    x2="6.34"
                    y2="17.66"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <line
                    x1="17.66"
                    y1="6.34"
                    x2="19.78"
                    y2="4.22"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                </svg>
              ) : (
                // moon icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>
            <div className="flex items-center gap-2">
              <img
                src={admin?.profilePhoto || dummy}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-gray-200 object-cover"
              />
              <span
                className={`hidden md:block font-medium ${
                  darkMode ? "text-gray-100" : "text-gray-800"
                }`}
              >
                {admin?.name || "Admin"}
              </span>
            </div>
          </div>
        </header>

        {/* page content */}
        <main className="p-4 md:p-6 lg:p-8 mt-16">
          {/* <div
            className={`p-4 md:p-6 rounded-lg shadow-sm min-h-[70vh] ${
              darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
            }`}
          > */}
            <Outlet />
          {/* </div> */}
        </main>
      </div>
    </div>
  );
}
