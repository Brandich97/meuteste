import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';

export function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === 'Invalid login credentials') {
          setError('invalid_credentials');
          return;
        }
        if (error.message === 'Email not confirmed') {
          setError('email_not_confirmed');
          return;
        }
        throw error;
      }
      
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError('Ocorreu um erro ao fazer login. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderErrorMessage = () => {
    switch (error) {
      case 'email_not_confirmed':
        return (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 text-center">
            <p className="mb-2">Por favor, confirme seu email antes de fazer login</p>
            <p className="text-sm">Verifique sua caixa de entrada pelo email de confirmação</p>
          </div>
        );
      case 'invalid_credentials':
        return (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Email ou senha incorretos. Se você ainda não tem uma conta, por favor registre-se.
          </div>
        );
      default:
        return error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        
        {renderErrorMessage()}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/registro"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Criar nova conta
          </Link>
        </div>

        <div className="mt-4">
          <button
            onClick={() => {
              localStorage.setItem('skipAuth', 'true');
              navigate('/');
            }}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Continuar sem login
          </button>
        </div>
      </div>
    </div>
  );
}