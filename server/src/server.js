import express from "express";
import http from "http";
import cors from "cors";
import { startSocketServer } from "./sockets.js";
import * as dotenv from "dotenv";
import { router as roomRouter } from "./room-router.js";

dotenv.config();

let app = express();
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.header("X-Content-Type-Options", "nosniff");
  res.header("X-Frame-Options", "deny");
  res.header("Content-Security-Policy", "default-src 'none';");

  next();
});
app.use(express.json());
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);
app.use("/room", roomRouter);

const server = http.createServer(app);
server.listen(process.env.PORT, () => {
  console.log(`listening on *:${process.env.PORT}`);
});

startSocketServer(server);
