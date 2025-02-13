import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import Task from "./task.js";

dotenv.config();
const app = express();

// const corsOptions = {
//   origin: ["https://tode.com"],
// };
app.use(cors());
app.use(express.json());

await mongoose.connect(process.env.DATABASE_URL);

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (e.name === "CastError") {
        res.status(404).send({ message: "not find" });
      } else if (e.name === "ValidationError") {
        console.log("Error occured");
        res.status(400).send({ message: e, message });
      } else {
        res.status(500).send({ message: e, message });
      }
    }
  };
}

app.post(
  "/tasks",
  asyncHandler(async (req, res) => {
    const data = req.body;
    const newTask = await Task.create(data);
    res.status(201).send(newTask);
  })
);

app.get(
  "/tasks",
  asyncHandler(async (req, res) => {
    const count = Number(req.query.count) || 0;
    const sortOption =
      req.query.sort === "oldest"
        ? ["createdAt", "asc"]
        : ["createdAt", "desc"];
    const tasks = await Task.find().limit(count).sort([sortOption]);
    res.send(tasks);
  })
);

app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      res.send(task);
    } else {
      res.status(404).send({ message: "not find" });
    }
  } catch (e) {
    if (e.name === "CastError") {
      res.status(404).send({ message: "not find" });
    } else {
      res.status(505).send({ message: e.message });
    }
  }
});

app.patch("/tasks/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task) {
    const data = req.body;
    Object.keys(data).forEach((key) => {
      task[key] = data[key];
    });
    await task.save();
    res.send(task);
  } else {
    res.status(404).send({ message: "not find" });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (task) {
    res.status(200).send({ message: "Task deleted successfully" });
  } else {
    res.status(404).send({ message: "Task not found" });
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Server started on port ${process.env.PORT}`)
);
