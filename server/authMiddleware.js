import jwt from "jsonwebtoken";
import "dotenv/config";

export function generarToken({ id_usuario, email }) {
  return jwt.sign(
    { id_usuario, email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
}

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : req.cookies?.token; // 🔥 Leer header Authorization o cookie

  if (!token) {
    return res.status(401).json({ mensaje: "Token no enviado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ mensaje: "Token inválido" });
  }
}
