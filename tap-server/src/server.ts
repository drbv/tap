import express from 'express';
import {userRouter} from './routes';
import {Database} from "./database";


Database.then(async (db) => {

    const {app, server} = await db.server({
        startServer: false,
        cors: true
    });
    const mainApp = express();

    // mainApp.use(express.json());

    // configure CORS, other middlewares...
    mainApp.use('/db', app);
    mainApp.use('/users', userRouter);
    mainApp.use('/', (req, res) => res.send('hello'));
    mainApp.listen(5000, () => console.log(`Server listening on port 5000`));
});
