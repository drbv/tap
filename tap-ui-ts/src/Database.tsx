import {
  addRxPlugin,
  createRxDatabase,
  RxCollectionBase,
  RxDatabase,
} from "rxdb";

import { getRxStorageDexie } from "rxdb/plugins/dexie";
import { RxDBReplicationCouchDBNewPlugin } from "rxdb/plugins/replication-couchdb-new";

addRxPlugin(RxDBReplicationCouchDBNewPlugin);

let dbPromise: RxDatabase<any>;
const activeSyncs: Map<{ database: string; collection: string }, any> =
  new Map();

/**
 * @description This function returns a RxCollection that is synchronized with a server database
 * @param collection name of the collection that is synchronized and returned
 * @param database name of the database the collection is synchronized to
 */
export async function getCollection(database: string, collection: string) {
  const clientDB: RxDatabase = await getClientDb();
  const rxCollection: RxCollectionBase<any> = clientDB[collection];

  // sync local collection with server
  const repState = await rxCollection.syncCouchDBNew({
    url: "http://localhost:5001/sampledb/",
    live: true,
  });

  repState.active$.subscribe((status) => {
    console.log("Sync is active: " + status);
  });

  // save repState to be able to close sync
  activeSyncs.set({ database, collection }, repState);

  return rxCollection;
}

/**
 * @description closeCollection is a function that allows the user to manually close a sync
 * @param collection name of the collection which synchronization is closed
 */
export async function closeCollection(
  database: string = "sampledb",
  collection: string
) {
  const repState = activeSyncs.get({ database, collection });
  if (repState) {
    await repState.cancel();
    activeSyncs.delete({ database, collection });
  }
}

/**
 * @description This function creates a new database and adding collectionsS
 */
async function _create() {
  const db = await createRxDatabase({
    name: "clientdb",
    storage: getRxStorageDexie(),
    ignoreDuplicate: true,
  });

  await db.addCollections({
    exchange: {
      schema: {
        title: "exchange",
        description: "exchange object",
        version: 0,
        primaryKey: "id",
        type: "object",
        properties: {
          id: {
            type: "string",
            final: true,
          },
          request: {
            type: "string",
          },
          response: {
            type: "string",
          },
        },
      },
    },
  });
  return db;
}

/**
 * @description this function returns the client database or create if not exist
 */
export async function getClientDb() {
  if (!dbPromise) dbPromise = await _create();
  return dbPromise;
}
