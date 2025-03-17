import type { PlayerStats } from '@/types/player';
import { BalldontlieAPI } from '@balldontlie/sdk';

// Cache for API responses
let statsCache: PlayerStats[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

// Initialize the API client
const api = new BalldontlieAPI({
  apiKey: process.env.BALLDONTLIE_API_KEY || '',
});

// Fallback data in case the API is unavailable
export const fallbackData: PlayerStats[] = [
  {
    id: 1,
    player_name: 'LaMelo Ball',
    pts: 23.9,
    reb: 5.1,
    ast: 8.0,
    stl: 1.9,
    blk: 0.4,
    fg_pct: 0.441,
    fg3_pct: 0.364,
    games: 22,
    minutes: 32,
  },
  {
    id: 2,
    player_name: 'Miles Bridges',
    pts: 21.0,
    reb: 7.3,
    ast: 3.2,
    stl: 1.0,
    blk: 0.6,
    fg_pct: 0.462,
    fg3_pct: 0.329,
    games: 79,
    minutes: 28,
  },
  {
    id: 3,
    player_name: 'Terry Rozier',
    pts: 21.1,
    reb: 4.2,
    ast: 5.7,
    stl: 1.2,
    blk: 0.4,
    fg_pct: 0.452,
    fg3_pct: 0.358,
    games: 63,
    minutes: 24,
  },
  {
    id: 4,
    player_name: 'Brandon Miller',
    pts: 17.3,
    reb: 4.3,
    ast: 2.4,
    stl: 0.9,
    blk: 0.5,
    fg_pct: 0.441,
    fg3_pct: 0.378,
    games: 71,
    minutes: 29,
  },
  {
    id: 5,
    player_name: 'Gordon Hayward',
    pts: 14.5,
    reb: 4.7,
    ast: 4.6,
    stl: 0.8,
    blk: 0.3,
    fg_pct: 0.468,
    fg3_pct: 0.362,
    games: 25,
    minutes: 26,
  },
  {
    id: 6,
    player_name: 'P.J. Washington',
    pts: 13.6,
    reb: 5.3,
    ast: 2.2,
    stl: 0.9,
    blk: 0.9,
    fg_pct: 0.444,
    fg3_pct: 0.328,
    games: 44,
    minutes: 25,
  },
  {
    id: 7,
    player_name: 'Nick Richards',
    pts: 9.7,
    reb: 8.0,
    ast: 0.6,
    stl: 0.4,
    blk: 1.1,
    fg_pct: 0.681,
    fg3_pct: 0.0,
    games: 69,
    minutes: 20,
  },
  {
    id: 8,
    player_name: 'Mark Williams',
    pts: 9.8,
    reb: 7.3,
    ast: 1.1,
    stl: 0.5,
    blk: 1.3,
    fg_pct: 0.632,
    fg3_pct: 0.0,
    games: 19,
    minutes: 22,
  },
];

// Function to test if the API key is valid
export async function testApiKey(apiKey: string): Promise<boolean> {
  try {
    const testApi = new BalldontlieAPI({ apiKey });
    await testApi.nba.getTeams();
    return true;
  } catch (error) {
    console.error('Error testing API key:', error);
    return false;
  }
}

export async function fetchPlayerStats(): Promise<PlayerStats[]> {
  // Since we don't have access to player stats, return fallback data
  return fallbackData;
}

// New function to get team information
export async function getTeamInfo() {
  try {
    const teams = await api.nba.getTeams();
    const hornets = teams.data.find((team) => team.id === 4); // Hornets team ID is 4
    return hornets;
  } catch (error) {
    console.error('Error fetching team info:', error);
    return null;
  }
}

// New function to get players
export async function getTeamPlayers() {
  try {
    const players = await api.nba.getPlayers({
      team_ids: [4], // Hornets team ID
      per_page: 100,
    });
    return players.data.map((player) => ({
      id: player.id,
      name: `${player.first_name} ${player.last_name}`,
      position: player.position,
      team: player.team.full_name,
    }));
  } catch (error) {
    console.error('Error fetching team players:', error);
    return [];
  }
}
