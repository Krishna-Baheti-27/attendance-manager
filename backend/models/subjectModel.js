import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const subjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;
