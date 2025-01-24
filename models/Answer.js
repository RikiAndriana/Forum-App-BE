import mongoose, { Schema } from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    answer: {
      type: String,
      required: [true, "answer is required"],
    },
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
    voteCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Answer = mongoose.model("Answer", answerSchema);
export default Answer;
