import { eq, and, like } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { getDb } from '../db/client'
import { grades, assessments } from '../db/schema'
import type { GradeEntry, FormativeInstance } from '../../shared/types'

export class GradeService {
  static async getGrades(classDisciplineId: string, bimester: number): Promise<GradeEntry[]> {
    // Busca todas as assessments deste bimestre/disciplina
    const disciplineAssessments = await getDb()
      .select({ id: assessments.id })
      .from(assessments)
      .where(
        and(
          eq(assessments.classDisciplineId, classDisciplineId),
          eq(assessments.bimester, bimester)
        )
      )

    const assessmentIds = disciplineAssessments.map((a) => a.id)

    if (assessmentIds.length === 0) return []

    // Busca notas vinculadas a essas assessments
    // Note: This fetches grades for AV1, AV2, and AV3 (simple).
    // For composite AV3, grades might be linked to activities, so we need to handle that.
    // However, existing UI seems to expect a flat list of grades.
    // For MVP, let's assume we fetch all grades that link directly to these assessments.

    /*
      TODO: Se quisermos todas as notas de uma vez (incluindo activities),
      precisamos de uma query mais elaborada ou buscar em separado.
      Por enquanto, vamos buscar tudo que tem assessment_id IN list.
    */

    // Drizzle `inArray` is needed but we can filter in JS if list is small or use raw query.
    // Let's use simple iteration or fetch all for the class (better optimization later).
    // For now, let's fetch ALL grades where assessmentId is in our list.

    const allGrades = await getDb().select().from(grades).all()

    // Filter in memory for SQLite simplicity (avoiding complexity with 'inArray' import right now)
    // Cast to GradeEntry to match frontend expectation
    return allGrades
      .filter((g) => g.assessmentId && assessmentIds.includes(g.assessmentId))
      .map((g) => ({
        ...g,
        updatedAt: g.updatedAt || new Date().toISOString()
      })) as GradeEntry[]
  }

  static async getFixedAssessments(
    classDisciplineId: string,
    bimester: number
  ): Promise<{ id: string; name: string; type: string; maxPoints: number }[]> {
    return (
      getDb()
        .select()
        .from(assessments)
        .where(
          and(
            eq(assessments.classDisciplineId, classDisciplineId),
            eq(assessments.bimester, bimester),
            like(assessments.type, 'av%') // av1, av2
          )
        )
        // Filter out av3 in memory or improve query if needed, but 'av%' includes av1, av2, av3...
        // Actually we want specific types.
        .then((res) =>
          res
            .filter((a) => ['av1', 'av2'].includes(a.type))
            .map((a) => ({
              id: a.id,
              name: a.name,
              type: a.type,
              maxPoints: a.maxPoints || 10
            }))
        )
    )
  }

  static async getFormativeInstances(
    classDisciplineId: string,
    bimester: number
  ): Promise<FormativeInstance[]> {
    // Busca assessments do tipo av3% (av3_simple ou av3_composite)
    const result = await getDb()
      .select()
      .from(assessments)
      .where(
        and(
          eq(assessments.classDisciplineId, classDisciplineId),
          eq(assessments.bimester, bimester),
          like(assessments.type, 'av3%')
        )
      )

    return result.map((r) => ({
      id: r.id,
      name: r.name,
      type: r.type === 'av3_composite' ? 'composite' : 'simple',
      maxPoints: r.maxPoints || 10,
      weight: 1, // Default weight to 1 since it's not in the schema yet
      classDisciplineId: r.classDisciplineId,
      bimester: r.bimester
    }))
  }

  static async getFormativeEntries(assessmentId: string): Promise<GradeEntry[]> {
    const result = await getDb().select().from(grades).where(eq(grades.assessmentId, assessmentId))

    return result.map((g) => ({
      ...g,
      updatedAt: g.updatedAt || new Date().toISOString()
    })) as GradeEntry[]
  }

  static async updateGrade(
    studentId: string,
    assessmentId: string,
    value: number | null
  ): Promise<void> {
    const db = getDb()

    // Check if exists
    const existing = db
      .select()
      .from(grades)
      .where(and(eq(grades.studentId, studentId), eq(grades.assessmentId, assessmentId)))
      .get()

    if (existing) {
      if (value === null) {
        // Option: delete or set null? Schema allows null.
        db.update(grades)
          .set({ value, updatedAt: new Date().toISOString() })
          .where(eq(grades.id, existing.id))
          .run()
        return
      }
      db.update(grades)
        .set({ value, updatedAt: new Date().toISOString() })
        .where(eq(grades.id, existing.id))
        .run()
    } else {
      if (value === null) return // Don't create null entry
      db.insert(grades)
        .values({
          id: uuidv4(),
          studentId,
          assessmentId,
          value,
          status: 'present'
        })
        .run()
    }
  }
}
