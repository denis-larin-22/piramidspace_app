import { useEffect, useState } from "react";
import { ASYNC_STORAGE_CATALOG_DATA_KEY, getDataFromAcyncStorage, saveDataToAcyncStorage } from "../acyncStorage";
import { IProductItem } from "../types";
import { fetchProductsList } from "../api";

// Checks the cache for saved Catalog list data, if there is no saved data, gets it via API and saves it to the cache / show loading status
export function useCatalogList() {
    const [catalogList, setCatalogList] = useState<IProductItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            try {
                const catalogDataFromStorage = await getDataFromAcyncStorage(ASYNC_STORAGE_CATALOG_DATA_KEY);

                let data: IProductItem[];
                if (catalogDataFromStorage === undefined) {
                    data = await fetchProductsList();
                    await saveDataToAcyncStorage(ASYNC_STORAGE_CATALOG_DATA_KEY, JSON.stringify(data));
                } else {
                    data = JSON.parse(catalogDataFromStorage);
                }

                const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
                setCatalogList(sorted);
            } catch (e) {
                console.warn("Failed to load catalog data", e);
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, []);

    return { catalogList, isLoading };
}