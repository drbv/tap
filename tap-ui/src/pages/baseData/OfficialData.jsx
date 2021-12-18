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

class OfficialData extends Component {
    constructor(props) {
        super(props)

        this.state = {
            Officials: null,
        }

        this.subs = []
    }

    async componentDidMount() {
        getBaseCollection('officials').then(async (collection) => {
            const sub = await collection.find().$.subscribe((Officials) => {
                if (!Officials) {
                    return
                }
                console.log('reload Official-list')
                console.dir(Officials)
                this.setState({
                    Officials,
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
        const { Officials } = this.state
        return (
            <div>
                {Officials != null ? (
                    <MUIDataTable
                        className={classes.table}
                        data={Officials}
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

export default withStyles(styles, { withTheme: true })(OfficialData)
