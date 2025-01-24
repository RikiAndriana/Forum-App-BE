import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  likeQuestion,
  dislikeQuestion,
  getVoting,
} from "../controller/votingQuestionController.js";

const router = express.Router();

// CRUD
// post /api/v1/voting/:idQuestion
router.post("/:idQuestion", authMiddleware, likeQuestion);

// delete /api/v1/voting/:idQuestion
router.delete("/:idQuestion", authMiddleware, dislikeQuestion);

// get /api/v1/voting/:idQuestion/user/:idUser
router.get("/:idQuestion/user/:idUser", getVoting);

export default router;
