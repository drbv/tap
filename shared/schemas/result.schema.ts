export const ResultSchema = {
    title: 'result data',
    description: 'Database schema for storing result information',
    version: 0,
    primaryKey: 'resultId',
    type: 'object',
    properties: {
        resultId: {
            type: "string",
            final: true,
        },
        bookId: {
            type: "string",
        },
        roundId: {
            type: "string",
        },
        judgeId: {
            type: "string",
        },
        categories: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    name: {
                        type: "string",
                    },
                    value: {
                        type: "number",
                    },
                },
            },
        },
        boni: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    name: {
                        type: "string",
                    },
                    value: {
                        type: "number",
                    },
                    amount: {
                        type: "number",
                    },
                },
            },
        },
        ready: {
            type: "boolean",
        },
    },
    required: ['bookId'],
}