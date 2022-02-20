//HOC and util
import React from "react";
import { PropTypes } from "prop-types";
import withStyles from "@material-ui/core/es/styles/withStyles";

import { isRxCollection, isRxDatabase, isRxDocument } from "rxdb";

import withProps from "../../components/HOC";
import * as Database from "../../Database";

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

class PhaseDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            localPhase: null,
        };
        this.subs = [];
    }

    async componentDidMount() {
        this.setState({ db: await Database.getClientDb() });
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.open !== this.props.open) {
            if (this.props.PhaseToEdit) {
                this.setState({ localPhase: this.props.PhaseToEdit });
            } else {
                this.setState({
                    localPhase: {
                        phase_id: Date.now().toString(),
                        name: "",
                    },
                });
            }
        }
    }

    async upsertPhase() {
        await this.state.db.phase.upsert(this.state.localPhase);
    }

    render() {
        const { classes } = this.props;
        const { localPhase } = this.state;

        return localPhase ? (
            <div>
                <Dialog
                    open={this.props.open}
                    onClose={() => this.props.handleClose()}
                    aria-labelledby='form-dialog-title'
                    scroll='body'
                >
                    <DialogTitle id='form-dialog-title'>
                        Station hinzufügen / bearbeiten
                    </DialogTitle>
                    <DialogContent dividers>
                        <div className={classes.inputContent}>
                            <TextField
                                margin='dense'
                                id='name'
                                name='name'
                                Title
                                value={localPhase.name}
                                required={true}
                                onChange={(e) => {
                                    let localPhaseCopy = localPhase;
                                    localPhaseCopy.name = e.target.value;
                                    this.setState({
                                        localPhase: localPhaseCopy,
                                    });
                                }}
                                helperText='Name des Wertungsbogens'
                                label='Name'
                                type='text'
                                fullWidth
                                className={classes.inputContent}
                            />
                            <Divider className={classes.header} />
                            <Typography className={classes.header}>
                                Tanzklassen
                            </Typography>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                this.props.handleClose();
                            }}
                            color='secondary'
                            variant='contained'
                        >
                            abbrechen
                        </Button>
                        <Button
                            disabled={this.state.disabled}
                            onClick={() => {
                                this.upsertPhase();
                                this.props.handleClose();
                            }}
                            color='primary'
                            variant='contained'
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

PhaseDialog.propTypes = {
    /**
     * dialog open or closed
     */
    open: PropTypes.bool.isRequired,
    /**
     * function to close dialog
     */
    handleClose: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(withProps(PhaseDialog));
