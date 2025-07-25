import { register, login, me } from "../repositories/auth.repo.js";
import bcrypt from "bcryptjs";

export const registerService = async (data) => {
  try {
    if (!data.fullName || !data.email || !data.password) {
      throw new Error("Tüm alanlar zorunludur.");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    const existingUser = await login(data.email);
    if (existingUser) {
      throw new Error("Bu e-posta adresi zaten kayıtlı.");
    }

    return await register(data);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const loginService = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error("E-posta ve şifre zorunludur.");
    }

    const user = await login(email);
    if (!user) {
      throw new Error("Kullanıcı bulunamadı.");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Şifre yanlış.");
    }
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const meService = async (email) => {
  try {
    if (!email) {
      throw new Error("E-posta zorunludur.");
    }

    const user = await me(email);
    if (!user) {
      throw new Error("Kullanıcı bulunamadı.");
    }
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};
