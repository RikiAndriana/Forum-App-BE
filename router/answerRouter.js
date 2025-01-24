import express from "express";
import { authMiddleware, permisionUser } from "../middleware/authMiddleware.js";
import { addAnswer, deleteAnswer } from "../controller/anwerController.js";

const router = express.Router();

// CRUD
// post /api/v1/answer/:idQuestion
router.post("/:idQuestion", authMiddleware, addAnswer);

// delete /api/v1/answer/:id
router.delete("/:id", authMiddleware, deleteAnswer);

export default router;
