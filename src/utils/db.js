import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// สร้าง Pool สำหรับการเชื่อมต่อ
// ค่าต่างๆ จะถูกดึงมาจากไฟล์ .env เพื่อความปลอดภัย
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ฟังก์ชันสำหรับใช้ Query ข้อมูล
export const query = (text, params) => {
  return pool.query(text, params);
};

export default pool;
