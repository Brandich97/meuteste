import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:workout_app/app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  await Supabase.initialize(
    url: 'https://wxldqesnhbpuxvcvmcni.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4bGRxZXNuaGJwdXh2Y3ZtY25pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1ODI3MzksImV4cCI6MjA2MDE1ODczOX0.cPEA7hgjQE4Kj9nBaMR07JgdE47b-BI0eXDJbF3pYxo',
  );

  runApp(const WorkoutApp());
}