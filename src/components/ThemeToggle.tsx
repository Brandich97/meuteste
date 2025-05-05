import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className={`
        fixed top-4 right-4 p-3 rounded-full
        transition-all duration-300 ease-out
        hover:scale-110
        ${isDark
          ? 'bg-neo-gray/80 text-neo-white hover:bg-neo-gray shadow-neo'
          : 'bg-white text-gray-800 hover:bg-gray-100 shadow-lg'
        }
        backdrop-blur-lg
        border
        ${isDark ? 'border-neo-blue-500/20' : 'border-gray-200'}
      `}
      aria-label={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}