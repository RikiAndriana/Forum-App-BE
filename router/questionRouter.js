import express from "express";
import {
  CreateQuestion,
  QuestionAll,
  DetailQuestion,
  UpdateQuestion,
  DeleteQuestion,
} from "../controller/questionController.js";
import { authMiddleware, permisionUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// CRUD
// post /api/v1/question
router.post("/", authMiddleware, CreateQuestion);

// get /api/v1/question
router.get("/", QuestionAll);

// get /api/v1/question/:id
router.get("/:id", DetailQuestion);

// put /api/v1/question/:id
router.put("/:id", authMiddleware, UpdateQuestion);

// delete /api/v1/question/:id
router.delete("/:id", authMiddleware, DeleteQuestion);

export default router;
