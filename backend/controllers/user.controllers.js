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
  secure: true,
  sameSite: "none",
  maxAge: 24 * 60 * 60 * 1000
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
        user.password = undefined;
       return res.cookie("token", token, {
           httpOnly: true,
  secure: true,
  sameSite: "none",
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
        secure: true,
        sameSite: "none",
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
const getMe=async(req,res)=>{
  try {

    const userId = req.user._id; 
   
  
    const user = await User.findById(userId).select("-password").populate({path:"workspaces",select:"name"}); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } 
    return res.status(200).json({ message: "User fetched successfully", user });  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error in getting user" });
  }
}
const getFriends=async(req,res)=>{
  try {
    console.log("Fetching friends for user ID:", req.params.id);
    const userId = req.params.id; 
    const user = await User.findById(userId).select("-password").populate({path:"friends",select:"fullName email"}); // Exclude password field from the response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User fetched successfully", friends:user.friends });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error in getting user" });
  }
}
const addFriend=async(req,res)=>{
   try {
    const { email } = req.body;
    console.log("herere")
    const currentUserId = req.user._id;

    // Find the friend by email
    const friend = await User.findOne({ email });
    if (!friend) {
      return res.status(404).json({ message: 'User with this email not found' });
    }

    // Check if it's the same user
    if (friend._id.equals(currentUserId)) {
      return res.status(400).json({ message: 'You cannot add yourself as a friend' });
    }

    // Check if already friends
    const currentUser = await User.findById(currentUserId);
    if (currentUser.friends.includes(friend._id)) {
      return res.status(400).json({ message: 'This user is already your friend' });
    }

    // Add friend to both users (two-way friendship)
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { friends: friend._id }
    });

    await User.findByIdAndUpdate(friend._id, {
      $addToSet: { friends: currentUserId }
    });

    // Get updated user data with populated friends
    const updatedUser = await User.findById(currentUserId)
      .populate('friends', 'fullName email profilePicture');

    res.status(200).json({
      message: 'Friend added successfully', 
      
      friends: updatedUser.friends
    });

  } catch (error) {
    console.error('Error adding friend:', error);
    res.status(500).json({ message: 'Failed to add friend', error: error.message });
  }
}

module.exports = { signup,login,logout,getUser,getMe,getFriends,addFriend };

