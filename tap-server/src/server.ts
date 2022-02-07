import express from "express"
import { Database } from "./database"
import { ActivityPortalService } from "./services/activity-portal.service"
import config from "config"
import { ServerResponse } from "http"

var server: any

const port = config.get("port")

function initialize(withLocalDb = false){
    const mainApp = express()

    

    Database.getAdminDB().then(async (db) => {
        const { app, server } = await db.server({
            startServer: false,
            cors: true,
        })
    
        // configure CORS, other middlewares...
        mainApp.use("/admindb", app)
    })

    Database.getBaseDB().then(async (db) => {
        const { app, server } = await db.server({
            startServer: false,
            cors: true,
        })
    
        // configure CORS, other middlewares...
        mainApp.use("/basedb", app)
    })
      
    Database.getCurrentCompetitionDB().then(async (db) => {
        if (db != undefined) {
            const { app, server } = await db.server({
                startServer: false,
                cors: true,
            })
           
            // configure CORS, other middlewares...
            mainApp.use("/competitiondb", app)
            //mainApp.use("/db", app)
        }
    })
    
    mainApp.use("/import", (req, res) => {
        const activityPortalService = new ActivityPortalService()
        activityPortalService.fetchDataFromPortal()
        res.send("importing")
    })
    
    mainApp.use("/activate", async (req, res) => {
        console.log("call received")
        if (!req.query.id) {
            res.status(400).send("Required query params missing")
        }
        const id = req.query.id as string

        // TODO: move to activityPortalService
        const db = await Database.setCurrentCompetitionDB(id)
        if (db !== null){
            const activityPortalService = new ActivityPortalService()
            await activityPortalService.fetchAppointmentDataFromPortal(id, db)

            res.send("Database " + id + " activated.")
        }
        
        res.status(400).send("Database " + id + " could not be activated")
    })
    
    console.log("port: ", port)
    server = mainApp.listen(port, () => console.log(`Server listening on port ${port}`))
}

initialize()
