export const CurrentCompetitionSchema = {
    title: "current competition data",
    description: "Database schema for storing data about current competition",
    version: 0,
    primaryKey: "competition_id",
    type: "object",
    properties: {
        competition_id: {
            type: "string",
            final: true,
        },
    },
};
