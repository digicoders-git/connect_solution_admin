import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../Loader";
import API from "../api/api";
export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getProjects = async () => {
    setLoading(true);
    const res = await API.get("http://localhost:3200/project/get");
    // setProjects(res.data);
    // console.log(res.data)
    setLoading(false);
  };

  useEffect(() => {
    getProjects();
  }, []);

  const deleteProject = async (id) => {
    await axios.delete(`http://localhost:3000/project/${id}`);
    toast.success("Project deleted!");
    getProjects();
  };

  const updateProject = async () => {
    await axios.put(`http://localhost:3000/project/${editData._id}`, editData);
    toast.success("Project updated!");
    setEditData(null);
    getProjects();
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  return loading?<Loader /> :(
    <div>
      <h1 className="text-2xl font-bold mb-6">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((p) => (
          <div key={p._id} className="bg-white rounded shadow p-4 flex flex-col gap-2">
            <img src={p.image} alt={p.title} className="h-40 w-full object-cover rounded" />
            <h3 className="font-semibold text-lg">{p.title}</h3>
            <p className="text-gray-600">{p.price} | {p.location}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setEditData(p)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deleteProject(p._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {editData && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Project</h2>
            <input
              type="text"
              name="title"
              value={editData.title}
              onChange={handleEditChange}
              className="border p-2 rounded w-full mb-3"
            />
            <input
              type="text"
              name="price"
              value={editData.price}
              onChange={handleEditChange}
              className="border p-2 rounded w-full mb-3"
            />
            <input
              type="text"
              name="location"
              value={editData.location}
              onChange={handleEditChange}
              className="border p-2 rounded w-full mb-3"
            />
            <input
              type="text"
              name="image"
              value={editData.image}
              onChange={handleEditChange}
              className="border p-2 rounded w-full mb-3"
            />
            <div className="flex gap-3">
              <button
                onClick={updateProject}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Update
              </button>
              <button
                onClick={() => setEditData(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}