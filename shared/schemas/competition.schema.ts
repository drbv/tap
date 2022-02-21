export const CompetitionSchema = {

    title: 'competition data',
    description: 'Database schema for one competition',
    version: 0,
    primaryKey: 'competition_id',
    type: 'object',
    properties: {
        competition_id: {
            type: 'string',
            finally: true
        },
        appointment_id: {
            type: 'string',
        },
        series: {
            type: 'string',
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
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                acro_short_text: {
                                    type: 'string',
                                },
                                points: {
                                    type: 'number',
                                },
                            }
                        }
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
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                acro_short_text: {
                                    type: 'string',
                                },
                                points: {
                                    type: 'number',
                                },
                            }
                        }
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
    required: ['competition_id'],
}
