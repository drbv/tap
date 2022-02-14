export const RoundSchema = {
    title: 'rounds data',
    description: 'Database schema for storing round information',
    version: 0,
    primaryKey: 'round_id',
    type: 'object',
    properties: {
        round_id: {
            type: 'string',
            final: true,
        },
        round_name: {
            type: 'string',
        },
        subrounds: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    participants: {
                        type: 'array',
                        items: {
                            type: 'string',
                        }
                    }
                },
            }
        },
        begin_time: {
            type: 'string',
        },
    },
    required: ['round_id', 'round_name', 'begin_time'],
}