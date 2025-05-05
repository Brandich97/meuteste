/*
  # Fix RLS policies for exercises table

  1. Changes
    - Drop all existing policies
    - Recreate policies with proper permissions
    
  2. Security
    - Maintain RLS enabled
    - Ensure proper user isolation
    - Allow public access where appropriate
*/

DO $$ 
BEGIN
  -- Drop all existing policies
  DROP POLICY IF EXISTS "Users can read exercises" ON exercises;
  DROP POLICY IF EXISTS "Users can create exercises" ON exercises;
  DROP POLICY IF EXISTS "Users can update own exercises" ON exercises;
  DROP POLICY IF EXISTS "Users can delete own exercises" ON exercises;
  DROP POLICY IF EXISTS "Public exercises are readable by anyone" ON exercises;
  DROP POLICY IF EXISTS "Users can insert their own exercises" ON exercises;
  DROP POLICY IF EXISTS "Users can manage own exercises" ON exercises;
END $$;

-- Create new policies with proper isolation
CREATE POLICY "Users can read exercises"
ON exercises
FOR SELECT
TO public
USING (
  user_id IS NULL OR 
  auth.uid() = user_id
);

CREATE POLICY "Users can create exercises"
ON exercises
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
);

CREATE POLICY "Users can update own exercises"
ON exercises
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own exercises"
ON exercises
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);