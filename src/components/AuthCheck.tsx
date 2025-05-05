import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { InitialProfileSetup } from './InitialProfileSetup';

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const [showProfileSetup, setShowProfileSetup] = React.useState(false);
  const [skipAuth, setSkipAuth] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (skipAuth) {
      localStorage.setItem('skipAuth', 'true');
      return;
    }

    const checkUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Check if user has completed profile setup
        const { data: profile } = await supabase
          .from('profiles')
          .select('goal')
          .eq('id', session.user.id)
          .single();

        const { data: stats } = await supabase
          .from('user_stats')
          .select('id')
          .eq('user_id', session.user.id)
          .limit(1);

        if (!profile?.goal || !stats?.length) {
          setShowProfileSetup(true);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && !localStorage.getItem('skipAuth')) {
        navigate('/login');
      } else if (session) {
        checkUserProfile();
      }
    });

    checkUserProfile();
    return () => subscription.unsubscribe();
  }, [navigate, skipAuth]);

  if (showProfileSetup) {
    return <InitialProfileSetup onComplete={() => setShowProfileSetup(false)} />;
  }

  if (!supabase.auth.getSession() && !skipAuth && !localStorage.getItem('skipAuth')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 mb-4"
          >
            Fazer Login
          </button>
          <button
            onClick={() => setSkipAuth(true)}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
          >
            Continuar sem login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}