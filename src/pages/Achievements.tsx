import React from 'react';
import { supabase } from '../supabase';
import type { Achievement } from '../types';

type AchievementCategory = 'frequency' | 'consistency' | 'evolution' | 'personalization' | 'secret';

const achievementCategories = {
  frequency: {
    title: 'Conquistas de Frequência',
    achievements: [
      { id: 'first_week', title: 'Primeira Semana Completa', description: 'Fez pelo menos 1 treino em cada dia planejado', imageUrl: 'https://wxldqesnhbpuxvcvmcni.supabase.co/storage/v1/object/public/achievements/first-week.png' },
      { id: 'five_days', title: '5 Dias Seguidos', description: 'Treinou 5 dias consecutivos', imageUrl: 'https://wxldqesnhbpuxvcvmcni.supabase.co/storage/v1/object/public/achievements/five-days.png' },
      { id: 'ten_workouts', title: '10 Treinos Registrados', description: '10 treinos registrados', imageUrl: 'https://wxldqesnhbpuxvcvmcni.supabase.co/storage/v1/object/public/achievements/ten-workouts.png' },
      { id: 'thirty_workouts', title: '30 Treinos Registrados', description: '30 treinos registrados', imageUrl: 'https://wxldqesnhbpuxvcvmcni.supabase.co/storage/v1/object/public/achievements/thirty-workouts.png' },
      { id: 'hundred_workouts', title: '100 Treinos no Total', description: '100 treinos no total', imageUrl: 'https://wxldqesnhbpuxvcvmcni.supabase.co/storage/v1/object/public/achievements/hundred-workouts.png' }
    ]
  },
  consistency: {
    title: 'Conquistas de Consistência',
    achievements: [
      { id: 'one_month', title: '1 Mês Sem Falhar', description: 'Treinou pelo menos 3x por semana durante 4 semanas', imageUrl: 'https://wxldqesnhbpuxvcvmcni.supabase.co/storage/v1/object/public/achievements/one-month.png' },
      { id: 'three_months', title: '3 Meses Ativo', description: '3 meses ativos', imageUrl: 'https://wxldqesnhbpuxvcvmcni.supabase.co/storage/v1/object/public/achievements/three-months.png' },
      { id: 'one_year', title: '1 Ano de Registro', description: '1 ano de registros', imageUrl: 'https://wxldqesnhbpuxvcvmcni.supabase.co/storage/v1/object/public/achievements/one-year.png' }
    ]
  },
  evolution: {
    title: 'Conquistas de Evolução',
    achievements: [
      { id: 'weight_increase', title: 'Aumentou Carga', description: 'Aumentou carga em 3 exercícios', imageUrl: 'https://wxldqesnhbpuxvcvmcni.supabase.co/storage/v1/object/public/achievements/weight-increase.png' },
      { id: '1rm_improvement', title: 'Melhorou 1RM', description: 'Melhorou 1RM em qualquer exercício', imageUrl: 'https://wxldqesnhbpuxvcvmcni.supabase.co/storage/v1/object/public/achievements/1rm-improvement.png' },
      { id: 'ten_notes', title: '10 Anotações', description: 'Registrou 10 anotações no diário', imageUrl: 'https://wxldqesnhbpuxvcvmcni.supabase.co/storage/v1/object/public/achievements/ten-notes.png' }
    ]
  },
  personalization: {
    title: 'Conquistas de Personalização',
    achievements: [
      { id: 'five_routines', title: '5 Rotinas', description: 'Criou 5 rotinas diferentes', imageUrl: 'https://wxldqesnhbpuxvcvmcni.supabase.co/storage/v1/object/public/achievements/five-routines.png' },
      { id: 'all_days', title: 'Todos os Dias', description: 'Treinou em todos os dias da semana pelo menos uma vez', imageUrl: 'https://wxldqesnhbpuxvcvmcni.supabase.co/storage/v1/object/public/achievements/all-days.png' },
      { id: 'reset_week', title: 'Reset com Foco', description: 'Redefiniu a semana e recomeçou com foco', imageUrl: 'https://wxldqesnhbpuxvcvmcni.supabase.co/storage/v1/object/public/achievements/reset-week.png' }
    ]
  },
  secret: {
    title: 'Conquistas Secretas',
    achievements: [
      { id: 'sunday_warrior', title: '???', description: '???', imageUrl: 'https://wxldqesnhbpuxvcvmcni.supabase.co/storage/v1/object/public/achievements/secret.png' },
      { id: 'holiday_warrior', title: '???', description: '???', imageUrl: 'https://wxldqesnhbpuxvcvmcni.supabase.co/storage/v1/object/public/achievements/secret.png' },
      { id: 'comeback', title: '???', description: '???', imageUrl: 'https://wxldqesnhbpuxvcvmcni.supabase.co/storage/v1/object/public/achievements/secret.png' }
    ]
  }
};

export function Achievements() {
  const [achievements, setAchievements] = React.useState<Achievement[]>([]);

  React.useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', user.id)
      .order('achieved_at', { ascending: false });

    if (data) setAchievements(data);
  };

  const isAchievementUnlocked = (achievementId: string) => {
    return achievements.some(a => a.achievement_type === achievementId);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 mb-16">
      <h1 className="text-2xl font-bold mb-6 text-neo-white">Conquistas</h1>

      <div className="space-y-8">
        {(Object.keys(achievementCategories) as AchievementCategory[]).map((category) => (
          <div key={category}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-neo-white/90">
                {achievementCategories[category].title}
              </h2>
              <span className="text-sm text-neo-blue-400">
                {achievements.filter(a => 
                  achievementCategories[category].achievements.some(
                    cat => cat.id === a.achievement_type
                  )
                ).length} / {achievementCategories[category].achievements.length}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 pb-8 border-b border-neo-blue-500/20">
              {achievementCategories[category].achievements.map((achievement) => {
                const unlocked = isAchievementUnlocked(achievement.id);
                return (
                  <div
                    key={achievement.id}
                    className="group flex flex-col items-center text-center"
                  >
                    <div 
                      className={`
                        w-20 h-20 mb-2 rounded-xl p-2
                        ${unlocked 
                          ? 'bg-gradient-to-br from-neo-blue-500/20 to-neo-purple-500/20 shadow-neo' 
                          : 'bg-neo-gray/50'
                        }
                        transition-all duration-300 ease-out
                        group-hover:scale-110 group-hover:shadow-neo-lg
                      `}
                    >
                      <img
                        src={achievement.imageUrl}
                        alt={achievement.title}
                        className={`w-full h-full object-contain transition-all duration-300 ${
                          unlocked ? '' : 'grayscale opacity-50'
                        }`}
                      />
                    </div>
                    <h3 className={`text-sm font-medium transition-colors ${
                      unlocked ? 'text-neo-white' : 'text-neo-white/60'
                    }`}>
                      {achievement.title}
                    </h3>
                    <p className="text-[10px] text-neo-white/40 mt-1 leading-tight">
                      {achievement.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}