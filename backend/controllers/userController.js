import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken"; // Import jsonwebtoken

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
