import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '@/hooks/useQuizStore';
import { audioManager } from '@/lib/audioManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { quizData } from '@shared/quiz-data';
export function QuizPage() {
  useDocumentTitle('ePrep - Quiz');
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const {
    quiz,
    currentQuestionIndex,
    startQuiz,
    answerQuestion,
    nextQuestion,
    userName,
  } = useQuizStore();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const quizDataItem = useMemo(() => quizData.find(q => q.id === quizId), [quizId]);
  useEffect(() => {
    if (!userName) {
      navigate('/');
      return;
    }
    if (quizDataItem) {
      startQuiz(quizDataItem);
    } else {
      // If quizId is invalid, navigate to a not-found page or home
      navigate('/404');
    }
  }, [quizDataItem, startQuiz, userName, navigate]);
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
          nextQuestion();
          setSelectedAnswer(null);
          setFeedback(null);
        } else {
          navigate('/results');
        }
      }, 1500); // 1.5-second delay
      return () => clearTimeout(timer);
    }
  }, [feedback, currentQuestionIndex, quiz, nextQuestion, navigate]);
  if (!quiz) {
    // This can show briefly while the store is being updated.
    return <p className="text-center text-muted-foreground">Loading quiz...</p>;
  }
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = (currentQuestionIndex / quiz.questions.length) * 100;
  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    const isCorrect = index === currentQuestion.correctAnswerIndex;
    if (isCorrect) {
      audioManager.playSound('https://cdn.jsdelivr.net/gh/ksh-ak/assets/sounds/correct.mp3');
    } else {
      audioManager.playSound('https://cdn.jsdelivr.net/gh/ksh-ak/assets/sounds/incorrect.mp3');
    }
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    answerQuestion(index);
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-foreground">{quiz.title}</CardTitle>
          <div className="pt-4">
            <Progress value={progress} />
            <p className="text-right text-sm text-muted-foreground mt-2">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </p>
          </div>
        </CardHeader>
      </Card>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground leading-relaxed">{currentQuestion.text}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectAnswer = currentQuestion.correctAnswerIndex === index;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                    className={cn(
                      "w-full text-left justify-start text-lg p-6 transition-all duration-300",
                      feedback && isCorrectAnswer && "bg-green-500/10 border-green-500 text-green-700 dark:text-green-400 hover:bg-green-500/20",
                      feedback && isSelected && !isCorrectAnswer && "bg-red-500/10 border-red-500 text-red-700 dark:text-red-400 hover:bg-red-500/20"
                    )}
                  >
                    {option}
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}