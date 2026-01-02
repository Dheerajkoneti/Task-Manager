import { Router } from "express";
import { auth } from "../middleware/auth";
import Task from "../models/Task";

const router = Router();

/* GET TASKS */
router.get("/", auth, async (req: any, res) => {
  const tasks = await Task.find({ user: req.user.id }).sort({
    startTime: 1,
  });
  res.json(tasks);
});

/* CREATE TASK */
router.post("/", auth, async (req: any, res) => {
  const { title, startTime, endTime, priority } = req.body;

  if (!title || !startTime || !endTime) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const task = await Task.create({
    title,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    priority,
    user: req.user.id,
  });

  res.json(task);
});

/* UPDATE TASK */
router.put("/:id", auth, async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(task);
});

/* DELETE TASK */
router.delete("/:id", auth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
