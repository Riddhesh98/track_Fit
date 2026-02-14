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


  const[mongoDbUserId, setMongoDbUserId] = useState("");
 
  
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
      }

      // console.log("data from updatehandler",data);

      const response = await axios.put("http://localhost:3000/api/users/update",
        data,

        {
        withCredentials: true
      })
  }


  useEffect(() => {
    const fetchUserData = async () => {
        const response = await axios.get("http://localhost:3000/api/users/me", {
          withCredentials: true,
        })

        console.log(response.data);

        setName(response.data.user.name);
        setEmail(response.data.user.email);
        setMongoDbUserId(response.data.user._id);
        setAge(response.data.user.age);
        setGender(response.data.user.gender);
        setHeight(response.data.user.height);
        setWeight(response.data.user.weight);
        setFrequency(response.data.user.frequency);


        // console.log(response.data.user.name);
        // console.log(response.data.user.email);
        // console.log(response.data.password);
        // console.log(response.dataage);
        // console.log(response.data.gender);
        // console.log(response.data.height);
        // console.log(response.data.weight);

    }

    fetchUserData();
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

          {/* CARD */}
          <div className="bg-[#09090b] border border-[#27272a] rounded-3xl p-8 relative">

            {/* Toggle Button */}
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

                {/* for mongo Db Id of user for later user */}
                  {/* it has no isEditing cause id cannot be changed */}
                  <div>
  <p className="text-xs text-zinc-500 mb-2">User ID</p>

  <div className="relative h-14 bg-[#121215] rounded-xl flex items-center px-4 font-semibold pr-14">
    <span className="truncate">{mongoDbUserId}</span>

    {/* Copy Button */}
    <button
      onClick={handleCopy}
      className="absolute right-4 flex items-center justify-center w-8 h-8 rounded-lg bg-[#18181b] hover:bg-[#27272a] transition"
    >
      {copied ? (
        <FiCheck className="text-green-400" size={16} />
      ) : (
        <FiCopy className="text-zinc-400" size={16} />
      )}
    </button>
  </div>
</div>


              {/* Name */}
              <div>
                <p className="text-xs text-zinc-500 mb-2">Name</p>
                {isEditing ? (
                  <input
                    className="w-full h-14 bg-black border border-[#27272a] rounded-xl px-4 focus:border-indigo-500 outline-none"
                    placeholder="Enter name"
                    onChange={(e) => setName(e.target.value)}
                  />
                ) : (
                  <div className="h-14 bg-[#121215] rounded-xl flex items-center px-4 font-semibold">
                    {name}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <p className="text-xs text-zinc-500 mb-2">Email</p>
                {isEditing ? (
                  <input
                    type="email"
                    className="w-full h-14 bg-black border border-[#27272a] rounded-xl px-4 focus:border-indigo-500 outline-none"
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                ) : (
                  <div className="h-14 bg-[#121215] rounded-xl flex items-center px-4 font-semibold">
                    {email}
                  </div>
                )}
              </div>

              {/* Stats
              <div className="grid grid-cols-3 gap-4">
                {["20 YRS", "170 CM", "83 KG"].map((item, i) => (
                  <div
                    key={i}
                    className="h-14 bg-[#121215] rounded-xl flex items-center justify-center font-semibold"
                  >
                    {item}
                  </div>
                ))}
              </div> */}

              {/* Age */}
              <div>
                <p className="text-xs text-zinc-500 mb-2">Age</p>
                {isEditing ? (
                  <input
                    type="number"
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full h-14 bg-black border border-[#27272a] rounded-xl px-4 focus:border-indigo-500 outline-none"
                    placeholder="Enter age"
                  />
                ) : (
                  <div className="h-14 bg-[#121215] rounded-xl flex items-center px-4 font-semibold">
                    {age}
                  </div>
                )}
              </div>


              {/* Height */}
              <div>
                <p className="text-xs text-zinc-500 mb-2">Height</p>
                {isEditing ? (
                  <input
                    type="number"
                    className="w-full h-14 bg-black border border-[#27272a] rounded-xl px-4 focus:border-indigo-500 outline-none"
                    placeholder="Enter height"
                    onChange={(e) => setHeight(e.target.value)}
                  />
                ) : (
                  <div className="h-14 bg-[#121215] rounded-xl flex items-center px-4 font-semibold">
                    {height}
                  </div>
                )}
              </div>


              {/* Weight */}
              <div>
                <p className="text-xs text-zinc-500 mb-2">Weight</p>
                {isEditing ? (
                  <input
                    type="number"
                    className="w-full h-14 bg-black border border-[#27272a] rounded-xl px-4 focus:border-indigo-500 outline-none"
                    placeholder="Enter weight"
                    onChange={(e) => setWeight(e.target.value)}
                  />
                ) : (
                  <div className="h-14 bg-[#121215] rounded-xl flex items-center px-4 font-semibold">
                    {weight}
                  </div>
                )}
              </div>




              {/* Gender
              <div>
                <p className="text-xs text-zinc-500 mb-2">Gender</p>
                <div className="h-14 bg-[#121215] rounded-xl flex items-center px-4 gap-2 font-semibold">
                  <FaMars className="text-indigo-400" />
                  
                </div>
              </div> */}

{/* 
              //with editing of gender */}

              {/* Gender */}
              <div>
                <p className="text-xs text-zinc-500 mb-2">Gender</p>
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full h-14 bg-black border border-[#27272a] rounded-xl px-4 focus:border-indigo-500 outline-none"
                    placeholder="Enter gender"
                    onChange={(e) => setGender(e.target.value)}
                  />
                ) : (
                  <div className="h-14 bg-[#121215] rounded-xl flex items-center px-4 font-semibold">
                    {gender}
                  </div>
                )}
              </div>




              {/* Frequency */}
              {/* <div>
                <p className="text-xs text-zinc-500 mb-2">Training Frequency</p>
                <div className="h-14 bg-[#121215] rounded-xl flex items-center px-4 font-semibold">
                  5 Days / Week
                </div>
              </div> */}

{/* 
              //with editing of freq. */}


              {/* Frequency */}
              <div>
                <p className="text-xs text-zinc-500 mb-2">Training Frequency</p>
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full h-14 bg-black border border-[#27272a] rounded-xl px-4 focus:border-indigo-500 outline-none"
                    placeholder="Enter frequency"
                    onChange={(e) => setFrequency(e.target.value)}
                  />
                ) : (
                  <div className="h-14 bg-[#121215] rounded-xl flex items-center px-4 font-semibold">
                    {frequency}
                  </div>
                )}
              </div>


              {/* Save Button */}
              {isEditing && (
                <button
                  onClick={(e) => 
                  {
                  // call the update function
                    updateHandler(e),

                    setIsEditing(false)}
                  }
                    className="w-full h-14 bg-white text-black rounded-xl font-bold uppercase flex items-center justify-center gap-2 hover:bg-zinc-200 transition"
                >
                  <FiSave />
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
