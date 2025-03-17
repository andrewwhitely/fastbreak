'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchPlayerStats } from '@/lib/api';
import type { PlayerStats } from '@/types/player';
import { useEffect, useState } from 'react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from 'recharts';

export function PerformanceRadarChart() {
  const [stats, setStats] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPlayerStats();
        if (Array.isArray(data) && data.length > 0) {
          setStats(data);
          if (data.length > 0 && data[0].id) {
            setSelectedPlayer(data[0].id.toString());
          }
        } else {
          setError('No player data available');
        }
      } catch (error) {
        console.error('Failed to fetch player stats:', error);
        setError('Failed to load player statistics');
      } finally {
        setLoading(false);
      }
    };

    getStats();
  }, []);

  const getPlayerData = () => {
    if (!stats || stats.length === 0 || !selectedPlayer) return [];

    try {
      const player = stats.find(
        (p) => p.id && p.id.toString() === selectedPlayer
      );
      if (!player) return [];

      // Normalize values to 0-100 scale for radar chart
      const maxValues = {
        pts: 30,
        reb: 15,
        ast: 10,
        stl: 3,
        blk: 3,
        fg_pct: 1,
      };

      return [
        { stat: 'Points', value: ((player.pts || 0) / maxValues.pts) * 100 },
        { stat: 'Rebounds', value: ((player.reb || 0) / maxValues.reb) * 100 },
        { stat: 'Assists', value: ((player.ast || 0) / maxValues.ast) * 100 },
        { stat: 'Steals', value: ((player.stl || 0) / maxValues.stl) * 100 },
        { stat: 'Blocks', value: ((player.blk || 0) / maxValues.blk) * 100 },
        { stat: 'FG%', value: ((player.fg_pct || 0) / maxValues.fg_pct) * 100 },
      ];
    } catch (error) {
      console.error('Error preparing radar data:', error);
      return [];
    }
  };

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <div className='space-y-1'>
          <CardTitle>Performance Radar</CardTitle>
          <CardDescription>
            Multi-axis chart showing player stats across categories
          </CardDescription>
        </div>
        <Select
          value={selectedPlayer}
          onValueChange={setSelectedPlayer}
          disabled={loading || stats.length === 0}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Select player' />
          </SelectTrigger>
          <SelectContent>
            {stats.map((player, index) => (
              <SelectItem
                key={player.id || `player-${index}`}
                value={player.id?.toString() || ''}
              >
                {player.player_name || 'Unknown Player'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className='h-[300px]'>
        {loading ? (
          <div className='flex items-center justify-center h-full'>
            <Skeleton className='h-[250px] w-full rounded-full' />
          </div>
        ) : error ? (
          <div className='flex items-center justify-center h-full text-muted-foreground'>
            {error}
          </div>
        ) : stats.length === 0 ? (
          <div className='flex items-center justify-center h-full text-muted-foreground'>
            No player data available
          </div>
        ) : (
          <ChartContainer
            config={{
              radar: {
                label: 'Player Stats',
                color: '#1D8CAB',
              },
            }}
          >
            <RadarChart
              data={getPlayerData()}
              cx='50%'
              cy='50%'
              outerRadius='80%'
            >
              <PolarGrid />
              <PolarAngleAxis dataKey='stat' />
              <PolarRadiusAxis
                domain={[0, 100]}
                axisLine={false}
                tick={false}
              />
              <Radar
                name='Player'
                dataKey='value'
                stroke='#4D0099'
                fill='#1D8CAB'
                fillOpacity={0.6}
              />
            </RadarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
