// ----------------------- DAY_NIGHT & ROLLER groups ------------------------------- //
export interface ISubgroupDayNightAndRoller {
    code: string;
    name: string;
    fixations: Fixation[];
    control: string[];
    colors: Record<string, ColorPrice[]> | string[];
    nacenki: Nacenka[];
    nacenkiTkaniCat: NacenkaTkaniCat[];
    tkani: Tkan[];
    options: any[];
}

export interface Fixation {
    name: string;
    unit: string;
    price: number;
}

export interface ColorPrice {
    width: number;
    price: string;
}

export interface Nacenka {
    price_step: string;          // строки вместо number
    step_height: string;
    min_height_calculate: string;
}

export interface NacenkaTkaniCat {
    category_id: number;
    category_price: string;
}

export interface Tkan {
    name: string;
    short_name: string;
    category_id: number;
    unit: string;
    price: number;
    max_width: number;
    max_height: number;
    max_area: number;
}

export interface OptionPrice {
    width: string;
    price: string;
}