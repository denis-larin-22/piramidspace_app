import { UnitsTypes } from "../auth";
import { BASE_URL } from "../base-url";
import { MainGroupsCode } from "./groups-and-products"

export interface IEditableOrder {
    login: string,
    order: {
        "комментарий": string,
        "адрес доставки": string,
        "ВидАдресаВЗаказе": string,
        "статус": string,
        "скидка": number,
        "предопл": number
    },
    items: (IOrderItemToAdd | IOrderItemToUpdate | IOrderItemToDelete)[]
}

export interface IOrderItemToAdd {
    action: "add",
    product_code: string,
    group_code: MainGroupsCode,
    subgroup_code: string,
    width: number,
    height: number,
    quantity: number,
    side: string,
    system_color: string,
    units: UnitsTypes,
    options: string,
    fixation_type: string
}

export interface IOrderItemToUpdate {
    action: "update",
    old_name: string,
    old_characteristic: string,
    product_code: string,
    group_code: MainGroupsCode,
    subgroup_code: string,
    width: number,
    height: number,
    quantity: number,
    side: string,
    system_color: string,
    units: UnitsTypes,
    fixation_type: string
    options: string
}

export interface IOrderItemToDelete {
    action: "delete",
    old_name: string,
    old_characteristic: string,
}

export interface IEditOrderResponse {
    success: boolean;
    order_number: string;
    total_usd: number;
    total_uah: number;
    updated_items: string[];
}

export async function editOrder(
    orderNumber: string | number,
    data: IEditableOrder
): Promise<IEditOrderResponse | null> {
    const url = `${BASE_URL}/api/piramid/orders/${orderNumber}/edit`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.status !== 200) {
            let serverMessage = '';

            try {
                const errorData = await response.json();
                serverMessage = errorData.message;
            } catch { }

            console.error(
                `Error editing order. Status: ${response.status}. ${serverMessage || response.statusText}`
            );

            return null;
        }

        return await response.json() as IEditOrderResponse;

    } catch (err) {
        console.error("Network or unexpected error while editing order:", err);
        return null;
    }
}
