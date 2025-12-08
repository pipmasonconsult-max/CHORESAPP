import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

async function columnExists(connection, tableName, columnName) {
  const [rows] = await connection.query(`
    SELECT COUNT(*) as count 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = ? 
    AND COLUMN_NAME = ?
  `, [tableName, columnName]);
  return rows[0].count > 0;
}

async function migrate() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);

  console.log('Running custom migration...');

  try {
    // Add assigned_by column if it doesn't exist
    if (!(await columnExists(connection, 'chore_assignments', 'assigned_by'))) {
      await connection.query(`
        ALTER TABLE chore_assignments 
        ADD COLUMN assigned_by INT NOT NULL DEFAULT 1
      `);
      console.log('✓ Added assigned_by column');
    } else {
      console.log('✓ assigned_by column already exists');
    }

    // Add difficulty column if it doesn't exist
    if (!(await columnExists(connection, 'chores', 'difficulty'))) {
      await connection.query(`
        ALTER TABLE chores 
        ADD COLUMN difficulty ENUM('easy', 'medium', 'hard') NOT NULL DEFAULT 'medium'
      `);
      console.log('✓ Added difficulty column');
    } else {
      console.log('✓ difficulty column already exists');
    }

    // Add time_window column if it doesn't exist
    if (!(await columnExists(connection, 'chores', 'time_window'))) {
      await connection.query(`
        ALTER TABLE chores 
        ADD COLUMN time_window ENUM('morning', 'afternoon', 'evening', 'anytime') NOT NULL DEFAULT 'anytime'
      `);
      console.log('✓ Added time_window column');
    } else {
      console.log('✓ time_window column already exists');
    }

    // Add estimated_minutes column if it doesn't exist
    if (!(await columnExists(connection, 'chores', 'estimated_minutes'))) {
      await connection.query(`
        ALTER TABLE chores 
        ADD COLUMN estimated_minutes INT NOT NULL DEFAULT 15
      `);
      console.log('✓ Added estimated_minutes column');
    } else {
      console.log('✓ estimated_minutes column already exists');
    }

    // Add is_active column if it doesn't exist
    if (!(await columnExists(connection, 'chores', 'is_active'))) {
      await connection.query(`
        ALTER TABLE chores 
        ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE
      `);
      console.log('✓ Added is_active column');
    } else {
      console.log('✓ is_active column already exists');
    }

    // Update choreType enum to include first_come
    try {
      await connection.query(`
        ALTER TABLE chores 
        MODIFY COLUMN chore_type ENUM('individual', 'first_come') NOT NULL DEFAULT 'individual'
      `);
      console.log('✓ Updated chore_type enum');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME' || error.code === 'ER_PARSE_ERROR') {
        console.log('✓ chore_type enum already correct');
      } else {
        throw error;
      }
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

migrate();
