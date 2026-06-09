import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

type ThemeToggleProps = {
  className?: string;
  showLabel?: boolean;
};

export default function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2 text-gray-300 transition-all duration-300 hover:border-primary/40 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary/60 ${className}`}
    >
      <span className="relative grid h-5 w-5 place-items-center overflow-hidden">
        <Sun
          className={`absolute h-5 w-5 text-yellow-400 transition-all duration-300 ${
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`}
        />
        <Moon
          className={`absolute h-5 w-5 text-accent transition-all duration-300 ${
            isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </span>
      {showLabel && <span className="text-sm font-semibold">{isDark ? "Dark" : "Light"}</span>}
    </button>
  );
}
