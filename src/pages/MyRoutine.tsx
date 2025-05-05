import React from 'react';
import type { WeekDay } from '../types';
import { useExercises } from '../hooks/useExercises';

const weekDays: WeekDay[] = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];

export function MyRoutine() {
  const [selectedDay, setSelectedDay] = React.useState<WeekDay>('segunda');
  const { exercises, isLoading } = useExercises(selectedDay);

  return (
    <div className="max-w-md mx-auto px-4 py-8 mb-16">
      <h1 className="text-2xl font-bold mb-6">Minha Rotina</h1>
      
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
              className="bg-white p-4 rounded-lg shadow"
            >
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
  );
}