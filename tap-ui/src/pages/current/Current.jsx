import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
    LinearProgress,
    Grid,
    Paper,
    Slider,
    Typography,
    Button,
} from "@material-ui/core";
import withStyles from "@material-ui/core/es/styles/withStyles";

import withProps from "../../components/HOC";
import { getCollection } from "../../Database";

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
};

class Current extends Component {
    constructor(props) {
        super(props);

        this.state = {
            results: null,
            rounds: null,
            evaluations: null,
        };

        this.subs = [];
    }

    async componentDidMount() {
        getCollection("result").then(async (collection) => {
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
                    this.setState(
                        {
                            results,
                        },
                        () => {
                            this.prepaireResults();
                        }
                    );
                });

            this.subs.push(sub);
        });

        getCollection("round").then(async (collection) => {
            let sub = await collection
                .find({
                    selector: {
                        status: "running",
                    },
                })
                .$.subscribe((rounds) => {
                    if (!rounds) {
                        return;
                    }
                    console.log("reload Rounds");
                    console.dir(rounds);
                    let currentRound =
                        rounds[0] &&
                        rounds[0].subrounds &&
                        rounds[0].subrounds.find(
                            (value) => value.status == "running"
                        );
                    this.setState(
                        {
                            rounds,
                            currentRound: currentRound,
                        },
                        () => this.prepaireResults()
                    );
                });
            this.subs.push(sub);
        });

        getCollection("scoringrule").then(async (collection) => {
            let sub = await collection.find().$.subscribe((evaluations) => {
                if (!evaluations) {
                    return;
                }
                console.log("reload Evaluations");
                console.dir(evaluations);
                this.setState({
                    evaluations,
                });
            });
            this.subs.push(sub);
        });
    }

    async prepaireResults() {
        if (
            this.state.currentRound &&
            this.state.currentRound.participants &&
            this.state.currentRound.participants[0] &&
            this.state.rounds &&
            this.state.rounds[0]
        ) {
            let foundResult =
                this.state.results &&
                this.state.results.find(
                    (result) =>
                        result.bookId ==
                            this.state.currentRound.participants[0] &&
                        result.roundId == this.state.rounds[0].roundId
                );
            if (!foundResult) {
                getCollection("result").then(async (collection) => {
                    let currentResult = await collection.atomicUpsert({
                        resultId: Date.now().toString() + this.props.user.id,
                        bookId: this.state.currentRound.participants[0],
                        roundId: this.state.rounds[0].roundId,
                        judgeId: this.props.user.id,
                        ready: false,
                    });
                    this.setState({ currentResult });
                });
            } else {
                this.setState({ currentResult: foundResult });
            }
        }
    }

    async updateResult(result) {
        getCollection("result").then(async (collection) => {
            await collection.atomicUpsert(result);
            console.dir(result);
        });
        this.setState({ currentResult: result });
    }

    render() {
        const { classes } = this.props;
        const { rounds, evaluations, currentResult, currentRound } = this.state;

        const currentEvaluation = evaluations && evaluations[0];

        return currentRound ? (
            <div>
                <Grid className={classes.root} spacing={2}>
                    <Grid container justifyContent='center' spacing={1}>
                        <Grid item xs={12}>
                            {currentResult && currentResult.ready == false ? (
                                <Grid item xs={6}>
                                    <Paper className={classes.paper}>
                                        <Typography
                                            id='discrete-slider'
                                            gutterBottom
                                        >
                                            {"Startnummer " +
                                                currentResult.bookId}
                                        </Typography>
                                        {currentEvaluation &&
                                            currentEvaluation.categories &&
                                            currentEvaluation.categories.map(
                                                (category) => {
                                                    return (
                                                        <div>
                                                            <Typography
                                                                id='discrete-slider'
                                                                gutterBottom
                                                            >
                                                                {category.name}
                                                            </Typography>
                                                            <Slider
                                                                defaultValue={
                                                                    currentResult.categories &&
                                                                    currentResult.categories.find(
                                                                        (
                                                                            result
                                                                        ) =>
                                                                            result.name ==
                                                                            category.name
                                                                    ) != null
                                                                        ? currentResult.categories.find(
                                                                              (
                                                                                  result
                                                                              ) =>
                                                                                  result.name ==
                                                                                  category.name
                                                                          )
                                                                              .value
                                                                        : 0.5 *
                                                                          category.max
                                                                }
                                                                aria-labelledby='discrete-slider-small-steps'
                                                                step={
                                                                    category.max /
                                                                    10
                                                                }
                                                                marks
                                                                min={
                                                                    category.min
                                                                }
                                                                max={
                                                                    category.max
                                                                }
                                                                valueLabelDisplay='auto'
                                                                onChangeCommitted={(
                                                                    e,
                                                                    newValue
                                                                ) => {
                                                                    const localResult =
                                                                        JSON.parse(
                                                                            JSON.stringify(
                                                                                currentResult
                                                                            )
                                                                        );

                                                                    if (
                                                                        localResult.categories &&
                                                                        localResult.categories.find(
                                                                            (
                                                                                result
                                                                            ) =>
                                                                                result.name ==
                                                                                category.name
                                                                        ) !=
                                                                            null
                                                                    ) {
                                                                        localResult.categories.find(
                                                                            (
                                                                                result
                                                                            ) =>
                                                                                result.name ==
                                                                                category.name
                                                                        ).value =
                                                                            newValue;
                                                                        this.updateResult(
                                                                            localResult
                                                                        );
                                                                    } else {
                                                                        localResult.categories
                                                                            ? localResult.categories.push(
                                                                                  {
                                                                                      name: category.name,
                                                                                      value: newValue,
                                                                                  }
                                                                              )
                                                                            : (localResult.categories =
                                                                                  [
                                                                                      {
                                                                                          name: category.name,
                                                                                          value: newValue,
                                                                                      },
                                                                                  ]);
                                                                        this.updateResult(
                                                                            localResult
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    );
                                                }
                                            )}
                                        <Grid
                                            container
                                            justifyContent='center'
                                            spacing={1}
                                        >
                                            {currentEvaluation &&
                                                currentEvaluation.boni &&
                                                currentEvaluation.boni.map(
                                                    (bonus) => {
                                                        return (
                                                            <Grid item xs={2}>
                                                                <Button
                                                                    variant='contained'
                                                                    color='red'
                                                                    onClick={() => {}}
                                                                >
                                                                    <Typography
                                                                        id='discrete-slider'
                                                                        gutterBottom
                                                                    >
                                                                        {
                                                                            bonus.name
                                                                        }
                                                                    </Typography>
                                                                </Button>
                                                            </Grid>
                                                        );
                                                    }
                                                )}
                                            <Button
                                                variant='contained'
                                                color='secondary'
                                                style={{
                                                    marginLeft: "10px",
                                                }}
                                                onClick={() => {
                                                    const localResult =
                                                        JSON.parse(
                                                            JSON.stringify(
                                                                currentResult
                                                            )
                                                        );

                                                    localResult.ready = true;

                                                    this.updateResult(
                                                        localResult
                                                    );
                                                }}
                                            >
                                                Wertungen abschicken
                                            </Button>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            ) : (
                                <div>
                                    <Typography>
                                        Wertung bereits abgesendet
                                    </Typography>
                                </div>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        ) : (
            <Typography>Runde startet gleich</Typography>
        );
    }
}

// Specifies the default values for props:
Current.defaultProps = {
    routes: {
        routes: [
            {
                name: "default",
                path: "/current",
                exact: true,
                component: <LinearProgress />,
                admin: false,
                icon: null,
                hide: true,
            },
        ],
    },
};

export default withStyles(styles, { withTheme: true })(withProps(Current));
