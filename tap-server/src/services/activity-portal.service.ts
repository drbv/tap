import config from "config";
import Papa, {ParseError, ParseResult} from "papaparse";
import * as https from "https";
import {UrlConfig} from "../interfaces/url-config.interface";
import {Constants} from "../models/constants.model";
import {Database} from "../database";
import {StartDataBwData} from "../../../shared/models/start-data-bw-data.model";
import {StartDataRrData} from "../../../shared/models/start-data-rr-data.model";
import {RxDatabaseBase} from "rxdb/dist/types/rx-database";
import {CollectionsOfDatabase, RxDatabaseGenerated} from "rxdb";
import {StartDataWrTlData} from "../../../shared/models/start-data-wr-tl-data.model";
import {BwLicense, License, RrLicense} from "../../../shared/interfaces/license.interface";
import {Offical} from "../../../shared/interfaces/offical.interface";
import {Team} from "../../../shared/interfaces/team.interface";
import {TeamMember} from "../../../shared/interfaces/team-member.interface";
import {FormationData} from "../../../shared/models/formation-data.model";
import {DrbvAcroData} from "../../../shared/models/drbv-acro-data.model";
import {StartDataAppointmentData} from "../../../shared/models/start-data-appointment-data.model";

export class ActivityPortalService {
    private db: RxDatabaseBase<any, any> & CollectionsOfDatabase & RxDatabaseGenerated<CollectionsOfDatabase>;

    public async fetchDataFromPortal(): Promise<void> {
        const urlConfigs: UrlConfig[] = config.get('urls');

        this.db = await Database.get();

        if (this.db === null) {
            console.error('cannot access database');
        }

        for (const urlConfig of urlConfigs) {
            try {
                switch (urlConfig.schema) {
                    case Constants.ACTIVITY_PORTAL_IMPORT_BW: {
                        const csvData = await this.fetchData<StartDataBwData>(urlConfig.url);
                        await this.importBwData(csvData);
                        break;
                    }
                    case Constants.ACTIVITY_PORTAL_IMPORT_RR: {
                        const csvData = await this.fetchData<StartDataRrData>(urlConfig.url);
                        await this.importRrData(csvData);
                        break;
                    }

                    case Constants.ACTIVITY_PORTAL_IMPORT_F: {
                        const csvData = await this.fetchData<FormationData>(urlConfig.url);
                        await this.importFormationData(csvData);
                        break;
                    }
                    case Constants.ACTIVITY_PORTAL_IMPORT_WR_TL: {
                        const csvData = await this.fetchData<StartDataWrTlData>(urlConfig.url);
                        await this.importWrTlData(csvData);
                        break;
                    }
                    case Constants.ACTIVITY_PORTAL_IMPORT_ACRO: {
                        const csvData = await this.fetchData<DrbvAcroData>(urlConfig.url);
                        await this.importAcroData(csvData);
                        break;
                    }
                    case Constants.ACTIVITY_PORTAL_IMPORT_APPOINTMENTS: {
                        const csvData = await this.fetchData<StartDataAppointmentData>(urlConfig.url);
                        await this.importAppointmentData(csvData);
                        break;
                    }

                    default: {
                        break;
                    }
                }
            } catch (e) {
                console.error(e);
            }
        }
    }

    private async fetchData<T>(url: string): Promise<T[]> {

        const streamHttp = await new Promise<any>((resolve, reject) =>
            https.get(url, (res) => {
                res.setEncoding('latin1')
                resolve(res);
            })
        );

        return new Promise((resolve, reject) => {

            Papa.parse(streamHttp, {
                header: true,
                dynamicTyping: true,
                transformHeader(header: string, index?: number): string {
                    if (header === 'Nr#') {
                        return 'Nr';
                    }
                    if (header === 'e-mail') {
                        return 'email';
                    }
                    if (header === 'Straße') {
                        return 'Strasse';
                    }
                    if (header === 'Einschränkungen') {
                        return 'Einschraenkungen';
                    }
                    return header;
                },
                complete(results: ParseResult<T>) {
                    resolve(results.data);
                },
                error(error) {
                    reject(error.message);
                }
            });
        });
    }

