import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: JwtPayload & { id: string; role: string }; // supaya ada role & id
}

// ======================= VERIFY TOKEN =======================
export const verifyToken: RequestHandler = (req, res, next) => {
  const token = (req as AuthRequest).cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload & {
      id: string;
      role: string;
    };
    (req as AuthRequest).user = decoded; // inject user info
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// ======================= CHECK ROLES =======================
export const checkRoles = (roles: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthRequest).user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }

    next();
  };
};
