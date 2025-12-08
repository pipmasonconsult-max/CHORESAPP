import { eq, and, gte, lte, desc, sql } from "drizzle-orm";
import { getDb } from "./db";
import {
  kids, chores, choreAssignments, tasks,
  type Kid, type InsertKid,
  type Chore, type InsertChore,
  type ChoreAssignment, type InsertChoreAssignment,
  type Task, type InsertTask
} from "../drizzle/schema";
import { prePopulatedChores } from "./data/prepopulated-chores";

// ============ Kids Management ============

export async function createKid(kidData: InsertKid): Promise<Kid> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(kids).values(kidData);
  const insertId = (result as any)[0]?.insertId || (result as any).insertId;
  const [newKid] = await db.select().from(kids).where(eq(kids.id, Number(insertId)));
  return newKid;
}

export async function getKidsByUserId(userId: number): Promise<Kid[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(kids).where(eq(kids.userId, userId));
}

export async function updateKid(kidId: number, updates: Partial<InsertKid>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(kids).set(updates).where(eq(kids.id, kidId));
}

export async function deleteKid(kidId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Delete related records first
  await db.delete(choreAssignments).where(eq(choreAssignments.kidId, kidId));
  await db.delete(tasks).where(eq(tasks.kidId, kidId));
  await db.delete(kids).where(eq(kids.id, kidId));
}

// ============ Chores Management ============

export async function initializePrePopulatedChores(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check if pre-populated chores already exist for this user
  const existing = await db.select()
    .from(chores)
    .where(and(eq(chores.userId, userId), eq(chores.isPrePopulated, true)))
    .limit(1);
  
  if (existing.length > 0) return; // Already initialized
  
  // Insert all pre-populated chores
  const choresToInsert = prePopulatedChores.map(chore => ({
    userId,
    title: chore.title,
    description: chore.description,
    paymentAmount: chore.basePayment.toString(),
    frequency: chore.frequency,
    choreType: chore.choreType,
    isPrePopulated: true,
  }));
  
  await db.insert(chores).values(choresToInsert);
}

export async function getChoresByUserId(userId: number): Promise<Chore[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(chores).where(eq(chores.userId, userId));
}

export async function createCustomChore(choreData: InsertChore): Promise<Chore> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(chores).values(choreData);
  const insertId = (result as any)[0]?.insertId || (result as any).insertId;
  const [newChore] = await db.select().from(chores).where(eq(chores.id, Number(insertId)));
  return newChore;
}

export async function updateChore(choreId: number, updates: Partial<InsertChore>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(chores).set(updates).where(eq(chores.id, choreId));
}

export async function deleteChore(choreId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Delete related records first
  await db.delete(choreAssignments).where(eq(choreAssignments.choreId, choreId));
  await db.delete(tasks).where(eq(tasks.choreId, choreId));
  await db.delete(chores).where(eq(chores.id, choreId));
}

// ============ Chore Assignments ============

export async function assignChoreToKid(choreId: number, kidId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check if assignment already exists
  const existing = await db.select()
    .from(choreAssignments)
    .where(and(eq(choreAssignments.choreId, choreId), eq(choreAssignments.kidId, kidId)))
    .limit(1);
  
  if (existing.length === 0) {
    await db.insert(choreAssignments).values({ choreId, kidId });
  }
}

export async function assignChoreToAllKids(choreId: number, userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const userKids = await getKidsByUserId(userId);
  
  for (const kid of userKids) {
    await assignChoreToKid(choreId, kid.id);
  }
}

export async function getChoreAssignmentsByKid(kidId: number): Promise<Array<Chore & { assignmentId: number }>> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      assignmentId: choreAssignments.id,
      id: chores.id,
      userId: chores.userId,
      title: chores.title,
      description: chores.description,
      paymentAmount: chores.paymentAmount,
      frequency: chores.frequency,
      choreType: chores.choreType,
      isPrePopulated: chores.isPrePopulated,
      createdAt: chores.createdAt,
    })
    .from(choreAssignments)
    .innerJoin(chores, eq(choreAssignments.choreId, chores.id))
    .where(eq(choreAssignments.kidId, kidId));
  
  return result;
}

