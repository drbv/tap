import {
    addPouchPlugin,
    addRxPlugin,
    createRxDatabase,
    getRxStoragePouch,
    RxDatabase,
} from 'rxdb'
import {RxDBServerPlugin} from 'rxdb/plugins/server'
import pouchdb_adapter_node_websql from 'pouchdb-adapter-node-websql'
import {AthleteSchema} from '../../shared/schemas/athlete.schema';
import {OfficialSchema} from '../../shared/schemas/official.schema';
import {TeamSchema} from '../../shared/schemas/team.schema';
import {AcroSchema} from '../../shared/schemas/acro.schema';
import {AppointmentSchema} from '../../shared/schemas/appointment.schema';

addRxPlugin(RxDBServerPlugin)
addPouchPlugin(pouchdb_adapter_node_websql)

export class Database {
    private static dbList = new Map<string, RxDatabase>();
    private static currentCompetition: string;
    private static db: RxDatabase;
    private static app: any;

    public static async getCompetitionDatabaseApp(): Promise<any> {
        if (!this.db) {
            this.db = await Database.createCompetitionDB('init');
        }

        await this.setCompetitionDatabaseApp();

        return this.app;
    }

    private static async setCompetitionDatabaseApp() {
        const serverResponse = await this.db.server({
            startServer: false,
            cors: true,
        });

        this.app = serverResponse.app;
    }

    public static async setCurrentCompetitionDB(name: string): Promise<RxDatabase>{
        try{
            this.db = await this.getCompetitionDB(name);
            this.currentCompetition = name;
            await this.setCompetitionDatabaseApp();

            return this.db;
        }
        catch(e){
            console.log(e);
            return null;
        }
    }

    public static async getCurrentCompetitionDB(): Promise<RxDatabase> {
        // get database from dbList by name
        const name = this.currentCompetition

        // check if currentCompetiton is available
        if (name && name !== ""){
            return this.getCompetitionDB(name)
        }

        // TODO: resolve Promise
        return null
    }

    public static async getCompetitionDB(name: string): Promise<RxDatabase> {
        // get database from dbList by name
        let db = this.dbList.get(name);
        if (db !== null) {
            // return db if exist
            return db;
        }

        // if not exist -> create database
        db = await this.createCompetitionDB(name);
        this.dbList.set(name, db);

        return db;
    }

    public static async getAdminDB(): Promise<RxDatabase> {
        const name = "adminDB";

        // get database from dbList by name
        let db = this.dbList.get(name);
        if (db !== null) {
            // return db if exist
            return db;
        }

        // if not exist -> create database
        db = await this.createAdminDB(name);
        this.dbList.set(name, db);

        return db;
    }

    public static async getBaseDB(): Promise<RxDatabase> {
        const name = "baseDB";

        // get database from dbList by name
        let db = this.dbList.get(name);
        if (db != null) {
            // return db if exist
            return db;
        }

        // if not exist -> create database
        db = await this.createBaseDB(name);
        this.dbList.set(name, db);

        return db;
    }

    static async createCompetitionDB(name: string): Promise<RxDatabase> {
        const db: RxDatabase = await createRxDatabase({
            name: "./" + name,
            storage: getRxStoragePouch('websql'),
            ignoreDuplicate: true,
        });

        await db.waitForLeadership();
        console.log('isLeader now');

        try {
            await db.addCollections({
                // TODO add missing collections
                // competition: {
                //     schema: CompetitionSchema,
                // },
            });
        } catch (e) {
            console.log('error: ', e);
        }

        console.log(name + ' initialized.');
        return db;
    }

    static async createAdminDB(name: string): Promise<RxDatabase> {
        const db: RxDatabase = await createRxDatabase({
            name: "./" + name,
            storage: getRxStoragePouch('websql'),
            ignoreDuplicate: true,
        });

        await db.waitForLeadership();
        console.log('isLeader now');

        try {
            await db.addCollections({
                // TODO add missing collections
                // competition: {
                //     schema: CompetitionSchema,
                // },
            });
        } catch (e) {
            console.log('error: ', e);
        }

        console.log(name + ' initialized.');
        return db;
    }

    static async createBaseDB(name: string): Promise<RxDatabase> {
        const db: RxDatabase = await createRxDatabase({
            name: "./" + name,
            storage: getRxStoragePouch('websql'),
            ignoreDuplicate: true,
        });

        await db.waitForLeadership();
        console.log('isLeader now');

        try {
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
        } catch (e) {
            console.log('error: ', e);
        }

        console.log(name + ' initialized.');
        return db;
    }
}
