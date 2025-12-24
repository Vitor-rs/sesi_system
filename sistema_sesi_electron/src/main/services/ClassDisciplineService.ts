import { eq, and, or } from 'drizzle-orm'
import { getDb } from '../db/client'
import { classDisciplines, disciplines, formativeTemplates, assessments } from '../db/schema'
import type { ClassDiscipline } from '../../shared/types'
import { v4 as uuidv4 } from 'uuid'

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

    // --- AUTO-SEMEADURA (Auto-Seeding) of Assessments ---
    // 1. Fetch relevant templates (Generic OR Exclusive to this discipline)
    const templates = await getDb()
      .select()
      .from(formativeTemplates)
      .where(
        or(
          eq(formativeTemplates.isGeneric, true),
          eq(formativeTemplates.disciplineId, data.disciplineId)
        )
      )

    // 2. Generate Assessments for 4 Bimesters
    const assessmentsToInsert: (typeof assessments.$inferInsert)[] = []

    // We prep the inserts first. For composite templates, we might need immediate IDs,
    // so we might need to insert them one by one or in batches if we want to add activities later (though templates don't have default activities yet, except maybe Caligrafia logic later).
    // For now, we'll do a simple batch insert for the main assessments structure.

    for (let bimester = 1; bimester <= 4; bimester++) {
      // 2.1 Fixed Assessments: AV1 (Mensal) & AV2 (Bimestral) configuration
      // TODO: Get default max points from global settings? For now hardcoded 10.0
      assessmentsToInsert.push({
        id: uuidv4(),
        classDisciplineId: created.id,
        bimester,
        name: 'Prova Mensal',
        type: 'av1',
        grade: 1,
        maxPoints: 10.0
      })

      assessmentsToInsert.push({
        id: uuidv4(),
        classDisciplineId: created.id,
        bimester,
        name: 'Prova Bimestral',
        type: 'av2',
        grade: 1,
        maxPoints: 10.0
      })

      // 2.2 Template-based Assessments (AV3)
      for (const template of templates) {
        assessmentsToInsert.push({
          id: uuidv4(),
          classDisciplineId: created.id,
          bimester,
          name: template.name,
          type: template.type === 'composite' ? 'av3_composite' : 'av3_simple',
          grade: 1, // Weight in average
          maxPoints: template.defaultMaxPoints
        })
      }
    }

    if (assessmentsToInsert.length > 0) {
      getDb().insert(assessments).values(assessmentsToInsert).run()
    }

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
