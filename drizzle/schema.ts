import { mysqlTable, text, serial, int, timestamp, boolean, decimal, mysqlEnum, varchar, index } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

// ============= USERS & AUTHENTICATION =============

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  
  // Google OAuth fields
  googleId: varchar("google_id", { length: 255 }).unique(),
  email: varchar("email", { length: 320 }).notNull(),
  name: text("name").notNull(),
  profilePicture: text("profile_picture"),
  
  // Legacy fields (for backward compatibility, can be removed later)
  openId: varchar("openId", { length: 64 }).unique(),
  loginMethod: varchar("loginMethod", { length: 64 }),
  username: varchar("username", { length: 50 }).unique(),
  passwordHash: varchar("password_hash", { length: 255 }),
  
  role: mysqlEnum("role", ["user", "admin"]).notNull().default("user"),
  timezone: varchar("timezone", { length: 50 }).default("America/New_York").notNull(),
  
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),
  lastSignedIn: timestamp("lastSignedIn").notNull().defaultNow(),
}, (table) => ({
  googleIdIdx: index("google_id_idx").on(table.googleId),
  emailIdx: index("email_idx").on(table.email),
}));

// ============= KID PROFILES =============

export const kids = mysqlTable("kids", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  birthday: timestamp("birthday").notNull(),
  avatarColor: varchar("avatar_color", { length: 20 }).notNull().default("#EC4899"), // pink default
  
  // Pocket money settings
  pocketMoneyAmount: decimal("pocket_money_amount", { precision: 10, scale: 2 }).notNull().default("10.00"),
  pocketMoneyFrequency: mysqlEnum("pocket_money_frequency", ["daily", "weekly", "biweekly", "monthly"]).notNull().default("weekly"),
  
  // Payout settings
  payoutFrequency: mysqlEnum("payout_frequency", ["weekly", "biweekly", "monthly"]).notNull().default("weekly"),
  payoutDay: int("payout_day").notNull().default(5), // 0=Sunday, 1=Monday, etc. or day of month
  lastPayoutDate: timestamp("last_payout_date"),
  autoPayoutEnabled: boolean("auto_payout_enabled").notNull().default(true),
  
  // Savings settings
  savingsPercentage: decimal("savings_percentage", { precision: 5, scale: 2 }).notNull().default("10.00"),
  autoSavingsEnabled: boolean("auto_savings_enabled").notNull().default(true),
  
  // Current earnings (pending payout)
  currentEarnings: decimal("current_earnings", { precision: 10, scale: 2 }).notNull().default("0.00"),
  
  // Total hours worked
  totalHoursWorked: decimal("total_hours_worked", { precision: 10, scale: 2 }).notNull().default("0.00"),
  
  // Music preference
  preferredMusic: varchar("preferred_music", { length: 50 }).default("lets_go"),
  musicVolume: int("music_volume").notNull().default(70), // 0-100
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
}, (table) => ({
  userIdIdx: index("user_id_idx").on(table.userId),
}));

// ============= BANK ACCOUNTS =============

export const bankAccounts = mysqlTable("bank_accounts", {
  id: int("id").primaryKey().autoincrement(),
  kidId: int("kid_id").references(() => kids.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  accountType: mysqlEnum("account_type", ["main", "savings", "investment", "custom"]).notNull(),
  balance: decimal("balance", { precision: 10, scale: 2 }).notNull().default("0.00"),
  icon: varchar("icon", { length: 50 }),
  color: varchar("color", { length: 20 }),
  goalAmount: decimal("goal_amount", { precision: 10, scale: 2 }),
  isProtected: boolean("is_protected").notNull().default(false), // Can't be deleted
  sortOrder: int("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
}, (table) => ({
  kidIdIdx: index("kid_id_idx").on(table.kidId),
}));

// ============= AUTOMATIC TRANSFERS =============

export const automaticTransfers = mysqlTable("automatic_transfers", {
  id: int("id").primaryKey().autoincrement(),
  kidId: int("kid_id").references(() => kids.id, { onDelete: "cascade" }).notNull(),
  sourceAccountId: int("source_account_id").references(() => bankAccounts.id, { onDelete: "cascade" }).notNull(),
  destinationAccountId: int("destination_account_id").references(() => bankAccounts.id, { onDelete: "cascade" }).notNull(),
  
  transferType: mysqlEnum("transfer_type", ["fixed", "percentage"]).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }), // For fixed transfers
  percentage: decimal("percentage", { precision: 5, scale: 2 }), // For percentage transfers
  
  frequency: mysqlEnum("frequency", ["daily", "weekly", "biweekly", "monthly"]).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  lastExecutedAt: timestamp("last_executed_at"),
  
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
}, (table) => ({
  kidIdIdx: index("kid_id_idx").on(table.kidId),
}));

