import Question from "../models/Question.js";
import ReportQuestion from "../models/ReportQuestion.js";
import asyncWrapper from "../middleware/asyncWrapper.js";

export const addReport = asyncWrapper(async (req, res) => {
  const questionId = req.params.idQuestion;

  const questionData = await Question.findById(questionId);

  if (!questionData) {
    res.status(404);
    throw new Error("Question Not Found");
  }

  const newReport = await ReportQuestion.create({
    userId: req.user._id,
    questionId: questionId,
    report: req.body.report,
  });

  return res.status(200).json({
    message: "Question Successfully Reported",
    data: newReport,
  });
});

export const allReport = asyncWrapper(async (req, res) => {
  const allReport = await ReportQuestion.find()
    .populate("userId", "-password")
    .populate("questionId");

  return res
    .status(200)
    .json({ message: "Successfully Get All Report", data: allReport });
});
