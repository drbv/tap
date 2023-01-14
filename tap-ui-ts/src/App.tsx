import React, {Component} from "react";
import {Button, TextField} from "@mui/material";
import './App.css';
import {getClientSampleDb} from "./Database";
import {RxDatabase} from "rxdb";
import * as uuid from "uuid";

interface StateData {
    value: string;
    samples: any;
}

class App extends Component<any, StateData> {
    constructor(props: StateData) {
        super(props);
        this.state = {
            value: '',
            samples: [],
        };
    }

    async componentDidMount() {
        const db: RxDatabase = await getClientSampleDb();
        db.sampleCollection.find().exec().then((samples: any) => {
            this.setState({samples});
        });
    }

    render() {
        return (
            <div className="App">
                <div>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="sampleValue"
                        name="Passwort"
                        style={{width: "300px"}}
                        value={this.state?.value}
                        onChange={(e) => {
                            this.setState({
                                value: e.target.value,
                            });
                        }}
                    />
                    <Button
                        id="send"
                        variant="contained"
                        color="secondary"
                        onClick={async () => {
                            const sampleDB = await getClientSampleDb()
                            await sampleDB.sampleCollection.upsert(
                                {
                                    id: uuid.v4(),
                                    data: {
                                        result: this.state?.value,
                                    }
                                }
                            )
                        }}
                        style={{marginTop: "10px"}}
                    >
                        Send
                    </Button>
                    <Button
                        id="start"
                        variant="contained"
                        color="secondary"
                        onClick={async () => {
                            const sampleCollection = await getClientSampleDb()
                            await sampleCollection.upsert(
                                {
                                    id: uuid.v4(),
                                    request: "start",
                                }
                            )
                        }}
                        style={{marginTop: "10px"}}
                    >
                        Start
                    </Button>
                    {this.state.samples && this.state.samples.map((sample: any) => {
                        return (
                            <div>
                                {sample?.data?.result.toString()}
                            </div>
                        )
                    })}
                </div>
                <p>
                    Hallo Lukas.
                </p>
            </div>
        );
    }
}

export default App;
