    // Like the post
    const result = await caller.forums.togglePostLike({ postId });

    expect(result).toHaveProperty('success', true);
    expect(result).toHaveProperty('liked');
  });

  it('should filter threads by sort option', async () => {
    const caller = appRouter.createCaller(createMockContext({
      id: testUserId,
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
    }));

    // Test different sort options
    const recentThreads = await caller.forums.getCourseThreads({
      courseId: testCourseId,
      sortBy: 'recent',
    });

    const popularThreads = await caller.forums.getCourseThreads({
      courseId: testCourseId,
      sortBy: 'popular',
    });

    expect(Array.isArray(recentThreads)).toBe(true);
    expect(Array.isArray(popularThreads)).toBe(true);
  });
});
