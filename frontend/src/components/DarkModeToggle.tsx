export default function DarkModeToggle() {
  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <button
      onClick={toggleDark}
      className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-3 py-2 rounded-lg"
    >
      🌙
    </button>
  );
}
