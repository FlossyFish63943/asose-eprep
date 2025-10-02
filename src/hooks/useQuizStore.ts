import { create } from 'zustand';
import { Quiz } from '@shared/types';
interface QuizState {
  quiz: Quiz | null;
  currentQuestionIndex: number;
  answers: number[];
  startTime: number | null;
  endTime: number | null;
  userName: string;
  setUserName: (name: string) => void;
  startQuiz: (quiz: Quiz) => void;
  answerQuestion: (answerIndex: number) => void;
  nextQuestion: () => void;
  finishQuiz: () => void;
  reset: () => void;
}
export const useQuizStore = create<QuizState>((set, get) => ({
  quiz: null,
  currentQuestionIndex: 0,
  answers: [],
  startTime: null,
  endTime: null,
  userName: '',
  setUserName: (name) => set({ userName: name }),
  startQuiz: (quiz) => {
    set({
      quiz,
      currentQuestionIndex: 0,
      answers: [],
      startTime: Date.now(),
      endTime: null,
    });
  },
  answerQuestion: (answerIndex) => {
    set((state) => ({
      answers: [...state.answers, answerIndex],
    }));
  },
  nextQuestion: () => {
    set((state) => {
      if (state.quiz && state.currentQuestionIndex < state.quiz.questions.length - 1) {
        return { currentQuestionIndex: state.currentQuestionIndex + 1 };
      }
      return {};
    });
  },
  finishQuiz: () => {
    set({ endTime: Date.now() });
  },
  reset: () => {
    set({
      quiz: null,
      currentQuestionIndex: 0,
      answers: [],
      startTime: null,
      endTime: null,
    });
  },
}));