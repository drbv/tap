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

import { AthleteSchema } from "../../shared/schemas/athlete.schema";
import { OfficialSchema } from "../../shared/schemas/official.schema";
import { TeamSchema } from "../../shared/schemas/team.schema";
import { AcroSchema } from "../../shared/schemas/acro.schema";
import { AppointmentSchema } from "../../shared/schemas/appointment.schema";
import { CompetitionSchema } from "../../shared/schemas/competition.schema";
import { CurrentCompetitionSchema } from "../../shared/schemas/currentCompetition.schema";
import { RoundSchema } from "../../shared/schemas/round.schema";
import { RoundResultSchema } from "../../shared/schemas/roundResult.schema";
import { FinalResultSchema } from "../../shared/schemas/finalResult.schema";
import { PhaseSchema } from "../../shared/schemas/phase.schema";
import { UserSchema } from "../../shared/schemas/user.schema";
import { ScoringRuleSchema } from "../../shared/schemas/scoringRule.schema";
import { HeatWorkflow } from "../../shared/schemas/heatWorkflow.schema";
import { RxDatabaseBase } from "rxdb/dist/types/rx-database";

const scoringRuleCompetitionDefaults = require("../template/competitionDB/scoringRule.json");

addPouchPlugin(pouchdb_adapter_leveldb); // leveldown adapters need the leveldb plugin to work
addRxPlugin(RxDBLeaderElectionPlugin);
addRxPlugin(RxDBServerCouchDBPlugin);

export class Database {
  private static dbList = new Map<string, RxDatabase>();
  public static currentCompetition: string = "";
  private static db: RxDatabase;
  private static app: any = null;

  public static async getSampleDB(): Promise<any> {
    if (this.db) {
      return this.db;
    } else {
      this.db = await createRxDatabase({
        name: "data/sampledb",
        storage: getRxStoragePouch(leveldown),
        ignoreDuplicate: true,
      });

      try {
        await this.db.addCollections({
          sampleCollection: {
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
                  },
                },
              },
            },
          },
        });
      } catch (e) {
        console.log("error: ", e);
      }
    }

    return this.db;
  }

  public static async getCompetitionDatabaseApp(): Promise<any> {
    if (this.db) {
      const port: number = config.get("port");
      const serverResponse = await this.db.serverCouchDB({
        cors: true,
        port,
        startServer: false,
      });

      this.app = serverResponse.app;
      return this.app;
    }
    return null;
  }

  public static async setCurrentCompetitionDB(
    name: string
  ): Promise<RxDatabase> {
    try {
      this.db = await this.getCompetitionDB(name);
      this.currentCompetition = name;
      return this.db;
    } catch (e) {
      console.log(e);
      return new Promise((resolve, reject) => {
        reject();
      });
    }
  }

  public static async getCurrentCompetitionDB(): Promise<RxDatabase> {
    // get database from dbList by name
    const name = this.currentCompetition;

    // check if currentCompetiton is available
    if (name && name !== "") {
      return this.getCompetitionDB(name);
    }

    // TODO: resolve Promise
    return new Promise((resolve, reject) => {
      reject();
    });
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

  public static async getBaseDB(): Promise<RxDatabase> {
    const name = "basedb";

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
      name: "data/" + "c" + name,
      storage: getRxStoragePouch(leveldown),
      ignoreDuplicate: true,
    });

    await db.waitForLeadership();
    console.log("isLeader now");

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
          schema: RoundResultSchema,
        },
        round_result: {
          schema: FinalResultSchema,
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
        heat_workflow: {
          schema: HeatWorkflow,
        },
      });

      // load predefined Scoringrule-Objects
      await db.scoring_rule.bulkInsert(scoringRuleCompetitionDefaults);
    } catch (e) {
      console.log("error: ", e);
    }

    console.log(name + " initialized.");
    return db;
  }

  // static async createAdminDB(name: string): Promise<RxDatabase> {
  //     const db: RxDatabase = await createRxDatabase({
  //         name: "./" + name,
  //         storage: getRxStoragePouch("websql"),
  //         ignoreDuplicate: true,
  //     });

  //     await db.waitForLeadership();
  //     console.log("isLeader now");

  //     try {
  //         await db.addCollections({
  //             // TODO add missing collections
  //             // competition: {
  //             //     schema: CompetitionSchema,
  //             // },
  //         });
  //     } catch (e) {
  //         console.log("error: ", e);
  //     }

  //     console.log(name + " initialized.");
  //     return db;
  // }

  static async createBaseDB(name: string): Promise<RxDatabase> {
    const db: RxDatabase = await createRxDatabase({
      name: "data/" + name,
      storage: getRxStoragePouch(leveldown),
      ignoreDuplicate: true,
    });

    await db.waitForLeadership();
    console.log("isLeader now");

    try {
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
    } catch (e) {
      console.log("error: ", e);
    }

    console.log(name + " initialized.");
    return db;
  }
}
