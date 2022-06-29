export const ScoringRuleSchema = {
  title: "Schema for defininig scoringRules",
  description:
    "Database schema for storing definitions for evaluations that can be used in rounds",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      final: true,
    },
    rounds: {
      type: "object",
      properties: {
        qualifying: { type: "boolean" },
        intermediate: { type: "boolean" },
        semifinals: { type: "boolean" },
        finals: { type: "boolean" },
      },
    },
    acrobatic: {
      type: "boolean",
    },
    league: {
      type: "string",
    },
    categories: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          min: {
            type: "number",
          },
          max: {
            type: "number",
          },
          step: {
            type: "number",
          },
        },
      },
    },
    deduction: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          value: {
            type: "number",
          },
          limit: {
            type: "number",
          },
          color: {
            type: "string",
          },
        },
      },
    },
    bonus: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          value: {
            type: "number",
          },
          limit: {
            type: "number",
          },
          color: {
            type: "string",
          },
        },
      },
    },
  },
  required: ["id", "rounds", "league", "acrobatic"],
};
