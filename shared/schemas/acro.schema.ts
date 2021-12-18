export const AcroSchema = {
    title: 'acro data',
    description: 'Database schema for storing acro information',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        // Nr#
        id: {
            type: 'string',
            final: true,
        },
        // Akrobatik
        acro_short_text: {
            type: 'string',
        },
        // Langtext
        acro_long_text: {
            type: 'string',
        },
        // Einstufung
        rating: {
            type: 'string',
        },
        points: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    key: {
                        type: 'string',
                    },
                    value: {
                        type: 'number',
                    },
                },
            },
        },
        group: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    key: {
                        type: 'string',
                    },
                    value: {
                        type: 'number',
                    },
                },
            },
        },
        notice: {
            type: 'string',
        },
    },
    required: [
        'id',
        'acro_short_text',
        'acro_long_text',
        'rating',
        'points',
        'group',
    ],
}
