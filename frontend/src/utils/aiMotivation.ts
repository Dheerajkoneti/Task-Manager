export function getMotivationalMessage({
  streak,
  focusSessions,
  missedTasks,
  context,
}: {
  streak: number;
  focusSessions: number;
  missedTasks: number;
  context?: "focus_start" | "task_done" | "idle";
}) {
  // 🎯 Focus started
  if (context === "focus_start") {
    const messages = [
      "🎯 Deep focus mode ON. Let distractions wait.",
      "🧠 One task. One goal. Full focus.",
      "🚀 This is where progress happens.",
    ];
    return random(messages);
  }

  // ✅ Task completed
  if (context === "task_done") {
    const messages = [
      "✅ Nice! Small wins build big success.",
      "🔥 Task crushed. Keep going!",
      "💪 Discipline beats motivation — and you showed both.",
    ];
    return random(messages);
  }

  // 🔥 Streak-based
  if (streak >= 5) {
    return "🔥 Legendary streak! Don’t break the chain.";
  }
  if (streak >= 3) {
    return "💥 You’re building momentum. Stay sharp.";
  }

  // 😐 Missed tasks
  if (missedTasks > 0) {
    return "⏳ Yesterday slipped. Today is a fresh start.";
  }

  // ☀️ Default
  return "🌱 Progress, not perfection. Just start.";
}

function random(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}
