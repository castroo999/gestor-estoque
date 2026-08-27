import type {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";

export function verificarToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({
      mensagem: "Token não informado",
    });
    return;
  }

  const token = authorization.slice(7);
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET não foi definida");
  }

  try {
    const payload = jwt.verify(token, jwtSecret);

    if (
      typeof payload === "string" ||
      typeof payload.userId !== "string"
    ) {
      res.status(401).json({
        mensagem: "Token inválido",
      });
      return;
    }

    req.userId = payload.userId;

    next();
  } catch {
    res.status(401).json({
      mensagem: "Token inválido ou expirado",
    });
  }
}