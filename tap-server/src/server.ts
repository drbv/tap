import express, {Request, Response} from 'express';
import config from "config";
import {DatabaseService} from "./database.service";


async function initialize() {
    const mainApp = express();
    const port: number = config.get("port");

    mainApp.get('/', (req: Request, res: Response) => {
        res.send('Hello, this is Express + TypeScript');
    });

    mainApp.listen(port, ()=> {
        console.log(`[Server]: I am running at https://localhost:${port}`);
    });
}

initialize().then(() => {
    DatabaseService.createDatabase();
});

function determineUpdates(clientData: any, serverData: any) {
    // Compare client and server data to determine which records need to be updated
    // This is where you would implement the logic for determining updates
    // You can use any method you prefer for comparing and determining updates
    // This is just an example of a possible implementation
    const updates: any[] = [];
    clientData.forEach((clientRecord: any) => {
        const serverRecord = serverData.find((r: any) => r.id === clientRecord.id);
        if (!serverRecord) {
            updates.push(clientRecord);
        } else {
            if (serverRecord.name !== clientRecord.name || serverRecord.value !== clientRecord.value) {
                updates.push(clientRecord);
            }
        }
    });
    return updates;
}
