import { notifyTask } from "./notify";

/* ⏰ Upcoming task reminder */
export const checkUpcomingTasks = (tasks: any[]) => {
  const now = Date.now();

  tasks.forEach(task => {
    if (task.status !== "TODO") return;

    const start = new Date(task.startTime).getTime();
    const diff = start - now;

    if (diff <= 5 * 60 * 1000 && diff > 4 * 60 * 1000) {
      notifyTask(`⏰ "${task.title}" starts in 5 minutes`);
    }
  });
};

/* 🔥 Daily streak reminder */
export const sendStreakReminder = (streak: number) => {
  if (streak > 0) {
    notifyTask(`🔥 You’re on a ${streak}-day streak. Keep going!`);
  }
};

/* ❌ Missed tasks summary */
export const sendMissedSummary = (tasks: any[]) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const missed = tasks.filter(
    t =>
      t.status === "MISSED" &&
      new Date(t.endTime).toDateString() === yesterday.toDateString()
  ).length;

  if (missed > 0) {
    notifyTask(`❌ You missed ${missed} task${missed > 1 ? "s" : ""} yesterday`);
  }
};
