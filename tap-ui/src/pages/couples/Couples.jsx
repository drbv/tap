import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import MUIDataTable from 'mui-datatables'
import {
    LinearProgress,
    Paper,
    Button,
    Tooltip,
    IconButton,
} from '@material-ui/core'
import { Edit, Delete } from '@material-ui/icons'
import withStyles from '@material-ui/core/es/styles/withStyles'

import { isRxDatabase, isRxCollection } from 'rxdb'

import withProps from '../../components/HOC'
import * as Database from '../../Database'
import CoupleDialog from './CoupleDialog'

const styles = (theme) => ({
    root: {
        flexGrow: 1,
        padding: 30,
    },
    table: {
        margin: '11px',
        marginBottom: '80px',
    },
    newCoupleField: {
        margin: '11px',
    },
    newCoupleButton: {
        margin: 10,
    },
})

class Couples extends Component {
    constructor(props) {
        super(props)

        this.state = {
            newCoupleOpen: false,
            coupleToEdit: null,
            couples: null,
        }

        this.subs = []
    }

    async componentDidMount() {
        this.setState({ db: await Database.getClientDb() })

        const sub = await this.state.db.couples
            .find()
            .$.subscribe((couples) => {
                if (!couples) {
                    return
                }
                console.log('reload couples-list ')
                console.dir(couples)
                this.setState({
                    couples,
                })
            })
        this.subs.push(sub)
    }

    componentWillUnmount() {
        // Unsubscribe from all subscriptions
        this.subs.forEach((sub) => sub.unsubscribe())
    }

    async deleteCouple(id) {
        await this.state.db.couples
            .findOne({
                selector: {
                    id: id,
                },
            })
            .remove()
    }

    render() {
        const { classes } = this.props
        const { couples, newCoupleOpen, coupleToEdit } = this.state

        return (
            <div>
                <Paper className={classes.newCoupleField}>
                    <Button
                        className={classes.newCoupleButton}
                        color="inherit"
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                            this.setState({ newCoupleOpen: true })
                        }}
                    >
                        Tanzpaar hinzufügen
                    </Button>
                    <Button
                        className={classes.newCoupleButton}
                        color="inherit"
                        variant="outlined"
                        color="primary"
                    >
                        Tanzpaare importieren
                    </Button>
                </Paper>
                <CoupleDialog
                    open={newCoupleOpen}
                    coupleToEdit={coupleToEdit}
                    handleClose={() =>
                        this.setState({
                            newCoupleOpen: false,
                            coupleToEdit: null,
                        })
                    }
                />
                {couples != null ? (
                    <MUIDataTable
                        className={classes.table}
                        data={couples}
                        columns={[
                            {
                                name: 'id',
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: 'class',
                                options: {
                                    filter: true,
                                    sort: true,
                                },
                            },
                            {
                                name: 'number',
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                            },
                            {
                                name: 'nameOneFirst',
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                            },
                            {
                                name: 'nameOneSecond',
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                            },
                            {
                                name: 'nameTwoFirst',
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                            },
                            {
                                name: 'nameTwoSecond',
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                            },
                            {
                                name: 'clubNumber',
                                options: {
                                    excluded: true,
                                    sort: true,
                                },
                            },
                            {
                                name: 'clubName',
                                options: {
                                    excluded: true,
                                    sort: true,
                                },
                            },
                            {
                                name: 'coupleNumber',
                                options: {
                                    sort: true,
                                },
                            },
                            {
                                name: 'Aktionen',
                                options: {
                                    sort: false,
                                    customBodyRender: (
                                        value,
                                        tableMeta,
                                        updateValue
                                    ) => {
                                        if (tableMeta.rowData != null) {
                                            return (
                                                <div>
                                                    <Tooltip title="Bearbeiten">
                                                        <span>
                                                            <IconButton
                                                                onClick={() => {
                                                                    this.setState(
                                                                        {
                                                                            newCoupleOpen:
                                                                                !newCoupleOpen,
                                                                            coupleToEdit:
                                                                                {
                                                                                    id: tableMeta
                                                                                        .rowData[0],
                                                                                    class: tableMeta
                                                                                        .rowData[1],
                                                                                    number: tableMeta
                                                                                        .rowData[2],
                                                                                    nameOneFirst:
                                                                                        tableMeta
                                                                                            .rowData[3],
                                                                                    nameOneSecond:
                                                                                        tableMeta
                                                                                            .rowData[4],
                                                                                    nameTwoFirst:
                                                                                        tableMeta
                                                                                            .rowData[5],
                                                                                    nameTwoSecond:
                                                                                        tableMeta
                                                                                            .rowData[6],
                                                                                    clubNumber:
                                                                                        tableMeta
                                                                                            .rowData[7],
                                                                                    clubName:
                                                                                        tableMeta
                                                                                            .rowData[8],
                                                                                    coupleNumber:
                                                                                        tableMeta
                                                                                            .rowData[9],
                                                                                },
                                                                        }
                                                                    )
                                                                }}
                                                            >
                                                                <Edit />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                    <Tooltip title="Entfernen">
                                                        <span>
                                                            <IconButton
                                                                onClick={() => {
                                                                    this.deleteCouple(
                                                                        tableMeta
                                                                            .rowData[0]
                                                                    )
                                                                }}
                                                            >
                                                                <Delete />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                </div>
                                            )
                                        }
                                    },
                                },
                            },
                        ]}
                        options={{
                            responsive: 'scrollFullHeight',
                            filter: false,
                            print: false,
                            selectableRows: 'none',
                            rowsPerPageOptions: [10, 25, 50, 100, 250],
                        }}
                    />
                ) : (
                    <LinearProgress />
                )}
            </div>
        )
    }
}

// Specifies the default values for props:
Couples.defaultProps = {
    routes: {
        routes: [
            {
                name: 'default',
                path: '/couples',
                exact: true,
                component: <LinearProgress />,
                admin: false,
                icon: null,
                hide: true,
            },
        ],
    },
}

export default withStyles(styles, { withTheme: true })(
    withRouter(withProps(Couples))
)
