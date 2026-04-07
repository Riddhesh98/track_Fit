import React, { useEffect, useState } from "react";
import {
  FiUser,
  FiMail,
  FiActivity,
  FiSave,
  FiCamera,
  FiEdit2,
  FiX
} from "react-icons/fi";
import { FaMars } from "react-icons/fa";
import UserLayout from "../components/UserLayout";
import axios from "axios";
import { FiCopy, FiCheck } from "react-icons/fi";

const Profile = () => {

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [frequency, setFrequency] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const [mongoDbUserId, setMongoDbUserId] = useState("");

  // 🔥 NEW STATES (REQUESTS)
  const [requests, setRequests] = useState([]);

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(mongoDbUserId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const updateHandler = async (e) => {
    e.preventDefault();

    const data = {
      name,
      email,
      age,
      gender,
      height,
      weight
    };

    await axios.put(
      "http://localhost:3000/api/users/update",
      data,
      { withCredentials: true }
    );
  };

  // 🔥 ACCEPT REQUEST
  const handleAccept = async (requestId) => {
    await axios.post(
      "http://localhost:3000/api/users/accept-request",
      { requestId },
      { withCredentials: true }
    );

    setRequests((prev) =>
      prev.filter((req) => req._id !== requestId)
    );
  };

  // 🔥 REJECT REQUEST
  const handleReject = async (requestId) => {
    await axios.post(
      "http://localhost:3000/api/users/reject-request",
      { requestId },
      { withCredentials: true }
    );

    setRequests((prev) =>
      prev.filter((req) => req._id !== requestId)
    );
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await axios.get(
        "http://localhost:3000/api/users/me",
        { withCredentials: true }
      );

      setName(response.data.user.name);
      setEmail(response.data.user.email);
      setMongoDbUserId(response.data.user._id);
      setAge(response.data.user.age);
      setGender(response.data.user.gender);
      setHeight(response.data.user.height);
      setWeight(response.data.user.weight);
      setFrequency(response.data.user.frequency);
    };

    // 🔥 FETCH REQUESTS
    const fetchRequests = async () => {
      const res = await axios.get(
        "http://localhost:3000/api/users/requests",
        { withCredentials: true }
      );

      setRequests(res.data.requests);
    };

    fetchUserData();
    fetchRequests();
  }, []);

  return (
    <UserLayout active="profile">
      <div className="min-h-screen bg-black text-white flex justify-center p-6">
        <div className="w-full max-w-2xl space-y-8">

          {/* HEADER */}
          <div className="text-center space-y-2">
            <div className="relative w-28 h-28 mx-auto rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 p-[2px]">
              <div className="w-full h-full rounded-full bg-[#121215] flex items-center justify-center relative group">
                <FiUser size={40} className="text-indigo-400" />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer">
                    <FiCamera size={22} />
                  </div>
                )}
              </div>
            </div>

            <h1 className="text-2xl font-black uppercase">
              {isEditing ? "Edit Profile" : "My Profile"}
            </h1>
          </div>

          {/* 🔥 NEW REQUEST BOX */}
          <div className="bg-[#09090b] border border-indigo-500 rounded-2xl p-5">
  <h2 className="text-sm font-bold uppercase mb-3 text-indigo-400">
    Gym Requests
  </h2>

  {requests.length === 0 ? (
    <p className="text-xs text-gray-400">
      No pending requests
    </p>
  ) : (
    <div className="space-y-3">
      {requests.map((req) => (
        <div
          key={req._id}
          className="flex items-center justify-between bg-[#121215] p-3 rounded-xl"
        >
          <p className="text-sm">
            {req.ownerId?.name || "Gym Owner"}
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => handleAccept(req._id)}
              className="px-3 py-1 text-xs bg-green-600 rounded-lg"
            >
              Accept
            </button>

            <button
              onClick={() => handleReject(req._id)}
              className="px-3 py-1 text-xs bg-red-600 rounded-lg"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
          {/* CARD */}
          <div className="bg-[#09090b] border border-[#27272a] rounded-3xl p-8 relative">

            <div className="absolute top-6 right-6">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl bg-[#18181b] hover:bg-[#27272a]"
              >
                {isEditing ? <FiX /> : <FiEdit2 />}
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="space-y-6 mt-6">

              {/* USER ID */}
              <div>
                <p className="text-xs text-zinc-500 mb-2">User ID</p>
                <div className="relative h-14 bg-[#121215] rounded-xl flex items-center px-4 font-semibold pr-14">
                  <span className="truncate">{mongoDbUserId}</span>
                  <button
                    onClick={handleCopy}
                    className="absolute right-4 w-8 h-8 rounded-lg bg-[#18181b]"
                  >
                    {copied ? <FiCheck /> : <FiCopy />}
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <p className="text-xs text-zinc-500 mb-2">Name</p>
                {isEditing ? (
                  <input onChange={(e) => setName(e.target.value)} className="w-full h-14 bg-black border rounded-xl px-4" />
                ) : (
                  <div className="h-14 bg-[#121215] rounded-xl flex items-center px-4">{name}</div>
                )}
              </div>

              {/* Email */}
              <div>
                <p className="text-xs text-zinc-500 mb-2">Email</p>
                {isEditing ? (
                  <input onChange={(e) => setEmail(e.target.value)} className="w-full h-14 bg-black border rounded-xl px-4" />
                ) : (
                  <div className="h-14 bg-[#121215] rounded-xl flex items-center px-4">{email}</div>
                )}
              </div>

              {/* Age */}
              <div>
                <p className="text-xs text-zinc-500 mb-2">Age</p>
                {isEditing ? (
                  <input type="number" onChange={(e) => setAge(e.target.value)} className="w-full h-14 bg-black border rounded-xl px-4" />
                ) : (
                  <div className="h-14 bg-[#121215] rounded-xl flex items-center px-4">{age}</div>
                )}
              </div>

              {/* Height */}
              <div>
                <p className="text-xs text-zinc-500 mb-2">Height</p>
                {isEditing ? (
                  <input type="number" onChange={(e) => setHeight(e.target.value)} className="w-full h-14 bg-black border rounded-xl px-4" />
                ) : (
                  <div className="h-14 bg-[#121215] rounded-xl flex items-center px-4">{height}</div>
                )}
              </div>

              {/* Weight */}
              <div>
                <p className="text-xs text-zinc-500 mb-2">Weight</p>
                {isEditing ? (
                  <input type="number" onChange={(e) => setWeight(e.target.value)} className="w-full h-14 bg-black border rounded-xl px-4" />
                ) : (
                  <div className="h-14 bg-[#121215] rounded-xl flex items-center px-4">{weight}</div>
                )}
              </div>

              {/* Gender */}
              <div>
                <p className="text-xs text-zinc-500 mb-2">Gender</p>
                {isEditing ? (
                  <input onChange={(e) => setGender(e.target.value)} className="w-full h-14 bg-black border rounded-xl px-4" />
                ) : (
                  <div className="h-14 bg-[#121215] rounded-xl flex items-center px-4">{gender}</div>
                )}
              </div>

              {/* Frequency */}
              <div>
                <p className="text-xs text-zinc-500 mb-2">Training Frequency</p>
                {isEditing ? (
                  <input onChange={(e) => setFrequency(e.target.value)} className="w-full h-14 bg-black border rounded-xl px-4" />
                ) : (
                  <div className="h-14 bg-[#121215] rounded-xl flex items-center px-4">{frequency}</div>
                )}
              </div>

              {isEditing && (
                <button
                  onClick={(e) => {
                    updateHandler(e);
                    setIsEditing(false);
                  }}
                  className="w-full h-14 bg-white text-black rounded-xl font-bold"
                >
                  Save Changes
                </button>
              )}

            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Profile;