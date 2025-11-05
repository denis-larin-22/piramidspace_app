import { BASE_URL } from "../base-url";

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
    bot_status: string | null;
    items: IOrderItem[];
};

export interface IOrderItem {
    "N_заказа": number,
    "наименование": string,
    "характерстика": string,
    "кол_во": string,
    "ед изм": string,
    "стоим": string,
    "площадь, м.кв.": string,
    "розничная_стоим": string,
    "комплектация": string,
    "sale_tk": number
}

export interface IOrderList {
    current_page: number,
    data: IOrder[],
    last_page: number,
}

export async function fetchOrdersList(dealerLogin: string, page: number, ordersPerPage: number): Promise<IOrderList | null> {
    const encodedLogin = encodeURIComponent(dealerLogin);
    const url = `${BASE_URL}/api/cms/getOrders?dealer_login=${encodedLogin}&page=${page}&per_page=${ordersPerPage}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            console.error(`ORDERS LIST ERROR! HTTP error: ${response.status} ${response.statusText}`);
            return null;
        }

        const data = await response.json();

        return data as IOrderList;
    } catch (error) {
        console.error("An error occurred while fetching orders list:", error);
        return null;
    }
};

export async function fetchOrderById(dealerLogin: string, orderId: string, ordersPerPage: number): Promise<IOrderList | null> {
    const encodedLogin = encodeURIComponent(dealerLogin);
    const url = `${BASE_URL}/api/cms/getOrders?order_id=${orderId}&dealer_login=${encodedLogin}&page=1&per_page=${ordersPerPage}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            console.error(`FETCHING ORDER BY ID ERROR! HTTP error: ${response.status} ${response.statusText}`);
            return null;
        }

        const data = await response.json();

        return data as IOrderList;
    } catch (error) {
        console.error("An error occurred while fetching order by id:", error);
        return null;
    }
};

export async function fetchOrderByStatus(dealerLogin: string, status: string, page: number, ordersPerPage: number): Promise<IOrderList | null> {
    const encodedLogin = encodeURIComponent(dealerLogin);
    const encodedStatus = encodeURIComponent(status);
    const url = `${BASE_URL}/api/cms/getOrders?dealer_login=${encodedLogin}&status=${encodedStatus}&page=${page}&per_page=${ordersPerPage}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            console.error(`FETCHING ORDER BY STATUS ERROR! HTTP error: ${response.status} ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        return data as IOrderList;
    } catch (error) {
        console.error("An error occurred while fetching order by status:", error);
        return null;
    }
};

interface IDeleteOrderBody {
    order_N: string;
    userType: string;
    login: string;
}

export async function fetchDeleteOrder(body: IDeleteOrderBody) {
    try {
        const response = await fetch(`${BASE_URL}/api/cms/deleteOrder`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("An error occurred while fetching delete order:", error);
        return null;
    }
}