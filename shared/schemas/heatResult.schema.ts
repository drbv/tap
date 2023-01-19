import { JsonSchema, RxJsonSchema } from "rxdb";
import { Category } from "./category.schema";
import { RoundType } from "./roundType.schema";

export const HeatResult = {
    title: "HeatResult",
    description: "object for storing points",
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
        judge_id: {
            type: "string",
        },
        heat_type: RoundType,
        categories: {
            type: "array",
            items: Category,
        },
    },
    required: ["id", "team_id", "judge_id", "heat_type"],
};
