import toast from "react-hot-toast";

/* ===============================
   REQUEST PERMISSION
================================ */
export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) return;

  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
};

/* ===============================
   MAIN NOTIFICATION FUNCTION
================================ */
export const notifyTask = (message: string, progress?: number) => {
  // Browser notification
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("⏰ Task Manager", {
      body: message,
      icon: "/favicon.ico",
    });
  }

  // In-app toast
  toast.custom(
    () => (
      <div
        style={{
          background: "#0f172a",
          color: "white",
          padding: "14px 18px",
          borderRadius: "14px",
          minWidth: "260px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.45)",
        }}
      >
        <strong>{message}</strong>

        {typeof progress === "number" && (
          <div
            style={{
              marginTop: "8px",
              height: "6px",
              background: "#334155",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: progress >= 100 ? "#22c55e" : "#6366f1",
                transition: "width 1s linear",
              }}
            />
          </div>
        )}
      </div>
    ),
    { duration: 4000 }
  );
};
