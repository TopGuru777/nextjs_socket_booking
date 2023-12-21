'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createRxDatabase, addRxPlugin } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { HumanSchema } from './schemas/testschema';

// Install the necessary plugins
addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBJsonDumpPlugin);

// Create a Context for the RxDB instance
export const RxDBContext = createContext(null);

// Provide a hook to access the database
export const useRxDB = () => {
  return useContext(RxDBContext);
};

const initDb = async () => {
  let db = await createRxDatabase({
    name: 'heroes',
    storage: getRxStorageDexie(),
  });

  if (!('heroes' in db.collections)) {
    await db.addCollections({
      heroes: {
        schema: HumanSchema
      }
    });
  }

  return db;
};

interface RxDBProviderProps {
  children: ReactNode;
}

// Initialize the DB and expose through the provider
export const RxDBProvider: React.FC<RxDBProviderProps> = ({ children }) => {
  const [db, setDb] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadDb = async () => {
      if (!db) {
        const instance: any = await initDb();
        if (mounted) {
          setDb(instance);
        }
      }
    };

    loadDb();

    // Cleanup function for unmounting
    return () => {
      mounted = false;
    };
  }, [db]);

  return (
    <RxDBContext.Provider value={db}>
      {children}
    </RxDBContext.Provider>
  );
};