// ============= TRANSACTIONS =============

export const transactions = mysqlTable("transactions", {
  id: int("id").primaryKey().autoincrement(),
  kidId: int("kid_id").references(() => kids.id, { onDelete: "cascade" }).notNull(),
  accountId: int("account_id").references(() => bankAccounts.id, { onDelete: "cascade" }).notNull(),
  
  type: mysqlEnum("type", ["credit", "debit", "transfer_in", "transfer_out", "payout", "investment_gain", "chore_earning"]).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  balanceAfter: decimal("balance_after", { precision: 10, scale: 2 }).notNull(),
  
  description: text("description"),
  relatedTransactionId: int("related_transaction_id"), // For transfers
  relatedTaskId: int("related_task_id"), // For chore earnings
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  kidIdIdx: index("kid_id_idx").on(table.kidId),
  accountIdIdx: index("account_id_idx").on(table.accountId),
  createdAtIdx: index("created_at_idx").on(table.createdAt),
}));

// ============= INVESTMENT OPTIONS =============

export const investmentOptions = mysqlTable("investment_options", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).notNull(), // e.g., 10.00 for 10%
  rateFrequency: mysqlEnum("rate_frequency", ["daily", "weekly", "monthly", "yearly"]).notNull(),
  compoundFrequency: mysqlEnum("compound_frequency", ["daily", "weekly", "monthly"]).notNull().default("daily"),
  
  riskLevel: mysqlEnum("risk_level", ["low", "medium", "high"]).notNull(),
  minimumAmount: decimal("minimum_amount", { precision: 10, scale: 2 }).notNull().default("0.00"),
  
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: int("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
}, (table) => ({
  userIdIdx: index("user_id_idx").on(table.userId),
}));

// ============= INVESTMENTS =============

export const investments = mysqlTable("investments", {
  id: int("id").primaryKey().autoincrement(),
  kidId: int("kid_id").references(() => kids.id, { onDelete: "cascade" }).notNull(),
  accountId: int("account_id").references(() => bankAccounts.id, { onDelete: "cascade" }).notNull(),
  optionId: int("option_id").references(() => investmentOptions.id, { onDelete: "restrict" }).notNull(),
  
  principalAmount: decimal("principal_amount", { precision: 10, scale: 2 }).notNull(),
  currentValue: decimal("current_value", { precision: 10, scale: 2 }).notNull(),
  totalGains: decimal("total_gains", { precision: 10, scale: 2 }).notNull().default("0.00"),
  
  startDate: timestamp("start_date").notNull(),
  maturityDate: timestamp("maturity_date"),
  withdrawnAt: timestamp("withdrawn_at"),
  
  status: mysqlEnum("status", ["active", "matured", "withdrawn"]).notNull().default("active"),
  lastCalculatedAt: timestamp("last_calculated_at").notNull().defaultNow(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
}, (table) => ({
  kidIdIdx: index("kid_id_idx").on(table.kidId),
  statusIdx: index("status_idx").on(table.status),
}));

// ============= CHORES =============

export const chores = mysqlTable("chores", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").references(() => users.id, { onDelete: "cascade" }), // NULL for pre-populated
  
  title: text("title").notNull(),
  description: text("description").notNull(),
  paymentAmount: decimal("payment_amount", { precision: 10, scale: 2 }).notNull(),
  
  frequency: mysqlEnum("frequency", ["daily", "weekly", "monthly"]).notNull(),
  timeWindow: mysqlEnum("time_window", ["morning", "day", "afternoon", "evening", "anytime"]).notNull().default("anytime"),
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard"]).notNull(),
  
  choreType: mysqlEnum("chore_type", ["individual", "first_come"]).notNull().default("individual"),
  estimatedMinutes: int("estimated_minutes").notNull().default(15),
  
  isPrePopulated: boolean("is_pre_populated").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
}, (table) => ({
  userIdIdx: index("user_id_idx").on(table.userId),
  frequencyIdx: index("frequency_idx").on(table.frequency),
}));

