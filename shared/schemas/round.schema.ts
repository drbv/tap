export const RoundSchema = {
    title: "Schema for rounds",
    description: "Database schema for storing round information",
    version: 0,
    primaryKey: "roundId",
    type: "object",
    properties: {
        roundId: {
            type: "string",
            final: true,
        },
        roundName: {
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
    required: ['roundId', 'roundName'],
}