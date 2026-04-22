import { IOrderItem } from "./ordersList";

// check IOrderItem item, return true if item, return false if other services
export function isOrderItem(item: IOrderItem): boolean {
    if (item['характерстика'] === null || item['характерстика'] === undefined || item['характерстика'].length === 0) {
        return false;
    } else {
        return true;
    }
}

export function filterOrderFromOtherServices(orderProductList: IOrderItem[]): IOrderItem[] {
    const filtredList = orderProductList.map((item) => {
        if (item['характерстика'] === null || item['характерстика'] === undefined || item['характерстика'].length === 0) {
            return null;
        } else {
            return item;
        }
    }).filter((item) => item !== null);

    return filtredList;
}