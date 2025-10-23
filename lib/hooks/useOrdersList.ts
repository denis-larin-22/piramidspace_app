import { useEffect, useState, useCallback } from 'react';
import { getDataFromAcyncStorage } from '../async-storage/acyncStorage';
import { ASYNC_STORAGE_USER_LOGIN } from '../async-storage/asyncStorageKeys';
import {
    fetchOrderById,
    fetchOrderByStatus,
    fetchOrdersList,
    IOrderList
} from '../api/orders-screen/ordersList';

export const useOrdersList = (
    orderId: string,
    status: string,
    page: number,
    ordersPerPage: number
) => {
    const [ordersList, setOrdersList] = useState<IOrderList | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // рычаг для ручного перезапуска
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    // загрузка
    const fetchOrders = useCallback(async () => {
        setIsLoading(true);

        const userLoginValue = await getDataFromAcyncStorage(ASYNC_STORAGE_USER_LOGIN);

        if (userLoginValue !== undefined) {
            if (orderId.length !== 0) {
                const orderById = await fetchOrderById(userLoginValue, orderId, ordersPerPage);
                setOrdersList(orderById);
            } else if (status.length !== 0) {
                const ordersListByStatus = await fetchOrderByStatus(userLoginValue, status, page, ordersPerPage);
                setOrdersList(ordersListByStatus);
            } else {
                const fullOrdersList = await fetchOrdersList(userLoginValue, page, ordersPerPage);
                setOrdersList(fullOrdersList);
            }
        } else {
            setOrdersList(null);
        }

        setIsLoading(false);
    }, [orderId, status, page, ordersPerPage]);

    // useEffect срабатывает и при обычных изменениях, и при ручном refetch
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders, refetchTrigger]);

    //  функция которую можно вызывать извне
    const triggerRefetch = useCallback(() => {
        setRefetchTrigger(prev => prev + 1);
    }, []);

    return { ordersList, isLoading, triggerRefetch };
};
