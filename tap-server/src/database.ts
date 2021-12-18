import {
    addPouchPlugin,
    addRxPlugin,
    CollectionsOfDatabase,
    createRxDatabase,
    getRxStoragePouch,
    RxDatabase,
    RxDatabaseGenerated,
} from 'rxdb'
import { RxDBServerPlugin } from 'rxdb/plugins/server'
import pouchdb_adapter_node_websql from 'pouchdb-adapter-node-websql'
import { RxDatabaseBase } from 'rxdb/dist/types/rx-database'
import { AthleteSchema } from '../../shared/schemas/athlete.schema'
import { OfficialSchema } from '../../shared/schemas/official.schema'
import { TeamSchema } from '../../shared/schemas/team.schema'
import { AcroSchema } from '../../shared/schemas/acro.schema'
import { AppointmentSchema } from '../../shared/schemas/appointment.schema'

addRxPlugin(RxDBServerPlugin)
addPouchPlugin(pouchdb_adapter_node_websql)

export class Database {
    private static dbPromise: RxDatabaseBase<any, any> &
        CollectionsOfDatabase &
        RxDatabaseGenerated<CollectionsOfDatabase>

    private static dbList = new Map<string, RxDatabase>();

    public static async get(name = 'base'): Promise<RxDatabase> {
        // get database from dbList by name
        const db = this.dbList.get(name);
        if (db != null) {
            // return db if exist
            return db;
        }

        // if not exist -> create database
        const base = name === 'base';
        return this.createDatabase(name, base);
    }

    private static async createDatabase(name = 'base', base = false) {
        const db: RxDatabase = await createRxDatabase({
            name: './db' + name,
            storage: getRxStoragePouch('websql'),
            ignoreDuplicate: true,
        });

        await db.waitForLeadership();
        console.log('isLeader now');

        try {
            if (base) {
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
                });
            } else {
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
                });
            }
        } catch (e) {
            console.log('error: ', e);
        }

        this.dbList.set(name, db);

        console.log(name + ' initialized.');
        return db;
    }
}
