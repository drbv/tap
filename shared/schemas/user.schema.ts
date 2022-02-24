export const UserSchema = {
  title: "Schema for users",
  description: "Database schema for storing user information",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
      id: {
          type: "string",
          primary: true,
      },
      name: {
          type: "string",
      },
      key: {
          type: "string",
      },
      role: {
          type: "string",
      },
  },
  required: ["id", "name", "key", "role"],
};