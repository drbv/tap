import { JsonSchema, RxJsonSchema } from "rxdb";
import { Category } from "./category.schema";
import { RoundType } from "./roundType.schema";

export const FinalResult = {
  title: "FinalResult",
  description: "object for storing information collected from heatResults",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      final: true,
    },
    team_id: {
      type: "string",
    },
    heatType: RoundType,
    categories: {
      type: "array",
      items: Category,
    },
    generalPenalties: {},
    disqualification: {
      type: "boolean",
    },
  },
  required: ["id", "team_id", "heatType"],
};
