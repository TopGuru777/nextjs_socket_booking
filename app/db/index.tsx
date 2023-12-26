'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createRxDatabase, addRxPlugin, removeRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { BookingSchema, ServiceSchema, StaffSchema, StatusSchema, CustomerSchema } from './schemas';
import { getBookingList, getCustomerList, getServiceList, getStaffList, getStatusList } from '../api/services';
import moment from 'moment';

// Install the necessary plugins
addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBJsonDumpPlugin);

// Create a Context for the RxDB instance
export const RxDBContext = createContext(null);

// Provide a hook to access the database
export const useRxDB = () => {
  return useContext(RxDBContext);
};

export const fetchBookings = async (startDate: Date, endDate: Date, db: any) => {
  const bookingList = await getBookingList(startDate, endDate);
  db.collections.bookings.bulkUpsert(bookingList);
}

export const fetchServices = async (db: any) => {
  const serviceList = await getServiceList();
  db.collections.services.bulkUpsert(serviceList);
}

export const fetchStaffList = async (db: any) => {
  const staffList = await getStaffList();
  db.collections.staffs.bulkUpsert(staffList);
}

export const fetchStatusList = async (db: any) => {
  const statusList = await getStatusList();
  db.collections.statuses.bulkUpsert(statusList);
}

export const fetchCustomerList = async (db: any) => {
  const customerList = await getCustomerList();
  db.collections.customers.bulkUpsert(customerList);
}

const initDb = async () => {
  const indexedDBStorage = getRxStorageDexie();

  let db = await createRxDatabase({
    name: 'booking',
    storage: getRxStorageDexie(),
  });

  await db.addCollections({
    bookings: {
      schema: BookingSchema
    },
    services: {
      schema: ServiceSchema
    },
    staffs: {
      schema: StaffSchema
    },
    statuses: {
      schema: StatusSchema
    },
    customers: {
      schema: CustomerSchema
    }
  });

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
