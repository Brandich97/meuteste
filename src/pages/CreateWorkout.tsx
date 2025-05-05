import React from 'react';
import type { WeekDay, Exercise } from '../types';
import { useExercises } from '../hooks/useExercises';
import { supabase } from '../supabase';
import { Trash2, Pencil } from 'lucide-react';

const weekDays: WeekDay[] = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];

const categories = [
  'Peito',
  'Costas',
  'Pernas',
  'Ombros',
  'Bíceps',
  'Tríceps',
  'Abdômen',
  'Cardio'
];

const exercisesByCategory: Record<string, string[]> = {
  Peito: ['Supino Reto', 'Supino Inclinado', 'Crucifixo', 'Flexão'],
  Costas: ['Puxada na Frente', 'Remada Baixa', 'Pulldown', 'Barra Fixa'],
  Pernas: ['Agachamento', 'Leg Press', 'Extensora', 'Flexora'],
  Ombros: ['Desenvolvimento', 'Elevação Lateral', 'Elevação Frontal'],
  Bíceps: ['Rosca Direta', 'Rosca Alternada', 'Rosca Martelo'],
  Tríceps: ['Extensão na Polia', 'Extensão Testa', 'Supino Fechado'],
  Abdômen: ['Prancha', 'Crunch', 'Elevação de Pernas'],
  Cardio: ['Esteira', 'Bicicleta', 'Elíptico', 'Corda']
};

export function CreateWorkout() {
  const [selectedDay, setSelectedDay] = React.useState<WeekDay>('segunda');
  const [category, setCategory] = React.useState(categories[0]);
  const [exercise, setExercise] = React.useState(exercisesByCategory[categories[0]][0]);
  const [sets, setSets] = React.useState(3);
  const [reps, setReps] = React.useState(12);
  const [weight, setWeight] = React.useState(0);
  const [editingExercise, setEditingExercise] = React.useState<Exercise | null>(null);

  const { exercises, isLoading, addExercise, isAdding, deleteExercise, updateExercise, isUpdating } = useExercises(selectedDay);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert('Você precisa estar logado para adicionar exercícios');
      return;
    }
    
    try {
      if (editingExercise) {
        await updateExercise({
          id: editingExercise.id,
          sets,
          reps,
          weight,
        });
        setEditingExercise(null);
        setSets(3);
        setReps(12);
        setWeight(0);
        alert('Exercício atualizado com sucesso!');
      } else {
        await addExercise({
          name: exercise,
          category,
          sets,
          reps,
          weight,
          day: selectedDay,
          user_id: user.id
        });
        setSets(3);
        setReps(12);
        setWeight(0);
        alert('Exercício adicionado com sucesso!');
      }
    } catch (error) {
      alert(editingExercise ? 'Erro ao atualizar exercício' : 'Erro ao adicionar exercício');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este exercício?')) {
      try {
        await deleteExercise(id);
        alert('Exercício excluído com sucesso!');
      } catch (error) {
        alert('Erro ao excluir exercício');
      }
    }
  };

  const handleEdit = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setSets(exercise.sets);
    setReps(exercise.reps);
    setWeight(exercise.weight);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 mb-16">
      <h1 className="text-2xl font-bold mb-6">Criar Treino</h1>

      <div className="grid grid-cols-7 gap-1 mb-6">
        {weekDays.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`p-2 text-xs rounded-lg ${
              selectedDay === day
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {day.charAt(0).toUpperCase() + day.slice(1, 3)}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className={`space-y-6 ${editingExercise ? 'ring-2 ring-blue-500 p-4 rounded-lg' : ''}`}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoria
          </label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setExercise(exercisesByCategory[e.target.value][0]);
            }}
            className="w-full p-2 border rounded-lg"
            disabled={!!editingExercise}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exercício
          </label>
          <select
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            className="w-full p-2 border rounded-lg"
            disabled={!!editingExercise}
          >
            {exercisesByCategory[category].map((ex) => (
              <option key={ex} value={ex}>
                {ex}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Séries
            </label>
            <input
              type="number"
              value={sets}
              onChange={(e) => setSets(Number(e.target.value))}
              min="1"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Repetições
            </label>
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(Number(e.target.value))}
              min="1"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Peso (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              min="0"
              step="0.5"
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isAdding || isUpdating}
          className={`w-full bg-blue-600 text-white py-3 rounded-lg ${
            isAdding || isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {isAdding ? 'Adicionando...' : isUpdating ? 'Atualizando...' : editingExercise ? 'Atualizar Exercício' : 'Adicionar Exercício'}
        </button>

        {editingExercise && (
          <button
            type="button"
            onClick={() => {
              setEditingExercise(null);
              setSets(3);
              setReps(12);
              setWeight(0);
            }}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 mt-2"
          >
            Cancelar Edição
          </button>
        )}
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Exercícios para {selectedDay}</h2>
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-center text-gray-500 py-8">Carregando...</p>
          ) : exercises.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Nenhum exercício cadastrado para {selectedDay}
            </p>
          ) : (
            exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="bg-white p-4 rounded-lg shadow relative"
              >
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(exercise)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Editar exercício"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(exercise.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Excluir exercício"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <h3 className="font-semibold text-lg">{exercise.name}</h3>
                <p className="text-gray-600">{exercise.category}</p>
                <div className="mt-2 text-sm text-gray-700">
                  <p>{exercise.sets} séries x {exercise.reps} repetições</p>
                  <p>Peso: {exercise.weight}kg</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}