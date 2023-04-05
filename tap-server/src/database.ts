import {
    addRxPlugin,
    CollectionsOfDatabase,
    createRxDatabase,
    RxDatabase,
} from "rxdb";
import { addPouchPlugin, getRxStoragePouch } from "rxdb/plugins/pouchdb";
import pouchdb_adapter_leveldb from "pouchdb-adapter-leveldb";
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election";
import { RxDBServerCouchDBPlugin } from "rxdb/plugins/server-couchdb";
import leveldown from "leveldown";
import config from "config";
import Dexie, { Table } from "dexie";
import "@prezentor/dexie-syncable";

import { AthleteSchema } from "../../shared/schemas/athlete.schema";
import { OfficialSchema } from "../../shared/schemas/official.schema";
import { TeamSchema } from "../../shared/schemas/team.schema";
import { AcroSchema } from "../../shared/schemas/acro.schema";
import { AppointmentSchema } from "../../shared/schemas/appointment.schema";
import { CompetitionSchema } from "../../shared/schemas/competition.schema";
import { CurrentCompetitionSchema } from "../../shared/schemas/currentCompetition.schema";
import { RoundSchema } from "../../shared/schemas/round.schema";
import { RoundResultSchema } from "../../shared/schemas/roundResult.schema";
import { FinalResult } from "../../shared/schemas/finalResult.schema";
import { PhaseSchema } from "../../shared/schemas/phase.schema";
import { UserSchema } from "../../shared/schemas/user.schema";
import { ScoringRuleSchema } from "../../shared/schemas/scoringRule.schema";
import { HeatWorkflow } from "../../shared/schemas/heatWorkflow.schema";
import { getRxStorageDexie } from "rxdb/plugins/dexie";

// @ts-ignore
import * as MemoryAdapter from "pouchdb-adapter-memory";

addRxPlugin(RxDBServerCouchDBPlugin);
addPouchPlugin(MemoryAdapter);

export interface Exchange {
    id?: string;
    request: string;
    response: string;
}

export class DexieDatabase extends Dexie {
    // 'friends' is added by dexie when declaring the stores()
    // We just tell the typing system this is the case
    exchange!: Table<Exchange>;

    constructor() {
        super("myDatabase");
        this.version(1).stores({
            exchange: "++id, request, response", // Primary key and indexed props
        });
    }
}

// tslint:disable-next-line:max-classes-per-file
export class Database {
    private static db: DexieDatabase;

    public static async getSampleDB(): Promise<DexieDatabase> {
        if (this.db) {
            return this.db;
        } else {
            this.db = new DexieDatabase();
            this.db.syncable.connect("websocket", "localhost:2345");

            this.db.exchange.add({
                request: "",
                response: "Free to edit",
            });

            console.log("exchange object created");
        }

        return this.db;
    }
}
