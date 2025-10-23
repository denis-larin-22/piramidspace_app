import { BASE_URL } from "../base-url"
import { MainGroupsCode } from "./groups-and-products"

// ORDER OBJECT WITH ITEMS | CALCULATE+CREATING ORDER
export interface ICalculateOrderObject {
    login: string,
    place_order: boolean,
    items: ICalculateOrderItem[],
    comment: string,
    delivery_adr: string,
    adrType: string,
    product_type: string,
    retailData: string,
    predopl: number
}

export interface ICalculateOrderItem {
    product_code: string,
    subgroup_code: string,
    group_code: MainGroupsCode,
    width: number,
    height: number,
    side: string,
    units: string,
    options?: string,
    quantity: number,
    system_color: string,
    fixation_type: string
}

// RESPONCE - RESULT
export interface ICalculateResponce {
    success: boolean,
    items: ICalculateResponceItem[],
    order_number: string | null,
    total_usd: number,
    total_uah: number
}

export interface ICalculateResponceItem {
    success: boolean,
    product_code: string,
    price_per_unit: number,
    price_per_unit_uah: number,
    total_price: number,
    total_price_uah: number,
    details: {
        color_markup: string,
        fixation_markup: number,
        option_markup: number
    }
}

export async function calculateOrderPriceDayNight(orderObject: ICalculateOrderObject): Promise<ICalculateResponce | null> {
    try {
        const response = await fetch(`${BASE_URL}/api/piramid/calculate-product`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderObject),
        });

        if (!response.ok) {
            console.error(`Error fetching calculate order price: ${response.status}`);
            return null;
        }

        const data: ICalculateResponce = await response.json();
        return data;
    } catch (err) {
        console.error(`Unknown error fetching calculate order price: ${err}`)
        return null;
    }
}
