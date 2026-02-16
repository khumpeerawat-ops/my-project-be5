import { Router } from "express";
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";
import { protect } from "../middlewares/protect.js";

const bookRouter = Router();

// บังคับให้ทุก API ในนี้ต้องมี Token
bookRouter.use(protect);

bookRouter.get("/", getBooks); //ดูรายการหนังสือ
bookRouter.post("/", createBook); //เพิ่มหนังสือ
bookRouter.put("/:id", updateBook); // สำหรับแก้ไข
bookRouter.delete("/:id", deleteBook); // สำหรับลบ

export default bookRouter;
