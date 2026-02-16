import { Router } from "express";
import { register, login } from "../controllers/authController.js";

const bookRouter = Router();

bookRouter.post("/register", register);
bookRouter.post("/login", login);

export default bookRouter;
