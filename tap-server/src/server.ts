import express, {Express, Request, Response} from 'express';
import config from "config";


async function initialize() {
    const mainApp = express();
    const port: number = config.get("port");

    mainApp.get('/', (req: Request, res: Response)=>{
        res.send('Hello, this is Express + TypeScript');
    });

    mainApp.listen(port, ()=> {
        console.log(`[Server]: I am running at https://localhost:${port}`);
    });
}

initialize().then(() => {});
