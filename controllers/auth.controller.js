import {
  registerService,
  loginService,
  meService,
} from "../services/auth.service.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const registerController = async (req, res) => {
  try {
    const data = req.body;

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await registerService(data);

    data.password = hashedPassword;

    const accessToken = jwt.sign(
      { email: data.email, id: user.id },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { email: data.email, id: user.id },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 604800000, // 7 days
    });

    return res.status(201).json({ success: true, message: "Kayıt başarılı." });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await loginService(email, password);

    const accessToken = jwt.sign(
      { email: user.email, id: user.id },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { email: user.email, id: user.id },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 604800000, // 7 days
    });

    return res.status(200).json({ success: true, message: "Giriş başarılı." });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const meController = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res
        .status(401)
        .json({ success: false, message: "Yetkisiz erişim." });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
    const user = await meService(decoded.email);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Kullanıcı bulunamadı." });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const logoutController = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.status(200).json({ success: true, message: "Çıkış başarılı." });
};

export const refreshTokenController = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, message: "Yetkisiz erişim." });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "Geçersiz token." });
    }

    const newAccessToken = jwt.sign(
      { email: decoded.email, id: decoded.id },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    return res.status(200).json({ success: true, message: "Token yenilendi." });
  });
};
