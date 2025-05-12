const jwt=require("jsonwebtoken");

const userAuth=async(req,res,next)=>{
    try {

        const token = req.cookies?.token; 
     
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - No token provided",
                success: false
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); 

        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized - Invalid token",
                success: false
            });
        }
            // console.log("Decoded token:", decoded); // Log the decoded token for debugging
        req.id = decoded.id; 
        req.user = { _id: decoded.id };
// console.log("User ID from token:", req.user._id); // Log the user ID for debugging
        next(); 
        // console.log("User authenticated successfully"); // Log success message
        
    } catch (error) {
        console.error("Auth Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message,
            error
        });
    }
}
module.exports={userAuth};