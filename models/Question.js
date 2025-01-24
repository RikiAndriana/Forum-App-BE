import mongoose, { Schema } from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
    },
    question: {
      type: String,
      required: [true, "question is required"],
    },
    category: {
      type: String,
      enum: ["javascript", "database", "nodejs", "vuejs"],
      required: [true, "category is required"],
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
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

questionSchema.virtual("listAnswer", {
  ref: "Answer",
  localField: "_id",
  foreignField: "questionId",
  justOne: false,
});

questionSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await this.model("ReportQuestion").deleteMany({ questionId: this._id });
    await this.model("VotingQuestion").deleteMany({ questionId: this._id });
    await this.model("Answer").deleteMany({ questionId: this._id });
  }
);

const Question = mongoose.model("Question", questionSchema);
export default Question;
