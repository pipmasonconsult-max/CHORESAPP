import mysql from 'mysql2/promise';

async function dropAllTables() {
  const connection = await mysql.createConnection('mysql://root:JMMvoMCEUEPHeNsiyOLqaRAiclZzARee@nozomi.proxy.rlwy.net:12167/railway');

  console.log('Connected to Railway database...');

  try {
    // Get all tables
    const [tables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'railway'
    `);

    console.log(`Found ${tables.length} tables to drop`);

    // Disable foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');

    // Drop each table
    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      await connection.query(`DROP TABLE IF EXISTS \`${tableName}\``);
      console.log(`✓ Dropped table: ${tableName}`);
    }

    // Re-enable foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('\n✅ All tables dropped successfully!');
    console.log('Now run the migration to recreate tables with the new schema.');
  } catch (error) {
    console.error('Error dropping tables:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

dropAllTables();
