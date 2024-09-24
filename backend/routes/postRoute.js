import express from "express";

import { protectRoute } from "../middleware/auth.middleware.js";
import { createComment, createPost, deletePost, getFeedPosts, likePost } from "../controllers/postController.js";

const router = express.Router();

router.get("/", protectRoute, getFeedPosts);
router.post("/create", protectRoute, createPost);
router.delete("/delete/:id", protectRoute, deletePost);
router.post("/:id/like", protectRoute, likePost);
router.post("/:id/comment", protectRoute, createComment);

// router.get("/:id", protectRoute, getPostById);

export default router;