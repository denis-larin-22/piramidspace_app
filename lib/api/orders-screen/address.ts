// !!!!!!!!  THERE IS CYRILLIC IN THE BACKEND ANSWER - result object !!!!!!!

import { BASE_URL } from "../base-url";

export interface IAddressValuesNP {
    "id": number;
    "login": string;
    "основной_дополнит_произв": string;
    "доставка способ": string;
    "город": string;
    "id города": string;
    "отделение": string;
    "id отделения": string;
    "фамилия": string;
    "имя": string;
    "отчество": string;
    "тел.получателя": string;
    "_1с": string;
    "street_np": string;
    "house_np": string;
    "appart_np": string;
    "coment_to_adress_np": string;
}

export interface IAddressValuesPrivat {
    "город": string,
    "доставка способ": string,
    "street_np": string,
    "houme_np": string,
    "appart_np": string,
    "фамилия": string,
    "имя": string,
    "отчество": string,
    "тел.получателя": string
}

export interface IAddress {
    "основний": IAddressValuesNP;
    "додатковий": boolean | IAddressValuesNP;
    "довільний": boolean | IAddressValuesNP;
    "За адресою": boolean | IAddressValuesPrivat;
}

export async function fetchAddressList(login: string): Promise<IAddress | null> {
    try {
        const response = await fetch(`${BASE_URL}/api/cms/addresses?dealer_login=${login}`);

        if (!response.ok) {
            console.error(`GETTING ADDRESS LIST ERROR! HTTP error: ${response.status} ${response.statusText}`);
            return null;
        }

        const data = await response.json() as IAddress;
        return data;
    } catch (error) {
        console.error("An error occurred while fetching address list:", error);
        return null;
    }
}