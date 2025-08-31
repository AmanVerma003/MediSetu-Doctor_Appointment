import jwt from "jsonwebtoken";

export const authAdmin = async (req, res, next) => {
  try {
    const aToken = req.headers.authorization?.split(" ")[1];
    if (!aToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Admin: Token missing",
      });
    }
    const decoded = jwt.verify(aToken, process.env.JWT_A_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    console.error("Admin Auth Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized Admin: Invalid token",
    });
  }
};
