import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  startTime: Date;
  endTime: Date;
  status: "TODO" | "INPROGRESS" | "DONE" | "MISSED";
  priority: "HIGH" | "MEDIUM" | "LOW";
  user: mongoose.Types.ObjectId;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["TODO", "INPROGRESS", "DONE", "MISSED"],
      default: "TODO",
    },

    priority: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW"],
      default: "MEDIUM",
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITask>("Task", taskSchema);