    private async importBwData(csvData: StartDataBwData[]) {
        const teams: Map<number, Team> = new Map<number, Team>();

        for (const row of csvData) {
            // concat teams
            if (teams.has(row.Buchnr)) {
                const team = teams.get(row.Buchnr);
                team.members.push({
                    member_id: row.RFID !== null ? row.RFID.toString() : this.fixRfidIsNull(row).toString(),
                } as TeamMember);
            } else {
                const team = {
                    book_id: row.Buchnr.toString(),
                    club_id: row.Clubnr,
                    club_name_short: row.Clubname_kurz,
                    organization: row.LRRVERB !== null ? row.LRRVERB : 'WRRC',
                    sport: 'bw',
                    members: [{member_id: row.RFID !== null ? row.RFID.toString() : this.fixRfidIsNull(row).toString(),}]
                } as Team;
                teams.set(row.Buchnr, team);
            }

            try {
                await this.db.athletes.upsert({
                    rfid: row.RFID !== null ? row.RFID.toString() : this.fixRfidIsNull(row).toString(),
                    book_id: row.Buchnr,
                    pre_name: row.Vorname,
                    family_name: row.Nachname,
                    birth_year: row.Geburtsjahr,
                    sex: row.Anrede === 'Herr' ? 'm' : 'w',
                    club_id: row.Clubnr,
                    club_name_short: row.Clubname_kurz,
                    organization: row.LRRVERB !== null ? row.LRRVERB : 'WRRC',
                    sport: 'bw'
                });
            } catch (e) {
                console.error(e);
            }
        }

        for (const team of teams.values()) {
            try {
                await this.db.teams.upsert({
                    book_id: team.book_id,
                    club_id: team.club_id,
                    club_name_short: team.club_name_short,
                    organization: team.organization,
                    sport: team.sport,
                    members: team.members,
                });
            } catch (e) {
                console.error(e);
            }
        }

        console.log('updated imported bw-start-data');
    }

    private async importRrData(csvData: StartDataRrData[]) {
        for (const row of csvData) {
            try {
                await this.db.athletes.upsert({
                    rfid: row.RFID1.toString(),
                    book_id: row.Buchnr,
                    pre_name: row.Vorname1,
                    family_name: row.Nachname1,
                    sex: row.Anrede1 === 'Herr' ? 'm' : 'w',
                    club_id: row.Clubnr,
                    club_name_short: row.Clubname_kurz,
                    organization: row.LRRVERB !== null ? row.LRRVERB : 'WRRC',
                    sport: 'rr'
                });
                await this.db.athletes.upsert({
                    rfid: row.RFID2.toString(),
                    book_id: row.Buchnr,
                    pre_name: row.Vorname2,
                    family_name: row.Nachname2,
                    sex: row.Anrede2 === 'Herr' ? 'm' : 'w',
                    club_id: row.Clubnr,
                    club_name_short: row.Clubname_kurz,
                    organization: row.LRRVERB !== null ? row.LRRVERB : 'WRRC',
                    sport: 'rr'
                });
                await this.db.teams.upsert({
                    book_id: row.Buchnr.toString(),
                    club_id: row.Clubnr,
                    club_name_short: row.Clubname_kurz,
                    organization: row.LRRVERB !== null ? row.LRRVERB : 'WRRC',
                    sport: 'rr',
                    league: row.Startklasse,
                    members: [{member_id: row.RFID1.toString()}, {member_id: row.RFID2.toString()}]
                });
            } catch (e) {
                console.error(e);
            }
        }
        console.log('updated imported rr-start-data');
    }

    private async importWrTlData(csvData: StartDataWrTlData[]) {
        const officials: Map<number, Offical> = new Map<number, Offical>();

        for (const row of csvData) {
            if (officials.has(row.Lizenzn)) {
                const official = officials.get(row.Lizenzn);
                this.parseLicense(row.Lizenz, official.licence);
            } else {
                const official = {
                    id: row.Lizenzn.toString(),
                    rfid: row.RFID,
                    pre_name: row.WVorname,
                    family_name: row.WName,
                    club_id: row.club,
                    licence: this.parseLicense(row.Lizenz),
                    email: row.email,
                    organization: row.LRRVERB,
                } as Offical;
                officials.set(row.Lizenzn, official);
            }
        }

        for (const official of officials.values()) {
            try {
                await this.db.officials.upsert({
                    id: official.id,
                    rfid: official.rfid,
                    pre_name: official.pre_name,
                    family_name: official.family_name,
                    club_id: official.club_id,
                    licence: official.licence,
                    email: official.email,
                    organization: official.organization,
                });
            } catch (e) {
                console.error(e);
            }
        }

        console.log('updated imported officials');
    }

    private fixRfidIsNull(row: StartDataBwData): number {
        return row.Anrede === 'Herr' ? (1000001 + (row.Buchnr * 10) - 1000000) : (1000002 + (row.Buchnr * 10) - 1000000);
    }

