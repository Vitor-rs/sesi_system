import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'
import { sql, relations } from 'drizzle-orm'

// --- Core Entities ---

// Students Table
export const students = sqliteTable('students', {
  id: text('id').primaryKey(), // UUID
  name: text('name').notNull(),
  classId: text('class_id').references(() => classes.id),
  status: text('status', { enum: ['active', 'inactive', 'transferred'] })
    .notNull()
    .default('active'),
  enrollmentType: text('enrollment_type', {
    enum: ['regular', 'transfer', 'transfer_in', 'late_admission']
  })
    .notNull()
    .default('regular'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  // New Fields
  admissionDate: text('admission_date'),
  originType: text('origin_type', {
    enum: ['sesi_internal', 'public', 'private_scholarship', 'private_paying', 'other']
  }),
  originDescription: text('origin_description'),
  originObservation: text('origin_observation'),
  // Legacy Fields (Keep for safety until migration)
  transferDate: text('transfer_date'),
  transferOrigin: text('transfer_origin'),
  transferCity: text('transfer_city'),
  transferState: text('transfer_state'),
  transferObservation: text('transfer_observation'),
  number: integer('number') // Chamada number
})

// Classes Table
// Classes Table
export const classes = sqliteTable('classes', {
  id: text('id').primaryKey(),
  name: text('name').notNull(), // e.g., "4º Ano A"
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
})

// Settings Table
export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
})

// History Table
export const studentHistory = sqliteTable('student_history', {
  id: text('id').primaryKey(),
  studentId: text('student_id')
    .notNull()
    .references(() => students.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  date: text('date').notNull(),
  description: text('description').notNull()
})

// --- Academic Structure ---

// Disciplines Catalog (Matérias disponíveis)
export const disciplines = sqliteTable('disciplines', {
  id: text('id').primaryKey(),
  name: text('name').notNull(), // e.g. "Matemática", "Português", "Caligrafia"
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
})

// Class Disciplines (Vínculo Turma-Matéria)
export const classDisciplines = sqliteTable('class_disciplines', {
  id: text('id').primaryKey(),
  classId: text('class_id')
    .notNull()
    .references(() => classes.id, { onDelete: 'cascade' }),
  disciplineId: text('discipline_id')
    .notNull()
    .references(() => disciplines.id),
  teacherName: text('teacher_name') // Optional override if specific teacher
})

// Formative Configuration Templates (Para dropdown de "Adicionar Formativa")
export const formativeTemplates = sqliteTable('formative_templates', {
  id: text('id').primaryKey(),
  name: text('name').notNull(), // e.g. "Participação", "Tarefas"
  type: text('type', { enum: ['simple', 'composite'] }).notNull(),
  defaultMaxPoints: real('default_max_points').notNull(),
  isGeneric: integer('is_generic', { mode: 'boolean' }).default(true),
  disciplineId: text('discipline_id').references(() => disciplines.id)
})

// --- Grading System ---

// Assessments (As colunas da planilha: AV1, AV2, AV3, e os grupos de formativas)
export const assessments = sqliteTable('assessments', {
  id: text('id').primaryKey(),
  classDisciplineId: text('class_discipline_id')
    .notNull()
    .references(() => classDisciplines.id, { onDelete: 'cascade' }),
  bimester: integer('bimester').notNull(), // 1, 2, 3, 4
  name: text('name').notNull(), // "Prova Mensal", "Participação", "Tarefas"
  type: text('type', {
    enum: ['av1', 'av2', 'av3_simple', 'av3_composite', 'recuperacao']
  }).notNull(),
  grade: real('grade').notNull().default(10), // Peso na média (geralmente 1)
  maxPoints: real('max_points').notNull().default(10), // Vale quanto? (10.0, 2.0, 4.0)
  date: text('date'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
})

// Activities (Itens dentro de uma Formativa Composta - ex: "Tarefa 01")
export const activities = sqliteTable('activities', {
  id: text('id').primaryKey(),
  assessmentId: text('assessment_id')
    .notNull()
    // Só deve vincular a assessments do tipo 'av3_composite'
    .references(() => assessments.id, { onDelete: 'cascade' }),
  name: text('name').notNull(), // "Ativ. 01", "Texto 3"
  dateAssigned: text('date_assigned'),
  dateDue: text('date_due'),
  description: text('description'),
  maxValue: real('max_value').default(1) // Peso relativo dentro da composta
})

// Grades (As notas lançadas)
export const grades = sqliteTable('grades', {
  id: text('id').primaryKey(),
  studentId: text('student_id')
    .notNull()
    .references(() => students.id, { onDelete: 'cascade' }),

  // Link polimórfico (conceitual): ou aponta para assessment (simples) ou activity (composta)
  assessmentId: text('assessment_id').references(() => assessments.id, { onDelete: 'cascade' }),
  activityId: text('activity_id').references(() => activities.id, { onDelete: 'cascade' }),

  value: real('value'), // A nota numérica ou 1/0 para checklists
  status: text('status', { enum: ['present', 'absent', 'late'] }).default('present'),
  feedback: text('feedback'),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
})

// --- Relations ---

export const studentHistoryRelations = relations(studentHistory, ({ one }) => ({
  student: one(students, {
    fields: [studentHistory.studentId],
    references: [students.id]
  })
}))

export const studentsRelations = relations(students, ({ many, one }) => ({
  history: many(studentHistory),
  class: one(classes, {
    fields: [students.classId],
    references: [classes.id]
  }),
  grades: many(grades)
}))

export const classesRelations = relations(classes, ({ many }) => ({
  students: many(students),
  classDisciplines: many(classDisciplines)
}))

export const disciplinesRelations = relations(disciplines, ({ many }) => ({
  classDisciplines: many(classDisciplines)
}))

export const classDisciplinesRelations = relations(classDisciplines, ({ one, many }) => ({
  class: one(classes, {
    fields: [classDisciplines.classId],
    references: [classes.id]
  }),
  discipline: one(disciplines, {
    fields: [classDisciplines.disciplineId],
    references: [disciplines.id]
  }),
  assessments: many(assessments)
}))

export const assessmentsRelations = relations(assessments, ({ one, many }) => ({
  classDiscipline: one(classDisciplines, {
    fields: [assessments.classDisciplineId],
    references: [classDisciplines.id]
  }),
  activities: many(activities),
  grades: many(grades)
}))

export const activitiesRelations = relations(activities, ({ one, many }) => ({
  assessment: one(assessments, {
    fields: [activities.assessmentId],
    references: [assessments.id]
  }),
  grades: many(grades)
}))

export const gradesRelations = relations(grades, ({ one }) => ({
  student: one(students, {
    fields: [grades.studentId],
    references: [students.id]
  }),
  assessment: one(assessments, {
    fields: [grades.assessmentId],
    references: [assessments.id]
  }),
  activity: one(activities, {
    fields: [grades.activityId],
    references: [activities.id]
  })
}))
