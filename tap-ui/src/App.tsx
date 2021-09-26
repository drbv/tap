import React from 'react';
import Button from '@material-ui/core/Button';
import getClientDb from "./Database";

function sync() {
    getClientDb().then(clientDB => {
        clientDB.acros.syncCouchDB({
            remote: 'http://localhost:5000/db/acros',
        });
        clientDB.officials.syncCouchDB({
            remote: 'http://localhost:5000/db/officials'
        });
        clientDB.teams.syncCouchDB({
            remote: 'http://localhost:5000/db/teams'
        });
        clientDB.athletes.syncCouchDB({
            remote: 'http://localhost:5000/db/athletes'
        });
    });
}

function App() {
    getClientDb().then(async clientDB => {
        console.log('db init')
    });

    return (
        <Button variant="outlined" color="primary" onClick={() => sync()}>
            SYNC
        </Button>
    );
}

export default App;
