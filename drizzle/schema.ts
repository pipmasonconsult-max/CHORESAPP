import { mysqlTable, text, serial, int, timestamp, boolean, decimal, mysqlEnum, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

// Users table (parents) - keeping original OAuth structure and adding password for local auth
export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  openId: varchar("openId", { length: 64 }).unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).notNull().default("user"),
  password: text("password"), // for parent login
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),
  lastSignedIn: timestamp("lastSignedIn").notNull().defaultNow(),
});

// Kids profiles table
export const kids = mysqlTable("kids", {
  id: serial("id").primaryKey(),
  userId: int("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  birthday: timestamp("birthday").notNull(),
  pocketMoneyAmount: decimal("pocket_money_amount", { precision: 10, scale: 2 }).notNull(),
  pocketMoneyFrequency: mysqlEnum("pocket_money_frequency", ["daily", "weekly", "monthly"]).notNull(),
  avatarColor: varchar("avatar_color", { length: 7 }).notNull().default("#4F46E5"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Chores table (templates)
export const chores = mysqlTable("chores", {
  id: serial("id").primaryKey(),
  userId: int("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  paymentAmount: decimal("payment_amount", { precision: 10, scale: 2 }).notNull(),
  frequency: mysqlEnum("frequency", ["daily", "weekly", "monthly"]).notNull(),
  choreType: mysqlEnum("chore_type", ["shared", "individual"]).notNull(), // shared (first-come) or individual (per kid)
  isPrePopulated: boolean("is_pre_populated").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Chore assignments (which kids can do which chores)
export const choreAssignments = mysqlTable("chore_assignments", {
  id: serial("id").primaryKey(),
  choreId: int("chore_id").references(() => chores.id).notNull(),
  kidId: int("kid_id").references(() => kids.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Task instances (actual chore completions)
export const tasks = mysqlTable("tasks", {
  id: serial("id").primaryKey(),
  choreId: int("chore_id").references(() => chores.id).notNull(),
  kidId: int("kid_id").references(() => kids.id).notNull(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  timeToComplete: int("time_to_complete"), // in seconds
  photoUrl: text("photo_url"),
  amountEarned: decimal("amount_earned", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  kids: many(kids),
  chores: many(chores),
}));

export const kidsRelations = relations(kids, ({ one, many }) => ({
  user: one(users, {
    fields: [kids.userId],
    references: [users.id],
  }),
  choreAssignments: many(choreAssignments),
  tasks: many(tasks),
}));

export const choresRelations = relations(chores, ({ one, many }) => ({
  user: one(users, {
    fields: [chores.userId],
    references: [users.id],
  }),
  choreAssignments: many(choreAssignments),
  tasks: many(tasks),
}));

export const choreAssignmentsRelations = relations(choreAssignments, ({ one }) => ({
  chore: one(chores, {
    fields: [choreAssignments.choreId],
    references: [chores.id],
  }),
  kid: one(kids, {
    fields: [choreAssignments.kidId],
    references: [kids.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  chore: one(chores, {
    fields: [tasks.choreId],
    references: [chores.id],
  }),
  kid: one(kids, {
    fields: [tasks.kidId],
    references: [kids.id],
  }),
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertKidSchema = createInsertSchema(kids);
export const selectKidSchema = createSelectSchema(kids);

export const insertChoreSchema = createInsertSchema(chores);
export const selectChoreSchema = createSelectSchema(chores);

export const insertChoreAssignmentSchema = createInsertSchema(choreAssignments);
export const selectChoreAssignmentSchema = createSelectSchema(choreAssignments);

export const insertTaskSchema = createInsertSchema(tasks);
export const selectTaskSchema = createSelectSchema(tasks);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Kid = typeof kids.$inferSelect;
export type InsertKid = typeof kids.$inferInsert;

export type Chore = typeof chores.$inferSelect;
export type InsertChore = typeof chores.$inferInsert;

export type ChoreAssignment = typeof choreAssignments.$inferSelect;
export type InsertChoreAssignment = typeof choreAssignments.$inferInsert;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;
