import express from "express";
import { GetProfile, getPublicProfile, getSuggestedConnections, Login, Register } from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.middleware.js";


const router = express.Router();


router.post('/register', Register)

//Login
router.post('/login', Login)
//Profile
router.post('/profile', GetProfile);
// suggestions
router.post("/suggestions", protectRoute, getSuggestedConnections);

router.post("/:username", protectRoute, getPublicProfile);




export default router;