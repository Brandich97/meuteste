/*
  # Fix exercises table RLS policies

  1. Changes
    - Drop existing RLS policies for exercises table
    - Create new, more secure RLS policies that properly handle all operations
    
  2. Security
    - Enable RLS (already enabled)
    - Add policies for:
      - Authenticated users can manage their own exercises
      - Anonymous users can only read public exercises
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anonymous users can manage public exercises" ON exercises;
DROP POLICY IF EXISTS "Users can create their own exercises" ON exercises;
DROP POLICY IF EXISTS "Users can delete their own exercises" ON exercises;
DROP POLICY IF EXISTS "Users can read their own exercises" ON exercises;
DROP POLICY IF EXISTS "Users can update their own exercises" ON exercises;

-- Create new comprehensive policies
CREATE POLICY "Users can manage their own exercises"
ON exercises
FOR ALL
TO authenticated
USING (
  auth.uid() = user_id
)
WITH CHECK (
  auth.uid() = user_id
);

CREATE POLICY "Public exercises are readable by anyone"
ON exercises
FOR SELECT
TO public
USING (
  user_id IS NULL
);