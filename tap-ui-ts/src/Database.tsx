import {addRxPlugin, createRxDatabase} from "rxdb";
import {getRxStorageDexie} from 'rxdb/plugins/dexie';
import { RxDBReplicationCouchDBNewPlugin } from 'rxdb/plugins/replication-couchdb-new';

addRxPlugin(RxDBReplicationCouchDBNewPlugin);

let dbSamplePromise: any;

async function _createSample() {
    const db = await createRxDatabase({
        name: "data/sampledb",
        storage: getRxStorageDexie(),
        ignoreDuplicate: true,
    });

    try {
        await db.addCollections({
            sampleCollection:{
                schema: {
                    title: "Sample",
                    description: "sample object",
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
                        data: {
                            type: "object",
                            properties: {
                                display: {
                                    type: "string",
                                },
                                result: {
                                    type: "number",
                                },
                            }
                        }
                    }
                }
            }
        });

        db.sampleCollection.syncCouchDBNew({
            url: 'http://localhost:5001/sampledb/sampleCollection',
            live: true,
        });
    } catch (e) {
        console.log("error: ", e);
    }

    return db;
}

export async function getClientSampleDb() {
    if (!dbSamplePromise) {
        dbSamplePromise = await _createSample()
    }
    return dbSamplePromise
}
