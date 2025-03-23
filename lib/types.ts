type StringOrNull = string | null;
type NumberOrNull = number | null;

// Product item from catalog
export interface IProductItem {
    id: number,
    name: string,
    category_id: number,
    availability: string,
    date_on_stock: StringOrNull,
    low_stock_meters: StringOrNull,
    sort_order: 0 | 1,
    price: {
        price_1: StringOrNull,
        price_2: StringOrNull,
        price_3: StringOrNull,
        price_4: StringOrNull,
        price_5: StringOrNull,
        sale: StringOrNull,
        date_on_sale: StringOrNull,
        date_off_sale: StringOrNull
    },
    category: {
        id: number,
        name: string
    },
    images_url: Array<string | null>,
    technical_info: {
        name: string,
        blackout: StringOrNull,
        water_resistance: StringOrNull
        fabric_texture: StringOrNull,
        composition: StringOrNull,
        warranty: StringOrNull,
        roll_width: StringOrNull,
        tape_width: StringOrNull,
        collection: StringOrNull,
        transparency: StringOrNull,
        color: StringOrNull,
        description: StringOrNull,
        max_width: StringOrNull,
        max_height: StringOrNull,
        max_area: StringOrNull,
    }
}
// Product attributes
export interface ITechnicalInfo {
    darkness: StringOrNull,
    water_resistance: StringOrNull,
    fabric_texture: StringOrNull,
    composition: StringOrNull,
    warranty: StringOrNull,
    roll_width: StringOrNull,
    tape_width: StringOrNull,
    collection: StringOrNull,
    system: StringOrNull,
    transparency: StringOrNull,
    color: StringOrNull,
    description: StringOrNull,
}

export interface IColor {
    id: number,
    name: string,
}

export interface IDesign {
    id: number,
    name: string,
}

export interface ITransparencie {
    id: number,
    name: string,
}

export interface ICollection {
    id: number,
    name: string,
}

export interface ICategory {
    id: number,
    name: string,
}
// Filters
export interface IFilterOption {
    filter: string,
    title?: string,
    options: string[],
    multichoice: boolean
}