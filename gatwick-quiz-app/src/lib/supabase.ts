import { createClient } from '@supabase/supabase-js';
import { BaseQuestion } from '@/types/questions';
import { parseQuestions } from './parseQuestion';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getQuestions() {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('created_at');

  if (error) throw error;
  return parseQuestions(data as BaseQuestion[]);
}

export async function saveScore(username: string, score: number) {
  const { data, error } = await supabase
    .from('leaderboard')
    .insert([{ username, score }]);

  if (error) throw error;
  return data;
}

export async function getLeaderboard(limit = 10) {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('username, score, created_at')
    .order('score', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}