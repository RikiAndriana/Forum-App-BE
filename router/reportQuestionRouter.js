import express from "express";
import { authMiddleware, permisionUser } from "../middleware/authMiddleware.js";
import {
  addReport,
  allReport,
} from "../controller/reportQuestionController.js";

const router = express.Router();

// CRUD
// post /api/v1/report/question/:idQuestion
router.post("/:idQuestion", authMiddleware, addReport);

// get /api/v1/report/question
router.get("/", authMiddleware, permisionUser("admin"), allReport);
export default router;
