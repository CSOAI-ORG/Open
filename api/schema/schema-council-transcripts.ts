/**
 * Council Session Transcripts Schema
 * Stores detailed logs and transcripts of Byzantine Council voting sessions
 * for transparency and audit purposes
 */

import { mysqlTable, int, varchar, text, timestamp, mysqlEnum, json, decimal, index } from "drizzle-orm/mysql-core";

// Council Session Transcripts - Detailed logs of each voting session
export const councilSessionTranscripts = mysqlTable("council_session_transcripts", {
  id: int().autoincrement().notNull().primaryKey(),
  sessionId: int().notNull(),
  
  // Session metadata
  sessionStartedAt: timestamp({ mode: 'string' }).notNull(),
  sessionEndedAt: timestamp({ mode: 'string' }),
  durationMs: int(),
  
  // Subject information
  subjectType: mysqlEnum(['watchdog_report', 'assessment', 'policy_proposal', 'system_review']).notNull(),
  subjectId: int().notNull(),
  subjectTitle: varchar({ length: 255 }).notNull(),
  subjectDescription: text(),
  subjectContext: json().$type<{
    framework?: string;
    riskLevel?: string;
    region?: string;
    organization?: string;
    additionalData?: Record<string, unknown>;
  }>(),
  
  // Voting summary
  totalAgents: int().default(33).notNull(),
  votingAgents: int().default(0).notNull(),
  approveVotes: int().default(0).notNull(),
  rejectVotes: int().default(0).notNull(),
  escalateVotes: int().default(0).notNull(),
  abstainVotes: int().default(0).notNull(),
  consensusReached: mysqlEnum(['yes', 'no']).default('no').notNull(),
  consensusThreshold: decimal({ precision: 5, scale: 2 }).default('0.67').notNull(),
  finalDecision: mysqlEnum(['approved', 'rejected', 'escalated', 'no_consensus']),
  
  // Human review (if escalated)
  humanReviewRequired: mysqlEnum(['yes', 'no']).default('no').notNull(),
  humanReviewerId: int(),
  humanReviewerName: varchar({ length: 255 }),
  humanDecision: text(),
  humanReviewedAt: timestamp({ mode: 'string' }),
  
  // Full transcript as structured JSON
  fullTranscript: json().$type<{
    phases: Array<{
      phase: string;
      startedAt: string;
      endedAt: string;
      events: Array<{
        timestamp: string;
        type: string;
        agentId?: string;
        agentType?: string;
        agentProvider?: string;
        vote?: string;
        confidence?: number;
        reasoning?: string;
        metadata?: Record<string, unknown>;
      }>;
    }>;
    summary: {
      keyPoints: string[];
      dissentingOpinions: string[];
      recommendations: string[];
    };
  }>(),
  
  // Export metadata
  exportedPdf: varchar({ length: 500 }),
  exportedJson: varchar({ length: 500 }),
  
  createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
  updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("idx_session_transcripts_sessionId").on(table.sessionId),
  index("idx_session_transcripts_subjectType").on(table.subjectType),
  index("idx_session_transcripts_finalDecision").on(table.finalDecision),
  index("idx_session_transcripts_createdAt").on(table.createdAt),
]);

// Individual vote logs with detailed reasoning
export const councilVoteLogs = mysqlTable("council_vote_logs", {
  id: int().autoincrement().notNull().primaryKey(),
  transcriptId: int().notNull(),
  sessionId: int().notNull(),
  
  // Agent information
  agentId: varchar({ length: 50 }).notNull(),
  agentName: varchar({ length: 100 }).notNull(),
  agentType: mysqlEnum(['guardian', 'arbiter', 'scribe']).notNull(),
  agentProvider: mysqlEnum(['openai', 'anthropic', 'google', 'kimi', 'deepseek']).notNull(),
  agentSpecialization: varchar({ length: 100 }),
  
  // Vote details
  vote: mysqlEnum(['approve', 'reject', 'escalate', 'abstain']).notNull(),
  confidence: decimal({ precision: 5, scale: 2 }),
  reasoning: text(),
  keyFactors: json().$type<string[]>(),
  
  // Compliance references
  frameworkReferences: json().$type<Array<{
    framework: string;
    article: string;
    relevance: string;
  }>>(),
  
  // Risk assessment
  riskAssessment: json().$type<{
    identifiedRisks: string[];
    mitigationSuggestions: string[];
    severityLevel: string;
  }>(),
  
  // Timing
  votedAt: timestamp({ mode: 'string' }).notNull(),
  processingTimeMs: int(),
  
  createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
}, (table) => [
  index("idx_vote_logs_transcriptId").on(table.transcriptId),
  index("idx_vote_logs_sessionId").on(table.sessionId),
  index("idx_vote_logs_agentId").on(table.agentId),
  index("idx_vote_logs_vote").on(table.vote),
  index("idx_vote_logs_votedAt").on(table.votedAt),
]);

// Session timeline events for detailed audit trail
export const councilSessionEvents = mysqlTable("council_session_events", {
  id: int().autoincrement().notNull().primaryKey(),
  transcriptId: int().notNull(),
  sessionId: int().notNull(),
  
  // Event details
  eventType: mysqlEnum([
    'session_started',
    'voting_opened',
    'vote_cast',
    'consensus_check',
    'threshold_reached',
    'escalation_triggered',
    'human_review_requested',
    'human_decision_made',
    'session_completed',
    'error_occurred',
    'retry_attempted'
  ]).notNull(),
  
  eventDescription: text(),
  eventData: json(),
  
  // Actor information
  actorType: mysqlEnum(['system', 'agent', 'human']).notNull(),
  actorId: varchar({ length: 100 }),
  actorName: varchar({ length: 255 }),
  
  // Timing
  occurredAt: timestamp({ mode: 'string' }).notNull(),
  
  createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
}, (table) => [
  index("idx_session_events_transcriptId").on(table.transcriptId),
  index("idx_session_events_sessionId").on(table.sessionId),
  index("idx_session_events_eventType").on(table.eventType),
  index("idx_session_events_occurredAt").on(table.occurredAt),
]);
