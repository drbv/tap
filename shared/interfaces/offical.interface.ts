import {License} from "./license.interface";

export interface Offical {
    readonly id: string;
    readonly rfid: number;
    readonly pre_name: string;
    readonly family_name: string;
    readonly club_id: number;
    readonly licence: License;
    readonly email: string;
    readonly organization: string;
}
