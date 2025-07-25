import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res
      .status(401)
      .json({ success: false, message: "Erişim izni reddedildi." });
  }

  try {
    const user = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, message: "Geçersiz erişim izni." });
  }
};
