import {addPouchPlugin, addRxPlugin, createRxDatabase, getRxStoragePouch, RxDatabase} from "rxdb";

// add the server-plugin
import {RxDBServerPlugin} from 'rxdb/plugins/server';
import {RxDBNoValidatePlugin} from 'rxdb/plugins/no-validate';
import {RxDBLeaderElectionPlugin} from 'rxdb/plugins/leader-election';
import {RxDBReplicationCouchDBPlugin} from 'rxdb/plugins/replication-couchdb';
import pouchdb_adapter_http from 'pouchdb-adapter-http';
import pouchdb_adapter_node_websql from 'pouchdb-adapter-node-websql';
import * as path from "path";

addRxPlugin(RxDBServerPlugin);

addRxPlugin(RxDBReplicationCouchDBPlugin);
addRxPlugin(RxDBNoValidatePlugin);
addRxPlugin(RxDBLeaderElectionPlugin);
addPouchPlugin(pouchdb_adapter_http);
addPouchPlugin(pouchdb_adapter_node_websql);


/**
 * create database and collections
 */

const rootLocation = path.resolve();

const createDatabase = async () => {

    const db: RxDatabase = await createRxDatabase({
        name: './data/server-db',
        storage: getRxStoragePouch('websql'),
        ignoreDuplicate: true,
    });

    db.waitForLeadership().then(() => {
        console.log('isLeader now');
    });

    // create collection
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

    try {

        await db.addCollections({
            items: {
                schema: mySchema
            }
        });

        // insert one document
        await db.items.insert({
            id: '1',
            name: 'foo',
            key: 'bar',
            role: 'any',
        });

    } catch (e) {
        console.log('error: ', e);
    }

    console.log('db initialized.')
    return db;
}

interface DatabaseType {
    get?: any
}

export const Database = createDatabase();




