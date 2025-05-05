/*
  # Fix exercises table RLS policies

  1. Changes
    - Drop existing RLS policies that are causing issues
    - Create new comprehensive RLS policies for exercises table
      - Allow authenticated users to manage their own exercises
      - Allow anonymous users to manage exercises with null user_id
  
  2. Security
    - Enable RLS on exercises table (already enabled)
    - Add policies for:
      - INSERT: Authenticated users can insert their own exercises
      - SELECT: Users can read their own exercises
      - UPDATE: Users can update their own exercises
      - DELETE: Users can delete their own exercises
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anonymous users can manage exercises" ON exercises;
DROP POLICY IF EXISTS "Users can manage their own exercises" ON exercises;

-- Create new policies
CREATE POLICY "Users can create their own exercises"
ON exercises
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
);

CREATE POLICY "Users can read their own exercises"
ON exercises
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
);

CREATE POLICY "Users can update their own exercises"
ON exercises
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id
)
WITH CHECK (
  auth.uid() = user_id
);

CREATE POLICY "Users can delete their own exercises"
ON exercises
FOR DELETE
TO authenticated
USING (
  auth.uid() = user_id
);

-- Policy for anonymous users (exercises with null user_id)
CREATE POLICY "Anonymous users can manage public exercises"
ON exercises
FOR ALL
TO anon
USING (
  user_id IS NULL
)
WITH CHECK (
  user_id IS NULL
);