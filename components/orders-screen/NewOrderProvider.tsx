import { createContext, ReactNode, useContext, useState } from "react";
import { Fixation, IProductByCodes, ISubgroup, MainGroupsCode } from "../../lib/api/orders-screen/groups-and-products";

export interface ICreateOrderContext {
    orderParams: ICreateOrderParams;
    setOrderParams: (params: ICreateOrderParams) => void;
}

export interface ICreateOrderParams {
    activeGroup: MainGroupsCode | null;
    newOrderObject: INewOrderObject;
    ordersList: INewOrderObject[];
}

export interface INewOrderObject {
    id: string | null,
    group: {
        name: string | null;
        code: MainGroupsCode | null;
    };
    subgroup: ISubgroup | null;
    product: IProductByCodes | null;
    width_gab: string | null; // габарит
    height_gab: string | null; // габарит
    width_shtapik: string | null; // по штапику
    height_shtapik: string | null; // по штапику
    controlType: string | null;
    count_number: string | null; // кількість
    color_system: string | null;
    fixation_type: Fixation | null;
    price: number;
    options: string | null;
    final_price: {
        usd: number,
        uah: number
    };
    adrType: string,
    comment: string,
    delivery_adr: string,
    product_type: string,
    retailData: string,
}

export const initCreateOrderParams: ICreateOrderParams = {
    activeGroup: null,
    newOrderObject: {
        id: null,
        group: { code: null, name: null },
        subgroup: null,
        product: null,
        width_gab: null,
        height_gab: null,
        width_shtapik: null,
        height_shtapik: null,
        controlType: null,
        count_number: null,
        color_system: null,
        fixation_type: null,
        price: 0,
        options: null,
        final_price: {
            usd: 0,
            uah: 0
        },
        adrType: "",
        comment: "",
        delivery_adr: "",
        product_type: "",
        retailData: "",
    },
    ordersList: [],
};

const NewOrderContext = createContext<ICreateOrderContext | undefined>(undefined);

export function CreateOrderProvider({ children }: { children: ReactNode }) {
    const [orderParams, setOrderParams] = useState<ICreateOrderParams>(initCreateOrderParams);

    return (
        <NewOrderContext.Provider value={{ orderParams, setOrderParams }}>
            {children}
        </NewOrderContext.Provider>
    );
}

export function useCreateOrder() {
    const ctx = useContext(NewOrderContext);
    if (!ctx) throw new Error("useCreateOrder must be used within CreateOrderProvider");
    return ctx;
}
