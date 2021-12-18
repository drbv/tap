import React, { Component } from 'react'

import {
    withStyles,
    LinearProgress,
    Paper,
    Button,
    Tooltip,
    IconButton,
    Typography,
} from '@material-ui/core'
import MUIDataTable from 'mui-datatables'

import { getBaseCollection } from '../../Database'

const styles = (theme) => ({
    root: {
        padding: theme.spacing(2),
        margin: '11px',
    },
    table: {
        margin: '11px',
        marginBottom: '80px',
    },
})

class TeamData extends Component {
    constructor(props) {
        super(props)

        this.state = {
            Teams: null,
        }

        this.subs = []
    }

    async componentDidMount() {
        getBaseCollection('teams').then(async (collection) => {
            const sub = await collection.find().$.subscribe((Teams) => {
                if (!Teams) {
                    return
                }
                console.log('reload Team-list')
                console.dir(Teams)
                this.setState({
                    Teams,
                })
            })
            this.subs.push(sub)
        })
    }

    componentWillUnmount() {
        // Unsubscribe from all subscriptions
        this.subs.forEach((sub) => sub.unsubscribe)
    }

    render() {
        const { classes } = this.props
        const { Teams } = this.state
        return (
            <div>
                {Teams != null ? (
                    <MUIDataTable
                        className={classes.table}
                        data={Teams}
                        columns={[
                            {
                                name: 'appointment_id',
                                options: {
                                    filter: false,
                                },
                                name: 'location',
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                                name: 'isActive',
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                                name: 'createState',
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                            },
                        ]}
                        options={{
                            responsive: 'scrollFullHeight',
                            rowsPerPageOptions: [50, 100, 250],
                        }}
                    ></MUIDataTable>
                ) : (
                    <LinearProgress />
                )}
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(TeamData)
