import { Hono } from "hono";
import type { Env } from './core-utils';
import { QuizEntity, LeaderboardEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import type { QuizSubmission } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // POST /api/quizzes/:id/submit - Submit answers and get a score
  app.post('/api/quizzes/:id/submit', async (c) => {
    // Ensure quiz data exists in the DO for validation.
    await QuizEntity.ensureSeed(c.env);
    const { id: quizId } = c.req.param();
    const submission = await c.req.json<QuizSubmission>();
    if (!submission.name || !submission.answers) {
      return bad(c, 'Name and answers are required');
    }
    const quizEntity = new QuizEntity(c.env, quizId);
    if (!(await quizEntity.exists())) {
      return notFound(c, 'Quiz not found');
    }
    const quiz = await quizEntity.getState();
    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (question.correctAnswerIndex === submission.answers[index]) {
        score++;
      }
    });
    const leaderboard = new LeaderboardEntity(c.env);
    const { scoreUpdated } = await leaderboard.submitScore(quizId, submission.name, score);
    return ok(c, { score, total: quiz.questions.length, scoreUpdated });
  });
  // GET /api/leaderboard - Get leaderboard scores
  app.get('/api/leaderboard', async (c) => {
    const leaderboard = new LeaderboardEntity(c.env);
    const scores = await leaderboard.getScores();
    return ok(c, scores);
  });
  // POST /api/leaderboard/reset - Admin endpoint to reset the leaderboard
  app.post('/api/leaderboard/reset', async (c) => {
    const { secretKey } = await c.req.json<{ secretKey?: string }>();
    // Use a type assertion to access the environment variable without modifying core files.
    const env = c.env as Env & { ADMIN_SECRET: string };
    const adminSecret = env.ADMIN_SECRET;
    if (!adminSecret) {
      console.error("ADMIN_SECRET environment variable not set.");
      return c.json({ success: false, error: 'Server configuration error.' }, 500);
    }
    if (secretKey !== adminSecret) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    const leaderboard = new LeaderboardEntity(c.env);
    await leaderboard.reset();
    return ok(c, { message: 'Leaderboard has been reset successfully.' });
  });
}