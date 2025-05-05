/*
  # Create exercises table and setup security

  1. New Tables
    - `exercises`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `category` (text)
      - `sets` (integer)
      - `reps` (integer)
      - `weight` (numeric)
      - `day` (text)
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS on `exercises` table
    - Add policies for authenticated users to manage their own exercises
    - Add policies for anonymous users to manage their exercises
*/

CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  name text NOT NULL,
  category text NOT NULL,
  sets integer NOT NULL,
  reps integer NOT NULL,
  weight numeric NOT NULL,
  day text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users
CREATE POLICY "Users can manage their own exercises"
ON exercises
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy for anonymous users
CREATE POLICY "Anonymous users can manage exercises"
ON exercises
FOR ALL
TO anon
USING (user_id IS NULL)
WITH CHECK (user_id IS NULL);