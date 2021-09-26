import express from 'express';
import {userRouter} from './routes';
import {Database} from "./database";
import {ActivityPortalService} from "./services/activity-portal.service"
import config from "config";


Database.get().then(async db => {

    const {app, server} = await db.server({
        startServer: false,
        cors: true
    });
    const mainApp = express();

    // configure CORS, other middlewares...
    mainApp.use('/db', app);
    mainApp.use('/users', userRouter);
    mainApp.use('/import', (req, res) => {
        const activityPortalService = new ActivityPortalService();
        activityPortalService.fetchDataFromPortal();
    });
    mainApp.use('/query', async (req, res) => {
        const o = await db.items.find().exec();
        console.log('o ', o);

        const r = await db.items.findByIds(["1"]);
        console.log('r ', r);
    });
    mainApp.use('/', (req, res) => {
        res.send('hello');
    });

    const port = config.get('port');
    console.log('port: ', port);
    mainApp.listen(port, () => console.log(`Server listening on port ${port}`));
});
