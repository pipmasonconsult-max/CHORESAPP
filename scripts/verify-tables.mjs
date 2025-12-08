import mysql from 'mysql2/promise';

async function verifyTables() {
  const connection = await mysql.createConnection('mysql://root:JMMvoMCEUEPHeNsiyOLqaRAiclZzARee@nozomi.proxy.rlwy.net:12167/railway');

  console.log('Verifying tables in Railway database...\n');

  try {
    const [tables] = await connection.query(`
      SELECT TABLE_NAME, TABLE_ROWS
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'railway'
      ORDER BY TABLE_NAME
    `);

    console.log(`✅ Found ${tables.length} tables:\n`);
    tables.forEach(table => {
      console.log(`  - ${table.TABLE_NAME} (${table.TABLE_ROWS} rows)`);
    });

    console.log('\n✅ Database is ready!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

verifyTables();
