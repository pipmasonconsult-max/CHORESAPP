import { Express } from "express";
import { eq, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import {
  createKid, getKidsByUserId, updateKid, deleteKid,
  getChoresByUserId, createCustomChore, updateChore, deleteChore,
  assignChoreToKid, assignChoreToAllKids, getChoreAssignmentsByKid, removeChoreAssignment,
  startTask, completeTask, getTasksByKid, getCompletedTasksByKid, getTotalEarningsByKid,
  getAvailableChoresForKid, initializePrePopulatedChores
} from "./db-helpers";
import { storagePut } from "./storage";

export function registerRoutes(app: Express) {
  
  // ============ Authentication Routes ============
  
  // Register/Login for parents
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }
      
      const db = await getDb();
      if (!db) {
        return res.status(500).json({ error: "Database not available" });
      }
      
      // Check if user already exists
      const existing = await db.select().from(users).where(eq(users.name, username)).limit(1);
      if (existing.length > 0) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const result = await db.insert(users).values({
        name: username,
        password: hashedPassword,
        role: "user",
      });
      
      // Drizzle MySQL returns [ResultSetHeader] where insertId is in result[0]
      const insertId = (result as any)[0]?.insertId || (result as any).insertId;
      if (!insertId) {
        console.error("Insert result:", JSON.stringify(result, (key, value) => typeof value === 'bigint' ? value.toString() : value));
        throw new Error("Failed to get insertId from database");
      }
      const userId = typeof insertId === 'bigint' ? Number(insertId) : Number(insertId);
      const [newUser] = await db.select().from(users).where(eq(users.id, userId));
      
      // Initialize pre-populated chores for new user
      await initializePrePopulatedChores(newUser.id);
      
      // Set session
      req.session!.userId = newUser.id;
      
      res.json({ 
        success: true, 
        user: { 
          id: newUser.id, 
          username: newUser.name 
        } 
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }
      
      const db = await getDb();
      if (!db) {
        return res.status(500).json({ error: "Database not available" });
      }
      
      // Find user
      const [user] = await db.select().from(users).where(eq(users.name, username)).limit(1);
      if (!user || !user.password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Set session
      req.session!.userId = user.id;
      
      res.json({ 
        success: true, 
        user: { 
          id: user.id, 
          username: user.name 
        } 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });
  
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });
  
  app.get("/api/auth/me", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }
    
    const [user] = await db.select().from(users).where(eq(users.id, req.session!.userId)).limit(1);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ 
      user: { 
        id: user.id, 
        username: user.name 
      } 
    });
  });
  
  // ============ Kids Management Routes ============
  
  app.get("/api/kids", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const kids = await getKidsByUserId(req.session!.userId);
      res.json(kids);
    } catch (error) {
      console.error("Error fetching kids:", error);
      res.status(500).json({ error: "Failed to fetch kids" });
    }
  });
  
  app.post("/api/kids", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const { name, birthday, pocketMoneyAmount, pocketMoneyFrequency, avatarColor } = req.body;
      
      const kid = await createKid({
        userId: req.session!.userId,
        name,
        birthday: new Date(birthday),
        pocketMoneyAmount: pocketMoneyAmount.toString(),
        pocketMoneyFrequency,
        avatarColor: avatarColor || "#4F46E5",
      });
      
      res.json(kid);
    } catch (error) {
      console.error("Error creating kid:", error);
      res.status(500).json({ error: "Failed to create kid profile" });
    }
  });
  
  app.put("/api/kids/:id", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const kidId = parseInt(req.params.id);
      const { name, birthday, pocketMoneyAmount, pocketMoneyFrequency, avatarColor } = req.body;
      
      const updates: any = {};
      if (name) updates.name = name;
      if (birthday) updates.birthday = new Date(birthday);
      if (pocketMoneyAmount) updates.pocketMoneyAmount = pocketMoneyAmount.toString();
      if (pocketMoneyFrequency) updates.pocketMoneyFrequency = pocketMoneyFrequency;
      if (avatarColor) updates.avatarColor = avatarColor;
      
      await updateKid(kidId, updates);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating kid:", error);
      res.status(500).json({ error: "Failed to update kid profile" });
    }
  });
  
  app.delete("/api/kids/:id", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const kidId = parseInt(req.params.id);
      await deleteKid(kidId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting kid:", error);
      res.status(500).json({ error: "Failed to delete kid profile" });
    }
  });
  
  // ============ Chores Management Routes ============
  
  app.get("/api/chores", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const chores = await getChoresByUserId(req.session!.userId);
      res.json(chores);
    } catch (error) {
      console.error("Error fetching chores:", error);
      res.status(500).json({ error: "Failed to fetch chores" });
    }
  });
  
  app.post("/api/chores", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const { title, description, paymentAmount, frequency, choreType } = req.body;
      
      const chore = await createCustomChore({
        userId: req.session!.userId,
        title,
        description,
        paymentAmount: paymentAmount.toString(),
        frequency,
        choreType,
        isPrePopulated: false,
      });
      
      res.json(chore);
    } catch (error) {
      console.error("Error creating chore:", error);
      res.status(500).json({ error: "Failed to create chore" });
    }
  });
  
  app.put("/api/chores/:id", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const choreId = parseInt(req.params.id);
      const { title, description, paymentAmount, frequency, choreType } = req.body;
      
      const updates: any = {};
      if (title) updates.title = title;
      if (description !== undefined) updates.description = description;
      if (paymentAmount) updates.paymentAmount = paymentAmount.toString();
      if (frequency) updates.frequency = frequency;
      if (choreType) updates.choreType = choreType;
      
      await updateChore(choreId, updates);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating chore:", error);
      res.status(500).json({ error: "Failed to update chore" });
    }
  });
  
  app.delete("/api/chores/:id", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const choreId = parseInt(req.params.id);
      await deleteChore(choreId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting chore:", error);
      res.status(500).json({ error: "Failed to delete chore" });
    }
  });
  
  // ============ Chore Assignment Routes ============
  
  app.post("/api/chores/:choreId/assign", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const choreId = parseInt(req.params.choreId);
      const { kidId, assignToAll } = req.body;
      
      if (assignToAll) {
        await assignChoreToAllKids(choreId, req.session!.userId);
      } else if (kidId) {
        await assignChoreToKid(choreId, kidId);
      } else {
        return res.status(400).json({ error: "Must specify kidId or assignToAll" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error assigning chore:", error);
      res.status(500).json({ error: "Failed to assign chore" });
    }
  });
  
  app.get("/api/kids/:kidId/chores", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const kidId = parseInt(req.params.kidId);
      const chores = await getChoreAssignmentsByKid(kidId);
      res.json(chores);
    } catch (error) {
      console.error("Error fetching kid chores:", error);
      res.status(500).json({ error: "Failed to fetch chores" });
    }
  });
  
  app.get("/api/kids/:kidId/available-chores", async (req, res) => {
    try {
      const kidId = parseInt(req.params.kidId);
      const chores = await getAvailableChoresForKid(kidId);
      res.json(chores);
    } catch (error) {
      console.error("Error fetching available chores:", error);
      res.status(500).json({ error: "Failed to fetch available chores" });
    }
  });
  
  app.delete("/api/assignments/:assignmentId", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const assignmentId = parseInt(req.params.assignmentId);
      await removeChoreAssignment(assignmentId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing assignment:", error);
      res.status(500).json({ error: "Failed to remove assignment" });
    }
  });
  
  // ============ Task Completion Routes ============
  
  app.post("/api/tasks/start", async (req, res) => {
    try {
      const { choreId, kidId } = req.body;
      
      if (!choreId || !kidId) {
        return res.status(400).json({ error: "choreId and kidId required" });
      }
      
      const task = await startTask(choreId, kidId);
      res.json(task);
    } catch (error) {
      console.error("Error starting task:", error);
      res.status(500).json({ error: "Failed to start task" });
    }
  });
  
  app.post("/api/tasks/:taskId/complete", async (req, res) => {
    try {
      const taskId = parseInt(req.params.taskId);
      const { photo } = req.body;
      
      let photoUrl = null;
      
      // Upload photo to S3 if provided
      if (photo) {
        const base64Data = photo.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        const fileName = `task-${taskId}-${Date.now()}.jpg`;
        
        const { url } = await storagePut(fileName, buffer, "image/jpeg");
        photoUrl = url;
      }
      
      const task = await completeTask(taskId, photoUrl);
      res.json(task);
    } catch (error) {
      console.error("Error completing task:", error);
      res.status(500).json({ error: "Failed to complete task" });
    }
  });
  
  app.get("/api/kids/:kidId/tasks", async (req, res) => {
    try {
      const kidId = parseInt(req.params.kidId);
      const tasks = await getTasksByKid(kidId);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });
  
  app.get("/api/kids/:kidId/completed-tasks", async (req, res) => {
    try {
      const kidId = parseInt(req.params.kidId);
      const tasks = await getCompletedTasksByKid(kidId);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching completed tasks:", error);
      res.status(500).json({ error: "Failed to fetch completed tasks" });
    }
  });
  
  app.get("/api/kids/:kidId/earnings", async (req, res) => {
    try {
      const kidId = parseInt(req.params.kidId);
      const total = await getTotalEarningsByKid(kidId);
      res.json({ total });
    } catch (error) {
      console.error("Error fetching earnings:", error);
      res.status(500).json({ error: "Failed to fetch earnings" });
    }
  });
  
  // ============ Admin Routes ============
  
  // Database reset endpoint (for Railway deployment)
  app.post("/api/admin/reset-database", async (req, res) => {
    try {
      const { password } = req.body;
      
      // Simple password protection
      if (password !== "reset-chores-db-2025") {
        return res.status(403).json({ error: "Invalid password" });
      }
      
      const db = await getDb();
      if (!db) {
        return res.status(500).json({ error: "Database not available" });
      }
      
      // Drop all tables
      await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0`);
      await db.execute(sql`DROP TABLE IF EXISTS tasks`);
      await db.execute(sql`DROP TABLE IF EXISTS chore_assignments`);
      await db.execute(sql`DROP TABLE IF EXISTS chores`);
      await db.execute(sql`DROP TABLE IF EXISTS kids`);
      await db.execute(sql`DROP TABLE IF EXISTS users`);
      await db.execute(sql`DROP TABLE IF EXISTS __drizzle_migrations`);
      await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1`);
      
      res.json({ success: true, message: "Database reset complete. Please restart the server to run migrations." });
    } catch (error) {
      console.error("Error resetting database:", error);
      res.status(500).json({ error: "Failed to reset database" });
    }
  });
  
  // Create tables endpoint - GET request for easy access
  app.get("/api/admin/create-tables", async (req, res) => {
    try {      
      const db = await getDb();
      if (!db) {
        return res.status(500).json({ error: "Database not available" });
      }
      
      // Create all tables
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          openId VARCHAR(64) UNIQUE,
          name TEXT,
          email VARCHAR(320),
          loginMethod VARCHAR(64),
          role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
          password TEXT,
          createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          lastSignedIn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS kids (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          name TEXT NOT NULL,
          birthday TIMESTAMP NOT NULL,
          pocket_money_amount DECIMAL(10, 2) NOT NULL,
          pocket_money_frequency ENUM('daily', 'weekly', 'monthly') NOT NULL,
          avatar_color VARCHAR(7) NOT NULL DEFAULT '#4F46E5',
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
      
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS chores (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          payment_amount DECIMAL(10, 2) NOT NULL,
          frequency ENUM('daily', 'weekly', 'monthly') NOT NULL,
          chore_type ENUM('shared', 'individual') NOT NULL,
          is_pre_populated BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
      
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS chore_assignments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          chore_id INT NOT NULL,
          kid_id INT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (chore_id) REFERENCES chores(id) ON DELETE CASCADE,
          FOREIGN KEY (kid_id) REFERENCES kids(id) ON DELETE CASCADE
        )
      `);
      
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS tasks (
          id INT AUTO_INCREMENT PRIMARY KEY,
          chore_id INT NOT NULL,
          kid_id INT NOT NULL,
          started_at TIMESTAMP,
          completed_at TIMESTAMP,
          time_to_complete INT,
          photo_url TEXT,
          amount_earned DECIMAL(10, 2) NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (chore_id) REFERENCES chores(id) ON DELETE CASCADE,
          FOREIGN KEY (kid_id) REFERENCES kids(id) ON DELETE CASCADE
        )
      `);
      
      res.json({ success: true, message: "All tables created successfully!" });
    } catch (error) {
      console.error("Error creating tables:", error);
      res.status(500).json({ error: "Failed to create tables", details: error instanceof Error ? error.message : 'Unknown error' });
    }
  });
}
