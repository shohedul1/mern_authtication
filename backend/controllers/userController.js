import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken"; // Import jsonwebtoken
import cloudinary from "../cloudinary/cloudinary.js";

const secreteKey = "swer&*&^#*&^@HJHjsdhfksdfhskfhw9853734598374";


export const Register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            username,
        });

        await user.save();
        // const token = jwt.sign({ id: user._id, email: user.email }, secreteKey, { expiresIn: '1hr' })


        return res.status(201).json({ status: true, message: "Register successful", })
    } catch (error) {
        return res.status(400).json({ status: false, message: "Something went wrong", error: error.message })
    }
};

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ status: false, message: "All files are require" })

        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ status: true, message: "Invalid Credential" })
        }

        const token = jwt.sign({ id: user._id, email: user.email }, secreteKey, { expiresIn: "15d", })

        return res.status(201).json({ status: true, message: "Login successful", token: token, user })
    } catch (error) {
        return res.status(400).json({ status: false, message: "Something went wrong", error: error.message })
    }
}

export const GetProfile = async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(' ')[1];
        if (!token) return res.status(400).json({ status: false, message: "Access Denied" })

        jwt.verify(token, secreteKey, async (err, decode) => {
            const user = await User.findById(decode?.id)
            if (!user) return res.status(400).json({ status: false, message: "Invalid Token" })
            return res.status(201).json({ status: true, message: "Profile Data", data: user })
        })

    } catch (error) {
        return res.status(400).json({ status: false, message: "Something went wrong", error: error.message })
    }
}

export const getPublicProfile = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json(user);
    } catch (error) {
        console.error("Error in getPublicProfile controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getSuggestedConnections = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id).select("connections");

        // Find users who are not already connected, and exclude the current user
        const suggestedUser = await User.find({
            _id: {
                $ne: req.user._id,
                $nin: currentUser.connections,
            },
        })
            .select("name username profilePicture headline")
            .limit(5);

        // Return users as an object with a `data` field
        return res.json({ data: suggestedUser });
    } catch (error) {
        console.error("Error in getSuggestedConnections controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// export const updateProfile = async (req, res) => {
//     try {
//         const allowedFields = [
//             "name",
//             "username",
//             "headline",
//             "about",
//             "location",
//             "profilePicture",
//             "bannerImg",
//             "skills",
//             "experience",
//             "education",
//         ];

//         const updatedData = {};

//         for (const field of allowedFields) {
//             if (req.body[field]) {
//                 updatedData[field] = req.body[field];
//             }
//         }

//         if (req.body.profilePicture) {
//             const result = await cloudinary.uploader.upload(req.body.profilePicture);
//             updatedData.profilePicture = result.secure_url;
//         }

//         if (req.body.bannerImg) {
//             const result = await cloudinary.uploader.upload(req.body.bannerImg);
//             updatedData.bannerImg = result.secure_url;
//         }

//         const user = await User.findByIdAndUpdate(req.user._id, { $set: updatedData }, { new: true }).select(
//             "-password"
//         );

//         return res.json(user, { message: "user profile updata" });
//     } catch (error) {
//         console.error("Error in updateProfile controller:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// };


export const updateProfile = async (req, res) => {
    try {
        const allowedFields = [
            "name",
            "username",
            "headline",
            "about",
            "location",
            "profilePicture",
            "bannerImg",
            "skills",
            "experience",
            "education",
        ];

        const updatedData = {};

        // Check allowed fields in the request body
        for (const field of allowedFields) {
            if (req.body[field]) {
                updatedData[field] = req.body[field];
            }
        }

        // Handle profile picture upload
        if (req.body.profilePicture) {
            try {
                const result = await cloudinary.uploader.upload(req.body.profilePicture);
                updatedData.profilePicture = result.secure_url;
            } catch (error) {
                console.error('Error uploading profile picture to Cloudinary:', error);
                return res.status(500).json({ message: "Error uploading profile picture" });
            }
        }

        // Handle banner image upload
        if (req.body.bannerImg) {
            try {
                const result = await cloudinary.uploader.upload(req.body.bannerImg);
                updatedData.bannerImg = result.secure_url;
            } catch (error) {
                console.error('Error uploading banner image to Cloudinary:', error);
                return res.status(500).json({ message: "Error uploading banner image" });
            }
        }

        // Update user profile in the database
        const user = await User.findByIdAndUpdate(req.user._id, { $set: updatedData }, { new: true }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Success response with updated user data
        return res.json({ data: user, message: "User profile updated successfully" });
    } catch (error) {
        console.error("Error in updateProfile controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};
