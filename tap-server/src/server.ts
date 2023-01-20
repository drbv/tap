import express from "express";
import {Database} from "./database";
import config from "config";
import {RoundService} from "./services/round.service";

// let websocketState: any;
// let server: any;
const port: number = config.get("port");

const roundService: RoundService = new RoundService();

async function initialize() {
  const db = await Database.getSampleDB();
  const sampleServer = await db.serverCouchDB({
    path: "/sampledb",
    port: 5001,
    cors: true,
    startServer: true,
    pouchdbExpressOptions: {
      inMemoryConfig: true,
      logPath: "./tap-server/tmp/log.txt",
    },
  });
  /*
                                                                                              mainApp.use("/startHeat", (req, res) => {
                                                                                                        if (!req.query.id) {
                                                                                                          res.status(400).send("Required query params missing");
                                                                                                        }
                                                                                                        const myWorkflow = new HeatService();
                                                                                                        myWorkflow.startHeat(req.query.id as string);
                                                                                                        res.status(200).send("heat was started");
                                                                                                      });

                                                                                                      const activityPortalService = new ActivityPortalService();

                                                                                                      mainApp.use("/import", (req, res) => {
                                                                                                        activityPortalService.fetchDataFromPortal().then();
                                                                                                        res.send("importing...");
                                                                                                      });

                                                                                                      mainApp.use("/sample", async (req, res) => {
                                                                                                        console.log("creating round");
                                                                                                        roundService.createRound();
                                                                                                      });

                                                                                                      server = mainApp.listen(port, () =>
                                                                                                        console.log(`Server listening on port ${port}`)
                                                                                                      );
                                                                                                       */
}

initialize();

/*
.then(async () => {
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
});
*/
