import mongoose, { Schema } from "mongoose";

const reportQuestionSchema = new mongoose.Schema({
  questionId: {
    type: Schema.Types.ObjectId,
    ref: "Question",
    required: [true, "questionId is required"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "userId is required"],
  },
  report: {
    type: String,
    required: [true, "report is required"],
  },
});

reportQuestionSchema.index(
  {
    questionId: 1,
    userId: 1,
  },
  { unique: true }
);

const ReportQuestion = mongoose.model("ReportQuestion", reportQuestionSchema);
export default ReportQuestion;
