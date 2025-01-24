import mongoose, { Schema } from "mongoose";

const votingQuestionSchema = new mongoose.Schema({
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
});

votingQuestionSchema.index(
  {
    questionId: 1,
    userId: 1,
  },
  { unique: true }
);

const VotingQuestion = mongoose.model("VotingQuestion", votingQuestionSchema);
export default VotingQuestion;
