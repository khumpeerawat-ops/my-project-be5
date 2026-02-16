import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./src/routes/auth.js";
import bookRouter from "./src/routes/books.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

// โหลดค่าจากไฟล์ .env
dotenv.config();

const app = express();

const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 4000;

// Middlewares หลัก
app.use(cors());
app.use(express.json());

// นำ Router มาใช้งาน
app.use("/auth", authRouter);
app.use("/books", bookRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Book Collection API");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
