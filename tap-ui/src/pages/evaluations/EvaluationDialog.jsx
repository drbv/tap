//HOC and util
import React from "react";
import { PropTypes } from "prop-types";
import withStyles from "@material-ui/core/es/styles/withStyles";

import { withLocalize } from "react-localize-redux";

import { isRxCollection, isRxDatabase, isRxDocument } from "rxdb";

import withProps from "../../components/HOC";
import { getCollection } from "../../Database";
import athleteTranslation from "../../translations/athletes.json";

//components and libraries
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  Input,
  MenuItem,
  Select,
  Slider,
  Typography,
  IconButton,
  Container,
  Divider,
  FormHelperText,
  FormControl,
  CircularProgress,
  Checkbox,
} from "@material-ui/core";
import { Delete, Add } from "@material-ui/icons";
import { Tooltip } from "@material-ui/core";

const styles = (theme) => ({
  header: {
    marginTop: 20,
  },
  root: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    margin: "11px",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-start",
  },
  flexboxContainer: {
    display: "flex",
    "align-items": "center",
  },
});

class EvaluationDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      localEvaluation: null,
      numberCouples: null,
      suggestedNumber: null,
    };
    this.subs = [];

    this.props.addTranslation(athleteTranslation);
  }

  async componentWillUnmount() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  async componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.open !== this.props.open ||
      prevProps.evaluationId !== this.props.evaluationId
    ) {
      if (this.props.evaluationId) {
        this.loadEvaluation(this.props.evaluationId);
      } else {
        this.setState({
          localEvaluation: {
            id: Date.now().toString(),
            rounds: {
              qualifying: false,
              intermediate: false,
              semifinals: false,
              finals: false,
            },
            acrobatic: true,
          },
        });
      }
    }
  }

  async loadEvaluation(id) {
    getCollection("scoringrule").then(async (collection) => {
      const localEvaluation = await collection.findOne(id).exec();
      this.setState({
        localEvaluation: localEvaluation.toJSON(),
      });
    });
  }

  async atomicUpsertEvaluation(localEvaluation) {
    getCollection("scoringrule").then(async (collection) => {
      await collection.upsert(localEvaluation);
    });
  }

  render() {
    const { classes, translate } = this.props;
    const { localEvaluation } = this.state;

    return localEvaluation ? (
      <div>
        <Dialog
          open={this.props.open}
          onClose={() => this.props.handleClose()}
          aria-labelledby="form-dialog-title"
          scroll="body"
        >
          <DialogTitle id="form-dialog-title">
            Wertungsbogen erstellen / bearbeiten
          </DialogTitle>
          <DialogContent dividers>
            <div className={classes.inputContent}>
              <div className={classes.inputContent}>
                <InputLabel
                  required={true}
                  shrink={true}
                  className={classes.inputContent}
                  htmlFor="role-select"
                >
                  Tanzklasse
                </InputLabel>
                <Select
                  fullWidth
                  inputProps={{
                    name: "league",
                    id: "league-select",
                  }}
                  value={localEvaluation.league}
                  onChange={(e) => {
                    this.setState((prevState) => {
                      let localEvaluation = Object.assign(
                        {},
                        prevState.localEvaluation
                      ); // creating copy of state variable
                      localEvaluation.league = e.target.value; // update the name property, assign a new value
                      return { localEvaluation }; // return new object
                    });
                  }}
                >
                  {[
                    "RR_A",
                    "RR_B",
                    "RR_C",
                    "RR_J",
                    "RR_S",
                    "RR_S1",
                    "RR_S2",
                  ].map((value) => {
                    return (
                      <MenuItem value={value}>
                        {translate("athlete.leagues." + value)}
                      </MenuItem>
                    );
                  })}
                </Select>
              </div>
              <Divider className={classes.header} />
              <Typography className={classes.header}>Kategorien</Typography>
              {localEvaluation.categories &&
                localEvaluation.categories.map((category, index) => {
                  return (
                    <div className={classes.row}>
                      <TextField
                        margin="dense"
                        id="name"
                        name="name"
                        style={{ width: "1000px" }}
                        Title
                        value={category.name}
                        required={true}
                        onChange={(e) => {
                          let localEvaluationCopy = JSON.parse(
                            JSON.stringify(localEvaluation)
                          );
                          localEvaluationCopy.categories[index].name =
                            e.target.value;
                          this.setState({
                            localEvaluation: localEvaluationCopy,
                          });
                        }}
                        label="Kategorie"
                        type="text"
                        fullWidth
                        className={classes.inputContent}
                      />
                      <TextField
                        margin="dense"
                        id="min"
                        name="min"
                        Title
                        value={category.min}
                        required={true}
                        onChange={(e) => {
                          let localEvaluationCopy = Object.assign(
                            {},
                            localEvaluation
                          );
                          localEvaluationCopy.categories[index].min =
                            parseFloat(e.target.value);
                          this.setState({
                            localEvaluation: localEvaluationCopy,
                          });
                        }}
                        label="Min"
                        type="number"
                        fullWidth
                        className={classes.inputContent}
                      />
                      <TextField
                        margin="dense"
                        id="max"
                        name="max"
                        Title
                        value={category.max}
                        required={true}
                        onChange={(e) => {
                          let localEvaluationCopy = Object.assign(
                            {},
                            localEvaluation
                          );
                          localEvaluationCopy.categories[index].max =
                            parseFloat(e.target.value);
                          this.setState({
                            localEvaluation: localEvaluationCopy,
                          });
                        }}
                        label="Max"
                        type="number"
                        fullWidth
                        className={classes.inputContent}
                      />
                      <TextField
                        margin="dense"
                        id="name"
                        name="name"
                        Title
                        value={category.step}
                        required={true}
                        onChange={(e) => {
                          let localEvaluationCopy = Object.assign(
                            {},
                            localEvaluation
                          );
                          localEvaluationCopy.categories[index].step =
                            parseFloat(e.target.value);
                          this.setState({
                            localEvaluation: localEvaluationCopy,
                          });
                        }}
                        label="Abstufung in %"
                        type="number"
                        fullWidth
                        className={classes.inputContent}
                      />
                      <Tooltip title="Entfernen">
                        <IconButton
                          onClick={() => {
                            let localEvaluationCopy = Object.assign(
                              {},
                              localEvaluation
                            );
                            localEvaluationCopy.categories.splice(index, 1);
                            this.setState({
                              localEvaluation: localEvaluationCopy,
                            });
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </div>
                  );
                })}
              <Tooltip title="Weitere Kategorie">
                <IconButton
                  onClick={() => {
                    let localEvaluationCopy = JSON.parse(
                      JSON.stringify(localEvaluation)
                    );
                    localEvaluationCopy.categories
                      ? localEvaluationCopy.categories.push({
                          name: "",
                          min: 0,
                          max: 1,
                          step: 1,
                        })
                      : (localEvaluationCopy.categories = [
                          {
                            name: "",
                            min: 0,
                            max: 1,
                            step: 1,
                          },
                        ]);
                    this.setState({
                      localEvaluation: localEvaluationCopy,
                    });
                  }}
                >
                  <Add />
                </IconButton>
              </Tooltip>
              <Divider className={classes.header} />
              <Typography className={classes.header}>Abzüge / Boni</Typography>
              {localEvaluation.deduction &&
                localEvaluation.deduction.map((bonus, index) => {
                  return (
                    <div className={classes.row}>
                      <TextField
                        margin="dense"
                        id="name"
                        name="name"
                        style={{ width: "1000px" }}
                        Title
                        value={bonus.name}
                        required={true}
                        onChange={(e) => {
                          let localEvaluationCopy = JSON.parse(
                            JSON.stringify(localEvaluation)
                          );
                          localEvaluationCopy.deduction[index].name =
                            e.target.value;
                          this.setState({
                            localEvaluation: localEvaluationCopy,
                          });
                        }}
                        label="Abzug / Bonus"
                        type="text"
                        fullWidth
                        className={classes.inputContent}
                      />
                      <TextField
                        margin="dense"
                        id="value"
                        name="value"
                        Title
                        value={bonus.value}
                        required={true}
                        onChange={(e) => {
                          let localEvaluationCopy = JSON.parse(
                            JSON.stringify(localEvaluation)
                          );
                          localEvaluationCopy.deduction[index].value =
                            parseFloat(e.target.value);
                          if (e.target.value < 0) {
                            localEvaluationCopy.deduction[index].color = "red";
                          } else {
                            localEvaluationCopy.deduction[index].color =
                              "green";
                          }
                          this.setState({
                            localEvaluation: localEvaluationCopy,
                          });
                        }}
                        label="Value"
                        type="number"
                        fullWidth
                        className={classes.inputContent}
                      />
                      <TextField
                        margin="dense"
                        id="limit"
                        name="limit"
                        Title
                        value={bonus.limit}
                        required={true}
                        onChange={(e) => {
                          let localEvaluationCopy = JSON.parse(
                            JSON.stringify(localEvaluation)
                          );
                          localEvaluationCopy.deduction[index].limit =
                            e.target.value;
                          this.setState({
                            localEvaluation: localEvaluationCopy,
                          });
                        }}
                        label="Limit"
                        type="number"
                        fullWidth
                        className={classes.inputContent}
                      />
                      <Tooltip title="Entfernen">
                        <IconButton
                          onClick={() => {
                            let localEvaluationCopy = JSON.parse(
                              JSON.stringify(localEvaluation)
                            );
                            localEvaluationCopy.deduction.splice(index, 1);
                            this.setState({
                              localEvaluation: localEvaluationCopy,
                            });
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </div>
                  );
                })}
              <Tooltip title="Abzug / Bonus hinzufügen">
                <IconButton
                  onClick={() => {
                    let localEvaluationCopy = JSON.parse(
                      JSON.stringify(localEvaluation)
                    );
                    localEvaluationCopy.deduction
                      ? localEvaluationCopy.deduction.push({
                          name: "",
                          value: 0,
                          limit: 0,
                        })
                      : (localEvaluationCopy.deduction = [
                          {
                            name: "",
                            value: 0,
                            limit: 0,
                          },
                        ]);
                    this.setState({
                      localEvaluation: localEvaluationCopy,
                    });
                  }}
                >
                  <Add />
                </IconButton>
              </Tooltip>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.props.handleClose();
              }}
              color="secondary"
              variant="contained"
            >
              abbrechen
            </Button>
            <Button
              disabled={this.state.disabled}
              onClick={() => {
                this.atomicUpsertEvaluation(localEvaluation).then(
                  this.props.handleClose()
                );
              }}
              color="primary"
              variant="contained"
            >
              speichern
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    ) : (
      ""
    );
  }
}

EvaluationDialog.propTypes = {
  /**
   * dialog open or closed
   */
  open: PropTypes.bool.isRequired,
  /**
   * function to close dialog
   */
  handleClose: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(
  withLocalize(withProps(EvaluationDialog))
);