export async function removeChoreAssignment(assignmentId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(choreAssignments).where(eq(choreAssignments.id, assignmentId));
}

// ============ Tasks (Chore Completions) ============

export async function startTask(choreId: number, kidId: number): Promise<Task> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Get chore payment amount
  const [chore] = await db.select().from(chores).where(eq(chores.id, choreId));
  if (!chore) throw new Error("Chore not found");
  
  const taskData: InsertTask = {
    choreId,
    kidId,
    startedAt: new Date(),
    earningsAmount: chore.paymentAmount,
  };
  
  const result = await db.insert(tasks).values(taskData);
  const insertId = (result as any)[0]?.insertId || (result as any).insertId;
  const [newTask] = await db.select().from(tasks).where(eq(tasks.id, Number(insertId)));
  return newTask;
}

export async function completeTask(
  taskId: number,
  photoUrl: string | null
): Promise<Task> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId));
  if (!task) throw new Error("Task not found");
  
  const completedAt = new Date();
  const timeToComplete = task.startedAt 
    ? Math.floor((completedAt.getTime() - new Date(task.startedAt).getTime()) / 1000)
    : 0;
  
  await db.update(tasks).set({
    completedAt,
    timeToComplete,
    photoUrl,
  }).where(eq(tasks.id, taskId));
  
  const [updatedTask] = await db.select().from(tasks).where(eq(tasks.id, taskId));
  return updatedTask;
}

export async function getTasksByKid(kidId: number): Promise<Task[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(tasks)
    .where(eq(tasks.kidId, kidId))
    .orderBy(desc(tasks.createdAt));
}

export async function getCompletedTasksByKid(kidId: number): Promise<Task[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(tasks)
    .where(and(
      eq(tasks.kidId, kidId),
      sql`${tasks.completedAt} IS NOT NULL`
    ))
    .orderBy(desc(tasks.completedAt));
}

export async function getTotalEarningsByKid(kidId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  
  const result = await db.select({
    total: sql<number>`COALESCE(SUM(${tasks.earningsAmount}), 0)`
  })
  .from(tasks)
  .where(and(
    eq(tasks.kidId, kidId),
    sql`${tasks.completedAt} IS NOT NULL`
  ));
  
  return Number(result[0]?.total || 0);
}

// ============ Task Availability Logic ============

export async function getAvailableChoresForKid(kidId: number): Promise<Array<Chore & { isAvailable: boolean; completedToday?: boolean }>> {
  const db = await getDb();
  if (!db) return [];
  
  // Get all chores assigned to this kid
  const assignedChores = await getChoreAssignmentsByKid(kidId);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const choresWithAvailability = await Promise.all(
    assignedChores.map(async (chore) => {
      // Check if chore was completed today (for daily chores)
      const completedToday = await db.select()
        .from(tasks)
        .where(and(
          eq(tasks.choreId, chore.id),
          eq(tasks.kidId, kidId),
          gte(tasks.completedAt, today),
          sql`${tasks.completedAt} IS NOT NULL`
        ))
        .limit(1);
      
      let isAvailable = true;
      
      if (chore.frequency === 'daily' && completedToday.length > 0) {
        isAvailable = false;
      }
      
      // For first_come chores, check if another kid completed it today
      if (chore.choreType === 'first_come' && chore.frequency === 'daily') {
        const completedByAnyone = await db.select()
          .from(tasks)
          .where(and(
            eq(tasks.choreId, chore.id),
            gte(tasks.completedAt, today),
            sql`${tasks.completedAt} IS NOT NULL`
          ))
          .limit(1);
        
        if (completedByAnyone.length > 0) {
          isAvailable = false;
        }
      }
      
      return {
        ...chore,
        isAvailable,
        completedToday: completedToday.length > 0,
      };
    })
  );
  
  return choresWithAvailability;
}
