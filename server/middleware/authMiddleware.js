import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ mensaje: "No autorizado" });

  const token = header.split(" ")[1];

  try {
    const user = jwt.verify(token, "CLAVE_SECRETA");
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ mensaje: "Token inválido" });
  }
}
