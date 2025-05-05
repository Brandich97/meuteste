import 'package:flutter/material.dart';
import 'package:workout_app/widgets/workout_list.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Minha Rotina'),
      ),
      body: const WorkoutList(),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // TODO: Implement add workout
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}