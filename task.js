import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 30,
    },
    description: {
      // 수정: 'descrption' -> 'description'
      type: String,
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt을 자동으로 추가함
  }
);

const Task = mongoose.model("Task", TaskSchema);
export default Task;
