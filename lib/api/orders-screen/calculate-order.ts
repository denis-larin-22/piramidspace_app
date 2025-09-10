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
    quantity: number,
    system_color: null | string,
    fixation_type: null | string,
    add_to_cart: boolean,
    login: string
}

interface ICalculateResponceSuccess {
    success: boolean,
    price_per_unit: number,
    total_price: number,
    details: {
        base_price: number,
        color_markup: number,
        fixation_markup: number
    },
    added_to_cart: boolean
}

interface ICalculateResponceError {
    success: boolean,
    error: string
}

export type ICalculateResponse =
    { status: 200; data: ICalculateResponceSuccess }
    | { status: 500; data: ICalculateResponceError }
    | null

export async function calculateOrderPrice(
    orderObject: ICulculateOrderObject
): Promise<ICalculateResponse> {
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

        if (response.status === 200) {
            const data: ICalculateResponceSuccess = await response.json();
            return { status: 200, data };
        }

        const errorData: ICalculateResponceError = await response.json();

        return {
            status: 500,
            data: errorData,
        };
    } catch (err) {
        console.error(`Unknown error fetching calculate order price: ${err}`)
        return null;
    }
}