// ============= CHORE ASSIGNMENTS =============

export const choreAssignments = mysqlTable("chore_assignments", {
  id: int("id").primaryKey().autoincrement(),
  choreId: int("chore_id").references(() => chores.id, { onDelete: "cascade" }).notNull(),
  kidId: int("kid_id").references(() => kids.id, { onDelete: "cascade" }), // NULL for "all kids"
  assignedBy: int("assigned_by").references(() => users.id, { onDelete: "cascade" }).notNull(),
  
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
  isActive: boolean("is_active").notNull().default(true),
}, (table) => ({
  choreIdIdx: index("chore_id_idx").on(table.choreId),
  kidIdIdx: index("kid_id_idx").on(table.kidId),
}));

// ============= TASKS (Completed Chores) =============

export const tasks = mysqlTable("tasks", {
  id: int("id").primaryKey().autoincrement(),
  choreId: int("chore_id").references(() => chores.id, { onDelete: "cascade" }).notNull(),
  kidId: int("kid_id").references(() => kids.id, { onDelete: "cascade" }).notNull(),
  
  status: mysqlEnum("status", ["in_progress", "pending_approval", "approved", "rejected"]).notNull().default("in_progress"),
  
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
  approvedAt: timestamp("approved_at"),
  
  timeToComplete: int("time_to_complete"), // in seconds
  timeSpentMinutes: int("time_spent_minutes"),
  earningsAmount: decimal("earnings_amount", { precision: 10, scale: 2 }),
  
  photoUrl: text("photo_url"),
  rejectionReason: text("rejection_reason"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
}, (table) => ({
  kidIdIdx: index("kid_id_idx").on(table.kidId),
  statusIdx: index("status_idx").on(table.status),
  completedAtIdx: index("completed_at_idx").on(table.completedAt),
}));

// ============= TIME TRACKING =============

export const timeEntries = mysqlTable("time_entries", {
  id: int("id").primaryKey().autoincrement(),
  kidId: int("kid_id").references(() => kids.id, { onDelete: "cascade" }).notNull(),
  taskId: int("task_id").references(() => tasks.id, { onDelete: "set null" }),
  
  date: timestamp("date").notNull(),
  hoursWorked: decimal("hours_worked", { precision: 5, scale: 2 }).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  kidIdIdx: index("kid_id_idx").on(table.kidId),
  dateIdx: index("date_idx").on(table.date),
}));

// ============= ACHIEVEMENTS =============

export const achievements = mysqlTable("achievements", {
  id: int("id").primaryKey().autoincrement(),
  kidId: int("kid_id").references(() => kids.id, { onDelete: "cascade" }).notNull(),
  
  type: mysqlEnum("type", ["hours_milestone", "earnings_milestone", "streak", "investment_return", "savings_goal"]).notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  
  value: decimal("value", { precision: 10, scale: 2 }).notNull(), // Milestone value
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
}, (table) => ({
  kidIdIdx: index("kid_id_idx").on(table.kidId),
}));

// ============= PAYOUT HISTORY =============

export const payoutHistory = mysqlTable("payout_history", {
  id: int("id").primaryKey().autoincrement(),
  kidId: int("kid_id").references(() => kids.id, { onDelete: "cascade" }).notNull(),
  
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  savingsAmount: decimal("savings_amount", { precision: 10, scale: 2 }).notNull(),
  mainAccountAmount: decimal("main_account_amount", { precision: 10, scale: 2 }).notNull(),
  
  payoutType: mysqlEnum("payout_type", ["standard", "invested", "custom_split"]).notNull(),
  
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  paidAt: timestamp("paid_at").defaultNow().notNull(),
}, (table) => ({
  kidIdIdx: index("kid_id_idx").on(table.kidId),
  paidAtIdx: index("paid_at_idx").on(table.paidAt),
}));

