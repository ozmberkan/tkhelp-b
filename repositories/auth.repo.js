import { prisma } from "../prisma/prisma.js";

export const register = async (data) => {
  return await prisma.user.create({
    data: data,
  });
};

export const login = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
};

export const me = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
};
