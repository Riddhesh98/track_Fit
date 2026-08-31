import { User } from "../Models/user.model.js";
import bcrypt from 'bcrypt';

const signup = async (req, res) => {
  try {
    const { name, email, password, age, gender, height, weight, frequency } = req.body;

    if (!name || !email || !password || !age || !gender) {
      return res.status(400).json({ message: "Name, email, password, age, and gender are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      age: Number(age),
      gender: gender.toLowerCase(),
    };

    if (height && !isNaN(Number(height)) && Number(height) > 0) {
      userData.height = Number(height);
    }
    if (weight && !isNaN(Number(weight)) && Number(weight) > 0) {
      userData.weight = Number(weight);
    }
    if (frequency && typeof frequency === "string" && frequency.trim().length > 0) {
      userData.frequency = frequency.trim();
    }

    const user = await User.create(userData);

    if (!user) {
      return res.status(400).json({ message: "User not created" });
    }

    const token = user.generateUserToken();
        
    if (!token) {
      return res.status(400).json({ message: "Token not created" });
    }

    res.cookie("token", token, {
      httpOnly: false,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(201).json({
      message: "User created successfully",
      user: userObj
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = user.generateUserToken();

    res.cookie("token", token, {
      httpOnly: false,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({
      message: "User logged in successfully",
      user: userObj
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  res.cookie("token", null, {
    httpOnly: false,
    maxAge: 0,
  });
  return res.status(200).json({ message: "User logged out successfully" });
};

const updateProfile = async (req, res) => {
  const id = req.user._id;

  if (!id) {
    return res.status(400).json({ message: "User not found" });
  }
  try {
    const updateData = { ...req.body };
    if (updateData.password) {
      delete updateData.password;
    }
    const user = await User.findOneAndUpdate({ _id: id }, updateData, { new: true });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const fetchUserData = async (req, res) => {
  const id = req.user._id;
  const user = await User.findOne({ _id: id }).select("-password");
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  return res.status(200).json({ message: "User found successfully", user });
};

const getMySubscription = async (req, res) => {
  try {
    return res.status(200).json({ message: "No subscription found", subscription: null, gym: null });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const getPendingGymRequests = async (req, res) => {
  try {
    return res.status(200).json({ message: "No pending requests", requests: [] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const respondToGymRequest = async (req, res) => {
  try {
    return res.status(200).json({ message: "No action required", status: "none" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export {
  signup,
  login,
  logout,
  updateProfile,
  fetchUserData,
  getMySubscription,
  getPendingGymRequests,
  respondToGymRequest,
};