import { BASE_URL } from "../base-url"
import { MainGroupsCode } from "./groups-and-products"

// Calculate full order price
export interface ICulculateOrderObject {
    product_code: string,
    subgroup_code: string,
    group_code: MainGroupsCode,
    width: number,
    height: number,
    side: string,
    units: string,
    quantity: number,
    system_color: string,
    add_to_cart: boolean,
    login: string,
    fixation_type?: string,
    options?: string,
}

export interface ICalculateResponce {
    success: boolean,
    price_per_unit: number,
    price_per_unit_uah: number,
    total_price: number,
    total_price_uah: number,
    details: {
        base_price: number,
        base_price_ua: number,
        color_markup: number,
        color_markup_ua: number,
        fixation_markup: number,
        fixation_markup_ua: number,
        option_markup: number,
        option_markup_ua: number
    },
    added_to_cart: boolean
}

export async function calculateOrderPriceDayNight(orderObject: ICulculateOrderObject): Promise<ICalculateResponce | null> {
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
