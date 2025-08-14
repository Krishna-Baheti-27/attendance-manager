import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const attendanceSchema = new Schema(
  {
    subject: {
      type: ObjectId,
      ref: "Subject",
      required: true,
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["present", "absent", "no-lecture"],
    },
  },
  {
    timestamps: true,
  }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
