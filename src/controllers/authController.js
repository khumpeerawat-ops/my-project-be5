import { query } from "../utils/db.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  const { username, password, firstName, lastName } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (username, password, first_name, last_name)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username;
    `;

    const result = await query(sql, [
      username,
      hashedPassword,
      firstName,
      lastName,
    ]);

    res.status(201).json({
      message: "User created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
};
