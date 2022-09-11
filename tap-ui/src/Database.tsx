import {
    addPouchPlugin,
    addRxPlugin,
    createRxDatabase,
    getRxStoragePouch,
    RxDatabase,
} from "rxdb"
import { RxDBNoValidatePlugin } from "rxdb/plugins/no-validate"
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election"
import { RxDBReplicationCouchDBPlugin } from "rxdb/plugins/replication-couchdb"
import pouchdb_adapter_http from "pouchdb-adapter-http"
import pouchdb_adapter_websql from "pouchdb-adapter-websql"
import { AthleteSchema } from "../../shared/schemas/athlete.schema"
import { TeamSchema } from "../../shared/schemas/team.schema"
import { OfficialSchema } from "../../shared/schemas/official.schema"
import { AcroSchema } from "../../shared/schemas/acro.schema"
import { AppointmentSchema } from "shared/schemas/appointment.schema"
import { PhaseSchema} from "shared/schemas/phase.schema"
import {
    CompetitionSchema
} from "../../shared/schemas/competition.schema"
import { RoundSchema } from "../../shared/schemas/round.schema"
import { ScoringRuleSchema } from "../../shared/schemas/scoringRule.schema"
import { UserSchema } from "../../shared/schemas/user.schema"
import { RoundResultSchema } from "../../shared/schemas/roundResult.schema"
import { CurrentCompetitionSchema } from "../../shared/schemas/currentCompetition.schema"

addRxPlugin(RxDBReplicationCouchDBPlugin)
addRxPlugin(RxDBNoValidatePlugin)
addRxPlugin(RxDBLeaderElectionPlugin)
addPouchPlugin(pouchdb_adapter_http)
// addPouchPlugin(pouchdb_adapter_websql)
addPouchPlugin(require('pouchdb-adapter-idb'));
require('http').globalAgent.maxSockets = 50;

let dbPromise: any = null
const activeSyncs = new Map()

let dbBasePromise: any = null
const activeBaseSyncs = new Map()

export async function getCollection(collection: string) {
    const clientDB = await getClientDb()
    const rxCollection: any = clientDB[collection]

    // check if there is already a alive replicationState
    if (((repState = activeSyncs.get(collection)), repState != null)) {
        if (repState.alive) {
            return rxCollection
        }
    }

    // sync local collection with server
    var repState = rxCollection.syncCouchDB({
        remote: "http://localhost:5001/db/1220200/" + collection,
        waitForLeadership: false,
        options: {
            live: true,
            retry: true,
        },
    })

    // save repState to be able to close sync
    activeSyncs.set(collection, repState)

    return rxCollection
}

export async function getBaseCollection(collection: string) {
    const clientDB = await getClientBaseDb()
    const rxCollection: any = clientDB[collection]

    // check if there is already a alive replicationState
    if (((repState = activeBaseSyncs.get(collection)), repState != null)) {
        if (repState.alive) {
            return rxCollection
        }
    }

    // sync local collection with server
    var repState = rxCollection.syncCouchDB({
        remote: "http://localhost:5001/basedb/" + collection,
        waitForLeadership: false,
        options: {
            live: true,
            retry: true,
        },
    })

    // save repState to be able to close sync
    activeBaseSyncs.set(collection, repState)

    return rxCollection
}

export async function closeCollection(collection: string) {
    const repState = activeSyncs.get(collection)
    if (repState) {
        await repState.cancel()
        activeSyncs.delete(collection)
    }
}

async function _create() {
    const db = await createRxDatabase({
        name: "./client-db",
        storage: getRxStoragePouch("idb"),
        ignoreDuplicate: true,
    })

    await db.addCollections({
        //new data        
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
    })

    await db.user.atomicUpsert({
        id: "DEFAULT_ADMIN",
        name: "DEFAULT_ADMIN",
        role: "admin",
        key: "admindarfalles",
    })

    return db
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
    })

    return db
}

export async function getClientDb() {
    if (!dbPromise) dbPromise = await _create()
    return dbPromise
}

export async function getClientBaseDb() {
    if (!dbBasePromise) dbBasePromise = await _createBase()
    return dbBasePromise
}
