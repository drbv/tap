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
import { getCollection } from "./Database";
import { RxDocument, RxDocumentBase, RxQuery } from "rxdb";

type AppProps = {};
type AppState = {
  exchangeObject: any;
  inputValue: string;
};

class App extends React.Component<AppProps, AppState> {
  private subs: any[];

  constructor(props: AppProps) {
    super(props);

    this.state = {
      inputValue: "default",
      exchangeObject: null,
    };
    // initializes subscription array
    this.subs = [];
  }

  async componentDidMount() {
    const exchangeCollection = await getCollection("sampledb", "exchange");
    const exchangeSubscription = exchangeCollection
      .findOne("singleexchange")
      .$.subscribe((exchangeObject: any) => {
        if (!exchangeObject) {
          return;
        } else {
          console.dir(exchangeObject);
          this.setState({ exchangeObject });
        }
      });
    this.subs.push(exchangeSubscription);
  }

  componentWillUnmount() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  render() {
    return (
      <div className="App">
        <Box sx={{ mx: "auto", padding: "20px" }}>
          <Card sx={{ mx: "auto", padding: "5px" }}>
            {this.state.exchangeObject
              ? this.state.exchangeObject.response
              : "Keine Rückmeldung"}
            <Divider />
            <TextField
              value={this.state.inputValue}
              onChange={(e) => this.setState({ inputValue: e.target.value })}
            />
            <Button
              variant="contained"
              onClick={async (e) => {
                const exchangeCollection = await getCollection(
                  "sampledb",
                  "exchange"
                );
                await exchangeCollection.upsert({
                  id: "singleExchange",
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

export default App;
