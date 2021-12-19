export const CompetitionSchema = {

    title: 'competition data',
    description: 'Database schema for one competition',
    version: 0,
    primaryKey: 'appointment_id',
    type: 'object',
    properties: {
        appointment_id: {
            type: 'string',
            final: true,
        },
        series: {
            type: 'boolean',
        },
        league: {
            type: 'string',
        },
        club_id: {
            type: 'string',
        },
        book_id: {
            type: 'string',
        },
        team_member_count: {
            type: 'number',
        },
        acros: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    round: {
                        type: 'string',
                    },
                    acro: {
                        ref: 'CompetitionAcroSchema',
                        type: 'string',
                    },
                }
            }
        },
        replacement_acros: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    round: {
                        type: 'string',
                    },
                    acro: {
                        ref: 'CompetitionAcroSchema',
                        type: 'string',
                    },
                }
            }
        },
        music: {
            type: 'object',
            properties: {
                dance: {
                    type: 'string',
                },
                acro: {
                    type: 'string',
                },
                team_preparation: {
                    type: 'string',
                },
                team_competition: {
                    type: 'string',
                },
                team_ceremony: {
                    type: 'string',
                },
                team_preparation_short: {
                    type: 'string',
                },
                team_competition_short: {
                    type: 'string',
                },
                team_ceremony_short: {
                    type: 'string',
                },
            }
        },
    },
    required: ['appointment_id', 'league', 'club_id', 'book_id'],
}
