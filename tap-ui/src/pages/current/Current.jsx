import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import {
    LinearProgress,
    Grid,
    Paper,
    Slider,
    Typography,
    Button,
} from '@material-ui/core'
import withStyles from '@material-ui/core/es/styles/withStyles'

import withProps from '../../components/HOC'
import * as Database from '../../Database'

const styles = {
    root: {
        flexGrow: 1,
        margin: '11px',
    },
    paper: {
        padding: 10,
        height: 700,
        width: 800,
    },
}

class Current extends Component {
    constructor(props) {
        super(props)

        this.state = {
            results: null,
            subround: null,
            round: null,
            couples: null,
            evaluation: null,
        }

        this.subs = []
    }

    async componentDidMount() {
        this.setState({ db: await Database.getClientDb() })

        const sub = await this.state.db.subrounds
            .findOne({ selector: { status: 'running' } })
            .$.subscribe(async (subround) => {
                if (!subround) {
                    return
                }

                console.log('reload subrounds-list ')
                console.dir(subround)
                this.setState({
                    subround,
                })

                await this.state.db.rounds
                    .findOne({ selector: { id: subround.roundId } })
                    .exec()
                    .then((localRound) => {
                        console.log('reload round ')
                        console.dir(localRound)
                        const localCopy = JSON.parse(JSON.stringify(localRound))
                        localCopy.judgeIds = ['1631412137716', '1631412525617']
                        this.setState({
                            round: localCopy,
                        })
                    })

                await this.state.db.couples
                    .find({
                        selector: { id: { $in: subround.coupleIds } },
                    })
                    .exec()
                    .then((localCouples) => {
                        this.setState({
                            couples: localCouples,
                        })
                    })

                await this.state.db.evaluations
                    .findOne({
                        selector: { id: this.state.round.evaluationTemplateId },
                    })
                    .exec()
                    .then((localEvaluation) =>
                        this.setState({
                            evaluation: localEvaluation,
                        })
                    )

                await this.prepaireResults()
            })
        this.subs.push(sub)
    }

    async prepaireResults() {
        this.state.couples.map(async (couple, index) => {
            const sub = await this.state.db.results
                .find({
                    selector: {
                        coupleId: couple.id,
                        roundId: this.state.round.id,
                    },
                })
                .$.subscribe(async (results) => {
                    if (
                        !results ||
                        !results.find(
                            (result) => result.judgeId == this.props.user.id
                        )
                    ) {
                        //create an empty result
                        await this.state.db.results.insert({
                            coupleId: couple.id,
                            roundId: this.state.round.id,
                            judgeId: this.props.user.id,
                            categories: [],
                            ready: false,
                        })
                    } else {
                        this.setState({
                            results: results,
                            ['result' + index]: results.find(
                                (result) => result.judgeId == this.props.user.id
                            ),
                        })
                    }
                })
            this.subs.push(sub)
        })
    }

    async updateResult(result) {
        await this.state.db.results.upsert(result)
        console.dir(result)
    }

