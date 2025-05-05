import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { AuthCheck } from './components/AuthCheck';
import { MyRoutine } from './pages/MyRoutine';
import { CreateWorkout } from './pages/CreateWorkout';
import { Profile } from './pages/Profile';
import { Achievements } from './pages/Achievements';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from './hooks/useTheme';

function App() {
  const { isDark } = useTheme();

  return (
    <BrowserRouter>
      <div className={isDark ? 'dark' : ''}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route
            path="/*"
            element={
              <AuthCheck>
                <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-neo-black dark:via-neo-gray dark:to-neo-black dark:text-neo-white transition-colors duration-300">
                  <div className="fixed inset-0 bg-gradient-radial from-neo-blue-500/10 via-transparent to-transparent pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-300" />
                  <ThemeToggle />
                  <Routes>
                    <Route path="/" element={<MyRoutine />} />
                    <Route path="/criar" element={<CreateWorkout />} />
                    <Route path="/conquistas" element={<Achievements />} />
                    <Route path="/perfil" element={<Profile />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                  <Navigation />
                </div>
              </AuthCheck>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;