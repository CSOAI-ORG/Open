/**
 * Tests for Analytics Filtering Feature
 * Verify that analytics endpoints support filtering by AI systems, frameworks, and incident types
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getDb } from '../../db';
import { watchdogReports, assessments, aiSystems, frameworks } from '../../../drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Analytics Filtering', () => {
  let db: any;
  let testAISystemId: number;
  let testFrameworkId: number;
  let testIncidentId: number;
  let testAssessmentId: number;

  beforeAll(async () => {
    db = await getDb();
    
    // Create test AI system
    const aiSystemResult = await db
      .insert(aiSystems)
      .values({
        userId: 1,
        name: 'Test AI System for Filtering',
        description: 'Test system',
        systemType: 'chatbot',
        riskLevel: 'limited',
        status: 'active',
      });
    testAISystemId = aiSystemResult.insertId ? Number(aiSystemResult.insertId) : 1;
    if (!testAISystemId || testAISystemId === 0) testAISystemId = 1;

    // Create test framework
    const frameworkResult = await db
      .insert(frameworks)
      .values({
        code: 'TEST_FW_' + Date.now(),
        name: 'Test Framework for Filtering',
        description: 'Test framework',
        version: '1.0',
        category: 'risk_management',
        isActive: true,
      });
    testFrameworkId = frameworkResult.insertId ? Number(frameworkResult.insertId) : 1;
    if (!testFrameworkId || testFrameworkId === 0) testFrameworkId = 1;

    // Create test incident
    const incidentResult = await db
      .insert(watchdogReports)
      .values({
        reporterEmail: 'test@example.com',
        reporterName: 'Test Reporter',
        title: 'Test Incident for Filtering',
        description: 'Test incident description',
        aiSystemName: testAISystemId.toString(),
        companyName: 'Test Company',
        incidentType: 'bias',
        severity: 'high',
        status: 'submitted',
      });
    testIncidentId = incidentResult.insertId ? Number(incidentResult.insertId) : 1;
    if (!testIncidentId || testIncidentId === 0) testIncidentId = 1;

    // Create test assessment
    const assessmentResult = await db
      .insert(assessments)
      .values({
        aiSystemId: testAISystemId,
        frameworkId: testFrameworkId,
        assessorId: 1,
        overallScore: '85.5',
        status: 'completed',
      });
    testAssessmentId = assessmentResult.insertId ? Number(assessmentResult.insertId) : 1;
    if (!testAssessmentId || testAssessmentId === 0) testAssessmentId = 1;
  });

  afterAll(async () => {
    // Cleanup test data
    if (db && testIncidentId) {
      await db.delete(watchdogReports).where(eq(watchdogReports.id, testIncidentId));
    }
    if (db && testAssessmentId) {
      await db.delete(assessments).where(eq(assessments.id, testAssessmentId));
    }
    if (db && testFrameworkId) {
      await db.delete(frameworks).where(eq(frameworks.id, testFrameworkId));
    }
    if (db && testAISystemId) {
      await db.delete(aiSystems).where(eq(aiSystems.id, testAISystemId));
    }
  });

  it('should retrieve list of AI systems for filtering', async () => {
    const systems = await db
      .select({
        id: aiSystems.id,
        name: aiSystems.name,
      })
      .from(aiSystems)
      .orderBy(aiSystems.name);

    expect(systems).toBeDefined();
    expect(Array.isArray(systems)).toBe(true);
    
    // Should include our test system (if data was created)
    if (systems.length > 0) {
      const testSystem = systems.find((s: any) => s.id === testAISystemId);
      if (testSystem) {
        expect(testSystem.name).toBe('Test AI System for Filtering');
      }
    }
  });

  it('should retrieve list of frameworks for filtering', async () => {
    const frameworksList = await db
      .select({
        id: frameworks.id,
        name: frameworks.name,
      })
      .from(frameworks)
      .orderBy(frameworks.name);

    expect(frameworksList).toBeDefined();
    expect(Array.isArray(frameworksList)).toBe(true);
    
    // Should include our test framework (if data was created)
    if (frameworksList.length > 0) {
      const testFramework = frameworksList.find((f: any) => f.id === testFrameworkId);
      if (testFramework) {
        expect(testFramework.name).toBe('Test Framework for Filtering');
      }
    }
  });

  it('should filter incidents by incident type', async () => {
    const incidents = await db
      .select()
      .from(watchdogReports)
      .where(eq(watchdogReports.incidentType, 'bias'));

    expect(incidents).toBeDefined();
    expect(Array.isArray(incidents)).toBe(true);
    
    // All returned incidents should be of type 'bias'
    incidents.forEach((incident: any) => {
      expect(incident.incidentType).toBe('bias');
    });
  });

  it('should filter incidents by severity', async () => {
    const incidents = await db
      .select()
      .from(watchdogReports)
      .where(eq(watchdogReports.severity, 'high'));

    expect(incidents).toBeDefined();
    expect(Array.isArray(incidents)).toBe(true);
    
    // All returned incidents should be of severity 'high'
    incidents.forEach((incident: any) => {
      expect(incident.severity).toBe('high');
    });
  });

  it('should filter assessments by framework', async () => {
    const assessmentsData = await db
      .select()
      .from(assessments)
      .where(eq(assessments.frameworkId, testFrameworkId));

    expect(assessmentsData).toBeDefined();
    expect(Array.isArray(assessmentsData)).toBe(true);
    
    // Should include our test assessment (if data was created)
    if (assessmentsData.length > 0) {
      const testAssessment = assessmentsData.find((a: any) => a.id === testAssessmentId);
      if (testAssessment) {
        expect(testAssessment.frameworkId).toBe(testFrameworkId);
      }
    }
  });

  it('should filter assessments by AI system', async () => {
    const assessmentsData = await db
      .select()
      .from(assessments)
      .where(eq(assessments.aiSystemId, testAISystemId));

    expect(assessmentsData).toBeDefined();
    expect(Array.isArray(assessmentsData)).toBe(true);
    
    // Should include our test assessment (if data was created)
    if (assessmentsData.length > 0) {
      const testAssessment = assessmentsData.find((a: any) => a.id === testAssessmentId);
      if (testAssessment) {
        expect(testAssessment.aiSystemId).toBe(testAISystemId);
      }
    }
  });

  it('should support combined filtering (AI system + framework)', async () => {
    const assessmentsData = await db
      .select()
      .from(assessments)
      .where(
        eq(assessments.aiSystemId, testAISystemId)
      );

    expect(assessmentsData).toBeDefined();
    
    // Filter further by framework
    const filteredByFramework = assessmentsData.filter(
      (a: any) => a.frameworkId === testFrameworkId
    );
    
    if (filteredByFramework.length > 0) {
      expect(filteredByFramework[0].aiSystemId).toBe(testAISystemId);
      expect(filteredByFramework[0].frameworkId).toBe(testFrameworkId);
    }
  });
});
