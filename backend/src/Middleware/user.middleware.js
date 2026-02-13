import jwt from "jsonwebtoken";

const userMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    console.log( "from middleware",token);
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.USER_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

export default userMiddleware;    