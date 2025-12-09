import { eq, and } from 'drizzle-orm'
import { getDb } from '../db/client'
import { classDisciplines, disciplines } from '../db/schema'
import type { ClassDiscipline } from '../../shared/types'

export class ClassDisciplineService {
  static async getByClassId(classId: string): Promise<ClassDiscipline[]> {
    const rows = await getDb()
      .select({
        id: classDisciplines.id,
        classId: classDisciplines.classId,
        disciplineId: classDisciplines.disciplineId,
        teacherName: classDisciplines.teacherName,
        disciplineName: disciplines.name
      })
      .from(classDisciplines)
      .innerJoin(disciplines, eq(classDisciplines.disciplineId, disciplines.id))
      .where(eq(classDisciplines.classId, classId))

    return rows.map((row) => ({
      ...row,
      discipline: {
        id: row.disciplineId,
        name: row.disciplineName
      }
    })) as ClassDiscipline[]
  }

  static async create(data: typeof classDisciplines.$inferInsert): Promise<ClassDiscipline> {
    // Check if duplicate exists
    const existing = getDb()
      .select()
      .from(classDisciplines)
      .where(
        and(
          eq(classDisciplines.classId, data.classId),
          eq(classDisciplines.disciplineId, data.disciplineId)
        )
      )
      .get()

    if (existing) {
      throw new Error('Discipline already associated with this class')
    }

    const created = getDb().insert(classDisciplines).values(data).returning().get()

    // Fetch with discipline name for return
    const result = await ClassDisciplineService.getByClassId(data.classId)
    const found = result.find((r) => r.id === created.id)
    if (!found) throw new Error('Failed to retrieve created association')

    return found
  }

  static async delete(id: string): Promise<void> {
    getDb().delete(classDisciplines).where(eq(classDisciplines.id, id)).run()
  }
}
