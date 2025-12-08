import { getDb } from './client'
import { classes, students, studentHistory } from './schema'
import { randomUUID, randomInt } from 'node:crypto'
import { sql } from 'drizzle-orm'
import { logger } from '../services/LoggerService'

const MOCK_CLASSES = [
  { name: '1º Ano A', grade: '1º Ano', letter: 'A', period: 'Matutino', capacity: 30 },
  { name: '2º Ano B', grade: '2º Ano', letter: 'B', period: 'Vespertino', capacity: 25 },
  { name: '3º Ano A', grade: '3º Ano', letter: 'A', period: 'Matutino', capacity: 30 },
  { name: '4º Ano C', grade: '4º Ano', letter: 'C', period: 'Vespertino', capacity: 28 },
  { name: '5º Ano A', grade: '5º Ano', letter: 'A', period: 'Matutino', capacity: 32 }
] as const

const NAMES = [
  'Ana Silva',
  'Bruno Santos',
  'Carlos Oliveira',
  'Daniela Souza',
  'Eduardo Lima',
  'Fernanda Costa',
  'Gabriel Pereira',
  'Helena Rodrigues',
  'Igor Almeida',
  'Julia Martins',
  'Lucas Ferreira',
  'Mariana Costa',
  'Nicolas Alves',
  'Olivia Rocha',
  'Pedro Henrique',
  'Quintino Bocaiuva',
  'Rafael Souza',
  'Sarah Lima',
  'Thiago Mendes',
  'Ursula Martins'
]

export async function seedDatabase(): Promise<void> {
  const db = getDb()

  // 1. Check if ANY data exists
  const existingClasses = await db.select({ count: sql<number>`count(*)` }).from(classes)
  if (existingClasses[0].count > 0) {
    logger.info('[Seed] Database already has data. Skipping seed.')
    return
  }

  logger.info('[Seed] Database is empty. Starting seed...')

  try {
    // 2. Insert Classes
    const classIds: string[] = []

    for (const cls of MOCK_CLASSES) {
      const id = randomUUID()
      classIds.push(id)
      await db.insert(classes).values({
        id,
        name: cls.name,
        period: cls.period,
        year: Number.parseInt(cls.grade[0]), // Extract year number
        capacity: cls.capacity,
        createdAt: new Date().toISOString()
      })
    }

    logger.info(`[Seed] Inserted ${classIds.length} classes.`)

    // 3. Insert Students
    for (let i = 0; i < 20; i++) {
      const studentId = randomUUID()
      const randomClassId = classIds[randomInt(0, classIds.length)]
      const randomName = NAMES[i] // Use unique name from list (assuming list >= 20 or loop wraps)

      await db.insert(students).values({
        id: studentId,
        name: randomName,
        classId: randomClassId,
        status: 'active',
        enrollmentType: 'regular',
        createdAt: new Date().toISOString()
      })

      // Add history
      await db.insert(studentHistory).values({
        id: randomUUID(),
        studentId: studentId,
        type: 'created',
        date: new Date().toISOString(),
        description: 'Matrícula inicial realizada via Seeding.'
      })
    }

    logger.info('[Seed] Inserted 20 students with history.')
    logger.info('[Seed] Database seeding completed successfully.')
  } catch (error) {
    logger.error('[Seed] Failed to seed database:', error)
  }
}
