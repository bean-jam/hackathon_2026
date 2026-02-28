import { supabase } from './supabase';

// Function to fetch leaderboard data
export async function fetchLeaderboard() {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('score', { ascending: false })
    .limit(10); // Fetch top 10 scores

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }

  return data;
}

// Function to add a new score
export async function addScore(username: string, score: number) {
  const { error } = await supabase.from('leaderboard').insert([{ username, score }]);

  if (error) {
    console.error('Error adding score:', error);
  }
}