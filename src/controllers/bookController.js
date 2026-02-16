import { query } from "../utils/db.js";

// ดึงรายการหนังสือทั้งหมด (เฉพาะของตัวเอง)
export const getBooks = async (req, res) => {
  const userId = req.user.id; // ได้มาจาก Middleware protect.js

  try {
    const result = await query(
      "SELECT * FROM books WHERE user_id = $1 ORDER BY id DESC",
      [userId],
    );

    return res.json({
      data: result.rows,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

// เพิ่มหนังสือเล่มใหม่
export const createBook = async (req, res) => {
  const { title, author, description } = req.body;
  const userId = req.user.id;

  if (!title || !author) {
    return res.status(400).json({ message: "Title and Author are required" });
  }

  try {
    const sql = `
      INSERT INTO books (title, author, description, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await query(sql, [title, author, description, userId]);

    return res.status(201).json({
      message: "Book has been added successfully",
      data: result.rows[0],
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};
