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
import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts';

export function PointsDistribution() {
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
        .sort((a, b) => (b.pts || 0) - (a.pts || 0))
        .slice(0, 10)
        .map((player) => ({
          name: player.player_name
            ? player.player_name.split(' ')[1] || player.player_name
            : 'Unknown', // Last name for brevity
          points: player.pts || 0,
        }));
    } catch (error) {
      console.error('Error preparing points data:', error);
      return [];
    }
  };

  const chartData = getChartData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Points Distribution</CardTitle>
        <CardDescription>Points per game for top players</CardDescription>
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
            No points data available
          </div>
        ) : (
          <ChartContainer
            config={{
              points: {
                label: 'Points Per Game',
                color: '#1D8CAB',
              },
            }}
            className='w-full h-full'
          >
            <BarChart data={chartData}>
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey='points' fill='#1D8CAB' radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
