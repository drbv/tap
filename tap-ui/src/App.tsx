import React from 'react'
import Button from '@material-ui/core/Button'
import getClientDb from './Database'

function sync() {
    getClientDb().then((clientDB) => {
        clientDB.appointments.syncCouchDB({
            remote: 'http://localhost:5000/db/appointments',
        })
    })
}

function App() {
    getClientDb().then(async (clientDB) => {
        console.log('db init')
    })

    return (
        <Button variant="outlined" color="primary" onClick={() => sync()}>
            SYNC
        </Button>
    )
}

export default App
