import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log(
    `✅ - Backend Sunucusu "http://localhost:${process.env.PORT}" portunda çalışıyor.`
  );
});
