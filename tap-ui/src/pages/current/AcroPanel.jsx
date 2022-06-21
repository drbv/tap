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

class AcroPanel extends Component {
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
    });
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.heat != this.props.heat) {
      this.prepaireResults();
    }
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
            result.bookId == this.state.currentRound.participants[0] &&
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
    const { currentResult } = this.state;
    const { classes, acroTemplate, heat } = this.props;

    return currentResult && currentResult.ready == false ? (
      <div>
        {acroTemplate &&
          heat &&
          heat.acros &&
          heat.acros[0] &&
          heat.acros[0].acro.map((acro) => {
            if (acro.acro_short_text != "") {
              return (
                <div>
                  <Typography id="discrete-slider" gutterBottom>
                    {acro.acro_short_text}
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
                        (result) => result.name == acro.acro_short_text
                      ) != null
                        ? currentResult.categories.find(
                            (result) => result.name == acro.acro_short_text
                          ).value
                        : 0.5 * acro.points
                    }
                    valueLabelFormat={(value) => {
                      return Math.round((value / acro.points) * 100) + "%";
                    }}
                    aria-labelledby="discrete-slider-small-steps"
                    step={acro.points / 10}
                    min={0}
                    max={acro.points}
                    valueLabelDisplay="auto"
                    onChangeCommitted={(e, newValue) => {
                      const localResult = JSON.parse(
                        JSON.stringify(currentResult)
                      );

                      if (
                        localResult.categories &&
                        localResult.categories.find(
                          (result) => result.name == acro.acro_short_text
                        ) != null
                      ) {
                        localResult.categories.find(
                          (result) => result.name == acro.acro_short_text
                        ).value = newValue ? newValue : 0;
                        this.updateResult(localResult);
                      } else {
                        localResult.categories
                          ? localResult.categories.push({
                              name: acro.acro_short_text,
                              value: newValue ? newValue : 0,
                            })
                          : (localResult.categories = [
                              {
                                name: acro.acro_short_text,
                                value: newValue ? newValue : 0,
                              },
                            ]);
                        this.updateResult(localResult);
                      }
                    }}
                  />
                  {acroTemplate.boni &&
                    acroTemplate.boni.map((bonus) => {
                      return (
                        <Grid item xs={2}>
                          <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            onClick={() => {
                              const localResult = JSON.parse(
                                JSON.stringify(currentResult)
                              );

                              localResult.boni
                                ? localResult.boni.push({
                                    name: bonus.name,
                                    value: bonus.value,
                                    amount: 1,
                                  })
                                : (localResult.boni = [
                                    {
                                      name: bonus.name,
                                      value: bonus.value,
                                      amount: 1,
                                    },
                                  ]);
                              this.updateResult(localResult);
                            }}
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
              );
            }
          })}
      </div>
    ) : (
      <div>
        <Typography>Acro - Wertung bereits abgesendet</Typography>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(withProps(AcroPanel));
