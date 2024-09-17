import cloudinary from "../cloudinary/cloudinary.js";
import Post from "../models/postModel.js";

export const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: { $in: [...req.user.connections, req.user._id] } })
            .populate("author", "name username profilePicture headline")
            .populate("comments.user", "name profilePicture")
            .sort({ createdAt: -1 });

        return res.status(200).json({ data: posts });
    } catch (error) {
        console.error("Error in getFeedPosts controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const createPost = async (req, res) => {
    try {
        const { content, image } = req.body;
        let newPost;

        if (image) {
            const imgResult = await cloudinary.uploader.upload(image);
            newPost = new Post({
                author: req.user._id,
                content,
                image: imgResult.secure_url,
            });
        } else {
            newPost = new Post({
                author: req.user._id,
                content,
            });
        }

        await newPost.save();
        return res.status(201).json({
            message: "User post created successfully",
            post: newPost
        });

    } catch (error) {
        console.error("Error in createPost controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};