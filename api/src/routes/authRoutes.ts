import { Router } from "express";
import { login, logout, me, refreshToken, register } from "../controllers/authController";


const router: Router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/logout', logout);
router.get('/me', me);
router.get('/refresh', refreshToken)

export default router;
