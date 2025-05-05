import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import type { Exercise, WeekDay } from '../types';

export function useExercises(selectedDay: WeekDay) {
  const queryClient = useQueryClient();
  const queryKey = ['exercises', selectedDay];

  const { data: exercises = [], isLoading, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase
        .from('exercises')
        .select('*')
        .eq('day', selectedDay)
        .order('created_at', { ascending: true });

      // Only filter by user_id if the user is authenticated
      if (user?.id) {
        query = query.eq('user_id', user.id);
      } else {
        query = query.is('user_id', null);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Exercise[];
    },
  });

  const addExercise = useMutation({
    mutationFn: async (exerciseData: Omit<Exercise, 'id' | 'created_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.id) {
        throw new Error('You must be logged in to add exercises');
      }

      const { data, error } = await supabase
        .from('exercises')
        .insert([{ ...exerciseData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      refetch();
    },
  });

  const deleteExercise = useMutation({
    mutationFn: async (id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.id) {
        throw new Error('You must be logged in to delete exercises');
      }

      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      refetch();
    },
  });

  const updateExercise = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Exercise> & { id: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.id) {
        throw new Error('You must be logged in to update exercises');
      }

      const { error } = await supabase
        .from('exercises')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      refetch();
    },
  });

  return {
    exercises,
    isLoading,
    addExercise: addExercise.mutateAsync,
    isAdding: addExercise.isPending,
    deleteExercise: deleteExercise.mutateAsync,
    isDeleting: deleteExercise.isPending,
    updateExercise: updateExercise.mutateAsync,
    isUpdating: updateExercise.isPending,
  };
}