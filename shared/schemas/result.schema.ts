export const ResultSchema = {
    title: 'result data',
    description: 'Database schema for storing result information',
    version: 0,
    primaryKey: 'book_id',
    type: 'object',
    properties: {
        book_id: {
            type: 'string',
            final: true,
        },
    },
    required: ['book_id'],
}