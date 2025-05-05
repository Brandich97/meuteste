import React from 'react';
import { supabase } from '../supabase';

interface InitialProfileSetupProps {
  onComplete: () => void;
}

export function InitialProfileSetup({ onComplete }: InitialProfileSetupProps) {
  const [goal, setGoal] = React.useState('');
  const [height, setHeight] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Update profile goal
      await supabase
        .from('profiles')
        .update({ goal })
        .eq('id', user.id);

      // Add initial stats
      await supabase
        .from('user_stats')
        .insert({
          user_id: user.id,
          height: Number(height),
          weight: Number(weight)
        });

      onComplete();
    } catch (error) {
      console.error('Error saving profile data:', error);
      alert('Erro ao salvar dados do perfil. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Complete seu perfil</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Qual seu objetivo?
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="">Selecione...</option>
              <option value="emagrecer">Emagrecer</option>
              <option value="ganhar_massa">Ganhar Massa</option>
              <option value="manter">Manter</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Altura (cm)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Ex: 175"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Peso atual (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Ex: 70.5"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Salvando...' : 'Continuar'}
          </button>
        </form>
      </div>
    </div>
  );
}