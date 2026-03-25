
import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

export interface DayProgress {
  date: string;
  habitsCompleted: string[] | string; // string[] en memoria, string (JSON) en BD
  isComplete: number | boolean; // 0 o 1 (number en BD, boolean en memoria)
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private db: SQLiteDBConnection | null = null;
  private dbName = 'routine_db';
  private readonly DB_VERSION = 1;

  constructor() {}

  async initializeDatabase(): Promise<void> {
    try {
      // Verificar si SQLite está disponible
      if (Capacitor.getPlatform() === 'web') {
        console.warn('SQLite no está disponible en web, usando localStorage como fallback');
        return;
      }

      const platform = Capacitor.getPlatform();
      const sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);

      // Verificar si la base de datos existe
      const ret = await sqlite.checkConnectionsConsistency();
      const isConn = (await sqlite.isConnection(this.dbName, false)).result;

      if (!isConn) {
        // Crear o abrir la base de datos
        this.db = await sqlite.createConnection(
          this.dbName,
          false,
          'no-encryption',
          this.DB_VERSION,
          false
        );
      } else {
        this.db = await sqlite.retrieveConnection(this.dbName, false);
      }

      await this.db.open();
      await this.createTables();
      console.log('Base de datos SQLite inicializada correctamente');
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
      // Fallback a localStorage si SQLite no está disponible
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) return;

    // Tabla para el progreso diario
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS day_progress (
        date TEXT PRIMARY KEY,
        habits_completed TEXT NOT NULL,
        is_complete INTEGER NOT NULL DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `;

    await this.db.execute(createTableQuery);
  }

  async saveDayProgress(date: string, habitsCompleted: string[], isComplete: boolean): Promise<void> {
    try {
      if (!this.db) {
        // Fallback a localStorage
        this.saveToLocalStorage(date, habitsCompleted, isComplete);
        return;
      }

      const habitsJson = JSON.stringify(habitsCompleted);
      const isCompleteInt = isComplete ? 1 : 0;
      const now = new Date().toISOString();

      const insertQuery = `
        INSERT OR REPLACE INTO day_progress
        (date, habits_completed, is_complete, updated_at)
        VALUES (?, ?, ?, ?)
      `;

      await this.db.run(insertQuery, [date, habitsJson, isCompleteInt, now]);
    } catch (error) {
      console.error('Error al guardar progreso:', error);
      // Fallback a localStorage
      this.saveToLocalStorage(date, habitsCompleted, isComplete);
    }
  }

  async getDayProgress(date: string): Promise<DayProgress | null> {
    try {
      if (!this.db) {
        // Fallback a localStorage
        return this.getFromLocalStorage(date);
      }

      const query = `SELECT * FROM day_progress WHERE date = ?`;
      const result = await this.db.query(query, [date]);

      if (result.values && result.values.length > 0) {
        const row = result.values[0] as any;
        return {
          date: row.date,
          habitsCompleted: JSON.parse(row.habits_completed),
          isComplete: row.is_complete === 1 ? 1 : 0,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        };
      }

      return null;
    } catch (error) {
      console.error('Error al obtener progreso:', error);
      // Fallback a localStorage
      return this.getFromLocalStorage(date);
    }
  }

  async getAllProgress(): Promise<{ [key: string]: DayProgress }> {
    try {
      if (!this.db) {
        // Fallback a localStorage
        return this.getAllFromLocalStorage();
      }

      const query = `SELECT * FROM day_progress ORDER BY date DESC`;
      const result = await this.db.query(query);

      const progress: { [key: string]: DayProgress } = {};

      if (result.values) {
        for (const row of result.values as any[]) {
          progress[row.date] = {
            date: row.date,
            habitsCompleted: JSON.parse(row.habits_completed),
            isComplete: row.is_complete === 1 ? 1 : 0,
            createdAt: row.created_at,
            updatedAt: row.updated_at
          };
        }
      }

      return progress;
    } catch (error) {
      console.error('Error al obtener todo el progreso:', error);
      // Fallback a localStorage
      return this.getAllFromLocalStorage();
    }
  }

  async getCompletedDaysCount(): Promise<number> {
    try {
      if (!this.db) {
        // Fallback a localStorage
        return this.getCompletedDaysFromLocalStorage();
      }

      const query = `SELECT COUNT(*) as count FROM day_progress WHERE is_complete = 1`;
      const result = await this.db.query(query);

      if (result.values && result.values.length > 0) {
        return (result.values[0] as any).count || 0;
      }

      return 0;
    } catch (error) {
      console.error('Error al contar días completados:', error);
      return this.getCompletedDaysFromLocalStorage();
    }
  }

  async deleteDayProgress(date: string): Promise<void> {
    try {
      if (!this.db) {
        // Fallback a localStorage
        this.deleteFromLocalStorage(date);
        return;
      }

      const query = `DELETE FROM day_progress WHERE date = ?`;
      await this.db.run(query, [date]);
    } catch (error) {
      console.error('Error al eliminar progreso:', error);
      this.deleteFromLocalStorage(date);
    }
  }

  async closeDatabase(): Promise<void> {
    try {
      if (this.db) {
        await this.db.close();
        this.db = null;
      }
    } catch (error) {
      console.error('Error al cerrar la base de datos:', error);
    }
  }

  // Métodos de fallback a localStorage
  private saveToLocalStorage(date: string, habitsCompleted: string[], isComplete: boolean): void {
    const progress = this.getAllFromLocalStorage();
    progress[date] = {
      date,
      habitsCompleted,
      isComplete: isComplete ? 1 : 0,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('routineProgress', JSON.stringify(progress));
  }

  private getFromLocalStorage(date: string): DayProgress | null {
    const progress = this.getAllFromLocalStorage();
    return progress[date] || null;
  }

  private getAllFromLocalStorage(): { [key: string]: DayProgress } {
    const stored = localStorage.getItem('routineProgress');
    if (!stored) return {};

    try {
      const parsed = JSON.parse(stored);
      // Convertir el formato antiguo al nuevo formato
      const converted: { [key: string]: DayProgress } = {};
      for (const [date, data] of Object.entries(parsed)) {
        const dayData = data as any;
        converted[date] = {
          date,
          habitsCompleted: Array.isArray(dayData.habitsCompleted)
            ? dayData.habitsCompleted
            : [],
          isComplete: dayData.isComplete ? 1 : 0,
          updatedAt: dayData.updatedAt || new Date().toISOString()
        };
      }
      return converted;
    } catch (error) {
      console.error('Error al parsear localStorage:', error);
      return {};
    }
  }

  private getCompletedDaysFromLocalStorage(): number {
    const progress = this.getAllFromLocalStorage();
    return Object.values(progress).filter(p => p.isComplete === 1).length;
  }

  private deleteFromLocalStorage(date: string): void {
    const progress = this.getAllFromLocalStorage();
    delete progress[date];
    localStorage.setItem('routineProgress', JSON.stringify(progress));
  }
}

