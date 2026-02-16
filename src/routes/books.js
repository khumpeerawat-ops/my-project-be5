import { Router } from "express";
import { getBooks, createBook } from "../controllers/bookController.js";
import { protect } from "../middlewares/protect.js";

const bookRouter = Router();

// บังคับให้ทุก API ในนี้ต้องมี Token
bookRouter.use(protect);

bookRouter.get("/", getBooks); //ดูรายการหนังสือ
bookRouter.post("/", createBook); //เพิ่มหนังสือ

export default bookRouter;
