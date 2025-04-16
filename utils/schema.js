import { serial, text, pgTable, varchar , integer, timestamp } from "drizzle-orm/pg-core";
export const MockInterview = pgTable('mockInterview' , {
    id : serial('id').primaryKey(),
    jsonMockResp : text('jsonMockResp').notNull(),
    jobPosition : varchar('jobPosition').notNull(),
    jobDesc : varchar('jobDesc').notNull(),
    jobExperience : varchar('jobExperience').notNull(),
    createdBy: varchar('createdBy').notNull(),
    createdAt: varchar('createdAt'),
    mockId : varchar('mockId').notNull()
})

export const UserAnswer = pgTable('userAnswer',{
    id:serial('id').primaryKey(),
    mockIdRef:varchar('mockId').notNull(),
    question:varchar('question').notNull(),
    correctAns:text('correctAns'),
    userAns:text('userAns'),
    feedback:text('feedback'),
    rating:varchar('rating'),
    userEmail:varchar('userEmail'),
    createdAt:varchar('createdAt')
})

export const resumes = pgTable('resumes', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email'),
  ats_score: integer('ats_score'),
  keyword_score: integer('keyword_score'),
  missing_skills: text('missing_skills'),
  suggestions: text('suggestions'),
  created_at: timestamp('created_at').defaultNow(),
});
