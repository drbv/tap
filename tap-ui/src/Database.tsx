import {addRxPlugin, createRxDatabase} from "rxdb";
import {addPouchPlugin, getRxStoragePouch} from 'rxdb/plugins/pouchdb';
import {RxDBReplicationCouchDBPlugin} from 'rxdb/plugins/replication-couchdb';
import pouchdb_adapter_http from "pouchdb-adapter-http";
import pouchdb_adapter_idb from "pouchdb-adapter-idb";
import {RxDBLeaderElectionPlugin} from 'rxdb/plugins/leader-election';
import {globalAgent} from "http";
import {AthleteSchema} from "./shared/schemas/athlete.schema"
import {TeamSchema} from "./shared/schemas/team.schema"
import {OfficialSchema} from "./shared/schemas/official.schema"
import {AcroSchema} from "./shared/schemas/acro.schema"
import {AppointmentSchema} from "./shared/schemas/appointment.schema"
import {PhaseSchema} from "./shared/schemas/phase.schema"
import {CompetitionSchema} from "./shared/schemas/competition.schema"
import {RoundSchema} from "./shared/schemas/round.schema"
import {UserSchema} from "./shared/schemas/user.schema"
import {RoundResultSchema} from "./shared/schemas/roundResult.schema"
import {CurrentCompetitionSchema} from "./shared/schemas/currentCompetition.schema"
import {ScoringRuleSchema} from "./shared/schemas/scoringRule.schema"
import leveldown from "leveldown";

addPouchPlugin(pouchdb_adapter_http);
addRxPlugin(RxDBReplicationCouchDBPlugin);
addPouchPlugin(pouchdb_adapter_idb);
addRxPlugin(RxDBLeaderElectionPlugin);

globalAgent.maxSockets = 50;

let dbSamplePromise: any = null
const activeSampleSyncs = new Map()

let dbPromise: any = null
const activeSyncs = new Map()

let dbBasePromise: any = null
const activeBaseSyncs = new Map()

export async function getSampleCollection(collection: string) {
    const sampleDB = await getClientSampleDb()
    const rxCollection: any = sampleDB[collection]

    // sync local collection with server
    const repState = rxCollection.syncCouchDB({
        remote: "http://localhost:5001/sampledb/" + collection,
        waitForLeadership: true,              // (optional) [default=true] to save performance, the sync starts on leader-instance only
        direction: {                          // direction (optional) to specify sync-directions
            pull: true, // default=true
            push: true  // default=true
        },
        options: {                             // sync-options (optional) from https://pouchdb.com/api.html#replication
            live: true,
            retry: true
        },
    })

    // save repState to be able to close sync
    activeSampleSyncs.set(collection, repState);

    return rxCollection;
}

export async function getCollection(collection: string, competitionId: string) {
    const clientDB = await getClientDb()
    const rxCollection: any = clientDB[collection]

    // sync local collection with server
    const repState = rxCollection.syncCouchDB({
        remote: "http://localhost:5001/db/" + competitionId + "/" + collection,
        waitForLeadership: true,              // (optional) [default=true] to save performance, the sync starts on leader-instance only
        direction: {                          // direction (optional) to specify sync-directions
            pull: true, // default=true
            push: true  // default=true
        },
        options: {                             // sync-options (optional) from https://pouchdb.com/api.html#replication
            live: true,
            retry: true
        },
    })

    // save repState to be able to close sync
    activeSyncs.set(collection, repState);

    return rxCollection;
}

export async function getBaseCollection(collection: string) {
    const clientDB = await getClientBaseDb();
    const rxCollection: any = clientDB[collection];

    // TODO repState not yet defined
    // check if there is already a alive replicationState
    /*if (((repState = activeBaseSyncs.get(collection)), repState != null)) {
        if (repState.alive) {
            return rxCollection
        }
    }*/

    // sync local collection with server
    const repState = rxCollection.syncCouchDB({
        remote: "http://localhost:5001/basedb/" + collection,
        waitForLeadership: true,              // (optional) [default=true] to save performance, the sync starts on leader-instance only
        direction: {                          // direction (optional) to specify sync-directions
            pull: true, // default=true
            push: true  // default=true
        },
        options: {                             // sync-options (optional) from https://pouchdb.com/api.html#replication
            live: true,
            retry: true
        },
    });

    // save repState to be able to close sync
    activeBaseSyncs.set(collection, repState);

    return rxCollection;
}

export async function closeCollection(collection: string) {
    const repState = activeSyncs.get(collection)
    if (repState) {
        await repState.cancel()
        activeSyncs.delete(collection)
    }
}

async function _createSample() {
    const db = await createRxDatabase({
        name: "data/sampledb",
        storage: getRxStoragePouch(leveldown),
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
        })
    } catch (e) {
        console.log("error: ", e);
    }

    return db;
}

async function _create() {
    const db = await createRxDatabase({
        name: "./client-db",
        storage: getRxStoragePouch("idb"),
        ignoreDuplicate: true,
    });

    await db.addCollections({
        // new data
        competition: {
            schema: CompetitionSchema,
        },
        phase: {
            schema: PhaseSchema,
        },
        result: {
            schema: RoundResultSchema,
        },
        round: {
            schema: RoundSchema,
        },
        scoring_rule: {
            schema: ScoringRuleSchema,
        },
        user: {
            schema: UserSchema,
        },
    });

    await db.user.atomicUpsert({
        id: "DEFAULT_ADMIN",
        name: "DEFAULT_ADMIN",
        role: "admin",
        key: "admindarfalles",
    })

    return db;
}

async function _createBase() {
    const db = await createRxDatabase({
        name: "./clientbase-db",
        storage: getRxStoragePouch("idb"),
        ignoreDuplicate: true,
    })

    await db.addCollections({
        current_competition: {
            schema: CurrentCompetitionSchema,
        },
        athletes: {
            schema: AthleteSchema,
        },
        teams: {
            schema: TeamSchema,
        },
        officials: {
            schema: OfficialSchema,
        },
        acros: {
            schema: AcroSchema,
        },
        appointments: {
            schema: AppointmentSchema,
        },
    });

    return db;
}

export async function getClientSampleDb() {
    if (!dbSamplePromise) dbSamplePromise = await _createSample()
    return dbSamplePromise
}

export async function getClientDb() {
    if (!dbPromise) dbPromise = await _create()
    return dbPromise
}

export async function getClientBaseDb() {
    if (!dbBasePromise) dbBasePromise = await _createBase()
    return dbBasePromise
}
