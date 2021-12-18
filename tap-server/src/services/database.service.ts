import {Database} from "../database";
import {RxDatabaseBase} from "rxdb/dist/types/rx-database";
import {CollectionsOfDatabase, RxDatabaseGenerated} from "rxdb";
import {StartDataBwData} from "../../../shared/models/start-data-bw-data.model";

export class DatabaseService {

    public async activateDatabase(id: string) {
        await Database.createDatabase(id);


    }
}
