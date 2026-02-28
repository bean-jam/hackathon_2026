import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

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