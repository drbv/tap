import BetterSqlite3 from "better-sqlite3";
import Database from "better-sqlite3";

export class DatabaseService {
    private static db: BetterSqlite3.Database;


    public static createDatabase() {
        this.db = new Database('data/sample.db', {verbose: console.log});
        this.db.exec("CREATE TABLE IF NOT EXISTS data(id INTEGER PRIMARY KEY, name TEXT);");
    }

    public static getDb(): BetterSqlite3.Database {
        return this.db;
    }
}
