export const FinalResultSchema = {
    title: "final result data",
    description: "Database schema for storing result information",
    version: 0,
    primaryKey: "resultId",
    type: "object",
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
        resultParts: {
            type: "array",
            items: {
                type: "object",
                properties: {
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
                    deduction: {
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
                },
            },
        },
        acroPoints: {
            type: "number",
        },
        basicPoints: {
            type: "number",
        },
        finalPoints: {
            type: "number",
        },
        roundDeductions: {
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
        state: {
            type: "string",
        },
    },
    required: ["bookId"],
};
