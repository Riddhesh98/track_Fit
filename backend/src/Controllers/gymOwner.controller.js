import { GymOwner } from "../Models/gymOwner.model.js";
import bcrypt from 'bcrypt'

const signup = async (req, res) => {
    const {name,email,password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({message:"All fields are required"});
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


export {
    signup,
    signin,
    logout
}