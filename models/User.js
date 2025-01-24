import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: [true, "username already used"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email already used"],
      validate: {
        validator: validator.isEmail,
        message: "input must be an email",
      },
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [6, "input password minimal 6 character"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    // allow virtual property convert to json and object
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// create virtual property
userSchema.virtual("listQuestion", {
  ref: "Question", //ref Question model
  localField: "_id", //our model
  foreignField: "userId", //other model
  justOne: false, //make it array to show all
});

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
