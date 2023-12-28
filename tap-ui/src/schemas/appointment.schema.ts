export const AppointmentSchema = {

    title: 'appointment data',
    description: 'Database schema for storing competition appointments',
    version: 0,
    primaryKey: 'appointment_id',
    type: 'object',
    properties: {
        appointment_id: {
            type: 'string',
            final: true,
        },
        date: {
            type: 'string',
        },
        club_id: {
            type: 'number',
        },
        club_name_short: {
            type: 'string',
        },
        series_name: {
            type: 'string',
        },
        competition_name: {
            type: 'string',
        },
        location: {
            type: 'string',
        },
        city: {
            type: 'string',
        },
        street: {
            type: 'string',
        },
        postal_code: {
            type: 'number',
        },
        begin_time: {
            type: 'string',
        },
        end_time: {
            type: 'string',
        },
        competition_type: {
            type: 'string',
        },
        league: {
            type: 'string',
        },
        tl: {
            type: 'string',
        },
        limitations: {
            type: 'string',
        },
        contact_person: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                },
                phone: {
                    type: 'string',
                },
            }
        },
        begin_evening_event: {
            type: 'string',
        },
        // only set by server
        isActive: {
            type: 'boolean',
        },
        createState: {
            type: 'string',
            enum: ['UNUSED', 'TO_CREATE', 'CREATED'],
        }
    },
    required: ['appointment_id', 'date', 'club_id', 'club_name_short', 'competition_name', 'location'],
}
