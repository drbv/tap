import {TeamMember} from "./team-member.interface";

export interface Team {
    readonly book_id: string;
    readonly club_id: number;
    readonly club_name_short: string;
    readonly organization: string;
    readonly sport: string;
    league: string;
    members: TeamMember[];
}
