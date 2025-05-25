import { ICategory, IProductItem } from "./types";
import { capitalizeFirstLetter, formatImagePathFromApi, getAvailabilityStatus, getStringFromNumber } from "./utils";

export const BASE_URL = "https://api.piramidspace.com";


// !!!!!!!!  THERE IS CYRILLIC IN THE BACKEND ANSWER - result object !!!!!!!
export interface IUserInfo {
    логин: string;
    "Имя Фамилия": string;
    "условия сотрудничества": number;
    e_mail_1: string;
    "адрес доставки": string;
    "права дистрибьютера": number;
    организация: string;
    pay_order_dill: number;
    brand_dill: string;
    birthday_dill: string;
    okpo_dill: number;
    location_dill: string;
    cellphone_dill: string | null;
}

export async function getAuth(login: string, phoneNumber: string): Promise<IUserInfo | undefined> {
    try {
        const response = await fetch(`${BASE_URL}/api/cms/getDiler?user=${login}`)
        if (!response.ok) {
            throw new Error(`LOGIN ERROR! HTTP error! status: ${response.status} `);
        }
        const resultObject = await response.json() as IUserInfo;
        return resultObject;
    } catch (error) {
        console.error('Error auth!', error);
        return undefined;
    }
};

// GET Product list
export async function fetchProductsList(): Promise<IProductItem[]> {
    try {
        const response = await fetch(`${BASE_URL}/api/cms/jaluji/products`);
        if (!response.ok) {
            throw new Error(`PRODUCT LIST ERROR! HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        return data.map((item: any) => {
            const productItem: IProductItem = {
                id: item.id,
                name: item.name,
                category_id: item.category_id,
                availability: getAvailabilityStatus(item.availability),
                date_on_stock: item.date_on_stock,
                low_stock_meters: item.low_stock_meters,
                sort_order: item.sort_order,
                price: {
                    price_1: item.price.price_1,
                    price_2: item.price.price_2,
                    price_3: item.price.price_3,
                    price_4: item.price.price_4,
                    price_5: item.price.price_5,
                    sale: item.price.sale,
                    date_on_sale: item.price.date_on_sale,
                    date_off_sale: item.price.date_off_sale,

                },
                category: {
                    id: item.category.id,
                    name: item.category.name
                },
                images_url: [
                    item.image.image_url_1 ? formatImagePathFromApi(item.image.image_url_1) : null,
                    item.image.image_url_2 ? formatImagePathFromApi(item.image.image_url_2) : null,
                    item.image.image_url_3 ? formatImagePathFromApi(item.image.image_url_3) : null,
                    item.image.image_url_4 ? formatImagePathFromApi(item.image.image_url_4) : null,
                ],
                technical_info: {
                    name: item.technical_info.name,
                    blackout: item.technical_info.blackout,
                    water_resistance: item.technical_info.water_resistance,
                    fabric_texture: item.technical_info.fabric_texture,
                    composition: item.technical_info.composition,
                    warranty: item.technical_info.warranty,
                    roll_width: item.technical_info.roll_width ? getStringFromNumber(item.technical_info.roll_width) : null,
                    tape_width: item.technical_info.tape_width ? getStringFromNumber(item.technical_info.tape_width) : null,
                    collection: capitalizeFirstLetter(item.technical_info.collection),
                    transparency: capitalizeFirstLetter(item.technical_info.transparency),
                    color: capitalizeFirstLetter(item.technical_info.color),
                    description: item.technical_info.description,
                    max_width: item.technical_info.max_width,
                    max_height: item.technical_info.max_height,
                    max_area: item.technical_info.max_area,
                }
            };

            return productItem;
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

export async function fetchProductItem(productId: string | number): Promise<Omit<IProductItem, 'price'> | null> {
    try {
        const response = await fetch(`${BASE_URL}/api/cms/jaluji/products/${productId}`);
        if (!response.ok) {
            throw new Error(`PRODUCT ITEM ERROR! HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        return {
            id: data.id,
            name: data.name,
            category_id: data.category_id,
            availability: getAvailabilityStatus(data.availability),
            date_on_stock: data.date_on_stock,
            low_stock_meters: data.low_stock_meters,
            sort_order: data.sort_order,
            category: {
                id: data.category.id,
                name: data.category.name
            },
            images_url: [
                data.image.image_url_1 ? formatImagePathFromApi(data.image.image_url_1) : null,
                data.image.image_url_2 ? formatImagePathFromApi(data.image.image_url_2) : null,
                data.image.image_url_3 ? formatImagePathFromApi(data.image.image_url_3) : null,
                data.image.image_url_4 ? formatImagePathFromApi(data.image.image_url_4) : null,
            ],
            technical_info: {
                name: data.technical_info.name,
                blackout: data.technical_info.blackout,
                water_resistance: data.technical_info.water_resistance,
                fabric_texture: data.technical_info.fabric_texture,
                composition: data.technical_info.composition,
                warranty: data.technical_info.warranty,
                roll_width: data.technical_info.roll_width ? getStringFromNumber(data.technical_info.roll_width) : null,
                tape_width: data.technical_info.tape_width ? getStringFromNumber(data.technical_info.tape_width) : null,
                collection: capitalizeFirstLetter(data.technical_info.collection),
                transparency: capitalizeFirstLetter(data.technical_info.transparency),
                color: capitalizeFirstLetter(data.technical_info.color),
                description: data.technical_info.description,
                max_width: data.technical_info.max_width,
                max_height: data.technical_info.max_height,
                max_area: data.technical_info.max_area,
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);

        return null;
    }
};

// Categories
export async function fetchCategories(): Promise<ICategory[]> {
    try {
        const response = await fetch(`${BASE_URL}/api/cms/jaluji/categories`);
        if (!response.ok) {
            throw new Error(`CATEGORIES ERROR! HTTP error! status: ${response.status} `);
        }
        const data = await response.json();
        return data.map((item: any) => ({
            id: item.id,
            name: item.name
        }))
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};


// Get the current exchange rate (dollars)
// !!!!!!!!  THERE IS CYRILLIC IN THE BACKEND ANSWER - result object !!!!!!!
interface IRateObject {
    дата: string,
    наименование: string,
    "курс, грн.": string
}

export async function getExchangeDollarRate() {
    try {
        const response = await fetch(`${BASE_URL}/api/cms/getCourse`);
        if (!response.ok) {
            throw new Error(`Exchange Dollar ERROR! HTTP error! status: ${response.status} `);
        }
        const rateObject = await response.json() as IRateObject; // IMPORTANT ↓↓↓↓
        // ↓↓↓ THE OBJECT HAS THE APPROACH ↓↓↓
        // { "дата": "2025-05-15",
        //   "наименование": "доллар",
        //   "курс, грн.": "41.60"
        // }
        return rateObject["курс, грн."]
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}


// Get the balance by login
// !!!!!!!!  THERE IS CYRILLIC IN THE BACKEND ANSWER - result object !!!!!!!
interface IBalanceObject {
    логин: string,
    "баланс, дол.": number
}

export async function getBalanceByLogin(login: string) {
    try {
        const response = await fetch(`${BASE_URL}/api/cms/getBalance?login=${login}`);
        if (!response.ok) {
            throw new Error(`Get Balance ERROR! HTTP error! status: ${response.status} `);
        }
        const balanceObject = await response.json() as IBalanceObject; // IMPORTANT ↓↓↓↓
        // ↓↓↓ THE OBJECT HAS THE APPROACH ↓↓↓
        // {
        //   "логин": "test@test",
        //   "баланс, дол.": -115.93
        // }
        return balanceObject["баланс, дол."];
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}