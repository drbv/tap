import React from "react";
import logo from "./logo.svg";
import "./App.css";
import {
    Box,
    Button,
    Card,
    Chip,
    Divider,
    Grid,
    Paper,
    Stack,
    Switch,
    TextField,
} from "@mui/material";
import {getClientDb} from "./Database";
import {useLiveQuery} from "dexie-react-hooks"

type AppProps = {};
type AppState = {
    exchangeObjects: any;
    inputValue: string;
};

export function ExchangeObjectsList() {
    const exchangeObjects = useLiveQuery(async () =>
        getClientDb().exchange.toArray()
    )

    return <>
        {exchangeObjects?.map(exchange => <li key={exchange.id}>
            {exchange.request}, {exchange.response}
        </li>)}
    </>

}

export default class App extends React.Component<AppProps, AppState> {
    private subs: any[];

    constructor(props: AppProps) {
        super(props);

        this.state = {
            inputValue: "default",
            exchangeObjects: null,
        };
        // initializes subscription array
        this.subs = [];
    }

    render() {
        return (
            <div className="App">
                <Box sx={{mx: "auto", padding: "20px"}}>
                    <Card sx={{mx: "auto", padding: "5px"}}>
                        <ExchangeObjectsList/>
                        <Divider/>
                        <TextField
                            value={this.state.inputValue}
                            onChange={(e) => this.setState({inputValue: e.target.value})}
                        />
                        <Button
                            variant="contained"
                            onClick={(e) => {
                                getClientDb().exchange.add({
                                    id: this.state.inputValue + "singleExchange",
                                    request: this.state.inputValue,
                                    response: "...",
                                });
                            }}
                        >
                            Objekt zurücksenden
                        </Button>
                    </Card>
                </Box>
            </div>
        );
    }
}