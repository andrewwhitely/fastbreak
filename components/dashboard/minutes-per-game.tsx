'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchPlayerStats } from '@/lib/api';
import { PlayerStats } from '@/types/player';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Skeleton } from '../ui/skeleton';

export function MinutesPerGame() {
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
        .sort((a, b) => (b.minutes || 0) - (a.minutes || 0))
        .slice(0, 10)
        .map((player) => ({
          name: player.player_name
            ? player.player_name.split(' ')[1] || player.player_name
            : 'Unknown',
          minutes: Math.round(player.minutes || 0),
        }));
    } catch (error) {
      console.error('Error preparing minutes data:', error);
      return [];
    }
  };

  const chartData = getChartData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Minutes Per Game</CardTitle>
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
            No minutes data available
          </div>
        ) : (
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              layout='vertical'
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis type='number' domain={[0, 48]} />
              <YAxis dataKey='name' type='category' width={100} />
              <Tooltip />
              <Bar dataKey='minutes' fill='#4D0099' radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
