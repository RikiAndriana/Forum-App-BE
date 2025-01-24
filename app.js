import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Router
import authRouter from "./router/authRouter.js";
import questionRouter from "./router/questionRouter.js";
import answerRouter from "./router/answerRouter.js";
import votingRouter from "./router/votingQuestionRouter.js";
import reportQuestionRouter from "./router/reportQuestionRouter.js";

import cookieParser from "cookie-parser";
import morgan from "morgan";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

dotenv.config();
const app = express();

// Middleware
// app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Parent Router
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/question", questionRouter);
app.use("/api/v1/answer", answerRouter);
app.use("/api/v1/voting", votingRouter);
app.use("/api/v1/report/question", reportQuestionRouter);

app.use(notFound);
app.use(errorHandler);

// connect to mongodb
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(process.env.PORT, () => {
  console.log(`server listening on http://localhost:${process.env.PORT}`);
});
