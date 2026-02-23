/*
  # Add topic and confidence score columns to messages table

  1. Changes
    - Add `topic` column to store message topics
    - Add `confidence_score` column for topic detection confidence
*/

ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS topic text,
ADD COLUMN IF NOT EXISTS confidence_score float;