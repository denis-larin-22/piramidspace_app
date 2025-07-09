import { useEffect, useState } from "react";
import { getBalanceByLogin } from "../api/info";
import { getDataFromAcyncStorage, saveDataToAcyncStorage } from "../async-storage/acyncStorage";
import { ASYNC_STORAGE_BALANCE_VALUE_KEY, ASYNC_STORAGE_USER_LOGIN } from "../async-storage/asyncStorageKeys";

export function useBalanceValue(isConnected: boolean) {
    const [balance, setBalance] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        async function getBalance() {
            setIsLoading(true);

            try {
                if (isConnected) {
                    const userLoginValue = await getDataFromAcyncStorage(ASYNC_STORAGE_USER_LOGIN);

                    if (userLoginValue) {
                        const value = await getBalanceByLogin(userLoginValue as string);
                        setBalance(value);

                        await saveDataToAcyncStorage(
                            ASYNC_STORAGE_BALANCE_VALUE_KEY,
                            JSON.stringify(value)
                        );
                    } else {
                        setBalance(null);
                    }
                } else {
                    const valueFromStorage = await getDataFromAcyncStorage(ASYNC_STORAGE_BALANCE_VALUE_KEY);

                    setBalance(valueFromStorage ? JSON.parse(valueFromStorage) : null);
                }
            } catch (error) {
                console.error("Error! Getting balance value by user login!", error);
                setBalance(null);
            } finally {
                setIsLoading(false);
            }
        }

        getBalance();
    }, [isConnected]);

    return { balance, isLoading };
};
