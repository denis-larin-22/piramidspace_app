import { BASE_URL } from "./base-url";

// !!!!!!!!  THERE IS CYRILLIC IN THE BACKEND ANSWER - result object !!!!!!!
export interface ISeller {
    "логин дилера": string;
    "фамилия продавца": string;
    "имя продавца": string;
    "отчество продавца": string;
    "логин продавца": string;
    "пароль продавца": string;
    "активен": string;
    "почта": string;
    "телефон": string;
    "статус": string;
    "1c": number;
}

export interface IOrder {
    "N_заказа": number;
    IP: string | null;
    "дата_заказа": string;
    "дата готовности": string | null;
    "пользователь": string;
    "вид заказа": string;
    "площадь, м.кв.": number;
    "сумма": number;
    "Сумма розница": number | null;
    "статус": string;
    "статус оплати": string | null;
    "комментарий": string;
    "ТТН перевозчика": string | null;
    "адрес доставки": string | null;
    "менеджер": string | null;
    "комментарий менеджера": string;
    "розничная сумма": number | null;
    "заказчик розница": string | null;
    "тел розница": string | null;
    "замер доставка установка розница": string | null;
    "ВидАдресаВЗаказе": string | null;
    "1c": string | number | null;
    "скидка": string;
    "предопл": number | null;
    "блок": string | null;
    sale_diler: number;
    seller: ISeller;
};

export async function fetchOrders(dealerLogin: string): Promise<IOrder[] | []> {
    const encodedLogin = encodeURIComponent(dealerLogin);
    const url = `${BASE_URL}/api/cms/getOrders?dealer_login=${encodedLogin}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            console.error(`ORDERS ERROR! HTTP error: ${response.status} ${response.statusText}`);
            return [];
        }

        const data = await response.json();
        return data as IOrder[];
    } catch (error) {
        console.error("An error occurred while fetching orders:", error);
        return [];
    }
};


//////////////////////////////////////////////////////////
// main groups codes
export type MainGroupsCode = 'day' | 'roller' | 'horizontal' | 'vertical' | 'components' | 'ads';

interface IProductGroupsStructureResponse {
    success: boolean,
    groups: IGroup[]
}

export interface IGroup {
    code: string,
    name: string,
    subgroups: Array<ISubgroup>
}

export interface ISubgroup {
    code: string,
    name: string
}

// get all subgroups (by group)
export async function getGroupsStructure(groupCode: MainGroupsCode): Promise<IProductGroupsStructureResponse | null> {
    try {
        const response = await fetch(`${BASE_URL}/api/piramid/product-groups?group=${groupCode}`);

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
    fixation: IFixationType[]
}

export interface IFixationType {
    name: string,
    category: number,
    presence: string,
    unit: string
}

export interface IProductsAndParams {
    products: IProductByCodes[],
    control: string[],
    colors: string[]
}

export async function getStructureProductsGroupByCodes(groupCode: MainGroupsCode, subgroupCode: string): Promise<IProductsAndParams | null> {
    try {
        const response = await fetch(`${BASE_URL}/api/piramid/products?group=${groupCode}&subgroup=${subgroupCode}`);

        if (!response.ok) {
            console.error(`GETTING PRODUCTS BY GROUP AND SUBGROUP CODES ERROR! HTTP error: ${response.status} ${response.statusText}`);
            return null;
        }

        const data = await response.json() as IProductsByCodesResponse;

        if (data.groups.length === 0 || data.groups[0].subgroups.length === 0) {
            return null;
        }
        return {
            products: data.groups[0].subgroups[0].products ?? [],
            colors: data.groups[0].subgroups[0].colors,
            control: data.groups[0].subgroups[0].control
        };
    } catch (error) {
        console.error("An error occurred while fetching products by group and subgroup codes:", error);
        return null;
    }
}





