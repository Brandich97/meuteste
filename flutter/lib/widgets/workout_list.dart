import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class WorkoutList extends StatelessWidget {
  const WorkoutList({super.key});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<List<Map<String, dynamic>>>(
      stream: Supabase.instance.client
          .from('exercises')
          .stream(primaryKey: ['id'])
          .order('created_at'),
      builder: (context, snapshot) {
        if (snapshot.hasError) {
          return Center(
            child: Text('Erro: ${snapshot.error}'),
          );
        }

        if (!snapshot.hasData) {
          return const Center(
            child: CircularProgressIndicator(),
          );
        }

        final exercises = snapshot.data!;

        if (exercises.isEmpty) {
          return const Center(
            child: Text('Nenhum exercício cadastrado'),
          );
        }

        return ListView.builder(
          itemCount: exercises.length,
          itemBuilder: (context, index) {
            final exercise = exercises[index];
            return Card(
              margin: const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 8,
              ),
              child: ListTile(
                title: Text(exercise['name']),
                subtitle: Text(
                  '${exercise['sets']} séries x ${exercise['reps']} repetições',
                ),
                trailing: Text('${exercise['weight']}kg'),
              ),
            );
          },
        );
      },
    );
  }
}