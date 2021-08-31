import React from 'react';
import Button from '@material-ui/core/Button';
import initClientDb from "./Database";

function clicked() {
    alert('clicked');
}

function App() {
    initClientDb().then(async clientDB => {
        await clientDB.items.find().exec();
        console.log('db init')
        // insert one document
        await clientDB.items.insert({
            id: '2',
            name: 'foo2',
            key: 'bar2',
            role: 'any2',
        });

        clientDB.items.syncCouchDB({
            remote: 'http://localhost:5000/db/items'
        });
    });

    return (
        <Button variant="contained" color="primary" onClick={() => clicked()}>
            Hello World
        </Button>
    );
}

export default App;


/*import React from 'react';
import 'fontsource-roboto';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/
