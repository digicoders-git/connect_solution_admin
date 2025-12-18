import React, { useEffect, useState } from "react";
import { useDarkMode } from "../DarkModeContext.jsx";
import API from "../api/api";
import { Link } from "react-router-dom";

export default function DashboardHome() {
  const { darkMode } = useDarkMode();
  const [adminData, setAdminData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const getUser = async () => {
    try {
      const res = await API.get(import.meta.env.VITE_BASE_URL+"/admin/get");
      setAdminData(res.data.data[0]);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    getUser();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const colors = {
    bgCard: darkMode ? "bg-gray-800" : "bg-white",
    textPrimary: darkMode ? "text-gray-100" : "text-gray-900",
    textMuted: darkMode ? "text-gray-400" : "text-gray-600",
    surfaceBorder: darkMode ? "border border-gray-700" : "border border-gray-100",
    gradientBg: darkMode
      ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"
      : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400",
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const quickActions = [
    {
      title: "Manage Projects",
      description: "View and manage all projects",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      link: "/dashboard/projects",
      color: "from-blue-500 to-cyan-400",
    },
    {
      title: "Contact Messages",
      description: "View customer inquiries",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      link: "/dashboard/contacts",
      color: "from-green-500 to-emerald-400",
    },
    {
      title: "Profile Settings",
      description: "Update your admin profile",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      link: "/dashboard/profile",
      color: "from-purple-500 to-violet-400",
    },
    {
      title: "System Settings",
      description: "Configure system preferences",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      link: "/dashboard/settings",
      color: "from-orange-500 to-amber-400",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner */}
      <div style={{border:'1px solid'}} className={`${colors.bgCard} ${colors.surfaceBorder} rounded-2xl p-8 shadow-xl relative overflow-hidden`}>
        <div className={`absolute top-0 right-0 w-64 h-64 ${darkMode ? "opacity-5" : "opacity-10"}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="80" fill={darkMode ? "#6366f1" : "#4f46e5"} />
            <circle cx="140" cy="60" r="40" fill={darkMode ? "#8b5cf6" : "#7c3aed"} />
            <circle cx="60" cy="140" r="50" fill={darkMode ? "#a855f7" : "#9333ea"} />
          </svg>
        </div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                {getGreeting()}, {adminData?.name || "Admin"}! 👋
              </h1>
              <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Welcome to your Ameraa Finnway Admin Dashboard
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <p className={`text-lg font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{formatDate(currentTime)}</p>
              {/* <p className={`text-2xl font-bold font-mono ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>{formatTime(currentTime)}</p> */}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {/* <div>
        <h2 className={`text-xl font-semibold mb-4 ${colors.textPrimary}`}>Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link
              to={action.link}
              key={index}
              className={`${colors.bgCard} ${colors.surfaceBorder} rounded-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer`}
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {action.icon}
              </div>
              <h3 className={`text-lg font-semibold ${colors.textPrimary} mb-1`}>
                {action.title}
              </h3>
              <p className={`text-sm ${colors.textMuted}`}>{action.description}</p>
            </Link>
          ))}
        </div>
      </div> */}

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tips Card */}
        <div className={`${colors.bgCard} ${colors.surfaceBorder} rounded-xl p-6`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className={`text-lg font-semibold ${colors.textPrimary}`}>Quick Tips</h3>
          </div>
          <ul className={`space-y-3 ${colors.textMuted}`}>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Use the sidebar to navigate between different sections</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Toggle dark mode for a comfortable viewing experience</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Keep your profile information up to date</span>
            </li>
          </ul>
        </div>

        {/* System Status Card */}
        <div className={`${colors.bgCard} ${colors.surfaceBorder} rounded-xl p-6`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className={`text-lg font-semibold ${colors.textPrimary}`}>System Status</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={colors.textMuted}>Server Status</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={colors.textMuted}>Database</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={colors.textMuted}>API Services</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
                Running
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
