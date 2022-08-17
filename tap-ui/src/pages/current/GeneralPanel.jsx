import { Slider, Typography, Grid, Button } from "@mui/material";
import withStyles from "@material-ui/core/es/styles/withStyles";

import { Component } from "react";
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

class GeneralPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {};

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
                    this.setState({
                        results,
                    });
                });

            this.subs.push(sub);
            this.prepaireResults();
        });
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.heat != this.props.heat) {
            this.prepaireResults();
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
                getCollection("result").then(async (collection) => {
                    let currentResult = await collection.atomicUpsert({
                        resultId: Date.now().toString() + this.props.user.id,
                        bookId: this.props.heat.participants[0],
                        roundId: this.props.round.roundId,
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
        const { currentResult } = this.state;
        const { classes, evaluationTemplate, heat } = this.props;

        return currentResult && currentResult.ready == false ? (
            <div>
                <Typography id="discrete-slider" gutterBottom>
                    {"Startnummer " + currentResult.bookId}
                </Typography>
                {evaluationTemplate &&
                    evaluationTemplate.categories &&
                    evaluationTemplate.categories.map((category) => {
                        return (
                            <div>
                                <Typography id="discrete-slider" gutterBottom>
                                    {category.name}
                                </Typography>
                                <Slider
                                    classes={{
                                        thumb: classes.thumb,
                                        rail: classes.rail,
                                        track: classes.track,
                                        valueLabel: classes.valueLabel,
                                        mark: classes.mark,
                                    }}
                                    defaultValue={
                                        currentResult.categories &&
                                        currentResult.categories.find(
                                            (result) =>
                                                result.name == category.name
                                        ) != null
                                            ? currentResult.categories.find(
                                                  (result) =>
                                                      result.name ==
                                                      category.name
                                              ).value
                                            : 0.5 * category.max
                                    }
                                    valueLabelFormat={(value) => {
                                        return (
                                            Math.round(
                                                (value / category.max) * 100
                                            ) + "%"
                                        );
                                    }}
                                    aria-labelledby="discrete-slider-small-steps"
                                    step={category.max / 10}
                                    marks
                                    min={category.min}
                                    max={category.max}
                                    valueLabelDisplay="auto"
                                    onChangeCommitted={(e, newValue) => {
                                        const localResult = JSON.parse(
                                            JSON.stringify(currentResult)
                                        );

                                        if (
                                            localResult.categories &&
                                            localResult.categories.find(
                                                (result) =>
                                                    result.name == category.name
                                            ) != null
                                        ) {
                                            localResult.categories.find(
                                                (result) =>
                                                    result.name == category.name
                                            ).value = newValue ? newValue : 0;
                                            this.updateResult(localResult);
                                        } else {
                                            localResult.categories
                                                ? localResult.categories.push({
                                                      name: category.name,
                                                      value: newValue
                                                          ? newValue
                                                          : 0,
                                                  })
                                                : (localResult.categories = [
                                                      {
                                                          name: category.name,
                                                          value: newValue
                                                              ? newValue
                                                              : 0,
                                                      },
                                                  ]);
                                            this.updateResult(localResult);
                                        }
                                    }}
                                />
                            </div>
                        );
                    })}
                {evaluationTemplate?.deduction?.general?.map((bonus) => {
                    return (
                        <Grid item xs={2}>
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => {}}
                            >
                                {bonus.name}
                            </Button>
                        </Grid>
                    );
                })}
                <Grid container justifyContent="center" spacing={1}>
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
                        Wertungen abschicken
                    </Button>
                </Grid>
            </div>
        ) : (
            <div>
                <Typography>Fußtechnik - Wertung bereits abgesendet</Typography>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(withProps(GeneralPanel));
