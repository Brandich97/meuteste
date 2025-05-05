/*
  # Add INSERT policy for exercises table

  1. Changes
    - Add new RLS policy to allow authenticated users to insert their own exercises
    
  2. Security
    - Policy ensures users can only insert exercises with their own user_id
    - Maintains existing policies for SELECT and ALL operations
*/

CREATE POLICY "Users can insert their own exercises" 
ON exercises
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);