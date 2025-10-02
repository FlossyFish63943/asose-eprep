import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, BarChart2 } from 'lucide-react';
import { useQuizStore } from '@/hooks/useQuizStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';
import { NamePromptModal } from '@/components/NamePromptModal';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { audioManager } from '@/lib/audioManager';
import { quizData } from '@shared/quiz-data';
export function HomePage() {
  useDocumentTitle('ePrep - Home');
  const navigate = useNavigate();
  const { setUserName } = useQuizStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [storedName, setStoredName] = useState('');
  useEffect(() => {
    const nameFromStorage = localStorage.getItem('asose-eprep-username') || '';
    setStoredName(nameFromStorage);
    if (nameFromStorage) {
      setUserName(nameFromStorage);
    }
  }, [setUserName]);
  const handleStartQuizClick = (quizId: string) => {
    // Initialize audio context on the first user gesture
    audioManager.init();
    setSelectedQuizId(quizId);
    setIsModalOpen(true);
  };
  const handleNameSubmit = (name: string) => {
    setUserName(name);
    localStorage.setItem('asose-eprep-username', name);
    setIsModalOpen(false);
    if (selectedQuizId) {
      navigate(`/quiz/${selectedQuizId}`);
    }
  };
  return (
    <>
      <NamePromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNameSubmit}
        defaultName={storedName}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-16"
      >
        <Toaster />
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-foreground">
            ASOSE ePrep
          </h1>
          <p className="text-lg text-muted-foreground">Select a quiz to begin your preparation.</p>
        </div>
        <div className="flex justify-center">
          <Button
            onClick={() => navigate('/leaderboard')}
            variant="outline"
          >
            <BarChart2 className="mr-2 h-5 w-5" />
            View Leaderboard
          </Button>
        </div>
        <div className="space-y-8">
          <h2 className="text-3xl font-semibold text-center text-foreground">Available Quizzes</h2>
          {quizData.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-muted-foreground">No quizzes are available at the moment. Please check back later.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {quizData.map((quiz, index) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="transition-all duration-300 group hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="text-2xl text-foreground">{quiz.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => handleStartQuizClick(quiz.id)}
                        className="w-full transition-all duration-300 group-hover:scale-105"
                      >
                        <Play className="mr-2 h-5 w-5" />
                        Start Quiz
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}