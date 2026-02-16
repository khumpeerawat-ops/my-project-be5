import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  // 1. ดึง Token จาก Header ชื่อ 'Authorization'
  const token = req.headers.authorization;

  // 2. ตรวจสอบว่ามี Token ส่งมาไหม และขึ้นต้นด้วย 'Bearer ' หรือไม่
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Token is missing or has invalid format",
    });
  }

  // 3. ตัดคำว่า 'Bearer ' ออกเพื่อเอาตัว Token จริงๆ
  const tokenWithoutBearer = token.split(" ")[1];

  // 4. ตรวจสอบความถูกต้องของ Token ด้วย SECRET_KEY
  jwt.verify(tokenWithoutBearer, process.env.SECRET_KEY, (err, payload) => {
    if (err) {
      return res.status(401).json({
        message: "Token is invalid or expired",
      });
    }

    // 5. ถ้าผ่าน ให้เก็บข้อมูล User ไว้ใน req เพื่อใช้ต่อใน Controller
    req.user = payload;

    // 6. อนุญาตให้ไปทำงานที่ฟังก์ชันถัดไป (Next step)
    next();
  });
};
