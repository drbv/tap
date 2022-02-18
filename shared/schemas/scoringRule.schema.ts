export const ScoringRuleSchema = {
  title: 'Schema for defininig scoringRules',
  description:
    'Database schema for storing definitions for evaluations that can be used in rounds',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true,
    },
    name: {
      type: 'string',
    },
    categories: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          min: {
            type: 'number',
          },
          max: {
            type: 'number',
          },
          step: {
            type: 'number',
          },
        },
      },
    },
    boni: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          value: {
            type: 'number',
          },
          limit: {
            type: 'number',
          },
          color: {
            type: 'string',
          },
        },
      },
    },
  },
};