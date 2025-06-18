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

