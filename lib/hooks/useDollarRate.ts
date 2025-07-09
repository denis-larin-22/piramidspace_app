import { useEffect, useState } from "react";
import { getExchangeDollarRate } from "../api/info";
import {
    getDataFromAcyncStorage,
    saveDataToAcyncStorage,
} from "../async-storage/acyncStorage";
import { ASYNC_STORAGE_RATE_VALUE_KEY } from "../async-storage/asyncStorageKeys";

export function useDollarRate(isConnected: boolean) {
    const [rate, setRate] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        async function getRate() {
            setIsLoading(true);

            try {
                if (isConnected) {
                    const value = await getExchangeDollarRate();
                    setRate(value);
                    await saveDataToAcyncStorage(
                        ASYNC_STORAGE_RATE_VALUE_KEY,
                        JSON.stringify(value)
                    );
                } else {
                    const cached = await getDataFromAcyncStorage(ASYNC_STORAGE_RATE_VALUE_KEY);

                    try {
                        setRate(cached ? JSON.parse(cached) : null);
                    } catch {
                        setRate(null);
                    }
                }
            } catch (err) {
                console.error("Error! Getting dollar rate!", err);
                setRate(null);
            } finally {
                setIsLoading(false);
            }
        }

        getRate();
    }, [isConnected]);

    return { rate, isLoading };
}
