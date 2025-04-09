import { useEffect, useState } from "react";
import { ASYNC_STORAGE_CATEGORIES_DATA_KEY, getDataFromAcyncStorage, saveDataToAcyncStorage } from "../acyncStorage";
import { ICategory } from "../types";
import { fetchCategories } from "../api";

// Checks the cache for saved Catalog categories list data, if there is no saved data, gets it via API and saves it to the cache / show loading status
export function useCatalogCategories() {
    const [categoriesList, setCategoriesList] = useState<ICategory[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function loadCategories() {
            setIsLoading(true);
            try {
                const dataFromStorage = await getDataFromAcyncStorage(ASYNC_STORAGE_CATEGORIES_DATA_KEY);

                let data: ICategory[];
                if (dataFromStorage === undefined) {
                    data = await fetchCategories();
                    await saveDataToAcyncStorage(ASYNC_STORAGE_CATEGORIES_DATA_KEY, JSON.stringify(data));
                } else {
                    data = JSON.parse(dataFromStorage);
                }

                setCategoriesList(data);
            } catch (error) {
                console.warn("Failed to load categories", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadCategories();
    }, []);

    return { categoriesList, isLoading };
};