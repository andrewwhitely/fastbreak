import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { MinutesPerGame } from '@/components/dashboard/minutes-per-game';
import { PerformanceRadarChart } from '@/components/dashboard/performance-radar-chart';
import { PlayerLeaderboard } from '@/components/dashboard/player-leaderboard';
import { PointsDistribution } from '@/components/dashboard/points-distribution';
import { ShootingEfficiency } from '@/components/dashboard/shooting-efficiency';

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading='Charlotte Hornets Dashboard'
        text='View comprehensive player statistics and performance analytics.'
      />
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-2'>
        <PlayerLeaderboard />
        <ShootingEfficiency />
        <PerformanceRadarChart />
        <PointsDistribution />
        <MinutesPerGame />
      </div>
    </DashboardShell>
  );
}
