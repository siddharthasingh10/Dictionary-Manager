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
        secure: process.env.NODE_ENV === "production", // use secure cookies in production
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 
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
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 
          });
        return res.status(200).json({ message: "Login successful", success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error in logging in" });
    }
}

module.exports = { signup,login };