    private parseLicense(value: string, license?: License): License {
        if (license === undefined) {
            license = {
                tl: false,
                bw: {
                    wre: false,
                } as BwLicense,
                rr: {
                    wre: false,
                    wra: false
                } as RrLicense,
            } as License;
        }

        switch (value) {
            case 'TL': {
                license.tl = true;
                break;
            }
            case 'WRE-BW': {
                license.bw.wre = true;
                break;
            }
            case 'WRE-RR': {
                license.rr.wre = true;
                break;
            }
            case 'WRA-RR': {
                license.rr.wra = true;
                break;
            }
            default:
                break;
        }

        return license;
    }

    private async importFormationData(csvData: FormationData[]) {
        for (const row of csvData) {
            try {
                await this.db.teams.upsert({
                    book_id: row.Buchnume.toString(),
                    club_id: row.Clubnr,
                    club_name_short: row.Clubname_kurz,
                    organization: row.LRRVERB !== null ? row.LRRVERB : 'WRRC',
                    sport: row.Startklasse.includes('_RR_') ? 'rr' : 'bw',
                    league: row.Startklasse,
                });
            } catch (e) {
                console.error(e);
            }
        }

        console.log('updated imported formations');
    }

    private async importAcroData(csvData: DrbvAcroData[]) {
        for (const row of csvData) {
            try {
                await this.db.acros.upsert({
                    id: row.Nr,
                    acro_short_text: row.Akrobatik,
                    acro_long_text: row.Langtext,
                    rating: row.Einstufung,
                    points: {
                        rr_a: row.RR_A !== null ? Number(row.RR_A.replace(',', '.')) : undefined,
                        rr_b: row.RR_B !== null ? Number(row.RR_B.replace(',', '.')) : undefined,
                        rr_c: row.RR_C !== null ? Number(row.RR_C.replace(',', '.')) : undefined,
                        rr_j: row.RR_J !== null ? Number(row.RR_J.replace(',', '.')) : undefined,
                        rr_s: row.RR_S !== null ? Number(row.RR_S.replace(',', '.')) : undefined,
                        f_rr_m: row.F_RR_M !== null ? Number(row.F_RR_M.replace(',', '.')) : undefined,
                        f_rr_j: row.F_RR_J !== null ? Number(row.F_RR_J.replace(',', '.')) : undefined,
                        f_rr_lf: row.F_RR_LF !== null ? Number(row.F_RR_LF.replace(',', '.')) : undefined,
                        f_rr_gf: row.F_RR_GF !== null ? Number(row.F_RR_GF.replace(',', '.')) : undefined,
                        f_rr_st: row.F_RR_ST !== null ? Number(row.F_RR_ST.replace(',', '.')) : undefined,
                    },
                    group: {
                        id_1: row.Gruppen_ID_1 !== null ? row.Gruppen_ID_1 : undefined,
                        id_2: row.Gruppen_ID_2 !== null ? row.Gruppen_ID_2 : undefined,
                        id_3: row.Gruppen_ID_3 !== null ? row.Gruppen_ID_3 : undefined,
                        id_4: row.Gruppen_ID_4 !== null ? row.Gruppen_ID_4 : undefined,
                        id_5: row.Gruppen_ID_5 !== null ? row.Gruppen_ID_5 : undefined,
                    },
                    notice: row.Bemerkung !== null ? row.Bemerkung : undefined,
                });
            } catch (e) {
                console.error(e);
            }
        }

        console.log('updated imported acros');
    }

    private async importAppointmentData(csvData: StartDataAppointmentData[]) {
        for (const row of csvData) {
            try {
                await this.db.appointments.upsert({
                    appointment_id: row.Terminnummer.toString(),
                    date: row.Datum,
                    club_id: row.Mitgliedsnr,
                    club_name_short: row.Clubname_kurz,
                    series_name: row.Cup_Serie !== null ? row.Cup_Serie : undefined,
                    competition_name: row.Bezeichnung,
                    location: row.Raum,
                    city: row.Ort,
                    street: row.Strasse,
                    postal_code: row.PLZ,
                    begin_time: row.Beginn,
                    end_time: row.Ende,
                    competition_type: row.Wettbewerbsart !== null ? row.Wettbewerbsart : undefined,
                    league: row.Startklasse !== null ? row.Startklasse : undefined,
                    tl: row.Turnierleiter !== null ? row.Turnierleiter : undefined,
                    limitations: row.Einschraenkungen !== null ? row.Einschraenkungen : undefined,
                    contact_person: {
                        name: row.Ansprechpartner !== null ? row.Ansprechpartner : undefined,
                        phone: row.Tel_Ansprechpartner !== null ? row.Tel_Ansprechpartner : undefined,
                    },
                    begin_evening_event: row.Beginn_Abendveranstaltung !== null ? row.Beginn_Abendveranstaltung : undefined,
                });
            } catch (e) {
                console.error(e);
            }
        }

        console.log('updated imported appointments');
    }
}
