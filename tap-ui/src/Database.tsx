import {addPouchPlugin, addRxPlugin, createRxDatabase, getRxStoragePouch} from 'rxdb';
import {RxDBNoValidatePlugin} from 'rxdb/plugins/no-validate';
import {RxDBLeaderElectionPlugin} from 'rxdb/plugins/leader-election';
import {RxDBReplicationCouchDBPlugin} from 'rxdb/plugins/replication-couchdb';
import pouchdb_adapter_http from 'pouchdb-adapter-http';
import pouchdb_adapter_websql from 'pouchdb-adapter-websql';

addRxPlugin(RxDBReplicationCouchDBPlugin);
addRxPlugin(RxDBNoValidatePlugin);
addRxPlugin(RxDBLeaderElectionPlugin);
addPouchPlugin(pouchdb_adapter_http);
addPouchPlugin(pouchdb_adapter_websql);

async function initClientDb() {

    const clientDB = await createRxDatabase({
        name: './client-db',
        storage: getRxStoragePouch('websql'),
        ignoreDuplicate: true,
    });

    //TODO use shared code
    const mySchema = {
        title: 'Schema for users',
        description: 'Database schema for storing user information',
        version: 0,
        primaryKey: 'id',
        type: 'object',
        properties: {
            id: {
                type: 'string',
                primary: true,
            },
            name: {
                type: 'string',
            },
            key: {
                type: 'string',
            },
            role: {
                type: 'string',
            },
        },
        required: ['id', 'name', 'key', 'role'],
    };

// create a collection
    await clientDB.addCollections({
        items: {
            schema: mySchema
        }
    });

    return clientDB;
}

export default initClientDb;
