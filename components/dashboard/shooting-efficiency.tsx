'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchPlayerStats } from '@/lib/api';
import type { PlayerStats } from '@/types/player';
import { useEffect, useState } from 'react';
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from 'recharts';

export function ShootingEfficiency() {
  const [stats, setStats] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPlayerStats();
        if (Array.isArray(data) && data.length > 0) {
          setStats(data);
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

  const getChartData = () => {
    if (!stats || stats.length === 0) return [];

    try {
      return stats
        .filter(
          (player) =>
            player &&
            typeof player.fg_pct === 'number' &&
            typeof player.fg3_pct === 'number' &&
            player.fg_pct > 0 &&
            player.fg3_pct > 0
        )
        .sort((a, b) => b.fg_pct - a.fg_pct)
        .slice(0, 8)
        .map((player) => ({
          name: player.player_name
            ? player.player_name.split(' ')[1] || player.player_name
            : 'Unknown', // Last name for brevity
          'FG%': Number.parseFloat((player.fg_pct * 100).toFixed(1)),
          '3PT%': Number.parseFloat((player.fg3_pct * 100).toFixed(1)),
        }));
    } catch (error) {
      console.error('Error preparing chart data:', error);
      return [];
    }
  };

  const chartData = getChartData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shooting Efficiency</CardTitle>
        <CardDescription>
          Field goal and 3-point percentages comparison
        </CardDescription>
      </CardHeader>
      <CardContent className='h-[300px]'>
        {loading ? (
          <div className='flex items-center justify-center h-full'>
            <Skeleton className='h-[250px] w-full' />
          </div>
        ) : error ? (
          <div className='flex items-center justify-center h-full text-muted-foreground'>
            {error}
          </div>
        ) : chartData.length === 0 ? (
          <div className='flex items-center justify-center h-full text-muted-foreground'>
            No shooting data available
          </div>
        ) : (
          <ChartContainer
            config={{
              'FG%': {
                label: 'Field Goal %',
                color: '#1D8CAB',
              },
              '3PT%': {
                label: '3-Point %',
                color: '#4D0099',
              },
            }}
          >
            <BarChart data={chartData}>
              <XAxis dataKey='name' />
              <YAxis domain={[0, 100]} />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey='FG%' fill='#1D8CAB' radius={[4, 4, 0, 0]} />
              <Bar dataKey='3PT%' fill='#4D0099' radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
