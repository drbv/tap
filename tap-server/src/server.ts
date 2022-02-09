import express from "express";
import { Database } from "./database";
import { ActivityPortalService } from "./services/activity-portal.service";
import config from "config";

let server: any;
const port = config.get("port");

function initialize() {
    const mainApp = express();


    Database.getAdminDB().then(async (db) => {
        const {app} = await db.server({
            startServer: false,
            cors: true,
        });

        mainApp.use("/admindb", app);
    });

    Database.getBaseDB().then(async (db) => {
        const {app} = await db.server({
            startServer: false,
            cors: true,
        })

        mainApp.use("/basedb", app)
    })

    Database.getCompetitionDatabaseApp().then(async (app) => {
            mainApp.use("/competitiondb", app)
    });

    const activityPortalService = new ActivityPortalService();

    mainApp.use("/import", (req, res) => {
        activityPortalService.fetchDataFromPortal().then();
        res.send("importing...")
    });

    mainApp.use("/activate", async (req, res) => {
        if (!req.query.id) {
            res.status(400).send("Required query params missing");
        }

        const id = req.query.id as string;

        if (id !== null) {
            await activityPortalService.fetchAppointmentDataFromPortal(id);

            res.send("Database " + id + " activated.");
        }

        res.status(400).send("Database " + id + " could not be activated");
    })

    server = mainApp.listen(port, () => console.log(`Server listening on port ${port}`));
}

initialize();