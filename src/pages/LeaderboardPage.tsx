import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2, Trophy, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api-client';
import { LeaderboardEntry } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
interface RankedLeaderboardEntry extends LeaderboardEntry {
  rank: number;
}
export function LeaderboardPage() {
  useDocumentTitle('ePrep - Leaderboard');
  const navigate = useNavigate();
  const { data: leaderboard, isLoading, error } = useQuery<LeaderboardEntry[]>({
    queryKey: ['leaderboard'],
    queryFn: () => api('/api/leaderboard'),
  });
  const rankedLeaderboard = useMemo((): RankedLeaderboardEntry[] => {
    if (!leaderboard) return [];
    let rank = 0;
    let lastScore = -1;
    let rankCounter = 0;
    return leaderboard.map((entry) => {
      rankCounter++;
      if (entry.score !== lastScore) {
        rank = rankCounter;
        lastScore = entry.score;
      }
      return { ...entry, rank };
    });
  }, [leaderboard]);
  const topScores = useMemo(() => {
    if (!leaderboard) return [];
    const distinctScores = [...new Set(leaderboard.map(e => e.score))];
    return distinctScores.slice(0, 3);
  }, [leaderboard]);
  const getTrophy = (score: number, rank: number) => {
    if (score === topScores[0]) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (score === topScores[1]) return <Trophy className="h-6 w-6 text-gray-400" />;
    if (score === topScores[2]) return <Trophy className="h-6 w-6 text-yellow-700" />;
    return <span className="text-muted-foreground w-6 text-center">{rank}</span>;
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-foreground">
          Leaderboard
        </h1>
        <p className="text-lg text-muted-foreground">Top scores across all quizzes.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">High Scores</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center items-center gap-4 text-muted-foreground h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-lg">Loading Scores...</p>
            </div>
          )}
          {error && <p className="text-center text-red-500 h-64">Failed to load leaderboard. Please try again later.</p>}
          {!isLoading && rankedLeaderboard && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankedLeaderboard.length > 0 ? (
                  rankedLeaderboard.map((entry, index) => (
                    <TableRow key={`${entry.name}-${index}`}>
                      <TableCell className="font-medium text-lg flex items-center gap-4">{getTrophy(entry.score, entry.rank)}</TableCell>
                      <TableCell className="text-base">{entry.name}</TableCell>
                      <TableCell className="text-right text-base font-bold">{entry.score}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground h-48">
                      No scores yet. Be the first to complete a quiz!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <div className="text-center">
        <Button
            onClick={() => navigate('/')}
            variant="outline"
        >
            <Home className="mr-2 h-5 w-5" />
            Back to Home
        </Button>
      </div>
    </motion.div>
  );
}