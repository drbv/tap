import { Slider, Typography, Grid, Button, Divider } from "@mui/material";
import withStyles from "@material-ui/core/es/styles/withStyles";

import { Component } from "react";
import ReactStopwatch from "react-stopwatch";
import withProps from "../../components/HOC";
import { getCollection } from "../../Database";
import Stopwatch from "./StopWatch";

const styles = {
    root: {
        flexGrow: 1,
        margin: "11px",
    },
    paper: {
        padding: 10,
        height: 700,
        width: 800,
    },
    mark: {
        background: "black",
    },
    rail: {
        background:
            "linear-gradient(to right, green 30%, orange 30% 70%, red 70%);",
    },
};

class ObserverPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.subs = [];
    }

    async componentDidMount() {
        getCollection("result", this.props.competitionId).then(
            async (collection) => {
                let sub = await collection
                    .find({
                        selector: {
                            judgeId: this.props.user.id,
                        },
                    })
                    .$.subscribe((results) => {
                        if (!results) {
                            return;
                        }
                        console.log("reload Results");
                        console.dir(results);
                        this.setState({
                            results,
                        });
                    });

                this.subs.push(sub);
                await this.prepaireResults();
            }
        );
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.heat !== this.props.heat) {
            await this.prepaireResults();
        }
    }

    async prepaireResults() {
        if (
            this.props.heat &&
            this.props.heat.participants &&
            this.props.heat.participants[0] &&
            this.props.round
        ) {
            let foundResult =
                this.state.results &&
                this.state.results.find(
                    (result) =>
                        result.bookId == this.props.heat.participants[0] &&
                        result.roundId == this.props.round.roundId
                );
            if (!foundResult) {
                getCollection("result", this.props.competitionId).then(
                    async (collection) => {
                        let currentResult = await collection.atomicUpsert({
                            resultId:
                                Date.now().toString() + this.props.user.id,
                            bookId: this.props.heat.participants[0],
                            roundId: this.props.round.roundId,
                            judgeId: this.props.user.id,
                            ready: false,
                        });
                        this.setState({ currentResult });
                    }
                );
            } else {
                this.setState({ currentResult: foundResult });
            }
        }
    }

    async updateResult(result) {
        getCollection("result", this.props.competitionId).then(
            async (collection) => {
                await collection.atomicUpsert(result);
                console.dir(result);
            }
        );
        this.setState({ currentResult: result });
    }

    render() {
        const { currentResult } = this.state;
        const { classes, evaluationTemplate, heat } = this.props;

        return currentResult && currentResult.ready == false ? (
            <div>
                <Typography id="discrete-slider" gutterBottom>
                    {"Startnummer " + currentResult.bookId}
                </Typography>
                <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    spacing={1}
                >
                    <Grid item xs={12}>
                        <div>
                            <Stopwatch />
                            <Divider
                                style={{
                                    marginTop: "10px",
                                }}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div>
                            <Grid
                                container
                                justifyContent="center"
                                alignItems="center"
                                spacing={1}
                            >
                                {evaluationTemplate &&
                                    evaluationTemplate.deduction &&
                                    evaluationTemplate.deduction.map(
                                        (deduction) => {
                                            return (
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => {
                                                        const localResult =
                                                            JSON.parse(
                                                                JSON.stringify(
                                                                    currentResult
                                                                )
                                                            );

                                                        localResult.deduction
                                                            ? localResult.deduction.push(
                                                                  {
                                                                      name: deduction.name,
                                                                      value: deduction.value,
                                                                  }
                                                              )
                                                            : (localResult.deduction =
                                                                  [
                                                                      {
                                                                          name: deduction.name,
                                                                          value: deduction.value,
                                                                      },
                                                                  ]);
                                                        this.updateResult(
                                                            localResult
                                                        );
                                                    }}
                                                    style={{ margin: "11px" }}
                                                >
                                                    {deduction.name}
                                                </Button>
                                            );
                                        }
                                    )}
                            </Grid>
                            <Divider
                                style={{
                                    marginTop: "10px",
                                    marginBottom: "10px",
                                }}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div>
                            <Grid
                                container
                                justifyContent="center"
                                alignItems="center"
                                spacing={1}
                            >
                                {currentResult?.deduction?.observer?.map(
                                    (deduction, index) => {
                                        return (
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                style={{ margin: "11px" }}
                                                onClick={() => {
                                                    const localResult =
                                                        JSON.parse(
                                                            JSON.stringify(
                                                                currentResult
                                                            )
                                                        );

                                                    localResult.deduction &&
                                                        localResult.deduction.splice(
                                                            index,
                                                            1
                                                        );

                                                    this.updateResult(
                                                        localResult
                                                    );
                                                }}
                                            >
                                                {deduction.name}
                                            </Button>
                                        );
                                    }
                                )}
                            </Grid>
                            <Divider
                                style={{
                                    marginTop: "10px",
                                    marginBottom: "10px",
                                }}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid
                            container
                            justifyContent="center"
                            alignItems="center"
                            spacing={1}
                        >
                            <Button
                                variant="contained"
                                color="secondary"
                                style={{
                                    marginLeft: "10px",
                                }}
                                onClick={() => {
                                    const localResult = JSON.parse(
                                        JSON.stringify(currentResult)
                                    );

                                    localResult.ready = true;

                                    this.updateResult(localResult);
                                }}
                            >
                                Wertung abschicken
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        ) : (
            <div>
                <Typography>Fußtechnik - Wertung bereits abgesendet</Typography>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(
    withProps(ObserverPanel)
);
