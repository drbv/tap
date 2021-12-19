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

class AcroData extends Component {
    constructor(props) {
        super(props)

        this.state = {
            Acros: null,
            tab: 0,
        }

        this.subs = []
    }

    async componentDidMount() {
        getBaseCollection('acros').then(async (collection) => {
            const sub = await collection.find().$.subscribe((Acros) => {
                if (!Acros) {
                    return
                }
                console.log('reload Acro-list')
                console.dir(Acros)
                this.setState({
                    Acros,
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
        const { Acros } = this.state
        return (
            <div>
                {Acros != null ? (
                    <MUIDataTable
                        className={classes.table}
                        data={Acros}
                        columns={[
                            {
                                name: 'id',
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                // Akrobatik
                                name: 'acro_short_text',
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                // Langtext
                                name: 'acro_long_text',
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                // Einstufung
                                name: 'rating',
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: 'points',
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: 'group',
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: 'notice',
                                options: {
                                    filter: false,
                                },
                            },
                        ]}
                        options={{
                            responsive: 'scrollFullHeight',
                            selectableRows: 'none',
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

export default withStyles(styles, { withTheme: true })(AcroData)
