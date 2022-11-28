export const Category = {
    title: "Category",
    description: "single category of a result",
    version: 0,
    primaryKey: "identifier",
    type: "object",
    properties: {
        identifier: {
            type: "string",
            final: true,
        },
        value: {
            type: "number",
        },
        penalties: {},
    },
    required: ["identifier", "value"],
};
