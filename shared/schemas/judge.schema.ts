import { JsonSchema, RxJsonSchema } from "rxdb";
import JudgeRole from "../enums/judgeRole";
import { Qualification } from "../enums/qualification";

export const Judge = {
  title: "Judge",
  description: "judge object",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      final: true,
    },
    name: {
      type: "string",
    },
    club: {
      type: "string",
    },
    qualification: {
      type: "string",
      enum: Object.values(Qualification),
    },
    role: {
      type: "string",
      enum: Object.values(JudgeRole),
    },
  },
  required: ["id", "name", "club"],
};
