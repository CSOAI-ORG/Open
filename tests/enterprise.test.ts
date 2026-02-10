    });

    it('should have correct phase structure', async () => {
      const caller = enterpriseRouter.createCaller(mockContext);
      const result = await caller.getComplianceRoadmap({});

      const phase1 = result.phases[0];
      expect(phase1.phase).toBe(1);
      expect(phase1.name).toBe('Critical Remediation');
      expect(phase1.actions).toBeDefined();
      expect(Array.isArray(phase1.actions)).toBe(true);
    });

    it('should calculate total hours correctly', async () => {
      const caller = enterpriseRouter.createCaller(mockContext);
      const result = await caller.getComplianceRoadmap({});

      expect(result.totalHours).toBeGreaterThan(0);
      expect(result.overallProgress).toBeGreaterThanOrEqual(0);
      expect(result.overallProgress).toBeLessThanOrEqual(100);
    });

    it('should accept optional organizationId parameter', async () => {
      const caller = enterpriseRouter.createCaller(mockContext);
      const result = await caller.getComplianceRoadmap({ organizationId: 'org-123' });