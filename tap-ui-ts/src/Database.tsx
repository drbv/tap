import {
  addRxPlugin,
  createRxDatabase,
  RxCouchDBReplicationState,
  RxDatabase,
} from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/dexie";
import { RxDBReplicationCouchDBPlugin } from "rxdb/plugins/replication-couchdb";
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election";
import { JudgeWorkflow } from "./shared/schemas/judgeWorkflow.schema";

addRxPlugin(RxDBReplicationCouchDBPlugin);
addRxPlugin(RxDBLeaderElectionPlugin);

let dbPromise: RxDatabase<any>;
const activeSyncs: Map<
  { database: string; collection: string },
  RxCouchDBReplicationState
> = new Map();

/**
 * @description This function returns a RxCollection that is synchronized with a server database
 * @param collection name of the collection that is synchronized and returned
 * @param database name of the database the collection is synchronized to
 */
export async function getCollection(
  database: string = "sampledb",
  collection: string
) {
  const clientDB = await getClientDb();
  const rxCollection: any = clientDB[collection];

  activeSyncs.get({ database, collection });

  // sync local collection with server
  const repState = rxCollection.syncCouchDB({
    remote: "http://localhost:5001/db/" + database + "/" + collection,
    waitForLeadership: true, // (optional) [default=true] to save performance, the sync starts on leader-instance only
    direction: {
      // direction (optional) to specify sync-directions
      pull: true, // default=true
      push: true, // default=true
    },
    options: {
      // sync-options (optional) from https://pouchdb.com/api.html#replication
      live: true,
      retry: true,
    },
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
    name: "./client-db",
    storage: getRxStorageDexie(),
    ignoreDuplicate: true,
  });

  await db.addCollections({
    // new data
    judgeWorkflow: {
      schema: JudgeWorkflow,
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
