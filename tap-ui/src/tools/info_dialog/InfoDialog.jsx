//HOC and utils
import React from 'react'
import { PropTypes } from 'prop-types'
import withStyles from '@material-ui/core/es/styles/withStyles'
//components and libraries
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Typography,
    Table,
    TableCell,
    TableBody,
    TableHead,
    TableRow,
} from '@material-ui/core'

const styles = (theme) => ({
    inputContent: {
        marginTop: 10,
    },
    inputSelect: {
        marginTop: 10,
        marginLeft: 10,
    },
    logo: {
        maxWidth: '60vw',
        maxHeight: '60vh',
        marginRight: 'auto',
        marginLeft: '0,5%',
        marginBottom: 20,
        marginTop: 20,
    },
})

class InfoDialog extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            open: this.props.open,
        }
    }

    render() {
        const { classes } = this.props
        return (
            <Dialog
                open={this.state.open}
                onClose={() => this.props.handleClose()}
                aria-labelledby="form-dialog-title"
                maxWidth="md"
                fullWidth={true}
                scroll="body"
            >
                <DialogContent>
                    <Table>
                        <TableHead>
                            <TableRow key={'header'}>
                                <TableCell align="left">software</TableCell>
                                <TableCell align="left">license</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>table body</TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            this.props.handleClose()
                        }}
                        color="primary"
                        variant="contained"
                    >
                        close
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

InfoDialog.propTypes = {
    /**
     * dialog open or closed
     */
    open: PropTypes.bool.isRequired,

    /**
     * handles closing of dialog
     */
    handleClose: PropTypes.func.isRequired,
}

export default withStyles(styles, { withTheme: true })(InfoDialog)
