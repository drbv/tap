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
import { makeStyles } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/es/styles/withStyles";

import withProps from "../../components/HOC";
import { getCollection } from "../../Database";
import GeneralPanel from "./GeneralPanel";
import AcroPanel from "./AcroPanel";
import ObserverPanel from "./ObserverPanel";

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

class Current extends Component {
    constructor(props) {
        super(props);

        this.state = {
            results: null,
            round: null,
            evaluations: null,
            judgeType: null,
        };

        this.subs = [];
    }

    async componentDidMount() {
        getCollection("round", this.props.competitionId).then(
            async (collection) => {
                let sub = await collection
                    .findOne({
                        selector: {
                            status: "running",
                            // $or: [
                            //     { judgeIds: { $in: this.props.user.id } },
                            //     { acroJudgeIds: { $in: this.props.user.id } },
                            //     { observerIds: { $in: this.props.user.id } },
                            // ],
                        },
                    })
                    .$.subscribe((round) => {
                        if (!round) {
                            return;
                        }
                        console.log("reload Rounds");
                        console.dir(round);
                        let currentHeat =
                            round &&
                            round.subrounds &&
                            round.subrounds.find(
                                (value) => value.status == "running"
                            );

                        this.setState(
                            {
                                round,
                                currentHeat,
                            },
                            () => {
                                this.loadCurrentCompetition();
                            }
                        );

                        round &&
                            round.evaluationTemplateId &&
                            getCollection(
                                "scoring_rule",
                                this.props.competitionId
                            ).then(async (collection) => {
                                let currentEvaluation = await collection
                                    .findOne({
                                        selector: {
                                            id: round.evaluationTemplateId,
                                        },
                                    })
                                    .exec();

                                console.dir(currentEvaluation);
                                this.setState({
                                    currentEvaluation,
                                });
                            });

                        round &&
                            round.evaluationTemplateId &&
                            getCollection(
                                "scoring_rule",
                                this.props.competitionId
                            ).then(async (collection) => {
                                let currentEvaluationTemplate = await collection
                                    .findOne({
                                        selector: {
                                            id: round.evaluationTemplateId,
                                        },
                                    })
                                    .exec();

                                console.dir(currentEvaluationTemplate);
                                this.setState({
                                    currentEvaluationTemplate,
                                });
                            });
                    });
                this.subs.push(sub);
            }
        );
    }

    async loadCurrentCompetition() {
        this.state.currentHeat &&
            this.state.currentHeat.participants[0] &&
            getCollection("competition", this.props.competitionId).then(
                async (collection) => {
                    let currentCompetition = await collection
                        .findOne({
                            selector: {
                                bookId: this.state.currentHeat.participants[0],
                            },
                        })
                        .exec();

                    this.setState({
                        currentCompetition,
                    });
                }
            );
    }

    render() {
        const { classes } = this.props;
        const {
            currentEvaluation,
            currentEvaluationTemplate,
            currentResult,
            currentHeat,
            currentCompetition,
            round,
        } = this.state;

        return currentHeat ? (
            <div>
                <Grid
                    className={classes.root}
                    container
                    justifyContent="center"
                    spacing={1}
                >
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            {/* {round && round.judgeIds.includes(this.props.user.id) && (
                <GeneralPanel
                  evaluationTemplate={currentEvaluation}
                  heat={currentHeat}
                  round={round}
                />
              )} */}
                            {/* {round && round.acroJudgeIds.includes(this.props.user.id) && (
                    <AcroPanel
                      evaluationTemplate={currentEvaluationTemplate}
                      heat={currentHeat}
                      round={round}
                    />
                  )} */}
                            {round &&
                                round.observerIds.includes(
                                    this.props.user.id
                                ) && (
                                    <ObserverPanel
                                        evaluationTemplate={currentEvaluation}
                                        heat={currentHeat}
                                        round={round}
                                    />
                                )}
                        </Paper>
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
