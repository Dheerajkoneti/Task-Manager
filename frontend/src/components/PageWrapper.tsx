import { ReactNode } from "react";

export default function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-8">
        {children}
      </div>
    </div>
  );
}
