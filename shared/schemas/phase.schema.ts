export const PhaseSchema = {
  title: 'phase data',
  description: 'Database schema for storing phase information',
  version: 0,
  primaryKey: 'phase_id',
  type: 'object',
  properties: {
      phase_id: {
          type: 'string',
          final: true,
      },
      phase_name: {
          type: 'string'
      },
      leagues: {
          type: 'array',
          items: {
            type: 'string',
          }
      }
  },
  required: ['phase_id'],
}