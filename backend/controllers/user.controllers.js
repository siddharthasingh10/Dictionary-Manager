const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model'); // adjust the path if needed

const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) { 
      return res.status(400).json({ errors: errors.array() });
    }

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user=  await User.create({
      fullName,
      email,
      password: hashedPassword
    });
    const userToSend = { ...user._doc };
delete userToSend.password;

    const token =jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
        maxAge: 1 * 24 * 60 * 60 * 1000 
      });
    return res.status(201).json({ message: "User created successfully", success: true,user:userToSend });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error in signing up" });
  }
};

const login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        const user=await User.findOne({email}).select("+password");
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
       return res.cookie("token", token, {
            httpOnly: true,
            secure:false,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 
          }).json({ message: "Login successful", success: true, user });
          
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error in logging in" });
    }
}
const logout=async(req,res)=>{
  try {
    const token=req.cookies?.token;
    if (!token) {
        return res.status(400).json({ 
            message: "No token found, user already logged out.",
            success: false 
        });
    }

    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
    });

    return res.status(200).json({
        message: "Logged out successfully.",
        success: true
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error in logging out" });
  }
}
const getUser=async(req,res)=>{
  try {
    const userId = req.params.id; 
    const user = await User.findById(userId).select("-password").populate({path:"workspaces",select:"name"}); // Exclude password field from the response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User fetched successfully", user });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error in getting user" });
  }
}


module.exports = { signup,login,logout,getUser };

