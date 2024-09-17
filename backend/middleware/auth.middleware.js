import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const secreteKey = "swer&*&^#*&^@HJHjsdhfksdfhskfhw9853734598374"; // Same secret key used for signing tokens

export const protectRoute = async (req, res, next) => {
    try {
        // Get token from headers
        const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
        // console.log(token);

        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        // Verify the token
        const decoded = jwt.verify(token, secreteKey);

        // Fetch user data and attach it to the req object
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found, authorization denied" });
        }

        // Attach user to the request
        req.user = user;

        // Move to the next middleware or controller
        next();
    } catch (error) {
        console.error("Error in protectRoute middleware:", error);
        return res.status(401).json({ message: "Token is not valid or has expired" });
    }
};
