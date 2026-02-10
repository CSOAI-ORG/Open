      const passedAttempt = existingAttempts.find(a => a.passed === 1);
      if (passedAttempt) {
        throw new Error('You have already passed this exam');
      }

      if (existingAttempts.length >= maxAttempts) {
        throw new Error(`Maximum attempts (${maxAttempts}) reached`);
      }

      const percentageScore = Math.round((input.correctAnswers / input.totalQuestions) * 100);
      const passed = percentageScore >= passingScore ? 1 : 0;

      const [result] = await db.insert(finalExamAttempts).values({
        userId: ctx.user.id,
        courseId: input.courseId,
        attemptNumber: existingAttempts.length + 1,
        score: input.score,
        totalQuestions: input.totalQuestions,
        correctAnswers: input.correctAnswers,
        percentageScore: percentageScore.toFixed(2),
        passed,
        startedAt: input.startedAt,
        timeSpentSeconds: input.timeSpentSeconds,
        answers: JSON.stringify(input.answers),
      });

      const attemptId = (result as any).insertId;

      return {
        success: true,
        attemptId,
        passed: passed === 1,
        percentageScore,
        attemptsRemaining: Math.max(0, maxAttempts - existingAttempts.length - 1),
      };
    }),

  getExamHistory: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');