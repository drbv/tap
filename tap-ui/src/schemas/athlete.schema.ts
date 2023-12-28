export const AthleteSchema = {
    title: "athlete data",
    description: "Database schema for storing athlete information",
    version: 0,
    primaryKey: "rfid",
    type: "object",
    properties: {
        rfid: {
            type: "string",
            final: true,
        },
        bookId: {
            type: "number",
        },
        pre_name: {
            type: "string",
        },
        family_name: {
            type: "string",
        },
        birth_year: {
            type: "number",
        },
        sex: {
            type: "string",
        },
        club_id: {
            type: "number",
        },
        club_name_short: {
            type: "string",
        },
        organization: {
            type: "string",
        },
        sport: {
            type: "string",
        },
    },
    required: [
        "rfid",
        "bookId",
        "pre_name",
        "family_name",
        "sex",
        "club_id",
        "club_name_short",
        "organization",
        "sport",
    ],
};
