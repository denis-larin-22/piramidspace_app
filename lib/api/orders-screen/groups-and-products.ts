import { BASE_URL } from "../base-url";

//////////////////////////////////////////////////////////
// main groups codes
export type MainGroupsCode = 'day' | 'roller' | 'horizontal' | 'vertical' | 'components' | 'ads';

export interface IProductGroupsStructureResponse {
    success: boolean,
    groups: IGroup[]
}

export interface IGroup {
    code: string,
    name: string,
    subgroups: ISubgroup[]
}

export interface ISubgroup {
    code: string;
    name: string;
    fixations: Fixation[];
    control: string[];
    colors: Record<string, ColorPrice[]> | string[];
    nacenki: Nacenka[];
    nacenkiTkaniCat: NacenkaTkaniCat[];
    tkani: Tkan[];
    options: Record<string, OptionPrice[]> | string[];
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

export interface OptionPrice {
    width: string;
    price: string;
}

export interface Nacenka {
    price_step: string;
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

// ----------------------- API ----------------------- //

// get all subgroups (by group)
export async function getGroupsStructure(groupCode: MainGroupsCode, login: string): Promise<IProductGroupsStructureResponse | null> {
    try {
        const response = await fetch(`${BASE_URL}/api/piramid/product-groups?login=${login}&group=${groupCode}`);

        if (!response.ok) {
            console.error(`GETTING SUBGROUPS ERROR! HTTP error: ${response.status} ${response.statusText}`);
            return null;
        }

        const data = await response.json() as IProductGroupsStructureResponse;
        return data;
    } catch (error) {
        console.error("An error occurred while fetching subgroups:", error);
        return null;
    }
};

//  get products list by group code and subgroupcode params
interface IProductsByCodesResponse {
    success: boolean,
    groups: ISelectedGroup[]
}

export interface ISelectedGroup {
    code: MainGroupsCode,
    name: string,
    subgroups: ISelectedSubgroup[]
}

export interface ISelectedSubgroup {
    code: string,
    name: string,
    products: IProductByCodes[],
    control: string[],
    colors: string[]
}

export interface IProductByCodes {
    code: string,
    name: string,
    price: number,
    presence: string,
    sale_tk: boolean,
    w_max: number,
    h_max: number,
    square_max: number,
    category_fabric: number,
}

export interface IFixationType {
    name: string,
    presence: string,
    unit: string
}

export async function getProductsByGroupCodes(groupCode: MainGroupsCode, subgroupCode: string, login: string): Promise<IProductByCodes[] | null> {
    try {
        const response = await fetch(`${BASE_URL}/api/piramid/products?group=${groupCode}&subgroup=${subgroupCode}&login=${login}`);

        if (!response.ok) {
            console.error(`GETTING PRODUCTS BY GROUP AND SUBGROUP CODES ERROR! HTTP error: ${response.status} ${response.statusText}`);
            return null;
        }

        const data = await response.json() as IProductsByCodesResponse;

        if (data.groups.length === 0 || data.groups[0].subgroups.length === 0) {
            return null;
        }
        return data.groups[0].subgroups[0].products ?? [];
    } catch (error) {
        console.error("An error occurred while fetching products by group and subgroup codes:", error);
        return null;
    }
}