export const TeamSchema = {

    title: 'team data',
    description: 'Database schema for storing team information',
    version: 0,
    primaryKey: 'book_id',
    type: 'object',
    properties: {
        book_id: {
            type: 'string',
            final: true,
        },
        team_name: {
            type: 'string',
        },
        club_id: {
            type: 'number',
        },
        club_name_short: {
            type: 'string',
        },
        organization: {
            type: 'string',
        },
        sport: {
            type: 'string',
        },
        league: {
            type: 'string',
        },
        members: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    member_id: {
                        type: 'string',
                    },
                }
            }
        },
    },
    required: ['book_id', 'club_id', 'club_name_short', 'organization', 'sport', 'members'],
}
