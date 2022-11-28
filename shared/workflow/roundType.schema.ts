import { DanceClass } from "../enums/danceClass";
import { HeatLevel } from "../enums/heatLevel";
import { HeatType } from "../enums/heatType";

export const RoundType = {
    title: "RoundType",
    description: "settings to prepare a round object",
    version: 0,
    primaryKey: "id",
    type: "object",
    properties: {
        id: {
            type: "string",
            final: true,
        },
        type: {
            type: "string",
            enum: HeatType,
        },
        level: {
            type: "string",
            enum: HeatLevel,
        },
        class: {
            type: "string",
            enum: DanceClass,
        },
    },
    required: ["id", "judge_id", "heat_id", "state"],
};
