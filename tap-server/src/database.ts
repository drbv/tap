import {
    addPouchPlugin,
    addRxPlugin,
    CollectionsOfDatabase,
    createRxDatabase,
    getRxStoragePouch,
    RxDatabase,
    RxDatabaseGenerated
} from "rxdb";
import {RxDBServerPlugin} from 'rxdb/plugins/server';
import pouchdb_adapter_node_websql from 'pouchdb-adapter-node-websql';
import {RxDatabaseBase} from "rxdb/dist/types/rx-database";
import {AthleteSchema} from "../../shared/schemas/athlete.schema";
import {OfficialSchema} from "../../shared/schemas/official.schema";
import {TeamSchema} from "../../shared/schemas/team.schema";
import {AcroSchema} from "../../shared/schemas/acro.schema";
import {AppointmentSchema} from "../../shared/schemas/appointment.schema";


addRxPlugin(RxDBServerPlugin);
addPouchPlugin(pouchdb_adapter_node_websql);


export class Database {

    private static dbPromise: RxDatabaseBase<any, any> & CollectionsOfDatabase & RxDatabaseGenerated<CollectionsOfDatabase>;

    public static get = async () => {
        if (!Database.dbPromise) {
            Database.dbPromise = await Database.createDatabase();
        }
        return Database.dbPromise;
    };

    private static async createDatabase() {

        const db: RxDatabase = await createRxDatabase({
            name: 'db',
            storage: getRxStoragePouch('websql'),
            ignoreDuplicate: true,
        });

        await db.waitForLeadership();
        console.log('isLeader now');

        try {

            await db.addCollections({
                athletes: {
                    schema: AthleteSchema
                },
                teams: {
                    schema: TeamSchema
                },
                officials: {
                    schema: OfficialSchema
                },
                acros: {
                    schema: AcroSchema
                },
                appointments: {
                    schema: AppointmentSchema
                },
            });

        } catch (e) {
            console.log('error: ', e);
        }

        console.log('db initialized.')
        return db;
    }
}



