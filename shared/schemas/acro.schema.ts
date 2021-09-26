export const AcroSchema = {

    title: 'acro data',
    description: 'Database schema for storing acro information',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        // Nr#
        id: {
            type: 'string',
            final: true,
        },
        // Akrobatik
        acro_short_text: {
            type: 'string',
        },
        // Langtext
        acro_long_text: {
            type: 'string',
        },
        // Einstufung
        rating: {
            type: 'string',
        },
        points: {
            type: 'object',
            properties: {
                // RR_A
                rr_a: {
                    type: 'number',
                },
                // RR_B
                rr_b: {
                    type: 'number',
                },
                // RR_C
                rr_c: {
                    type: 'number',
                },
                // RR_J
                rr_j: {
                    type: 'number',
                },
                // RR_S
                rr_s: {
                    type: 'number',
                },
                // F_RR_M
                f_rr_m: {
                    type: 'number',
                },
                // F_RR_J
                f_rr_j: {
                    type: 'number',
                },
                // F_RR_LF
                f_rr_lf: {
                    type: 'number',
                },
                // F_RR_GF
                f_rr_gf: {
                    type: 'number',
                },
                // F_RR_ST
                f_rr_st: {
                    type: 'number',
                },
            }
        },
        group: {
            type: 'object',
            properties: {
                // Gruppen_ID_1
                id_1: {
                    type: 'number',
                },
                // Gruppen_ID_2
                id_2: {
                    type: 'number',
                },
                // Gruppen_ID_3
                id_3: {
                    type: 'number',
                },
                // Gruppen_ID_4
                id_4: {
                    type: 'number',
                },
                // Gruppen_ID_5
                id_5: {
                    type: 'number',
                },
            },
        },
        notice: {
            type: 'string',
        },
    },
    required: ['id', 'acro_short_text', 'acro_long_text', 'rating', 'points', 'group'],
}
