import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized User: Token missing",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_U_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("User Auth Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized User: Invalid token",
    });
  }
};
