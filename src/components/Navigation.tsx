import React from 'react';
import { NavLink } from 'react-router-dom';
import { Dumbbell, PlusCircle, Trophy, User } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export function Navigation() {
  const { isDark } = useTheme();

  return (
    <nav className={`
      fixed bottom-4 left-1/2 -translate-x-1/2 
      backdrop-blur-lg rounded-2xl shadow-neo 
      max-w-md w-[calc(100%-2rem)]
      transition-all duration-300
      ${isDark 
        ? 'bg-neo-gray/80 border border-neo-blue-500/20' 
        : 'bg-white/80 border border-gray-200 shadow-lg'
      }
    `}>
      <div className="px-4">
        <div className="flex justify-around py-3">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center transition-colors ${
                isActive 
                  ? isDark ? 'text-neo-blue-400' : 'text-blue-600'
                  : isDark ? 'text-neo-white/60 hover:text-neo-white' : 'text-gray-600 hover:text-gray-900'
              }`
            }
          >
            <Dumbbell className="h-6 w-6" />
            <span className="text-xs mt-1">Minha Rotina</span>
          </NavLink>
          <NavLink
            to="/criar"
            className={({ isActive }) =>
              `flex flex-col items-center transition-colors ${
                isActive 
                  ? isDark ? 'text-neo-blue-400' : 'text-blue-600'
                  : isDark ? 'text-neo-white/60 hover:text-neo-white' : 'text-gray-600 hover:text-gray-900'
              }`
            }
          >
            <PlusCircle className="h-6 w-6" />
            <span className="text-xs mt-1">Criar Treino</span>
          </NavLink>
          <NavLink
            to="/conquistas"
            className={({ isActive }) =>
              `flex flex-col items-center transition-colors ${
                isActive 
                  ? isDark ? 'text-neo-blue-400' : 'text-blue-600'
                  : isDark ? 'text-neo-white/60 hover:text-neo-white' : 'text-gray-600 hover:text-gray-900'
              }`
            }
          >
            <Trophy className="h-6 w-6" />
            <span className="text-xs mt-1">Conquistas</span>
          </NavLink>
          <NavLink
            to="/perfil"
            className={({ isActive }) =>
              `flex flex-col items-center transition-colors ${
                isActive 
                  ? isDark ? 'text-neo-blue-400' : 'text-blue-600'
                  : isDark ? 'text-neo-white/60 hover:text-neo-white' : 'text-gray-600 hover:text-gray-900'
              }`
            }
          >
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Perfil</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}