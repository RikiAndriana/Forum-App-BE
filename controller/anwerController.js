import Answer from "../models/Answer.js";
import Question from "../models/Question.js";
import asyncWrapper from "../middleware/asyncWrapper.js";
import { checkPermission } from "../middleware/checkPermission.js";

export const addAnswer = asyncWrapper(async (req, res) => {
  const questionId = req.params.idQuestion;

  const questionData = await Question.findById(questionId);
  if (!questionData) {
    res.status(404);
    throw new Error("Question Not Found");
  }

  const newAnswer = await Answer.create({
    answer: req.body.answer,
    questionId: questionId,
    userId: req.user._id,
  });

  return res.status(200).json({
    message: "Successfully Create Answer",
    data: newAnswer,
  });
});

export const deleteAnswer = asyncWrapper(async (req, res) => {
  const paramsId = req.params.id;

  const answerData = await Answer.findById(paramsId);
  checkPermission(req.user, answerData.userId, res);

  await Answer.findByIdAndDelete(paramsId);
  return res.status(200).json({ message: "Berhasil hapus jawaban" });
});
