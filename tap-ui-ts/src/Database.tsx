import Dexie, {Table} from "dexie"

let dbPromise: DexieDatabase;

export interface Exchange {
    id?: string;
    request: string;
    response: string;
}

export class DexieDatabase extends Dexie {
    // 'friends' is added by dexie when declaring the stores()
    // We just tell the typing system this is the case
    exchange!: Table<Exchange>;

    constructor() {
        super('myDatabase');
        this.version(1).stores({
            exchange: '++id, request, response' // Primary key and indexed props
        });
    }
}

/**
 * @description this function returns the client database or create if not exist
 */
export function getClientDb() {
    if (!dbPromise) dbPromise = new DexieDatabase();
    return dbPromise;
}
