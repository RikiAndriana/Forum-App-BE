import Question from "../models/Question.js";
import asyncWrapper from "../middleware/asyncWrapper.js";
import { checkPermission } from "../middleware/checkPermission.js";

export const CreateQuestion = asyncWrapper(async (req, res) => {
  const { title, question, category } = req.body;
  const newQuestion = await Question.create({
    title,
    question,
    category,
    userId: req.user._id,
  });
  return res
    .status(200)
    .json({ message: "add question success", data: newQuestion });
});

export const QuestionAll = asyncWrapper(async (req, res) => {
  // FILTER
  // *mongoose feature (.sort .limit .skip)
  // req query
  const queryObj = { ...req.query };
  // ignore query sort & page
  const excludeField = ["page", "sort"];
  excludeField.forEach((element) => {
    delete queryObj[element];
  });
  //testing (req.query = all && queryObj not all)
  // console.log(req.query, queryObj);

  let query = Question.find(queryObj).populate("userId", "-password");

  // sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" "); //title,question => ["title","question"] => tile question

    query = query.sort(sortBy);
  } else {
    //sort by new quetion (as default)
    query = query.sort("-createdAt");
  }

  // pagination
  const page = parseInt(req.query.page) || 1;
  const limitData = 5;
  const skipData = (page - 1) * limitData;

  query = query.skip(skipData).limit(limitData);

  // if skip data > total document
  if (req.query.page) {
    let numQuetion = null;
    if (req.query.category) {
      numQuetion = await Question.countDocuments(queryObj);
    } else {
      numQuetion = await Question.countDocuments();
    }
    if (skipData >= numQuetion) {
      throw new Error("This page doesn't exist");
    }
  }

  const QuestionData = await query;
  const countQuestion = await Question.countDocuments(queryObj);

  return res.status(200).json({
    message: "show questions success",
    data: QuestionData,
    total: countQuestion,
  });
});

export const DetailQuestion = asyncWrapper(async (req, res) => {
  const idParams = req.params.id;
  const question = await Question.findById(idParams)
    .populate("userId", "-password")
    .populate({
      path: "listAnswer",
      populate: { path: "userId", select: "-password" },
    });
  if (!question) {
    return res.status(404).json({ message: "Question id no found" });
  }

  return res.status(200).json({
    message: "show question success",
    data: question,
  });
});
export const UpdateQuestion = asyncWrapper(async (req, res) => {
  const { title, question, category } = req.body;
  const paramId = req.params.id;

  const selectedQuestion = await Question.findById(paramId);

  if (!selectedQuestion) {
    res.status(404);
    throw new Error("Question id not found");
  }
  // check permission
  checkPermission(req.user, selectedQuestion.userId, res);

  selectedQuestion.title = title;
  selectedQuestion.question = question;
  selectedQuestion.category = category;

  await selectedQuestion.save();

  return res
    .status(200)
    .json({ message: "update question success", data: selectedQuestion });
});

export const DeleteQuestion = asyncWrapper(async (req, res) => {
  const paramId = req.params.id;
  const selectedQuestion = await Question.findById(paramId);

  if (!selectedQuestion) {
    res.status(404);
    throw new Error("Question id not found");
  }

  checkPermission(req.user, selectedQuestion.userId, res);

  await selectedQuestion.deleteOne();

  return res.status(200).json({
    message: "Question succesfully deleted",
  });
});
