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
            rounds: null,
            evaluations: null,
            judgeType: null,
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
                        // $or: [
                        //     { judgeIds: { $in: this.props.user.id } },
                        //     { acroJudgeIds: { $in: this.props.user.id } },
                        // ],
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
                    //check judge status

                    let judgeType =
                        rounds[0] &&
                        rounds[0].judgeIds.includes(this.props.user.id)
                            ? "evaluation"
                            : "acro";

                    this.setState(
                        {
                            judgeType,
                            rounds,
                            currentRound: currentRound,
                        },
                        () => {
                            this.prepaireResults();
                            this.loadCurrentCompetition();
                        }
                    );

                    rounds[0] &&
                        rounds[0].evaluationTemplateId &&
                        getCollection("scoringrule").then(
                            async (collection) => {
                                let currentEvaluation = await collection
                                    .findOne({
                                        selector: {
                                            id: rounds[0].evaluationTemplateId,
                                        },
                                    })
                                    .exec();

                                console.dir(currentEvaluation);
                                this.setState({
                                    currentEvaluation,
                                });
                            }
                        );

                    rounds[0] &&
                        rounds[0].acroTemplateId &&
                        getCollection("scoringrule").then(
                            async (collection) => {
                                let currentAcroTemplate = await collection
                                    .findOne({
                                        selector: {
                                            id: rounds[0].acroTemplateId,
                                        },
                                    })
                                    .exec();

                                console.dir(currentAcroTemplate);
                                this.setState({
                                    currentAcroTemplate,
                                });
                            }
                        );
                });
            this.subs.push(sub);
        });
    }

    async loadCurrentCompetition() {
        this.state.currentRound &&
            this.state.currentRound.participants[0] &&
            getCollection("competition").then(async (collection) => {
                let currentCompetition = await collection
                    .findOne({
                        selector: {
                            bookId: this.state.currentRound.participants[0],
                        },
                    })
                    .exec();

                this.setState({
                    currentCompetition,
                });
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
        const {
            rounds,
            currentEvaluation,
            currentAcroTemplate,
            currentResult,
            currentRound,
            currentCompetition,
            judgeType,
        } = this.state;

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
                                        {judgeType && judgeType == "evaluation"
                                            ? // Wertungspanel für Fußtechnik
                                              currentEvaluation &&
                                              currentEvaluation.categories &&
                                              currentEvaluation.categories.map(
                                                  (category) => {
                                                      return (
                                                          <div>
                                                              <Typography
                                                                  id='discrete-slider'
                                                                  gutterBottom
                                                              >
                                                                  {
                                                                      category.name
                                                                  }
                                                              </Typography>
                                                              <Slider
                                                                  classes={{
                                                                      thumb: classes.thumb,
                                                                      rail: classes.rail,
                                                                      track: classes.track,
                                                                      valueLabel:
                                                                          classes.valueLabel,
                                                                      mark: classes.mark,
                                                                  }}
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
                                                                  valueLabelFormat={(
                                                                      value
                                                                  ) => {
                                                                      return (
                                                                          Math.round(
                                                                              (value /
                                                                                  category.max) *
                                                                                  100
                                                                          ) +
                                                                          "%"
                                                                      );
                                                                  }}
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
                                                                              newValue
                                                                                  ? newValue
                                                                                  : 0;
                                                                          this.updateResult(
                                                                              localResult
                                                                          );
                                                                      } else {
                                                                          localResult.categories
                                                                              ? localResult.categories.push(
                                                                                    {
                                                                                        name: category.name,
                                                                                        value: newValue
                                                                                            ? newValue
                                                                                            : 0,
                                                                                    }
                                                                                )
                                                                              : (localResult.categories =
                                                                                    [
                                                                                        {
                                                                                            name: category.name,
                                                                                            value: newValue
                                                                                                ? newValue
                                                                                                : 0,
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
                                              )
                                            : // Wertungspanel für Akrobatiken
                                              currentAcroTemplate &&
                                              currentCompetition &&
                                              currentCompetition.acros &&
                                              currentCompetition.acros[0] &&
                                              currentCompetition.acros[0].acro.map(
                                                  (acro) => {
                                                      if (
                                                          acro.acro_short_text !=
                                                          ""
                                                      ) {
                                                          return (
                                                              <div>
                                                                  <Typography
                                                                      id='discrete-slider'
                                                                      gutterBottom
                                                                  >
                                                                      {
                                                                          acro.acro_short_text
                                                                      }
                                                                  </Typography>
                                                                  <Slider
                                                                      classes={{
                                                                          thumb: classes.thumb,
                                                                          rail: classes.rail,
                                                                          track: classes.track,
                                                                          valueLabel:
                                                                              classes.valueLabel,
                                                                          mark: classes.mark,
                                                                      }}
                                                                      defaultValue={
                                                                          currentResult.categories &&
                                                                          currentResult.categories.find(
                                                                              (
                                                                                  result
                                                                              ) =>
                                                                                  result.name ==
                                                                                  acro.acro_short_text
                                                                          ) !=
                                                                              null
                                                                              ? currentResult.categories.find(
                                                                                    (
                                                                                        result
                                                                                    ) =>
                                                                                        result.name ==
                                                                                        acro.acro_short_text
                                                                                )
                                                                                    .value
                                                                              : 0.5 *
                                                                                acro.points
                                                                      }
                                                                      valueLabelFormat={(
                                                                          value
                                                                      ) => {
                                                                          return (
                                                                              Math.round(
                                                                                  (value /
                                                                                      acro.points) *
                                                                                      100
                                                                              ) +
                                                                              "%"
                                                                          );
                                                                      }}
                                                                      aria-labelledby='discrete-slider-small-steps'
                                                                      step={
                                                                          acro.points /
                                                                          10
                                                                      }
                                                                      min={0}
                                                                      max={
                                                                          acro.points
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
                                                                                      acro.acro_short_text
                                                                              ) !=
                                                                                  null
                                                                          ) {
                                                                              localResult.categories.find(
                                                                                  (
                                                                                      result
                                                                                  ) =>
                                                                                      result.name ==
                                                                                      acro.acro_short_text
                                                                              ).value =
                                                                                  newValue
                                                                                      ? newValue
                                                                                      : 0;
                                                                              this.updateResult(
                                                                                  localResult
                                                                              );
                                                                          } else {
                                                                              localResult.categories
                                                                                  ? localResult.categories.push(
                                                                                        {
                                                                                            name: acro.acro_short_text,
                                                                                            value: newValue
                                                                                                ? newValue
                                                                                                : 0,
                                                                                        }
                                                                                    )
                                                                                  : (localResult.categories =
                                                                                        [
                                                                                            {
                                                                                                name: acro.acro_short_text,
                                                                                                value: newValue
                                                                                                    ? newValue
                                                                                                    : 0,
                                                                                            },
                                                                                        ]);
                                                                              this.updateResult(
                                                                                  localResult
                                                                              );
                                                                          }
                                                                      }}
                                                                  />
                                                                  {currentAcroTemplate.boni &&
                                                                      currentAcroTemplate.boni.map(
                                                                          (
                                                                              bonus
                                                                          ) => {
                                                                              return (
                                                                                  <Grid
                                                                                      item
                                                                                      xs={
                                                                                          2
                                                                                      }
                                                                                  >
                                                                                      <Button
                                                                                          variant='outlined'
                                                                                          color='secondary'
                                                                                          size='small'
                                                                                          onClick={() => {
                                                                                              const localResult =
                                                                                                  JSON.parse(
                                                                                                      JSON.stringify(
                                                                                                          currentResult
                                                                                                      )
                                                                                                  );

                                                                                              localResult.boni
                                                                                                  ? localResult.boni.push(
                                                                                                        {
                                                                                                            name: bonus.name,
                                                                                                            value: bonus.value,
                                                                                                            amount: 1,
                                                                                                        }
                                                                                                    )
                                                                                                  : (localResult.boni =
                                                                                                        [
                                                                                                            {
                                                                                                                name: bonus.name,
                                                                                                                value: bonus.value,
                                                                                                                amount: 1,
                                                                                                            },
                                                                                                        ]);
                                                                                              this.updateResult(
                                                                                                  localResult
                                                                                              );
                                                                                          }}
                                                                                      >
                                                                                          {
                                                                                              bonus.name
                                                                                          }
                                                                                      </Button>
                                                                                  </Grid>
                                                                              );
                                                                          }
                                                                      )}
                                                              </div>
                                                          );
                                                      }
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
                                                                    variant='outlined'
                                                                    color='error'
                                                                    size='small'
                                                                    onClick={() => {}}
                                                                >
                                                                    {bonus.name}
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
