import { useEffect, useState } from 'react'
import { getDataFromAcyncStorage, saveDataToAcyncStorage } from '../async-storage/acyncStorage'
import { fetchOrders, IOrder } from '../api/orders'
import {
    ASYNC_STORAGE_ORDERS_LIST_KEY,
    ASYNC_STORAGE_USER_LOGIN
} from '../async-storage/asyncStorageKeys'

export const useOrders = (isConnected: boolean = true) => {
    const [ordersList, setOrdersList] = useState<IOrder[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const getOrders = async () => {
            setIsLoading(true)

            if (isConnected) {
                const userLoginValue = await getDataFromAcyncStorage(ASYNC_STORAGE_USER_LOGIN);

                if (userLoginValue !== undefined) {
                    const orders = await fetchOrders(userLoginValue);
                    setOrdersList(orders);

                    saveDataToAcyncStorage(ASYNC_STORAGE_ORDERS_LIST_KEY, JSON.stringify(orders));
                } else {
                    setOrdersList([]); // fallback
                }
            } else {
                const storedOrders = await getDataFromAcyncStorage(ASYNC_STORAGE_ORDERS_LIST_KEY);
                if (typeof storedOrders === 'string') {
                    setOrdersList(JSON.parse(storedOrders));
                } else {
                    setOrdersList([]); // fallback
                }
            }

            setIsLoading(false);
        }

        getOrders();
    }, [isConnected]);

    return { ordersList, isLoading };
};
