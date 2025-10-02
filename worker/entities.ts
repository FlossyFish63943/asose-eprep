import { IndexedEntity, Entity, Env } from "./core-utils";
import type { Quiz, LeaderboardEntry } from "@shared/types";
export class QuizEntity extends IndexedEntity<Quiz> {
  static readonly entityName = "quiz";
  static readonly indexName = "quizzes";
  static readonly initialState: Quiz = { id: "", title: "", questions: [] };
  static seedData: Quiz[] = [
    {
      id: "cs-fundamentals",
      title: "CS Fundamentals",
      questions: [
        {
          text: "What does 'CPU' stand for?",
          options: ["Central Processing Unit", "Computer Personal Unit", "Central Process Unit", "Control Panel Unit"],
          correctAnswerIndex: 0
        },
        {
          text: "Which of these is a programming language?",
          options: ["HTML", "JPEG", "Python", "FTP"],
          correctAnswerIndex: 2
        },
        {
          text: "What is the binary equivalent of the decimal number 10?",
          options: ["1010", "1100", "0011", "1001"],
          correctAnswerIndex: 0
        }
      ]
    },
    {
      id: "web-development",
      title: "Web Development Basics",
      questions: [
        {
          text: "What does HTML stand for?",
          options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink and Text Markup Language", "Home Tool Markup Language"],
          correctAnswerIndex: 0
        },
        {
          text: "Which property is used to change the background color in CSS?",
          options: ["color", "bgcolor", "background-color", "background"],
          correctAnswerIndex: 2
        },
        {
          text: "What is the purpose of JavaScript in web development?",
          options: ["To style web pages", "To structure web pages", "To add interactivity to web pages", "To manage databases"],
          correctAnswerIndex: 2
        }
      ]
    }
  ];
}
export type LeaderboardState = {
  scores: LeaderboardEntry[];
  completedQuizzes: Record<string, string[]>; // { [userName]: [quizId1, quizId2] }
};
export class LeaderboardEntity extends Entity<LeaderboardState> {
  static readonly entityName = "leaderboard";
  static readonly fixedId = "global";
  static readonly initialState: LeaderboardState = { scores: [], completedQuizzes: {} };
  constructor(env: Env) {
    super(env, LeaderboardEntity.fixedId);
  }
  async getScores(): Promise<LeaderboardEntry[]> {
    const state = await this.getState();
    return state.scores.sort((a, b) => b.score - a.score);
  }
  async submitScore(quizId: string, name: string, score: number): Promise<{ scoreUpdated: boolean }> {
    let scoreWasUpdated = false;
    await this.mutate((state) => {
      const userCompletions = state.completedQuizzes[name] || [];
      if (userCompletions.includes(quizId)) {
        // User has already completed this quiz, do not update score.
        scoreWasUpdated = false;
        return state;
      }
      scoreWasUpdated = true;
      const newCompletions = {
        ...state.completedQuizzes,
        [name]: [...userCompletions, quizId]
      };
      const existingEntryIndex = state.scores.findIndex((e) => e.name === name);
      let newScores: LeaderboardEntry[];
      if (existingEntryIndex > -1) {
        newScores = [...state.scores];
        newScores[existingEntryIndex] = {
          ...newScores[existingEntryIndex],
          score: newScores[existingEntryIndex].score + score
        };
      } else {
        newScores = [...state.scores, { name, score }];
      }
      return { scores: newScores, completedQuizzes: newCompletions };
    });
    return { scoreUpdated: scoreWasUpdated };
  }
  async reset(): Promise<void> {
    await this.save(LeaderboardEntity.initialState);
  }
}