import { User } from "../Models/user.model.js";
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



export {
    signup,
    login,
    logout
}