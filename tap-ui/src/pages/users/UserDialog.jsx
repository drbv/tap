//HOC and util
import React from "react";
import { PropTypes } from "prop-types";
import withStyles from "@material-ui/core/es/styles/withStyles";

import { isRxCollection, isRxDatabase, isRxDocument } from "rxdb";

import withProps from "../../components/HOC";
import { getCollection } from "../../Database";

//components and libraries
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputLabel,
    MenuItem,
    Select,
    FormHelperText,
    FormControl,
    CircularProgress,
} from "@material-ui/core";

import { BlurOn } from "@material-ui/icons";
import { Tooltip } from "@material-ui/core";

const styles = (theme) => ({
    inputContent: {
        marginTop: 20,
    },
    flexboxContainer: {
        display: "flex",
        "align-items": "center",
    },
});

class UserDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            localUser: null,
        };
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.open !== this.props.open) {
            if (this.props.userToEdit) {
                this.setState({ localUser: this.props.userToEdit });
            } else {
                this.setState({
                    localUser: {
                        id: Date.now().toString(),
                        name: "",
                        role: "",
                        key: "",
                    },
                });
            }
        }
    }

    async upsertUser() {
        getCollection("user", this.props.competitionId).then(
            async (collection) => {
                await collection.atomicUpsert(this.state.localUser);
            }
        );
    }

    render() {
        const { classes } = this.props;
        const { localUser } = this.state;

        return localUser ? (
            <div>
                <Dialog
                    open={this.props.open}
                    onClose={() => this.props.handleClose()}
                    aria-labelledby="form-dialog-title"
                    scroll="body"
                >
                    <DialogTitle id="form-dialog-title">
                        Nutzer anlegen / bearbeiten
                    </DialogTitle>
                    <DialogContent dividers>
                        <TextField
                            margin="dense"
                            id="name"
                            name="name"
                            Title
                            value={localUser.name}
                            required={true}
                            onChange={(e) => {
                                let localUserCopy = localUser;
                                localUserCopy.name = e.target.value;
                                this.setState({
                                    localUser: localUserCopy,
                                });
                            }}
                            helperText="Name des Nutzers"
                            label="Name"
                            type="text"
                            fullWidth
                            className={classes.inputContent}
                        />
                        <div className={classes.inputContent}>
                            <InputLabel
                                required={true}
                                shrink={true}
                                className={classes.inputContent}
                                htmlFor="role-select"
                            >
                                Berechtigung
                            </InputLabel>
                            <Select
                                fullWidth
                                inputProps={{
                                    name: "role",
                                    id: "role-select",
                                }}
                                value={localUser.role}
                                onChange={(e) => {
                                    this.setState((prevState) => {
                                        let localUser = Object.assign(
                                            {},
                                            prevState.localUser
                                        ); // creating copy of state variable
                                        localUser.role = e.target.value; // update the name property, assign a new value
                                        return { localUser }; // return new object
                                    });
                                }}
                            >
                                <MenuItem value="judge">
                                    Wertungsrichter
                                </MenuItem>
                                <MenuItem value="admin">Turnierleiter</MenuItem>
                                <MenuItem value="service">
                                    Beamer / Übersicht
                                </MenuItem>
                            </Select>
                        </div>
                        <div className={classes.flexboxContainer}>
                            <TextField
                                margin="dense"
                                id="key"
                                name="key"
                                value={this.state.localUser.key}
                                multiline={true}
                                onChange={(e) => {
                                    let localUserCopy = localUser;
                                    localUserCopy.key = e.target.value;
                                    this.setState({
                                        localUser: localUserCopy,
                                    });
                                }}
                                helperText="Passwort zum Anmelden"
                                label="Schlüssel"
                                type="text"
                                fullWidth
                                className={classes.inputContent}
                            />
                            <Tooltip title="Schlüssel generieren">
                                <BlurOn />
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
                                this.upsertUser();
                                this.props.handleClose();
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

UserDialog.propTypes = {
    /**
     * dialog open or closed
     */
    open: PropTypes.bool.isRequired,
    /**
     * function to close dialog
     */
    handleClose: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(withProps(UserDialog));
