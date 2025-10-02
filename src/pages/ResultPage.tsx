import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Home, BarChart2, Loader2, Info } from 'lucide-react';
import { useQuizStore } from '@/hooks/useQuizStore';
import { audioManager } from '@/lib/audioManager';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { QuizSubmissionResponse } from '@shared/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
export function ResultPage() {
  useDocumentTitle('ePrep - Results');
  const navigate = useNavigate();
  const { quiz, answers, userName, reset } = useQuizStore();
  const [finalScore, setFinalScore] = useState<QuizSubmissionResponse | null>(null);
  const { mutate: submitQuiz, isPending } = useMutation({
    mutationFn: (submission: { name: string; answers: number[] }) =>
      api<QuizSubmissionResponse>(`/api/quizzes/${quiz?.id}/submit`, {
        method: 'POST',
        body: JSON.stringify(submission),
      }),
    onSuccess: (data) => {
      setFinalScore(data);
    },
    onError: (error) => {
      console.error("Failed to submit quiz", error);
      // Fallback to client-side calculation on error
      let score = 0;
      quiz?.questions.forEach((q, i) => {
        if (q.correctAnswerIndex === answers[i]) score++;
      });
      setFinalScore({ score, total: quiz?.questions.length || 0, scoreUpdated: false });
    },
  });
  useEffect(() => {
    if (!quiz || !userName) {
      navigate('/');
      return;
    }
    if (answers.length === quiz.questions.length) {
      submitQuiz({ name: userName, answers });
    }
  }, [quiz, answers, userName, navigate, submitQuiz]);
  useEffect(() => {
    if (finalScore) {
      audioManager.playSound('https://cdn.jsdelivr.net/gh/ksh-ak/assets/sounds/completion.mp3');
    }
  }, [finalScore]);
  const handleGoHome = () => {
    reset();
    navigate('/');
  };
  const handleViewLeaderboard = () => {
    reset();
    navigate('/leaderboard');
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="flex flex-col items-center justify-center text-center space-y-8"
    >
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-4xl">Quiz Complete!</CardTitle>
          <p className="text-muted-foreground text-lg">Well done, {userName}!</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {isPending || !finalScore ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
              <Loader2 className="h-16 w-16 animate-spin" />
              <p className="mt-4 text-xl">Calculating your score...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-2xl text-muted-foreground">Your Final Score:</p>
              <p className="text-8xl font-bold text-primary">
                {finalScore.score}
                <span className="text-4xl text-muted-foreground"> / {finalScore.total}</span>
              </p>
              {finalScore.scoreUpdated === false && (
                <Alert className="text-left">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Note</AlertTitle>
                  <AlertDescription>
                    You have already completed this quiz. Your score for this attempt has not been added to your cumulative leaderboard total.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              onClick={handleGoHome}
              size="lg"
            >
              <Home className="mr-2 h-5 w-5" />
              Play Again
            </Button>
            <Button
              onClick={handleViewLeaderboard}
              variant="outline"
              size="lg"
            >
              <BarChart2 className="mr-2 h-5 w-5" />
              View Leaderboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}