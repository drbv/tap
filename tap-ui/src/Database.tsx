import {
    addPouchPlugin,
    addRxPlugin,
    createRxDatabase,
    getRxStoragePouch,
    RxDatabase,
} from 'rxdb'
import { RxDBNoValidatePlugin } from 'rxdb/plugins/no-validate'
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election'
import { RxDBReplicationCouchDBPlugin } from 'rxdb/plugins/replication-couchdb'
import pouchdb_adapter_http from 'pouchdb-adapter-http'
import pouchdb_adapter_websql from 'pouchdb-adapter-websql'
import { AthleteSchema } from '../../shared/schemas/athlete.schema'
import { TeamSchema } from '../../shared/schemas/team.schema'
import { OfficialSchema } from '../../shared/schemas/official.schema'
import { AcroSchema } from '../../shared/schemas/acro.schema'
import { AppointmentSchema } from 'shared/schemas/appointment.schema'
import {
    userSchema,
    stationSchema,
    roundSetSchema,
    roundSchema,
    evaluationSchema,
    subRoundSchema,
    coupleSchema,
    resultSchema,
} from './schema'

addRxPlugin(RxDBReplicationCouchDBPlugin)
addRxPlugin(RxDBNoValidatePlugin)
addRxPlugin(RxDBLeaderElectionPlugin)
addPouchPlugin(pouchdb_adapter_http)
addPouchPlugin(pouchdb_adapter_websql)

let dbPromise: any = null
const activeSyncs = new Map()

export async function getCollection(collection: string) {
    var clientDB = await getClientDb()
    var rxCollection: any = clientDB[collection]

    // check if there is already a alive replicationState
    if (((repState = activeSyncs.get(collection)), repState != null)) {
        if (repState.alive) {
            return rxCollection
        }
    }

    // sync local collection with server
    var repState = rxCollection.syncCouchDB({
        remote: 'http://localhost:5000/db/' + collection,
        options: {
            live: true,
            retry: true,
        },
    })

    // save repState to be able to close sync
    activeSyncs.set(collection, repState)

    return rxCollection
}

export async function closeCollection(collection: string) {
    var repState = activeSyncs.get(collection)
    if (repState) {
        await repState.cancel()
        activeSyncs.delete(collection)
    }
}

async function _create() {
    const db = await createRxDatabase({
        name: './client-db',
        storage: getRxStoragePouch('websql'),
        ignoreDuplicate: true,
    })

    await db.addCollections({
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

        //old data
        users: {
            schema: userSchema,
        },
        stations: {
            schema: stationSchema,
        },
        roundsets: {
            schema: roundSetSchema,
        },
        evaluations: {
            schema: evaluationSchema,
        },
        rounds: {
            schema: roundSchema,
        },
        subrounds: {
            schema: subRoundSchema,
        },
        results: {
            schema: resultSchema,
        },
    })

    await db.users.upsert({
        id: 'DEFAULT_ADMIN',
        name: 'DEFAULT_ADMIN',
        role: 'admin',
        key: 'admindarfalles',
    })

    return db
}

export async function getClientDb() {
    if (!dbPromise) dbPromise = await _create()
    return dbPromise
}
