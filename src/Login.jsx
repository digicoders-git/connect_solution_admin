// src/pages/Login.jsx
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import API from "./api/api"; // keep your existing import path

export default function Login() {
  const navigate = useNavigate();
  // use adminID instead of email
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // if already logged in, redirect
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) navigate("/dashboard", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const validate = () => {
    // if (!form.adminID?.toString().trim()) { toast.error("Admin ID daal bhai"); return false; }
    // optional: if adminID must be numeric uncomment below
    // if (!/^\d+$/.test(form.adminID)) { toast.error("Admin ID numeric hona chahiye"); return false; }
    if (!form.password || form.password.length < 3) { 
      // kept 3 for demo; change to 6 if needed
      toast.error("Password must be 3 characters"); 
      return false; 
    }
    return true;
  };
// console.log('api is',API.post("/admin/login", {payload:"abhay"}))  

// console.log('url',`${import.meta.env.VITE_BASE_URL}/admin/login`)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      // send adminID and password as your backend expects
      const payload = { email: form.email, password: form.password };
      // console.log(payload)
      // call backend login - your endpoint is /api/login (as you said earlier)
      const res = await API.post("/admin/login", payload);
      // console.log(res)

      // backend might return { token } or { data: { token } } etc.
      const token = res?.data?.token ?? res?.data?.data?.token ?? null;
      const user = res?.data?.user ?? res?.data?.data?.user ?? null;

      if (!token) {
        toast.error("Login failed — token missing in response");
        setLoading(false);
        return;
      }

      // store token + optional user
      localStorage.setItem("authToken", token);
      if (user) localStorage.setItem("authUser", JSON.stringify(user));

      toast.success("Login successful 🎉");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      // console.error("Login error", err);
      const msg = err?.response?.data?.message || err?.response?.data?.error || err.message || "Login failed — check credentials";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white text-gray-900 rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-4xl font-bold text-center mb-4" style={{fontSize:"24px", fontWeight:"bold", marginBottom:"20px", color:"#333", textAlign:"center",}}>Admin Login</h1>
        {/* <p className="text-sm text-center text-gray-600 mb-6">Apne account se login karein</p> */}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col">
            <span className="text-sm font-medium mb-1" style={{marginBottom:"10px", fontSize:"16px"}}>Enter Email</span>
            <input
            style={{border:"1px solid #ccc", padding:"10px", borderRadius:"5px", width:"100%"}}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium mb-1"  style={{marginBottom:"10px", fontSize:"16px"}}>Password</span>
            <input
            style={{border:"1px solid #ccc", padding:"10px", borderRadius:"5px", width:"100%"}}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
              minLength={3}
            />
          </label>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              {/* <input type="checkbox" className="h-4 w-4" /> */}
              {/* <span>Remember me</span> */}
            </label>

          </div>

          <button
          style={{border:"1px solid #ccc", padding:"10px", borderRadius:"5px", width:"100%", backgroundColor:"#333", color:"#fff", cursor:"pointer", fontSize:"16px", fontWeight:"bold"}}
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white font-medium transition cursor-pointer ${loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <div style={{fontSize:"12px", color:"#333", textAlign:"center", marginTop:"10px"}}>
            @ 2025 Connect Solution. All rights reserved.
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {/* <p>Demo: use your API or mock. <button className="text-indigo-600">Need help?</button></p> */}
        </div>
      </div>
    </div>
  );
}
