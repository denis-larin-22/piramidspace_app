import { BASE_URL } from "./base-url";

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
        if (resultObject.cellphone_dill === phoneNumber) {
            return resultObject;
        } else {
            return undefined;
        }

    } catch (error) {
        return undefined;
    }
};