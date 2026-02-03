/**
 * IndexedDB wrapper for configuration storage
 * Database: AIPersonaConfigDB
 * Stores: platform_config, industry_config, project_config, config_history
 */

const DB_NAME = 'AIPersonaConfigDB';
const DB_VERSION = 1;

export const STORES = {
  platform: 'platform_config',
  industry: 'industry_config',
  project: 'project_config',
  history: 'config_history',
} as const;

export type StoreName = typeof STORES[keyof typeof STORES];

/**
 * IndexedDB wrapper class
 * Provides a promise-based API for IndexedDB operations
 */
export class ConfigDB {
  private db: IDBDatabase | null = null;

  /**
   * Initialize the database
   */
  async init(): Promise<void> {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error(`Failed to open database: ${request.error}`));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores with indexes
        Object.values(STORES).forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            // Use keyPath that handles both 'id' and 'metadata.id'
            const store = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: false });

            // Create indexes for filtering
            store.createIndex('industryId', 'industryId', { unique: false });
            store.createIndex('projectId', 'projectId', { unique: false });
            store.createIndex('updatedAt', 'metadata.updatedAt', { unique: false });
            store.createIndex('level', 'metadata.level', { unique: false });
          }
        });
      };
    });
  }

  /**
   * Get a record by ID
   */
  async get<T>(storeName: StoreName, id: string): Promise<T | undefined> {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result as T);
      request.onerror = () => reject(new Error(`Failed to get record: ${request.error}`));
    });
  }

  /**
   * Save or update a record
   */
  async set<T extends { id: string }>(storeName: StoreName, data: T): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to save record: ${request.error}`));
    });
  }

  /**
   * Delete a record by ID
   */
  async delete(storeName: StoreName, id: string): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to delete record: ${request.error}`));
    });
  }

  /**
   * Get all records from a store
   */
  async getAll<T>(storeName: StoreName, filters?: {
    industryId?: string;
    projectId?: string;
  }): Promise<T[]> {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        let results = request.result as T[];

        // Apply filters if provided
        if (filters) {
          results = results.filter((item: any) => {
            if (filters.industryId && item.industryId !== filters.industryId) return false;
            if (filters.projectId && item.projectId !== filters.projectId) return false;
            return true;
          });
        }

        resolve(results);
      };
      request.onerror = () => reject(new Error(`Failed to get all records: ${request.error}`));
    });
  }

  /**
   * Clear all records from a store
   */
  async clear(storeName: StoreName): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to clear store: ${request.error}`));
    });
  }

  /**
   * Close the database connection
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// Export singleton instance
export const configDB = new ConfigDB();
