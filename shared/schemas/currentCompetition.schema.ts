export const CurrentCompetitionSchema = {
    title: "current competition data",
    description: "Database schema for storing data about current competition",
    version: 0,
    primaryKey: "id",
    type: "object",
    properties: {
        id: {
            type: "string",
            final: true,
        },
        competition_id: {
            type: "string",
        },
    },
};
