import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';

// Users table for client accounts
export const usersTable = pgTable('users', {
  id: text('id').primaryKey(),
  userEmail: text('user_email').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Voice therapy sessions table
export const sessionsTable = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => usersTable.id, { onDelete: 'cascade' }),
  agentId: text('agent_id').notNull(),
  sessionStatus: text('session_status').notNull(),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  endedAt: timestamp('ended_at'),
  durationSeconds: integer('duration_seconds')
});

// Transcript turns table
export const turnsTable = pgTable('transcript_turns', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').notNull().references(() => sessionsTable.id, { onDelete: 'cascade' }),
  speakerRole: text('speaker_role').notNull(),
  transcriptText: text('transcript_text').notNull(),
  recordedAt: timestamp('recorded_at').defaultNow().notNull()
});

// CBT restructuring steps table
export const cbtStepsTable = pgTable('cbt_steps', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').notNull().references(() => sessionsTable.id, { onDelete: 'cascade' }),
  cbtStep: text('cbt_step').notNull(),
  userInput: text('user_input').notNull(),
  agentResponse: text('agent_response').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Crisis detection log table
export const crisisEventsTable = pgTable('crisis_events', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').references(() => sessionsTable.id, { onDelete: 'cascade' }),
  riskLevel: text('risk_level').notNull(),
  triggerPhrase: text('trigger_phrase').notNull(),
  detectedAt: timestamp('detected_at').defaultNow().notNull()
});
