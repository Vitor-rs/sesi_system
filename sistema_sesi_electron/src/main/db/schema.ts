import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

// Students Table
export const students = sqliteTable('students', {
  id: text('id').primaryKey(), // UUID
  name: text('name').notNull(),
  classId: text('class_id'),
  status: text('status', { enum: ['active', 'inactive', 'transferred'] })
    .notNull()
    .default('active'),
  enrollmentType: text('enrollment_type', { enum: ['regular', 'transfer'] })
    .notNull()
    .default('regular'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  transferDate: text('transfer_date'),
  transferOrigin: text('transfer_origin'),
  transferCity: text('transfer_city'),
  transferState: text('transfer_state'),
  transferObservation: text('transfer_observation'),
  number: integer('number')
})

// Classes Table
export const classes = sqliteTable('classes', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  period: text('period').notNull(),
  year: integer('year').notNull(),
  capacity: integer('capacity').notNull(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
})

// History Table (for Student history events)
export const studentHistory = sqliteTable('student_history', {
  id: text('id').primaryKey(),
  studentId: text('student_id')
    .notNull()
    .references(() => students.id),
  type: text('type').notNull(),
  date: text('date').notNull(),
  description: text('description').notNull()
})