    render() {
        const { classes } = this.props
        const { subround, round, couples, evaluation } = this.state

        return subround ? (
            <div>
                <Grid className={classes.root} spacing={2}>
                    <Grid container justifyContent="center" spacing={1}>
                        <Grid item xs={12}>
                            {couples &&
                                couples.map((couple, index) => {
                                    if (
                                        this.state['result' + index] &&
                                        this.state['result' + index].ready ==
                                            false
                                    ) {
                                        return (
                                            <Grid item xs={6}>
                                                <Paper
                                                    className={classes.paper}
                                                >
                                                    <Typography
                                                        id="discrete-slider"
                                                        gutterBottom
                                                    >
                                                        {'Startnummer ' +
                                                            couple.number +
                                                            ': ' +
                                                            couple.nameOneFirst +
                                                            ' ' +
                                                            couple.nameOneSecond +
                                                            ' und ' +
                                                            couple.nameTwoFirst +
                                                            ' ' +
                                                            couple.nameTwoSecond}
                                                    </Typography>
                                                    {evaluation &&
                                                        evaluation.categories &&
                                                        evaluation.categories.map(
                                                            (category) => {
                                                                return (
                                                                    <div>
                                                                        <Typography
                                                                            id="discrete-slider"
                                                                            gutterBottom
                                                                        >
                                                                            {
                                                                                category.name
                                                                            }
                                                                        </Typography>
                                                                        <Slider
                                                                            defaultValue={
                                                                                this
                                                                                    .state[
                                                                                    'result' +
                                                                                        index
                                                                                ] &&
                                                                                this
                                                                                    .state[
                                                                                    'result' +
                                                                                        index
                                                                                ]
                                                                                    .categories &&
                                                                                this.state[
                                                                                    'result' +
                                                                                        index
                                                                                ].categories.find(
                                                                                    (
                                                                                        result
                                                                                    ) =>
                                                                                        result.name ==
                                                                                        category.name
                                                                                ) !=
                                                                                    null
                                                                                    ? this.state[
                                                                                          'result' +
                                                                                              index
                                                                                      ].categories.find(
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
                                                                            aria-labelledby="discrete-slider-small-steps"
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
                                                                            valueLabelDisplay="auto"
                                                                            onChange={(
                                                                                e,
                                                                                newValue
                                                                            ) => {
                                                                                const localResult =
                                                                                    JSON.parse(
                                                                                        JSON.stringify(
                                                                                            this
                                                                                                .state[
                                                                                                'result' +
                                                                                                    index
                                                                                            ]
                                                                                        )
                                                                                    )

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

                                                                                    this.setState(
                                                                                        {
                                                                                            ['result' +
                                                                                            index]:
                                                                                                localResult,
                                                                                        }
                                                                                    )
                                                                                    this.updateResult(
                                                                                        localResult
                                                                                    )
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
                                                                                              ])

                                                                                    this.setState(
                                                                                        {
                                                                                            ['result' +
                                                                                            index]:
                                                                                                localResult,
                                                                                        }
                                                                                    )

                                                                                    this.updateResult(
                                                                                        localResult
                                                                                    )
                                                                                }
                                                                            }}
                                                                        />
                                                                    </div>
                                                                )
                                                            }
                                                        )}
                                                    <Grid
                                                        container
                                                        justifyContent="center"
                                                        spacing={1}
                                                    >
                                                        {evaluation &&
                                                            evaluation.boni &&
                                                            evaluation.boni.map(
                                                                (bonus) => {
                                                                    return (
                                                                        <Grid
                                                                            item
                                                                            xs={
                                                                                2
                                                                            }
                                                                        >
                                                                            <Button
                                                                                variant="contained"
                                                                                color="red"
                                                                                onClick={() => {}}
                                                                            >
                                                                                <Typography
                                                                                    id="discrete-slider"
                                                                                    gutterBottom
                                                                                >
                                                                                    {
                                                                                        bonus.name
                                                                                    }
                                                                                </Typography>
                                                                            </Button>
                                                                        </Grid>
                                                                    )
                                                                }
                                                            )}
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            style={{
                                                                marginLeft:
                                                                    '10px',
                                                            }}
                                                            onClick={() => {
                                                                const localResult =
                                                                    JSON.parse(
                                                                        JSON.stringify(
                                                                            this
                                                                                .state[
                                                                                'result' +
                                                                                    index
                                                                            ]
                                                                        )
                                                                    )

                                                                localResult.ready = true

                                                                this.updateResult(
                                                                    localResult
                                                                )
                                                            }}
                                                        >
                                                            Wertungen abschicken
                                                        </Button>
                                                    </Grid>
                                                </Paper>
                                            </Grid>
                                        )
                                    } else {
                                        return (
                                            <div>
                                                <Typography>
                                                    Wertung bereits abgesendet
                                                </Typography>
                                                {round && (
                                                    <Button
                                                        variant="outlined"
                                                        color="success"
                                                    >
                                                        1631412137716
                                                    </Button>
                                                )}
                                            </div>
                                        )
                                    }
                                })}
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        ) : (
            <Typography>Runde startet gleich</Typography>
        )
    }
}

// Specifies the default values for props:
Current.defaultProps = {
    routes: {
        routes: [
            {
                name: 'default',
                path: '/current',
                exact: true,
                component: <LinearProgress />,
                admin: false,
                icon: null,
                hide: true,
            },
        ],
    },
}

export default withStyles(styles, { withTheme: true })(withProps(Current))
