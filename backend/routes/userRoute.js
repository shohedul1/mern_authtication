import express from "express";
import { GetProfile, getPublicProfile, getSuggestedConnections, Login, Register, updateProfile } from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.middleware.js";


const router = express.Router();


router.post('/register', Register)

//Login
router.post('/login', Login)
//existing Profile 
router.post('/profile', GetProfile);
// suggestions profile get
router.post("/suggestions", protectRoute, getSuggestedConnections);
//any single profile get
router.post("/:username", protectRoute, getPublicProfile);
//update profile 
router.put("/updateprofile", protectRoute, updateProfile);






export default router;