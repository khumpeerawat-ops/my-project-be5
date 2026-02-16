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

// --- Update หนังสือ ---
export const updateBook = async (req, res) => {
  const { id } = req.params; // ID ของหนังสือที่ต้องการแก้ไข
  const { title, author, description } = req.body;
  const userId = req.user.id; // ID ของเจ้าของที่ Login อยู่

  try {
    // ตรวจสอบว่ามีหนังสือเล่มนี้ และเป็นของ User คนนี้จริงๆ หรือไม่
    const sql = `
      UPDATE books 
      SET title = $1, author = $2, description = $3
      WHERE id = $4 AND user_id = $5
      RETURNING *;
    `;

    const result = await query(sql, [title, author, description, id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message:
          "Book not found or you don't have permission to update this book",
      });
    }

    return res.json({
      message: "Book has been updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

// --- Delete หนังสือ ---
export const deleteBook = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const sql = `
      DELETE FROM books 
      WHERE id = $1 AND user_id = $2
      RETURNING id;
    `;

    const result = await query(sql, [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message:
          "Book not found or you don't have permission to delete this book",
      });
    }

    return res.json({
      message: `Book ID: ${id} has been deleted successfully`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};
