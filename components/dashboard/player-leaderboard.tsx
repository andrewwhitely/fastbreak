'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { fetchPlayerStats } from '@/lib/api';
import type { PlayerStats } from '@/types/player';
import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export function PlayerLeaderboard() {
  const [stats, setStats] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('pts');
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

  const getSortedPlayers = () => {
    if (!stats || stats.length === 0) return [];

    try {
      return [...stats]
        .sort((a, b) => {
          const aValue = a[category as keyof PlayerStats];
          const bValue = b[category as keyof PlayerStats];

          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return bValue - aValue;
          }
          return 0;
        })
        .slice(0, 5);
    } catch (error) {
      console.error('Error sorting players:', error);
      return [];
    }
  };

  const categoryLabels: Record<string, string> = {
    pts: 'Points',
    reb: 'Rebounds',
    ast: 'Assists',
    stl: 'Steals',
    blk: 'Blocks',
    fg_pct: 'FG%',
    fg3_pct: '3PT%',
  };

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <div className='space-y-1'>
          <CardTitle>Player Leaderboard</CardTitle>
          <CardDescription>
            Top 5 players in each statistical category
          </CardDescription>
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Select category' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='pts'>Points</SelectItem>
            <SelectItem value='reb'>Rebounds</SelectItem>
            <SelectItem value='ast'>Assists</SelectItem>
            <SelectItem value='stl'>Steals</SelectItem>
            <SelectItem value='blk'>Blocks</SelectItem>
            <SelectItem value='fg_pct'>FG%</SelectItem>
            <SelectItem value='fg3_pct'>3PT%</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className='py-2'>
            <Alert className='warning'>
              <AlertCircle className='h-4 w-4' />
              <AlertTitle>Note</AlertTitle>
              <AlertDescription>Using fallback data. {error}</AlertDescription>
            </Alert>
            <Table className='mt-4'>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className='text-right'>
                    {categoryLabels[category]}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getSortedPlayers().map((player, i) => (
                  <TableRow key={player.id || i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className='font-medium'>
                      {player.player_name}
                    </TableCell>
                    <TableCell className='text-right'>
                      {category === 'fg_pct' || category === 'fg3_pct'
                        ? `${(
                            (player[category as keyof PlayerStats] as number) *
                            100
                          ).toFixed(1)}%`
                        : player[category as keyof PlayerStats]}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : loading ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className='text-right'>
                  {categoryLabels[category]}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>
                      <Skeleton className='h-4 w-[120px]' />
                    </TableCell>
                    <TableCell className='text-right'>
                      <Skeleton className='h-4 w-[40px] ml-auto' />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className='text-right'>
                  {categoryLabels[category]}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getSortedPlayers().map((player, i) => (
                <TableRow key={player.id || i}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell className='font-medium'>
                    {player.player_name}
                  </TableCell>
                  <TableCell className='text-right'>
                    {category === 'fg_pct' || category === 'fg3_pct'
                      ? `${(
                          (player[category as keyof PlayerStats] as number) *
                          100
                        ).toFixed(1)}%`
                      : player[category as keyof PlayerStats]}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
