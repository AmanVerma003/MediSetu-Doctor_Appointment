import jwt from "jsonwebtoken";

export const authDoc = async (req, res, next) => {
  try {
    const dToken = req.headers.authorization?.split(" ")[1];
    if (!dToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Admin: Token missing",
      });
    }
    const decoded = jwt.verify(dToken, process.env.JWT_D_SECRET);
    req.docId = decoded.id;
    next();
  } catch (error) {
    console.error("Admin Auth Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized Admin: Invalid token",
    });
  }
};
