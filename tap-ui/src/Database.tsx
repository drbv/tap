import {
    addPouchPlugin,
    addRxPlugin,
    createRxDatabase,
    getRxStoragePouch,
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

var dbPromise: any = null

async function getClientDb() {
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
        couples: {
            schema: coupleSchema,
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

export default getClientDb
