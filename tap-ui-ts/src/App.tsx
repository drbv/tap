import React from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  Box,
  Card,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Switch,
} from "@mui/material";
import { getCollection } from "./Database";
import { RxDocument, RxDocumentBase, RxQuery } from "rxdb";

type AppProps = {};

class App extends React.Component<AppProps> {
  private subs: RxQuery[];

  constructor(props: AppProps) {
    super(props);

    // initializes subscription array
    this.subs = [];
  }

  async componentDidMount() {
    const workflowCollection = await getCollection("sampledb", "judgeWorkflow");
    const workflowSubscription = workflowCollection
      .find()
      .$.subscribe((workflowObjects: RxDocumentBase<any>) =>
        this.setState({ workflowObjects })
      );
    this.subs.push(workflowSubscription);
  }

  render() {
    return (
      <div className="App">
        <Box sx={{ mx: "auto", padding: "20px" }}>
          <Card sx={{ mx: "auto", padding: "5px" }}>
            Head
            <Divider />
            Bottom
          </Card>
        </Box>
      </div>
    );
  }
}

export default App;
