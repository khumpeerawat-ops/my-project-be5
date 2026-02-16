import { query } from "../utils/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// --- Exercise #1: Register ---
export const register = async (req, res) => {
  const { username, password, firstName, lastName } = req.body;

  // 1. Validate ข้อมูลเบื้องต้น
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    // 2. เข้ารหัส Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. บันทึกลง PostgreSQL
    const sql = `
      INSERT INTO users (username, password, first_name, last_name)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username;
    `;

    await query(sql, [username, hashedPassword, firstName, lastName]);

    return res.status(201).json({
      message: "User has been created successfully",
    });
  } catch (error) {
    // จัดการกรณี Username ซ้ำ (Unique constraint)
    if (error.code === "23505") {
      return res.status(400).json({ message: "Username already exists" });
    }
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

// --- Exercise #2: Login ---
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. ค้นหา User
    const result = await query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    const user = result.rows[0];

    // 2. ตรวจสอบ Username และ Password
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // 3. สร้าง JWT Token
    const token = jwt.sign(
      {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1d" },
    );

    // 4. Response กลับตามโจทย์
    return res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};
