export const userSchema = {
  title: 'Schema for users',
  description: 'Database schema for storing user information',
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
    key: {
      type: 'string',
    },
    role: {
      type: 'string',
    },
  },
  required: ['id', 'name', 'key', 'role'],
};

export const stationSchema = {
  title: 'Schema for stations',
  description: 'Database schema for storing information about stations',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: 'true',
    },
    name: {
      type: 'string',
    },
  },
};

export const roundSetSchema = {
  title: 'Schema for set of rounds',
  description: 'Database schema for storing information about a set of rounds',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true,
    },
    class: {
      type: 'string',
    },
    stationId: {
      type: 'string',
    },
  },
};

export const evaluationSchema = {
  title: 'Schema for defininig evaluations',
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

export const roundSchema = {
  title: 'Schema for rounds',
  description: 'Database schema for storing round information',
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
    numberSubRounds: {
      type: 'number',
    },
    evaluationTemplateId: {
      type: 'string',
    },
    judgeIds: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    observerIds: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    status: {
      type: 'string',
    },
  },
  required: ['status'],
};

export const subRoundSchema = {
  title: 'Schema for rounds',
  description: 'Database schema for storing round information',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true,
    },
    roundId: {
      type: 'string',
    },
    number: {
      type: 'number',
    },
    coupleIds: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    status: {
      type: 'string',
    },
  },
  required: ['status'],
};

export const coupleSchema = {
  title: 'Schema for participants',
  description: 'Database schema for storing information about persons',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    class: {
      type: 'string',
    },
    number: {
      type: 'string',
    },
    nameOneFirst: {
      type: 'string',
    },
    nameOneSecond: {
      type: 'string',
    },
    nameTwoFirst: {
      type: 'string',
    },
    nameTwoSecond: {
      type: 'string',
    },
    clubNumber: {
      type: 'string',
    },
    clubName: {
      type: 'string',
    },
    coupleNumber: {
      type: 'string',
    },
  },
};

export const resultSchema = {
  title: 'Schema for results',
  description:
    'Database schema for storing information about results of couples',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true,
    },
    coupleId: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    roundId: {
      type: 'string',
    },
    judgeId: {
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
          value: {
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
          amount: {
            type: 'number',
          },
        },
      },
    },
    ready: {
      type: 'boolean',
    },
  },
};

//TODO: Check if Schemas are valid
