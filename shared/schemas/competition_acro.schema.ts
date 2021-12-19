export const CompetitionSchema = {

    title: 'competition data',
    description: 'Database schema for one competition',
    version: 0,
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
}
