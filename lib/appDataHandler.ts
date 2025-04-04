import { ASYNC_STORAGE_CATALOG_DATA_KEY, ASYNC_STORAGE_CATEGORIES_DATA_KEY, getDataFromAcyncStorage, saveDataToAcyncStorage } from "./acyncStorage";
import { fetchCategories, fetchProductsList } from "./api";
import { ICategory, IProductItem } from "./types";

// Checks the cache for saved Catalog list data, if there is no saved data, gets it via API and saves it to the cache
export async function getDataCatalogList(): Promise<IProductItem[]> {
    const catalogDataFromStorage = await getDataFromAcyncStorage(ASYNC_STORAGE_CATALOG_DATA_KEY);

    if (catalogDataFromStorage === undefined) {
        const productList = await fetchProductsList();

        saveDataToAcyncStorage(ASYNC_STORAGE_CATALOG_DATA_KEY, JSON.stringify(productList));
        return productList;
    } else {
        return JSON.parse(catalogDataFromStorage);
    }
};

// Checks the cache for saved Catalog categories list data, if there is no saved data, gets it via API and saves it to the cache
export async function getDataCatalogCategories(): Promise<ICategory[]> {
    const categoriesDataFromStorage = await getDataFromAcyncStorage(ASYNC_STORAGE_CATEGORIES_DATA_KEY);

    if (categoriesDataFromStorage === undefined) {
        const categoriesList = await fetchCategories();

        saveDataToAcyncStorage(ASYNC_STORAGE_CATEGORIES_DATA_KEY, JSON.stringify(categoriesList));
        return categoriesList;
    } else {
        return JSON.parse(categoriesDataFromStorage);
    }
};