
/**
 * Nexus SQLite Service (Client-Side)
 * Powered by sql.js (WASM)
 */

let dbInstance: any = null;

export const initSQLite = async () => {
  if (dbInstance) return dbInstance;

  try {
    const SQL = await (window as any).initSqlJs({
      locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${file}`
    });

    const savedDb = localStorage.getItem('nexus_sqlite_binary');
    if (savedDb) {
      const uInt8Array = new Uint8Array(JSON.parse(savedDb));
      dbInstance = new SQL.Database(uInt8Array);
      console.info("Nexus: 📁 SQLite Database Loaded from Local Storage.");
    } else {
      dbInstance = new SQL.Database();
      console.info("Nexus: 🆕 Initializing New SQLite Instance.");
      createSchema(dbInstance);
    }

    return dbInstance;
  } catch (e) {
    console.error("SQLite failed to initialize, using fallback arrays.", e);
    return null;
  }
};

const createSchema = (db: any) => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      seller_id TEXT,
      seller_name TEXT,
      title TEXT,
      description TEXT,
      price REAL,
      category TEXT,
      condition TEXT,
      image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT,
      college TEXT,
      avatar TEXT
    );
  `);
  
  saveToDisk(db);
};

export const saveToDisk = (db: any) => {
  if (!db) return;
  const data = db.export();
  const binaryArray = Array.from(data);
  localStorage.setItem('nexus_sqlite_binary', JSON.stringify(binaryArray));
};

/**
 * Exports the current database as a downloadable .sqlite file
 */
export const downloadDatabaseFile = () => {
  if (!dbInstance) return;
  const data = dbInstance.export();
  const blob = new Blob([data], { type: 'application/x-sqlite3' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `nexus_node_v1_${Date.now()}.sqlite`;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Imports an external .sqlite file into the app
 */
export const importDatabaseFile = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const uInt8Array = new Uint8Array(buffer);
  
  // Re-initialize engine with new data
  const SQL = await (window as any).initSqlJs({
    locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${file}`
  });
  
  dbInstance = new SQL.Database(uInt8Array);
  saveToDisk(dbInstance);
  window.location.reload(); // Refresh to apply changes
};

export const query = (sql: string, params: any[] = []) => {
  if (!dbInstance) return [];
  const stmt = dbInstance.prepare(sql);
  stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
};

export const execute = (sql: string, params: any[] = []) => {
  if (!dbInstance) return;
  dbInstance.run(sql, params);
  saveToDisk(dbInstance);
};

export const getDbSize = () => {
  const saved = localStorage.getItem('nexus_sqlite_binary');
  return saved ? Math.round(saved.length / 1024) : 0;
};

export const getDb = () => dbInstance;
