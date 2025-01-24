import Question from "../models/Question.js";
import VotingQuestion from "../models/VotingQuestion.js";
import asyncWrapper from "../middleware/asyncWrapper.js";

export const likeQuestion = asyncWrapper(async (req, res) => {
  const questionId = req.params.idQuestion;

  const questionData = await Question.findById(questionId);
  if (!questionData) {
    res.status(404);
    throw new Error("Question Not Found");
  }

  const newVoting = await VotingQuestion.create({
    userId: req.user._id,
    questionId: questionId,
  });

  await Question.findByIdAndUpdate(questionData._id, {
    voteCount: questionData.voteCount + 1,
  });

  return res.status(200).json({
    message: "Successfully Like Question",
    data: newVoting,
  });
});

export const dislikeQuestion = asyncWrapper(async (req, res) => {
  const questionId = req.params.idQuestion;

  const questionData = await Question.findById(questionId);
  if (!questionData) {
    res.status(404);
    throw new Error("Question Not Found");
  }

  const votingQuestion = await VotingQuestion.findOne({
    userId: req.user._id,
    questionId: questionData._id,
  });
  if (!votingQuestion) {
    res.status(400);
    throw new Error("This Question isn't liked yet");
  }

  await VotingQuestion.findOneAndDelete({
    userId: req.user._id,
    questionId: questionId,
  });

  await Question.findByIdAndUpdate(questionData._id, {
    voteCount: questionData.voteCount - 1,
  });

  return res.status(200).json({ message: "Successfully Dislike Question" });
});

export const getVoting = asyncWrapper(async (req, res) => {
  const voting = await VotingQuestion.findOne({
    questionId: req.params.idQuestion,
    userId: req.params.idUser,
  });

  return res.status(200).json({ message: "Get Detail Voting", data: voting });
});
