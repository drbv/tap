// Define a sync service class that creates and configures a sync client
import {DexieDatabase} from "./Database";

export class SyncService {
    db: DexieDatabase;
    syncClient: any;

    constructor(db: DexieDatabase) {
        this.db = db;
        // Create a sync client with the database
        /*
        this.syncClient = this.db.syncable.createSyncClient({
            // Specify the protocol version (must match with the server)
            protocolVersion: 1,
            // Specify how to handle conflicts (default is 'remoteWins')
            conflictResolutionStrategy: 'remoteWins',
            // Specify how to filter changes (optional)
            filter: (changes) => changes,
            // Specify how to modify changes before applying them (optional)
            applyRemoteChanges: (changes) => changes,
            // Specify how to react to sync events (optional)
            onChangesAccepted: () => console.log('Changes accepted'),
            onConnectivityChange: () => console.log('Connectivity changed'),
            onError: () => console.log('Sync error'),
            onStatusChanged: () => console.log('Status changed')
        });
        */
    }

    // Connect the sync client to a sync endpoint
    connect(url: string) {
        return this.syncClient.connect(
            "http", // The protocol name (must match with the server)
            url // The url of the sync endpoint
        );
    }
}