// ============= RELATIONS =============

export const usersRelations = relations(users, ({ many }) => ({
  kids: many(kids),
  chores: many(chores),
  investmentOptions: many(investmentOptions),
}));

export const kidsRelations = relations(kids, ({ one, many }) => ({
  user: one(users, {
    fields: [kids.userId],
    references: [users.id],
  }),
  choreAssignments: many(choreAssignments),
  tasks: many(tasks),
  bankAccounts: many(bankAccounts),
  automaticTransfers: many(automaticTransfers),
  transactions: many(transactions),
  investments: many(investments),
  timeEntries: many(timeEntries),
  achievements: many(achievements),
  payoutHistory: many(payoutHistory),
}));

export const bankAccountsRelations = relations(bankAccounts, ({ one, many }) => ({
  kid: one(kids, {
    fields: [bankAccounts.kidId],
    references: [kids.id],
  }),
  transactions: many(transactions),
  investments: many(investments),
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
  assignedBy: one(users, {
    fields: [choreAssignments.assignedBy],
    references: [users.id],
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

// ============= ZOD SCHEMAS =============

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertKidSchema = createInsertSchema(kids);
export const selectKidSchema = createSelectSchema(kids);

export const insertBankAccountSchema = createInsertSchema(bankAccounts);
export const selectBankAccountSchema = createSelectSchema(bankAccounts);

export const insertAutomaticTransferSchema = createInsertSchema(automaticTransfers);
export const selectAutomaticTransferSchema = createSelectSchema(automaticTransfers);

export const insertTransactionSchema = createInsertSchema(transactions);
export const selectTransactionSchema = createSelectSchema(transactions);

export const insertInvestmentOptionSchema = createInsertSchema(investmentOptions);
export const selectInvestmentOptionSchema = createSelectSchema(investmentOptions);

export const insertInvestmentSchema = createInsertSchema(investments);
export const selectInvestmentSchema = createSelectSchema(investments);

export const insertChoreSchema = createInsertSchema(chores);
export const selectChoreSchema = createSelectSchema(chores);

export const insertChoreAssignmentSchema = createInsertSchema(choreAssignments);
export const selectChoreAssignmentSchema = createSelectSchema(choreAssignments);

export const insertTaskSchema = createInsertSchema(tasks);
export const selectTaskSchema = createSelectSchema(tasks);

export const insertTimeEntrySchema = createInsertSchema(timeEntries);
export const selectTimeEntrySchema = createSelectSchema(timeEntries);

export const insertAchievementSchema = createInsertSchema(achievements);
export const selectAchievementSchema = createSelectSchema(achievements);

export const insertPayoutHistorySchema = createInsertSchema(payoutHistory);
export const selectPayoutHistorySchema = createSelectSchema(payoutHistory);

// ============= TYPE EXPORTS =============

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Kid = typeof kids.$inferSelect;
export type InsertKid = typeof kids.$inferInsert;

export type BankAccount = typeof bankAccounts.$inferSelect;
export type InsertBankAccount = typeof bankAccounts.$inferInsert;

export type AutomaticTransfer = typeof automaticTransfers.$inferSelect;
export type InsertAutomaticTransfer = typeof automaticTransfers.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

export type InvestmentOption = typeof investmentOptions.$inferSelect;
export type InsertInvestmentOption = typeof investmentOptions.$inferInsert;

export type Investment = typeof investments.$inferSelect;
export type InsertInvestment = typeof investments.$inferInsert;

export type Chore = typeof chores.$inferSelect;
export type InsertChore = typeof chores.$inferInsert;

export type ChoreAssignment = typeof choreAssignments.$inferSelect;
export type InsertChoreAssignment = typeof choreAssignments.$inferInsert;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

export type TimeEntry = typeof timeEntries.$inferSelect;
export type InsertTimeEntry = typeof timeEntries.$inferInsert;

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;

export type PayoutHistory = typeof payoutHistory.$inferSelect;
export type InsertPayoutHistory = typeof payoutHistory.$inferInsert;
