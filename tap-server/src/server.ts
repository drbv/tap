import express from "express";
import { Database } from "./database";
import { ActivityPortalService } from "./services/activity-portal.service";
import config from "config";
import { RoundWorkflowService } from "./workflows/services/roundWorkflowService";
import {RxDatabase, RxDocument} from "rxdb";
import { HeatService } from "./workflows/services/heat.service";
import {RoundService} from "./services/round.service";
import { json } from "stream/consumers";

let server: any;
const port: number = config.get("port");

const roundService: RoundService = new RoundService();

async function initialize() {
    const mainApp = express();

    Database.getSampleDB().then(async (db:RxDatabase) => {
        const { app } = await db.serverCouchDB({
            path: "data",
            port,
            cors: true,
            startServer: false,
        });

        mainApp.use("/sampledb", app);
    })

    // Database.getAdminDB().then(async (db) => {
    //     const { app } = await db.server({
    //         startServer: false,
    //         cors: true,
    //     });

    //     mainApp.use("/admindb", app);
    // });

    /*Database.getBaseDB().then(async (db) => {
        const { app } = await db.serverCouchDB({
            path: "data",
            port,
            cors: true,
            startServer: false,
        });

        mainApp.use("/basedb", app);
    });*/

    mainApp.use("/startHeat", (req, res) => {
        if (!req.query.id) {
            res.status(400).send("Required query params missing");
        }
        let myWorkflow = new HeatService();
        myWorkflow.startHeat(req.query.id as string);
        res.status(200).send("heat was started");
    });

    const activityPortalService = new ActivityPortalService();

    mainApp.use("/import", (req, res) => {
        activityPortalService.fetchDataFromPortal().then();
        res.send("importing...");
    });

    /*mainApp.use("/activate", async (req, res) => {
        if (!req.query.id) {
            res.status(400).send("Required query params missing");
        }

        const id = req.query.id as string;

        if (id != null) {
            await activityPortalService.fetchAppointmentDataFromPortal(id);

            if (Database.currentCompetition !== "") {
                Database.getCompetitionDatabaseApp().then((app) => {
                    // set currentCompetition object
                    Database.getBaseDB().then(async (baseDB) =>
                        baseDB.current_competition
                            .findOne()
                            .exec()
                            .then(async (document: RxDocument) => {
                                if (document == null) {
                                    await baseDB.current_competition.insert({
                                        id: "CURRENT",
                                        competition_id: id,
                                    });
                                } else {
                                    await document.atomicPatch({
                                        competition_id: id,
                                    });
                                }
                            })
                    );
                    // TODO: load appointment and set "isActive" field

                    mainApp.use("/db/" + Database.currentCompetition, app);
                    // res.redirect('/db/' + Database.currentCompetition)

                    res.send("Database " + id + " activated.");
                });
            }
        } else {
            res.status(404);
        }
    });
*/

    mainApp.use("/sample", async (req, res) => {
        console.log('creating round');
        roundService.createRound();
    });

    server = mainApp.listen(port, () =>
        console.log(`Server listening on port ${port}`)
    );
}

initialize();


/*.then(async () => {
    // console.log('get database')

    console.log("start wf");
    // const rs = new RoundService();
    // //rs.createRound();
    // const hs = new HeatService();
    // hs.changeData("observer");
    // hs.startHeat();
    // console.log("hs ", hs.getCurrentState().name);
    // hs.assess();
    // console.log("hs ", hs.getCurrentState().name);


    let lastObj: any;
    await Database.getDb().then(async db => {
        console.log('subscribing...');
        db.chats.$.subscribe((changeEvent: any) => {
            console.log('client is speaking: ', changeEvent.documentData.message);

            if (!lastObj || (lastObj && lastObj.message_id !== changeEvent.documentData.message_id)) {
                lastObj = {message_id: uuidv4(), message: 'got message ' + changeEvent.documentData.message_id};
                console.log('insert reply to database');
                db.chats.upsert(lastObj);
            }

            console.log('cmp ', changeEvent.documentData.message)
            if (changeEvent.documentData.message === 'START') {
                console.log('trigger START')
                rs.stateMachine.trigger(TransitionId.START);
            }
            if (changeEvent.documentData.message === 'CREATE') {
                console.log('trigger CREATE')
                rs.stateMachine.trigger(TransitionId.CREATE);
            }
        });
    });
});*/
