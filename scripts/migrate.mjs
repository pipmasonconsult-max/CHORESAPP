import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

async function migrate() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);

  console.log('Running custom migration...');

  try {
    // Add assigned_by column if it doesn't exist
    await connection.query(`
      ALTER TABLE chore_assignments 
      ADD COLUMN IF NOT EXISTS assigned_by INT NOT NULL DEFAULT 1
    `);
    console.log('✓ Added assigned_by column');

    // Add difficulty column if it doesn't exist
    await connection.query(`
      ALTER TABLE chores 
      ADD COLUMN IF NOT EXISTS difficulty ENUM('easy', 'medium', 'hard') NOT NULL DEFAULT 'medium'
    `);
    console.log('✓ Added difficulty column');

    // Add timeWindow column if it doesn't exist
    await connection.query(`
      ALTER TABLE chores 
      ADD COLUMN IF NOT EXISTS time_window ENUM('morning', 'afternoon', 'evening', 'anytime') NOT NULL DEFAULT 'anytime'
    `);
    console.log('✓ Added time_window column');

    // Add estimatedMinutes column if it doesn't exist
    await connection.query(`
      ALTER TABLE chores 
      ADD COLUMN IF NOT EXISTS estimated_minutes INT NOT NULL DEFAULT 15
    `);
    console.log('✓ Added estimated_minutes column');

    // Add isActive column if it doesn't exist
    await connection.query(`
      ALTER TABLE chores 
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE
    `);
    console.log('✓ Added is_active column');

    // Update choreType enum to include first_come
    await connection.query(`
      ALTER TABLE chores 
      MODIFY COLUMN chore_type ENUM('individual', 'first_come') NOT NULL DEFAULT 'individual'
    `);
    console.log('✓ Updated chore_type enum');

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

migrate();
