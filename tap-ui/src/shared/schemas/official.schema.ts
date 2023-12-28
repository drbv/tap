export const OfficialSchema = {

    title: 'officials data',
    description: 'Database schema for storing officials information',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            final: true,
        },
        rfid: {
            type: 'number',
        },
        pre_name: {
            type: 'string',
        },
        family_name: {
            type: 'string',
        },
        club_id: {
            type: 'number',
        },
        licence: {
            type: 'object',
            properties: {
                tl: {
                    type: 'boolean',
                },
                rr: {
                    type: 'object',
                    properties: {
                        wre: {
                            type: 'boolean',
                        },
                        wra: {
                            type: 'boolean',
                        },
                    },
                },
                bw: {
                    type: 'object',
                    properties: {
                        wre: {
                            type: 'boolean',
                        },
                    }
                },
            }
        },
        email: {
            type: 'string',
        },
        organization: {
            type: 'string',
        },
    },
    required: ['id', 'pre_name', 'family_name', 'club_id', 'licence', 'email', 'organization'],
}
