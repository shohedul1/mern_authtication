import express from "express";
import { GetProfile, Login, Register } from "../controllers/userController.js";


const router = express.Router();


router.post('/register', Register)

//Login
router.post('/login', Login)

//Profile
router.post('/profile', GetProfile)


export default router;