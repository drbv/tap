import config from 'config'
import Papa, {NODE_STREAM_INPUT, ParseResult} from 'papaparse'
import {UrlConfig} from '../interfaces/url-config.interface'
import {Constants} from '../models/constants.model'
import {Database} from '../database'
import {StartDataBwData} from '../../../shared/models/start-data-bw-data.model'
import {StartDataRrData} from '../../../shared/models/start-data-rr-data.model'
import {RxDatabaseBase} from 'rxdb/dist/types/rx-database'
import {CollectionsOfDatabase, RxDatabase, RxDatabaseGenerated} from 'rxdb'
import {StartDataWrTlData} from '../../../shared/models/start-data-wr-tl-data.model'
import {BwLicense, License, RrLicense,} from '../../../shared/interfaces/license.interface'
import {Offical} from '../../../shared/interfaces/offical.interface'
import {Team} from '../../../shared/interfaces/team.interface'
import {TeamMember} from '../../../shared/interfaces/team-member.interface'
import {FormationData} from '../../../shared/models/formation-data.model'
import {DrbvAcroData} from '../../../shared/models/drbv-acro-data.model'
import {StartDataAppointmentData} from '../../../shared/models/start-data-appointment-data.model'
import {CompetitionData} from "../../../shared/models/competition-data.model";
import * as https from "https";

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

    public async fetchAppointmentDataFromPortal(id: string): Promise<void> {
        this.db = await Database.get();

        if (this.db === null) {
            console.error('cannot access database');
        }

        const database = await Database.createDatabase(id);

        const url = `https://drbv.de/cms/images/Download/TurnierProgramm/startlisten/${id}_Anmeldung.txt`;

        const csvData = await this.fetchData<CompetitionData>(url);
        await this.importActiveDb(database, csvData);
    }

    private async fetchData<T>(url: string): Promise<T[]> {

        const csvData = await new Promise<any>((resolve, reject) =>
            this.getData(url).then((res) => {
                console.log(res);
                resolve(res);
            })
        );

        return new Promise<T[]>((resolve, reject) => {

            const parseStream = Papa.parse<T>(csvData, {
                header: true,
                worker: false,
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
            });

            resolve(parseStream.data);
        });
    }

    private get(url: string, resolve: any, reject: any) {
        https.get(url, (res) => {
            // if any other status codes are returned, those needed to be added here
            if(res.statusCode === 301 || res.statusCode === 302) {
                return this.get(res.headers.location, resolve, reject)
            }

            res.setEncoding('latin1');

            let body: string = '';
            res.on('data', (chunk) => {
                body+= chunk;
            });

            res.on('end', () => {
                try {
                    resolve(body);
                } catch (err) {
                    reject(err);
                }
            });
        });
    }

    private async getData(url: string) {
        return new Promise((resolve, reject) => this.get(url, resolve, reject));
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
                    sport: 'bw',
                })
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
                    sport: 'rr',
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
                    sport: 'rr',
                });
                await this.db.teams.upsert({
                    book_id: row.Buchnr.toString(),
                    club_id: row.Clubnr,
                    club_name_short: row.Clubname_kurz,
                    organization: row.LRRVERB !== null ? row.LRRVERB : 'WRRC',
                    sport: 'rr',
                    league: row.Startklasse,
                    members: [
                        {member_id: row.RFID1.toString()},
                        {member_id: row.RFID2.toString()},
                    ],
                })
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
                const acroPoints: any[] = [];
                if (row.RR_A !== null) {
                    acroPoints.push({
                        key: 'rr_a',
                        value: Number(row.RR_A.replace(',', '.')),
                    });
                }
                if (row.RR_B !== null) {
                    acroPoints.push({
                        key: 'rr_b',
                        value: Number(row.RR_B.replace(',', '.')),
                    });
                }
                if (row.RR_C !== null) {
                    acroPoints.push({
                        key: 'rr_c',
                        value: Number(row.RR_C.replace(',', '.')),
                    });
                }
                if (row.RR_J !== null) {
                    acroPoints.push({
                        key: 'rr_j',
                        value: Number(row.RR_J.replace(',', '.')),
                    });
                }
                if (row.RR_S !== null) {
                    acroPoints.push({
                        key: 'rr_s',
                        value: Number(row.RR_S.replace(',', '.')),
                    });
                }
                if (row.F_RR_M !== null) {
                    acroPoints.push({
                        key: 'f_rr_m',
                        value: Number(row.F_RR_M.replace(',', '.')),
                    });
                }
                if (row.F_RR_J !== null) {
                    acroPoints.push({
                        key: 'f_rr_j',
                        value: Number(row.F_RR_J.replace(',', '.')),
                    });
                }
                if (row.F_RR_LF !== null) {
                    acroPoints.push({
                        key: 'f_rr_lf',
                        value: Number(row.F_RR_LF.replace(',', '.')),
                    });
                }
                if (row.F_RR_GF !== null) {
                    acroPoints.push({
                        key: 'f_rr_gf',
                        value: Number(row.F_RR_GF.replace(',', '.')),
                    });
                }
                if (row.F_RR_ST !== null) {
                    acroPoints.push({
                        key: 'f_rr_st',
                        value: Number(row.F_RR_ST.replace(',', '.')),
                    });
                }

                const acroGroups: any[] = [];
                if (row.Gruppen_ID_1 !== null) {
                    acroGroups.push({key: 'id_1', value: row.Gruppen_ID_1});
                }
                if (row.Gruppen_ID_2 !== null) {
                    acroGroups.push({key: 'id_2', value: row.Gruppen_ID_2});
                }
                if (row.Gruppen_ID_3 !== null) {
                    acroGroups.push({key: 'id_3', value: row.Gruppen_ID_3});
                }
                if (row.Gruppen_ID_4 !== null) {
                    acroGroups.push({key: 'id_4', value: row.Gruppen_ID_4});
                }
                if (row.Gruppen_ID_5 !== null) {
                    acroGroups.push({key: 'id_5', value: row.Gruppen_ID_5});
                }

                await this.db.acros.upsert({
                    id: row.Nr,
                    acro_short_text: row.Akrobatik,
                    acro_long_text: row.Langtext,
                    rating: row.Einstufung,
                    points: acroPoints,
                    group: acroGroups,
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
            if (!row) {
                console.log("Row is null")
            } else if (!row.Terminnummer) {
                console.log("Appointment_ID is null")
            } else {
                try {
                    await this.db.appointments.upsert({
                        appointment_id: row.Terminnummer.toString(),
                        date: row.Datum,
                        club_id: row.Mitgliedsnr,
                        club_name_short: row.Clubname_kurz,
                        series_name:
                            row.Cup_Serie !== null ? row.Cup_Serie : undefined,
                        competition_name: row.Bezeichnung,
                        location: row.Raum,
                        city: row.Ort,
                        street: row.Strasse,
                        postal_code: row.PLZ,
                        begin_time: row.Beginn,
                        end_time: row.Ende,
                        competition_type:
                            row.Wettbewerbsart !== null
                                ? row.Wettbewerbsart
                                : undefined,
                        league:
                            row.Startklasse !== null ? row.Startklasse : undefined,
                        tl:
                            row.Turnierleiter !== null
                                ? row.Turnierleiter
                                : undefined,
                        limitations:
                            row.Einschraenkungen !== null
                                ? row.Einschraenkungen
                                : undefined,
                        contact_person: {
                            name:
                                row.Ansprechpartner !== null
                                    ? row.Ansprechpartner
                                    : undefined,
                            phone:
                                row.Tel_Ansprechpartner !== null
                                    ? row.Tel_Ansprechpartner
                                    : undefined,
                        },
                        begin_evening_event:
                            row.Beginn_Abendveranstaltung !== null
                                ? row.Beginn_Abendveranstaltung
                                : undefined,
                    })
                } catch (e) {
                    console.error(e);
                }
            }
        }

        console.log('updated imported appointments');
    }

    private async importActiveDb(database: RxDatabase, csvData: CompetitionData[]) {
        if (database === null) {
            console.log("invalid collection");
            return;
        }
        for (const row of csvData) {
            try {
                await database.competition.upsert({
                    appointment_id: row.Turniernr,
                    series: row.Cup_Serie,
                    league: row.Startkl,
                    club_id: row.Verein_nr,
                    book_id: row.Startbuch,
                    team_member_count: row.Anz_Taenzer,
                    acros: [
                        {
                            round: 'VR',
                            acro: [
                                {
                                    acro_short_text: row.Akro1_VR,
                                    points: row.Wert1_VR,
                                },
                                {
                                    acro_short_text: row.Akro2_VR,
                                    points: row.Wert2_VR,
                                },
                                {
                                    acro_short_text: row.Akro3_VR,
                                    points: row.Wert3_VR,
                                },
                                {
                                    acro_short_text: row.Akro4_VR,
                                    points: row.Wert4_VR,
                                },
                                {
                                    acro_short_text: row.Akro5_VR,
                                    points: row.Wert5_VR,
                                },
                                {
                                    acro_short_text: row.Akro6_VR,
                                    points: row.Wert6_VR,
                                },
                                {
                                    acro_short_text: row.Akro7_VR,
                                    points: row.Wert7_VR,
                                },
                                {
                                    acro_short_text: row.Akro8_VR,
                                    points: row.Wert8_VR,
                                },
                            ],
                        },
                        {
                            name: 'ZR',
                            acros: [
                                {
                                    acro_short_text: row.Akro1_ZR,
                                    points: row.Wert1_ZR,
                                },
                                {
                                    acro_short_text: row.Akro2_ZR,
                                    points: row.Wert2_ZR,
                                },
                                {
                                    acro_short_text: row.Akro3_ZR,
                                    points: row.Wert3_ZR,
                                },
                                {
                                    acro_short_text: row.Akro4_ZR,
                                    points: row.Wert4_ZR,
                                },
                                {
                                    acro_short_text: row.Akro5_ZR,
                                    points: row.Wert5_ZR,
                                },
                                {
                                    acro_short_text: row.Akro6_ZR,
                                    points: row.Wert6_ZR,
                                },
                                {
                                    acro_short_text: row.Akro7_ZR,
                                    points: row.Wert7_ZR,
                                },
                                {
                                    acro_short_text: row.Akro8_ZR,
                                    points: row.Wert8_ZR,
                                },
                            ],
                        },
                        {
                            name: 'ER',
                            acros: [
                                {
                                    acro_short_text: row.Akro1_ER,
                                    points: row.Wert1_ER,
                                },
                                {
                                    acro_short_text: row.Akro2_ER,
                                    points: row.Wert2_ER,
                                },
                                {
                                    acro_short_text: row.Akro3_ER,
                                    points: row.Wert3_ER,
                                },
                                {
                                    acro_short_text: row.Akro4_ER,
                                    points: row.Wert4_ER,
                                },
                                {
                                    acro_short_text: row.Akro5_ER,
                                    points: row.Wert5_ER,
                                },
                                {
                                    acro_short_text: row.Akro6_ER,
                                    points: row.Wert6_ER,
                                },
                                {
                                    acro_short_text: row.Akro7_ER,
                                    points: row.Wert7_ER,
                                },
                                {
                                    acro_short_text: row.Akro8_ER,
                                    points: row.Wert8_ER,
                                },
                            ],
                        },
                    ],
                    replacement_acros: [
                        {
                            round: 'VR',
                            acro: [
                                {
                                    acro_short_text: row.E_Akro1_VR,
                                    points: row.E_Wert1_VR,
                                },
                                {
                                    acro_short_text: row.E_Akro2_VR,
                                    points: row.E_Wert2_VR,
                                },
                            ],
                        },
                        {
                            name: 'ZR',
                            acros: [
                                {
                                    acro_short_text: row.E_Akro1_ZR,
                                    points: row.E_Wert1_ZR,
                                },
                                {
                                    acro_short_text: row.E_Akro2_ZR,
                                    points: row.E_Wert2_ZR,
                                },
                            ],
                        },
                        {
                            name: 'ER',
                            acros: [
                                {
                                    acro_short_text: row.E_Akro1_ER,
                                    points: row.E_Wert1_ER,
                                },
                                {
                                    acro_short_text: row.E_Akro2_ER,
                                    points: row.E_Wert2_ER,
                                },
                            ],
                        },
                    ],
                    music: {
                        dance: row.Musik_FT,
                        acro: row.Musik_Akro,
                        team_preparation: row.Musik_Stell,
                        team_competition: row.Musik_Form,
                        team_ceremony: row.Musik_Sieg,
                        team_preparation_short: row.Musik_Stell_kurz,
                        team_competition_short: row.Musik_Form_kurz,
                        team_ceremony_short: row.Musik_Sieg_kurz,
                    }
                });
            } catch (e) {
                console.error(e);
            }
        }

        console.log('updated imported appointments');
    }
}
