import jwt from "jsonwebtoken";

export const verifyOwner = (req, res, next) => {
  try {
    const token = req.cookies.ownerToken;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.GYM_OWNER_SECRET);

    req.owner = decoded; // { id }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};