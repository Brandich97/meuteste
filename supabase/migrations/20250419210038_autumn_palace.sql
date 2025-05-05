/*
  # Fix RLS policies for exercises table

  1. Changes
    - Drop existing policies that might conflict
    - Create new policies to properly handle exercise management:
      - Allow authenticated users to insert their own exercises
      - Allow users to manage their own exercises
      - Allow public access to exercises without user_id (public exercises)

  2. Security
    - Maintain RLS enabled
    - Ensure proper user isolation
    - Protect user data while allowing public access where appropriate
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public exercises are readable by anyone" ON exercises;
DROP POLICY IF EXISTS "Users can insert their own exercises" ON exercises;
DROP POLICY IF EXISTS "Users can manage their own exercises" ON exercises;

-- Create new policies with proper permissions
CREATE POLICY "Public exercises are readable by anyone"
ON exercises
FOR SELECT
TO public
USING (user_id IS NULL);

CREATE POLICY "Users can insert their own exercises"
ON exercises
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id OR user_id IS NULL
);

CREATE POLICY "Users can manage own exercises"
ON exercises
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);