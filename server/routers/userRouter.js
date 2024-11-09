
import { Router } from "express";

import jwt from  "jsonwebtoken";
import { postRegistation, postLogin } from "../controllers/userController.js";

const { sign } = jwt;

const router = Router();


router.post('/register',  postRegistation)

router.post('/login', postLogin)


export default router
