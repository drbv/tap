import * as PouchDB from "pouchdb";
import config from "config";

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

export class Database {
    private static dbList = new Map<string, PouchDB.Database>();
    public static currentCompetition: string = "";
    private static db: PouchDB.Database;
    private static app: any = null;

    public static async getSampleDB(): Promise<any> {
        if (this.db) {
            return this.db;
        } else {
            this.db = new PouchDB.default("sampledb-client");
            this.db.put({
                _id: "singleexchange",
                request: "",
                response: "Free to edit",
            });

            this.db.replicate.to("localhost:2345/sample", {}, () => {
                alert("replication completed");
            });
        }

        return this.db;
    }

    // public static async getAdminDB(): Promise<RxDatabase> {
    //     const name = "admindb";

    //     // get database from dbList by name
    //     let db = this.dbList.get(name);
    //     if (db != null) {
    //         // return db if exist
    //         return db;
    //     }

    //     // if not exist -> create database
    //     db = await this.createAdminDB(name);
    //     this.dbList.set(name, db);

    //     return db;
    // }
}
