import { GymOwner } from "../Models/gymOwner.model.js";
import bcrypt from 'bcrypt'
import { User } from "../Models/user.model.js";

const signup = async (req, res) => {
    try {
        const {name,email,password,JWT_SECRT} = req.body;
   
        if(!name || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
    
        if(JWT_SECRT == process.env.GYM_OWNER_SECRET){
            return res.status(400).json({message:"JWT_SECRT is requiredor invalid"});
        }
    
        const hasedPassword=await bcrypt.hash(password,10);
    
        const gymOwner = await GymOwner.create({
            name,
            email,
            password:hasedPassword,
        
        })

        if(!gymOwner){
            return res.status(400).json({message:"GymOwner not created"});
        }
    
        const ownerToken = await gymOwner.generateGymOwnerToken();
    
        if(!ownerToken){
            return res.status(400).json({message:"Token not created"});
        }
    
        res.cookie("ownerToken", ownerToken, {
            httpOnly: false,          // JS can't access (XSS protection)
            maxAge: 30 * 24 * 60 * 60, // 30 days
        });
    
        gymOwner.gymOwnerToken=ownerToken;
    
        gymOwner.save();
    
        
    
        return res.status(200).json({message:"GymOwner created successfully"}
            ,
            gymOwner
        );
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:error.message});
        
    }
}



const signin = async (req, res) => {
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({message:"All fields are required"});
    }

    const gymOwner = await GymOwner.findOne({email}).select("+password");

    if(!gymOwner){
        return res.status(400).json({message:"GymOwner not found"});
    }

    const isMatch = await bcrypt.compare(password,gymOwner.password);

    if(!isMatch){
        return res.status(400).json({message:"Invalid credentials"});
    }

    const ownerToken = gymOwner.generateGymOwnerToken();

    if(!ownerToken){
        return res.status(400).json({message:"Token not created"});
    }

    res.cookie("ownerToken", ownerToken, {
        httpOnly: false,          // JS can't access (XSS protection)
        maxAge: 30 * 24 * 60 * 60, // 30 days
    });


    return res.status(200).json({message:"GymOwner logged in successfully"}
        ,gymOwner
    );

}


const logout = async(req,res)=>{

    res.cookie("ownerToken", null, {
        httpOnly: false,          // JS can't access (XSS protection)
        maxAge: 0, // 30 days
    });
    return res.status(200).json({message:"GymOwner logged out successfully"});

}


// REQUEST USER
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
        return res.status(400).json({
          message: "Provide user email or userId",
        });
      }
  
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
  
      const existing = await OwnerUser.findOne({
        ownerId,
        userId: user._id,
      });
  
      if (existing) {
        return res.status(400).json({
          message: `Request already ${existing.status}`,
        });
      }
  
      const request = await OwnerUser.create({
        ownerId,
        userId: user._id,
      });
  
      return res.status(201).json({
        message: "Request sent successfully",
        request,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };


export {
    signup,
    signin,
    logout,
    requestUser
}