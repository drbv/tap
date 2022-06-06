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
import {CompetitionSchema} from '../../shared/schemas/competition.schema';
import {RoundSchema} from '../../shared/schemas/round.schema';
import {ResultSchema} from '../../shared/schemas/result.schema';
import {PhaseSchema} from '../../shared/schemas/phase.schema';
import {UserSchema} from '../../shared/schemas/user.schema';
import {ScoringRuleSchema} from '../../shared/schemas/scoringRule.schema';

addRxPlugin(RxDBServerPlugin)
addPouchPlugin(pouchdb_adapter_node_websql)

export class Database {
    private static dbList = new Map<string, RxDatabase>();
    public static currentCompetition: string = "";
    private static db: RxDatabase;
    private static app: any = null;

    public static async getCompetitionDatabaseApp(): Promise<any> {
        if (this.db) {
            const serverResponse = await this.db.server({
                startServer: false,
                cors: true,
            });

            this.app = serverResponse.app;
            return this.app
        }
        return null
    }

    public static async setCurrentCompetitionDB(name: string): Promise<RxDatabase>{
        try{
            this.db = await this.getCompetitionDB(name);
            this.currentCompetition = name;
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
        if (db != null) {
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
        if (db != null) {
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
            name: name,
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
                competition: {
                    schema: CompetitionSchema,
                },
                phase: {
                    schema: PhaseSchema,
                },
                result: {
                    schema: ResultSchema,
                },
                round: {
                    schema: RoundSchema,
                },
                scoringrule: {
                    schema: ScoringRuleSchema,
                },
                user: {
                    schema: UserSchema,
                },
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
            name: name,
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
