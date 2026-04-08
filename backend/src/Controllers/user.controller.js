import { User } from "../Models/user.model.js";
import { Subscription } from "../Models/Subscription.model.js";
import { OwnerUser } from "../Models/OwnerUser.model.js";
import { GymOwner } from "../Models/gymOwner.model.js";
import bcrypt from 'bcrypt'



const signup = async (req,res)=>{
   try {
     const {name,email,password,age,gender} = req.body;
 
     if(!name || !email || !password || !age || !gender){
         return res.status(400).json({message:"All fields are required"});
     }
 
     const {height,weight,frequency} = req.body;
 
     const user = await User.create({
         name,
         email,
         password,
         age,
         gender,
         height,
         weight,
         frequency
     })
 
     if(!user){
         return res.status(400).json({message:"User not created"});
     }

     const hasedPassword=await bcrypt.hash(password,10);
    
 
     const token = await user.generateUserToken();
        
     if(!token){
         return res.status(400).json({message:"Token not created"});
     }

     res.cookie("token", token, {
        httpOnly: false,          // JS can't access (XSS protection)
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
         
      });

      user.userToken=token;
      user.password=hasedPassword;
      //save
      await user.save();


      

     return res.status(201).json({message:"User created successfully",
        user
     });
   } catch (error) {
     console.log(error);
     return res.status(500).json({message:"Internal server error"});
   }
}

// //test data for signup for postman
// {
//     "name":"test",
//     "email":"test@test.com",
//     "password":"testtest",
//     "age":18,
//     "gender":"male",
//     "height":170,
//     "weight":60,
//     "frequency":5
// }



const login = async(req,res)=>{
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    console.log(email,password);

    const user = await User.findOne({email})
                            .select("+password");
   
    console.log(user);

    if(!user){
        return res.status(400).json({message:"User not found"});
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
        return res.status(400).json({message:"Invalid credentials"});
    }

    const token = user.generateUserToken(user._id);
        
    if(!token){
        return res.status(400).json({message:"Token not created"});
    }

    res.cookie("token", token, {
        httpOnly: false,          // JS can't access (XSS protection)
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
         
      });


    return res.status(200).json({message:"User logged in successfully",
        user
     });


}


const logout = async(req,res)=>{
    res.cookie("token", null, {
        httpOnly: false,          // JS can't access (XSS protection)
        maxAge: 0, // 30 days
         
      });
      return res.status(200).json({message:"User logged out successfully"});
}


const updateProfile = async(req,res)=>{
    const id=req.user._id;

    if(!id){
        return res.status(400).json({message:"User not found"});
    }
try {
    
    const user = await User.findOneAndUpdate({_id:id},req.body,{new:true});
    if(!user){
        return res.status(400).json({message:"User not found"});
    }
    return res.status(200).json({message:"User updated successfully",user});
} catch (error) {
    console.log(error);
    return res.status(500).json({message:error});
}

}


const fetchUserData= async (req,res) => {
    
    const id = req.user._id;
    const user = await User.findOne({_id:id}).select("-password");
    if(!user){
        return res.status(400).json({message:"User not found"});
    }
    return res.status(200).json({message:"User found successfully",user});
}


const getMySubscription = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get the OwnerUser link for this user (most recent approved one)
        const link = await OwnerUser.findOne({ userId, status: "approved" })
            .sort({ createdAt: -1 })
            .populate("ownerId", "name email");

        if (!link) {
            return res.status(200).json({ message: "No gym linked", subscription: null, gym: null });
        }

        // Get latest subscription from that owner
        const subscription = await Subscription.findOne({
            userId,
            ownerId: link.ownerId._id,
        }).sort({ createdAt: -1 }).lean();

        if (!subscription) {
            return res.status(200).json({ message: "No subscription found", subscription: null, gym: link.ownerId });
        }

        const now = new Date();
        const daysLeft = Math.max(0, Math.ceil((new Date(subscription.endDate) - now) / (1000 * 60 * 60 * 24)));
        const status = daysLeft > 0 ? "active" : "expired";

        return res.status(200).json({message:"Subscription fetched",
            subscription: { ...subscription, daysLeft, status },
            gym: link.ownerId,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}


// Get all PENDING gym requests for the logged-in user
const getPendingGymRequests = async (req, res) => {
    try {
        const userId = req.user._id;
        const pendingLinks = await OwnerUser.find({ userId, status: "pending" })
            .populate("ownerId", "name email")
            .sort({ createdAt: -1 });

        // Attach subscription info to each pending request
        const requests = await Promise.all(
            pendingLinks.map(async (link) => {
                const subscription = await Subscription.findOne({
                    userId,
                    ownerId: link.ownerId._id,
                }).sort({ createdAt: -1 }).lean();

                return {
                    linkId: link._id,
                    gym: link.ownerId,
                    createdAt: link.createdAt,
                    subscription: subscription
                        ? {
                            fee: subscription.fee,
                            startDate: subscription.startDate,
                            endDate: subscription.endDate,
                            durationDays: Math.round(
                                (new Date(subscription.endDate) - new Date(subscription.startDate)) /
                                (1000 * 60 * 60 * 24)
                            ),
                        }
                        : null,
                };
            })
        );

        return res.status(200).json({ message: "Pending requests fetched", requests });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};


// Accept or reject a gym request
const respondToGymRequest = async (req, res) => {
    try {
        const userId = req.user._id;
        const { linkId } = req.params;
        const { action } = req.body; // "accept" | "reject"

        if (!action || !["accept", "reject"].includes(action)) {
            return res.status(400).json({ message: "action must be 'accept' or 'reject'" });
        }

        const link = await OwnerUser.findOne({ _id: linkId, userId });
        if (!link) {
            return res.status(404).json({ message: "Request not found" });
        }
        if (link.status !== "pending") {
            return res.status(400).json({ message: `Request is already ${link.status}` });
        }

        const newStatus = action === "accept" ? "approved" : "rejected";
        link.status = newStatus;
        await link.save();

        // If rejected, delete the pending subscription
        if (newStatus === "rejected") {
            await Subscription.deleteMany({ userId, ownerId: link.ownerId, pending: true });
        } else {
            // Activate the subscription
            await Subscription.updateMany(
                { userId, ownerId: link.ownerId, pending: true },
                { $unset: { pending: 1 } }
            );
        }

        return res.status(200).json({
            message: action === "accept" ? "Gym request accepted. Your membership is now active!" : "Gym request rejected.",
            status: newStatus,
        });
    } catch (error) {
        console.log(error);
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
}