export const RoundSchema = {
    title: "Schema for rounds",
    description: "Database schema for storing round information",
    version: 0,
    primaryKey: "round_id",
    type: "object",
    properties: {
        round_id: {
            type: "string",
            primary: true,
        },
        round_name: {
            type: "string",
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
                    },
                    status: {
                        type: "string",
                    },
                },
            }
        },
        evaluationTemplateId: {
            type: "string",
        },
        judgeIds: {
            type: "array",
            items: {
                type: "string",
            },
        },
        observerIds: {
            type: "array",
            items: {
                type: "string",
            },
        },
        status: {
            type: "string",
        },
    },
    required: ['round_id', 'round_name'],
}