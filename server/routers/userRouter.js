
import { Router } from "express";
import { postRegistation, postLogin } from "../controllers/userController.js";


const router = Router();


router.post('/register',  postRegistation)

router.post('/login', postLogin)


export default router
