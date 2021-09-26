export interface BwLicense {
    wre: boolean
}

export interface RrLicense {
    wre: boolean,
    wra: boolean
}

export interface License {
    readonly id: number,
    tl: boolean,
    rr: RrLicense,
    bw: BwLicense,
}
