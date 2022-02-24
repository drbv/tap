export const ResultSchema = {
    title: 'result data',
    description: 'Database schema for storing result information',
    version: 0,
    primaryKey: 'book_id',
    type: 'object',
    properties: {
        book_id: {
            type: "string",
            primary: true,
        },
        round_id: {
            type: "string",
        },
        judge_id: {
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
    required: ['book_id'],
}