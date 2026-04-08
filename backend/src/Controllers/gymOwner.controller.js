import { GymOwner } from "../Models/gymOwner.model.js";
import bcrypt from 'bcrypt';
import { User } from "../Models/user.model.js";
import { OwnerUser } from "../Models/OwnerUser.model.js";
import { Subscription } from "../Models/Subscription.model.js";

// ─── AUTH ───────────────────────────────────────────────

const signup = async (req, res) => {
    try {
        const { name, email, password, JWT_SECRT } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (JWT_SECRT == process.env.GYM_OWNER_SECRET) {
            return res.status(400).json({ message: "JWT_SECRT is required or invalid" });
        }

        const hasedPassword = await bcrypt.hash(password, 10);

        const gymOwner = await GymOwner.create({
            name,
            email,
            password: hasedPassword,
        });

        if (!gymOwner) {
            return res.status(400).json({ message: "GymOwner not created" });
        }

        const ownerToken = await gymOwner.generateGymOwnerToken();

        if (!ownerToken) {
            return res.status(400).json({ message: "Token not created" });
        }

        res.cookie("ownerToken", ownerToken, {
            httpOnly: false,
            maxAge: 30 * 24 * 60 * 60,
        });

        gymOwner.gymOwnerToken = ownerToken;
        gymOwner.save();

        return res.status(200).json({ message: "GymOwner created successfully" }, gymOwner);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

const signin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const gymOwner = await GymOwner.findOne({ email }).select("+password");

    if (!gymOwner) {
        return res.status(400).json({ message: "GymOwner not found" });
    }

    const isMatch = await bcrypt.compare(password, gymOwner.password);

    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const ownerToken = gymOwner.generateGymOwnerToken();

    if (!ownerToken) {
        return res.status(400).json({ message: "Token not created" });
    }

    res.cookie("ownerToken", ownerToken, {
        httpOnly: false,
        maxAge: 30 * 24 * 60 * 60,
    });

    return res.status(200).json({ message: "GymOwner logged in successfully" }, gymOwner);
};

const logout = async (req, res) => {
    res.cookie("ownerToken", null, {
        httpOnly: false,
        maxAge: 0,
    });
    return res.status(200).json({ message: "GymOwner logged out successfully" });
};

// ─── REQUEST USER ────────────────────────────────────────

const requestUser = async (req, res) => {
    try {
        const ownerId = req.owner.id;
        const { email, userId } = req.body;

        let user;

        if (email) {
            user = await User.findOne({ email });
        } else if (userId) {
            user = await User.findById(userId);
        } else {
            return res.status(400).json({ message: "Provide user email or userId" });
        }

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const existing = await OwnerUser.findOne({ ownerId, userId: user._id });

        if (existing) {
            return res.status(400).json({ message: `Request already ${existing.status}` });
        }

        const request = await OwnerUser.create({ ownerId, userId: user._id });

        return res.status(201).json({ message: "Request sent successfully", request });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ─── GET ALL OWNER USERS (with subscription status) ──────

const getMyUsers = async (req, res) => {
    try {
        const ownerId = req.owner.id;

        // Get all OwnerUser records for this owner with user details
        const ownerUsers = await OwnerUser.find({ ownerId }).populate("userId", "-password -userToken");

        // For each linked user, get their latest subscription
        const usersWithSubscription = await Promise.all(
            ownerUsers.map(async (ou) => {
                const user = ou.userId;
                const linkStatus = ou.status; // pending / approved / rejected

                // Get latest subscription
                const subscription = await Subscription.findOne({ ownerId, userId: user._id })
                    .sort({ createdAt: -1 })
                    .lean();

                let subStatus = "pending";
                let daysLeft = null;

                if (linkStatus === "approved" && subscription) {
                    const now = new Date();
                    daysLeft = Math.max(0, Math.ceil((new Date(subscription.endDate) - now) / (1000 * 60 * 60 * 24)));
                    subStatus = daysLeft > 0 ? "active" : "expired";
                } else if (linkStatus === "pending") {
                    subStatus = "pending";
                } else if (linkStatus === "rejected") {
                    subStatus = "rejected";
                }

                return {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    age: user.age,
                    gender: user.gender,
                    linkStatus,
                    subStatus,
                    daysLeft,
                    subscription: subscription || null,
                };
            })
        );

        return res.status(200).json({ message: "Users fetched successfully", users: usersWithSubscription });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

// ─── GET SINGLE USER DETAILS ──────────────────────────────

const getUserDetails = async (req, res) => {
    try {
        const ownerId = req.owner.id;
        const { userId } = req.params;

        // Verify this user is linked AND approved
        const link = await OwnerUser.findOne({ ownerId, userId });
        if (!link) {
            return res.status(403).json({ message: "This user is not linked to your gym" });
        }
        if (link.status !== "approved") {
            return res.status(403).json({ message: `Cannot view data — link status is '${link.status}'. User must accept the gym request first.` });
        }

        const user = await User.findById(userId).select("-password -userToken");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get latest subscription
        const subscription = await Subscription.findOne({ ownerId, userId })
            .sort({ createdAt: -1 })
            .lean();

        let daysLeft = null;
        let subStatus = "none";

        if (subscription) {
            const now = new Date();
            daysLeft = Math.max(0, Math.ceil((new Date(subscription.endDate) - now) / (1000 * 60 * 60 * 24)));
            subStatus = daysLeft > 0 ? "active" : "expired";
        }

        return res.status(200).json({
            message: "User details fetched",
            user,
            subscription: subscription
                ? { ...subscription, daysLeft, status: subStatus }
                : null,
            linkStatus: link.status,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

// ─── CREATE SUBSCRIPTION ──────────────────────────────────

const createSubscription = async (req, res) => {
    try {
        const ownerId = req.owner.id;
        const { userId, fee, durationDays } = req.body;

        if (!userId || !fee || !durationDays) {
            return res.status(400).json({ message: "userId, fee, and durationDays are required" });
        }

        if (isNaN(fee) || Number(fee) <= 0) {
            return res.status(400).json({ message: "Fee must be a positive number" });
        }

        if (isNaN(durationDays) || Number(durationDays) <= 0) {
            return res.status(400).json({ message: "Duration must be a positive number" });
        }

        // Ensure user is linked to this owner
        const link = await OwnerUser.findOne({ ownerId, userId });
        if (!link) {
            return res.status(403).json({ message: "This user is not linked to your gym" });
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + Number(durationDays));

        const subscription = await Subscription.create({
            ownerId,
            userId,
            fee: Number(fee),
            startDate,
            endDate,
        });

        return res.status(201).json({
            message: "Subscription created successfully",
            subscription,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

// ─── GET SUBSCRIPTION FOR A USER ─────────────────────────

const getSubscription = async (req, res) => {
    try {
        const ownerId = req.owner.id;
        const { userId } = req.params;

        const subscription = await Subscription.findOne({ ownerId, userId })
            .sort({ createdAt: -1 })
            .lean();

        if (!subscription) {
            return res.status(404).json({ message: "No subscription found for this user" });
        }

        const now = new Date();
        const daysLeft = Math.max(0, Math.ceil((new Date(subscription.endDate) - now) / (1000 * 60 * 60 * 24)));
        const status = daysLeft > 0 ? "active" : "expired";

        return res.status(200).json({
            message: "Subscription fetched",
            subscription: { ...subscription, daysLeft, status },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};


// ─── ADD USER + SUBSCRIPTION IN ONE STEP ─────────────────
// Owner provides email, fee, durationDays → creates link (approved) + subscription

const addUserWithSubscription = async (req, res) => {
    try {
        const ownerId = req.owner.id;
        const { email, userId: userIdParam, fee, durationDays } = req.body;

        if ((!email && !userIdParam) || !fee || !durationDays) {
            return res.status(400).json({ message: "email or userId, fee, and durationDays are required" });
        }

        if (isNaN(fee) || Number(fee) <= 0) {
            return res.status(400).json({ message: "Fee must be a positive number" });
        }

        if (isNaN(durationDays) || Number(durationDays) <= 0) {
            return res.status(400).json({ message: "Duration must be a positive number" });
        }

        // Find user by email OR by id
        let user;
        if (email) {
            user = await User.findOne({ email: email.trim().toLowerCase() });
        } else {
            user = await User.findById(userIdParam);
        }

        if (!user) {
            return res.status(404).json({ message: "No user found. Make sure they have a TrackFit account." });
        }

        // Check if a link already exists
        const existingLink = await OwnerUser.findOne({ ownerId, userId: user._id });
        if (existingLink && existingLink.status === "approved") {
            return res.status(400).json({ message: "This user is already an approved member of your gym." });
        }
        if (existingLink && existingLink.status === "pending") {
            return res.status(400).json({ message: "A pending request already exists for this user." });
        }

        // Create a PENDING link — user must accept before owner sees their data
        const link = await OwnerUser.findOneAndUpdate(
            { ownerId, userId: user._id },
            { ownerId, userId: user._id, status: "pending" },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Store subscription as "pending" (will activate on user acceptance)
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + Number(durationDays));

        const subscription = await Subscription.create({
            ownerId,
            userId: user._id,
            fee: Number(fee),
            startDate,
            endDate,
            pending: true,
        });

        return res.status(201).json({
            message: "Request sent! The user will see a gym invitation and must accept it to activate their membership.",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            link,
            subscription,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

export {
    signup,
    signin,
    logout,
    requestUser,
    getMyUsers,
    getUserDetails,
    createSubscription,
    getSubscription,
    addUserWithSubscription,
    removeUser,
};

// ─── REMOVE USER ──────────────────────────────────────────
async function removeUser(req, res) {
    try {
        const ownerId = req.owner.id;
        const { userId } = req.params;

        const link = await OwnerUser.findOneAndDelete({ ownerId, userId });
        if (!link) {
            return res.status(404).json({ message: "User not linked to your gym" });
        }

        // Also delete all subscriptions between this owner and user
        await Subscription.deleteMany({ ownerId, userId });

        return res.status(200).json({ message: "Member removed successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}