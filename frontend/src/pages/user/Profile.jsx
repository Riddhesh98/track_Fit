import React, { useEffect, useState } from "react";
import {
  FiUser,
  FiEdit2,
  FiX,
  FiCopy,
  FiCheck
} from "react-icons/fi";
import UserLayout from "../../components/layouts/UserLayout";
import axios from "axios";

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

    try {
      await axios.put(
        "http://localhost:3000/api/users/update",
        data,
        { withCredentials: true }
      );
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccept = async (linkId) => {
    try {
      await axios.post(
        `http://localhost:3000/api/users/gym-requests/${linkId}`,
        { action: "accept" },
        { withCredentials: true }
      );
      setRequests((prev) => prev.filter((req) => req.linkId !== linkId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (linkId) => {
    try {
      await axios.post(
        `http://localhost:3000/api/users/gym-requests/${linkId}`,
        { action: "reject" },
        { withCredentials: true }
      );
      setRequests((prev) => prev.filter((req) => req.linkId !== linkId));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/users/me",
          { withCredentials: true }
        );

        setName(response.data.user.name || "");
        setEmail(response.data.user.email || "");
        setMongoDbUserId(response.data.user._id || "");
        setAge(response.data.user.age || "");
        setGender(response.data.user.gender || "");
        setHeight(response.data.user.height || "");
        setWeight(response.data.user.weight || "");
        setFrequency(response.data.user.frequency || "");
      } catch (err) {
        console.error(err);
      }
    };

    const fetchRequests = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/users/gym-requests",
          { withCredentials: true }
        );
        setRequests(res.data.requests || []);
      } catch (_) {}
    };

    fetchUserData();
    fetchRequests();
  }, []);

  return (
    <UserLayout active="profile">
      <div className="space-y-8 pb-12">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FiUser className="text-orange-600" size={18} />
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Athlete Identification</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Physical Baseline & Profile
            </h1>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors self-start sm:self-auto"
          >
            {isEditing ? <FiX size={15} /> : <FiEdit2 size={15} />}
            {isEditing ? "Cancel Editing" : "Edit Profile"}
          </button>
        </div>

        {/* GYM REQUESTS BOX */}
        {requests.length > 0 && (
          <div className="bg-white border border-orange-200 rounded-xl p-5 shadow-xs space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-orange-600">
              Pending Gym Invitations ({requests.length})
            </h2>

            <div className="space-y-2">
              {requests.map((req) => (
                <div
                  key={req.linkId}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
                >
                  <div>
                    <p className="text-sm font-bold text-gray-900">{req.gym?.name || "Gym Owner"}</p>
                    {req.subscription && (
                      <p className="text-xs text-gray-500">₹{req.subscription.fee} · {req.subscription.durationDays} days</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(req.linkId)}
                      className="px-3 py-1.5 text-xs font-bold bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleReject(req.linkId)}
                      className="px-3 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROFILE BASELINE CARD */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
          
          {/* ID ROW */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Athlete Database ID
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                readOnly
                value={mongoDbUserId}
                className="w-full h-11 px-3 pr-12 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono font-bold text-gray-700 outline-none"
              />
              <button
                onClick={handleCopy}
                className="absolute right-2 p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
                title="Copy ID"
              >
                {copied ? <FiCheck size={16} className="text-green-600" /> : <FiCopy size={16} />}
              </button>
            </div>
          </div>

          {/* GRID INPUT FIELDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 outline-none focus:border-orange-600 transition-colors"
                />
              ) : (
                <div className="h-11 px-3 bg-gray-50 border border-gray-200/80 rounded-lg flex items-center font-bold text-sm text-gray-900">{name || "—"}</div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 outline-none focus:border-orange-600 transition-colors"
                />
              ) : (
                <div className="h-11 px-3 bg-gray-50 border border-gray-200/80 rounded-lg flex items-center font-bold text-sm text-gray-900">{email || "—"}</div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Age</label>
              {isEditing ? (
                <input
                  type="number"
                  min="10"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 outline-none focus:border-orange-600 transition-colors"
                />
              ) : (
                <div className="h-11 px-3 bg-gray-50 border border-gray-200/80 rounded-lg flex items-center font-bold text-sm text-gray-900">{age || "—"}</div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Gender</label>
              {isEditing ? (
                <input
                  type="text"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 outline-none focus:border-orange-600 transition-colors"
                />
              ) : (
                <div className="h-11 px-3 bg-gray-50 border border-gray-200/80 rounded-lg flex items-center font-bold text-sm text-gray-900 capitalize">{gender || "—"}</div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Height (cm)</label>
              {isEditing ? (
                <input
                  type="number"
                  min="50"
                  max="250"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 outline-none focus:border-orange-600 transition-colors"
                />
              ) : (
                <div className="h-11 px-3 bg-gray-50 border border-gray-200/80 rounded-lg flex items-center font-bold text-sm text-gray-900">{height ? `${height} cm` : "—"}</div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Goal Weight (kg)</label>
              {isEditing ? (
                <input
                  type="number"
                  min="20"
                  max="300"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 outline-none focus:border-orange-600 transition-colors"
                />
              ) : (
                <div className="h-11 px-3 bg-gray-50 border border-gray-200/80 rounded-lg flex items-center font-bold text-sm text-gray-900">{weight ? `${weight} kg` : "—"}</div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="pt-2">
              <button
                onClick={updateHandler}
                className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
              >
                Save Baseline Changes
              </button>
            </div>
          )}

        </div>
      </div>
    </UserLayout>
  );
};

export default Profile;