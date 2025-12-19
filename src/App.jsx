
import { Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layout + pages
import DashboardLayout from "./dash/Dashboard"; // layout
import DashboardHome from "./dash/DashboardHome";
import Projects from "./dash/Projects";
import ProjectDetails from "./dash/ProjectDetails";
import Profile from "./dash/Profile";
import EditProfile from "./dash/EditProfile";
// import AddProject from "./dash/AddProject";
import Contacts from "./dash/Contacts";
import EditContact from "./dash/EditContact";
import ContactDetails from "./dash/ContactDetails";
import JobApplications from "./dash/JobApplications";
import EditJobApplication from "./dash/EditJobApplication";
import JobApplicationDetails from "./dash/JobApplicationDetails";
import Consultations from "./dash/Consultations";
import EditConsultation from "./dash/EditConsultation";
import ConsultationDetails from "./dash/ConsultationDetails";
import Loader from "./Loader";
// IMPORTANT: adjust this import if your Login file is at a different path.
// I placed the improved login at src/pages/Login.jsx in earlier steps:
import Login from "./Login";
// import User from "./dash/User";

import RequireAuth from "./components/RequireAuth";
// import Category from "./dash/Category";
// import Sliders from "./dash/Sliders";
// import Workers from "./dash/Workers";

function App() {
  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("authToken");

  return (
    <div className="w-full min-h-screen overflow-hidden">
      <ToastContainer />

      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected dashboard - all nested routes require auth */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          {/* nested routes rendered inside DashboardLayout <Outlet /> */}
          <Route index element={<DashboardHome />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="projects" element={<Projects />} />
          <Route path="project-details/:id" element={<ProjectDetails />} />
          <Route path="profile" element={<Profile />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="edit-contact/:id" element={<EditContact />} />
          <Route path="contact-details/:id" element={<ContactDetails />} />
          <Route path="job-applications" element={<JobApplications />} />
          <Route path="edit-job-application/:id" element={<EditJobApplication />} />
          <Route path="job-application-details/:id" element={<JobApplicationDetails />} />
          <Route path="consultations" element={<Consultations />} />
          <Route path="edit-consultation/:id" element={<EditConsultation />} />
          <Route path="consultation-details/:id" element={<ConsultationDetails />} />
          {/* <Route path="add-project" element={<AddProject />} />
          <Route path="users" element={<User />} />
          <Route path="category" element={<Category />} />
          <Route path="sliders" element={<Sliders />} />
          <Route path="workers" element={<Workers />} /> */}
        </Route>

        <Route path="/loader" element={<Loader />} />

        {/* fallback: if logged in go to dashboard else send to login */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </div>
  );
}

export default App;
