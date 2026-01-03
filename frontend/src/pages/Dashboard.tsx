import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../dashboard.css";
import { startFocusSound, stopFocusSound } from "../utils/focusSound";
import { notifyTask, requestNotificationPermission } from "../utils/notify";
import {
  checkUpcomingTasks,
  sendStreakReminder,
  sendMissedSummary,
} from "../utils/smartReminders";
import { getMotivationalMessage } from "../utils/aiMotivation";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ================= TYPES ================= */
type Task = {
  _id: string;
  title: string;
  status: "TODO" | "INPROGRESS" | "DONE" | "MISSED";
  startTime: string;
  endTime: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
};
const columns = [
  { key: "TODO", label: "TODO" },
  { key: "INPROGRESS", label: "IN PROGRESS" },
  { key: "DONE", label: "DONE" },
  { key: "MISSED", label: "MISSED" },
] as const;

export default function Dashboard() {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [priority, setPriority] =
    useState<"HIGH" | "MEDIUM" | "LOW">("MEDIUM");

  const [editTask, setEditTask] = useState<Task | null>(null);
  const [focusTask, setFocusTask] = useState<Task | null>(null);
  const [focusSessions, setFocusSessions] = useState(0);
  const [aiMessage, setAiMessage] = useState("");
  const [now, setNow] = useState(Date.now());

  const prevStatus = useRef<Record<string, Task["status"]>>({});

  /* ================= AUTH ================= */
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    requestNotificationPermission();
    fetchTasks();
  }, []);

  /* ================= CLOCK ================= */
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  /* ================= FETCH ================= */
  const fetchTasks = async () => {
  try {
    const res = await api.get("/tasks");
    setTasks(
      res.data.sort(
        (a: Task, b: Task) =>
          new Date(a.startTime).getTime() -
          new Date(b.startTime).getTime()
      )
    );
  } catch {
    toast.error("Failed to load tasks");
  }
};
  /* ================= STREAK ================= */
  const calculateStreak = () => {
    let count = 0;
    let day = new Date();

    while (true) {
      const done = tasks.some(
        t =>
          t.status === "DONE" &&
          new Date(t.endTime).toDateString() === day.toDateString()
      );
      if (!done) break;
      count++;
      day.setDate(day.getDate() - 1);
    }
    return count;
  };

  const streak = calculateStreak();
  const longestStreak = Math.max(
    streak,
    Number(localStorage.getItem("longestStreak") || 0)
  );

  useEffect(() => {
    localStorage.setItem("longestStreak", String(longestStreak));
  }, [longestStreak]);

  /* ================= ANALYTICS ================= */
  const completedToday = tasks.filter(
    t =>
      t.status === "DONE" &&
      new Date(t.endTime).toDateString() ===
        new Date().toDateString()
  ).length;

  const missedTasks = tasks.filter(t => t.status === "MISSED").length;
  const focusMinutes = focusSessions * 25;

  /* ================= AI MESSAGE ================= */
  useEffect(() => {
    setAiMessage(
      getMotivationalMessage({
        streak,
        focusSessions,
        missedTasks,
        context: "idle",
      })
    );
  }, [streak, focusSessions, missedTasks]);

  /* ================= SMART REMINDERS ================= */
  useEffect(() => {
    const t = setInterval(() => checkUpcomingTasks(tasks), 60000);
    return () => clearInterval(t);
  }, [tasks]);

  useEffect(() => {
    const todayKey = new Date().toDateString();
    if (localStorage.getItem("dailyReminderRun") !== todayKey) {
      sendStreakReminder(streak);
      sendMissedSummary(tasks);
      localStorage.setItem("dailyReminderRun", todayKey);
    }
  }, [tasks, streak]);

  /* ================= FOCUS SOUND ================= */
  useEffect(() => {
    focusTask ? startFocusSound() : stopFocusSound();
  }, [focusTask]);

  /* ================= AUTO STATUS ================= */
 useEffect(() => {
  const t = setInterval(async () => {
    let changed = false;
    const nowDate = new Date();

    for (const task of tasks) {
      const start = new Date(task.startTime);
      const end = new Date(task.endTime);
      const last = prevStatus.current[task._id];

      /* 🚀 AUTO START */
      if (
        task.status === "TODO" &&
        nowDate >= start &&
        nowDate < end &&
        last !== "INPROGRESS"
      ) {
        await api.put(`/tasks/${task._id}`, { status: "INPROGRESS" });
        notifyTask(`🚀 Started: ${task.title}`);
        prevStatus.current[task._id] = "INPROGRESS";
        changed = true;
      }

      /* ❌ AUTO MISS (time ended, not completed) */
      if (
        (task.status === "TODO" || task.status === "INPROGRESS") &&
        nowDate > end &&
        last !== "MISSED"
      ) {
        await api.put(`/tasks/${task._id}`, { status: "MISSED" });
        notifyTask(`❌ Missed: ${task.title}`);
        prevStatus.current[task._id] = "MISSED";
        changed = true;
      }
    }

    if (changed) fetchTasks();
  }, 5000);

  return () => clearInterval(t);
}, [tasks]);
useEffect(() => {
  if (!focusTask) return;
  const end = new Date(focusTask.endTime).getTime();
  if (now >= end) {
    (async () => {
      await api.put(`/tasks/${focusTask._id}`, { status: "DONE" });
      notifyTask(`✅ Completed by focus: ${focusTask.title}`);
      setFocusTask(null);
      fetchTasks();
    })();
  }
}, [now, focusTask]);
  /* ================= ACTIONS ================= */
  const markDone = async (id: string) => {
    await api.put(`/tasks/${id}`, { status: "DONE" });
    toast.success("Task completed");
    setAiMessage(
      getMotivationalMessage({
        streak: streak + 1,
        focusSessions,
        missedTasks,
        context: "task_done",
      })
    );
    fetchTasks();
  };
  const deleteTask = async (id: string) => {
    await api.delete(`/tasks/${id}`);
    toast.success("Task deleted");
    fetchTasks();
  };
  const startEdit = (task: Task) => {
    setEditTask(task);
    setTitle(task.title);
    setStartTime(task.startTime);
    setEndTime(task.endTime);
    setPriority(task.priority);
  };
  /* ================= HELPERS ================= */
  const getCountdown = (end: string) => {
  const diff = new Date(end).getTime() - now;

  if (diff <= 0) return "⏰ Time over";

  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return `${minutes}m ${seconds}s left`;
};
const getProgressPercent = (task: Task) => {
  const start = new Date(task.startTime).getTime();
  const end = new Date(task.endTime).getTime();
  const total = end - start;
  const remaining = Math.max(0, end - now);

  return total <= 0 ? 0 : (remaining / total) * 100;
};
const getWeeklyData = () => {
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));

    const label = d.toLocaleDateString("en-US", { weekday: "short" });

    const completed = tasks.filter(
      t =>
        t.status === "DONE" &&
        new Date(t.endTime).toDateString() === d.toDateString()
    ).length;

    return { day: label, completed };
  });

  return days;
};
  /* ================= UI ================= */
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Task Dashboard</h1>
        <button className="logout-btn" onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}>
          Logout
        </button>
      </div>

      <div className="daily-summary">
        <div className="summary-pill success">✅ Completed: {completedToday}</div>
        <div className="summary-pill info">⏱ Focus: {focusMinutes} mins</div>
        <div className="summary-pill danger">❌ Missed: {missedTasks}</div>
      </div>
      <div className="weekly-graph">
  <h2>📊 Weekly Productivity</h2>
  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={getWeeklyData()}>
      <XAxis dataKey="day" />
      <YAxis allowDecimals={false} />
      <Tooltip />
      <Bar dataKey="completed" fill="#4CAF50" radius={[6, 6, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
</div>
      {/* ➕ ADD TASK BAR */}
<div className="add-task-bar">
  <input
    type="text"
    placeholder="Task title"
    value={title}
    onChange={e => setTitle(e.target.value)}
  />

  <input
    type="datetime-local"
    value={startTime}
    onChange={e => setStartTime(e.target.value)}
  />

  <input
    type="datetime-local"
    value={endTime}
    onChange={e => setEndTime(e.target.value)}
  />

  <select
    value={priority}
    onChange={e => setPriority(e.target.value as any)}
  >
    <option value="HIGH">High</option>
    <option value="MEDIUM">Medium</option>
    <option value="LOW">Low</option>
  </select>

  <button
  className="add-task-btn"
  onClick={async () => {
    if (!title || !startTime || !endTime) {
      toast.error("All fields required");
      return;
    }

    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    if (end <= start) {
      toast.error("End time must be after start time");
      return;
    }

    try {
  if (editTask) {

    await api.put(`/tasks/${editTask._id}`, {
  title,
  startTime: new Date(startTime).toISOString(),
  endTime: new Date(endTime).toISOString(),
  priority,
});
    toast.success("Task updated");
    setEditTask(null);
  } else {
    await api.post("/tasks", {
  title,
  startTime: new Date(startTime).toISOString(),
  endTime: new Date(endTime).toISOString(),
  priority,
  status: "TODO",
});
    toast.success("Task added");
  }

  setTitle("");
  setStartTime("");
  setEndTime("");
  setPriority("MEDIUM");
  fetchTasks();
} catch {
  toast.error("Failed to save task");
}
  }}
>
  {editTask ? "Update Task" : "Add Task"}
</button>
</div>
      {aiMessage && <div className="ai-message">🤖 {aiMessage}</div>}

      {/* BOARD */}
      <div className="board">
        {columns.map(col => (
          <div key={col.key} className="column">
            <h2>{col.label}</h2>

            {tasks.filter(t => t.status === col.key).map(task => (
              <div key={task._id} className="task">
                <strong>{task.title}</strong>
                <small>{getCountdown(task.endTime)}</small>

                <div className="task-actions">
                  {task.status === "INPROGRESS" && (
                    <button
                      className="icon-btn focus"
                      onClick={() => {
                        setFocusTask(task);
                        setFocusSessions(s => s + 1);
                        setAiMessage(
                          getMotivationalMessage({
                            streak,
                            focusSessions,
                            missedTasks,
                            context: "focus_start",
                          })
                        );
                      }}
                    >
                      🎯
                    </button>
                  )}

                  {task.status !== "DONE" && (
                    <button className="icon-btn done" onClick={() => markDone(task._id)}>
                      ✓
                    </button>
                  )}

                  <button className="icon-btn edit" onClick={() => startEdit(task)}>
                    ✎
                  </button>

                  <button className="icon-btn delete" onClick={() => deleteTask(task._id)}>
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {focusTask && (
        <div className="focus-overlay">
          <div className="focus-content pulse">
            <svg width="160" height="160">
              <circle r="70" cx="80" cy="80" className="progress-ring-bg" />
              <circle
                r="70"
                cx="80"
                cy="80"
                className="progress-ring-bar"
                style={{
                  strokeDasharray: 440,
                  strokeDashoffset:
                    440 - (440 * getProgressPercent(focusTask)) / 100,
                }}
              />
            </svg>

            <div className="focus-timer">{getCountdown(focusTask.endTime)}</div>
            <h1>{focusTask.title}</h1>
            <div className="focus-streak fire">🔥 {streak} day streak</div>

            <button
  className="exit-btn"
  onClick={() => {
    notifyTask("⚠ Focus stopped early");
    setFocusTask(null);
  }}
>
  Exit Focus
</button>

          </div>
        </div>
      )}
    </div>
  );
}
