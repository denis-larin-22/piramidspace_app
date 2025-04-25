import { IFilterOption, IProductItem } from "../types";

export function getFilterOptions(productList: IProductItem[]) {
    const filterByColors: IFilterOption = {
        filter: "color",
        title: "Колір",
        options: getColors(productList),
        multichoice: true
    }
    const filterByTransparencies: IFilterOption = {
        filter: "transparency",
        title: "Прозорість",
        options: getTransparencies(productList),
        multichoice: true
    }
    const filterByCollections: IFilterOption = {
        filter: "collection",
        title: "Колекція",
        options: getCollections(productList),
        multichoice: true
    }
    const filterByRollWidth: IFilterOption = {
        filter: "rollWidth",
        title: "Ширина рулону",
        options: getRollWidthValues(productList),
        multichoice: true
    }
    const filterByTapeWidth: IFilterOption = {
        filter: "tapeWidth",
        title: "Ширина ламелі",
        options: getTapeWidthValues(productList),
        multichoice: true
    }
    const filterByPriceCategories: IFilterOption = {
        filter: "price",
        title: "Категорія ціни",
        options: getPriceCategories(productList),
        multichoice: true
    }
    const filterByAvailability: IFilterOption = {
        filter: "availability",
        title: "Наявність",
        options: getAvailability(productList),
        multichoice: true
    }
    const filterBySaleValue: IFilterOption = {
        filter: "sale",
        title: "Акція",
        options: getSaleValues(productList),
        multichoice: true
    }

    return [filterBySaleValue, filterByColors, filterByTransparencies, filterByCollections, filterByRollWidth, filterByTapeWidth, filterByPriceCategories, filterByAvailability];
}

function getColors(productList: IProductItem[]) {
    const uniqueColorsArray = Array.from(
        productList.reduce<Set<string>>((acc, product) => {
            const color = product.technical_info.color;

            // Check that the color is not null and add it to the Set
            if (color !== null) {
                acc.add(color); // Adding color to Set for uniqueness
            }

            return acc;
        }, new Set<string>())
    );

    return uniqueColorsArray;
}

function getTransparencies(productList: IProductItem[]) {
    const uniqueTransparencyValuesArray = Array.from(
        productList.reduce<Set<string>>((acc, product) => {
            const transparency = product.technical_info.transparency;

            // Check that the transparency is not null and add it to the Set
            if (transparency !== null) {
                acc.add(transparency); // Adding transparency to Set for uniqueness
            }

            return acc;
        }, new Set<string>())
    );

    return uniqueTransparencyValuesArray;
};

function getCollections(productList: IProductItem[]) {
    const uniqueCollectionsArray = Array.from(
        productList.reduce<Set<string>>((acc, product) => {
            const collection = product.technical_info.collection;

            // Check that the collection is not null and add it to the Set
            if (collection !== null) {
                acc.add(collection); // Adding collection to Set for uniqueness
            }

            return acc;
        }, new Set<string>())
    );

    return uniqueCollectionsArray;
};

function getRollWidthValues(productList: IProductItem[]) {
    const uniqueCollectionsArray = Array.from(
        productList.reduce<Set<string>>((acc, product) => {
            const rollWidthValue = product.technical_info.roll_width;

            // Check that the value is not null and add it to the Set
            if (rollWidthValue !== null) {
                acc.add((rollWidthValue).toString()); // Adding value to Set for uniqueness
            }

            return acc;
        }, new Set<string>())
    );

    return uniqueCollectionsArray;
};

function getTapeWidthValues(productList: IProductItem[]) {
    const uniqueCollectionsArray = Array.from(
        productList.reduce<Set<string>>((acc, product) => {
            const tapeWidthValue = product.technical_info.tape_width;

            // Check that the value is not null and add it to the Set
            if (tapeWidthValue !== null) {
                acc.add((tapeWidthValue).toString()); // Adding value to Set for uniqueness
            }

            return acc;
        }, new Set<string>())
    );

    return uniqueCollectionsArray;
};

function getAvailability(productList: IProductItem[]) {
    const uniqueCollectionsArray = Array.from(
        productList.reduce<Set<string>>((acc, product) => {
            const availability = product.availability;

            // Check that the availability value is not null and add it to the Set
            if (availability !== null) {
                acc.add(availability); // Adding availability value to Set for uniqueness
            }

            return acc;
        }, new Set<string>())
    );

    return uniqueCollectionsArray;
};

function getPriceCategories(productList: IProductItem[]) {
    const uniquePriceCategoriesArray = Array.from(
        productList.reduce<Set<string>>((acc, product) => {
            const priceCategory = product.price.price_5;

            // Check that the priceCategory is not null and add it to the Set
            if (priceCategory !== null) {
                acc.add(priceCategory); // Adding priceCategory to Set for uniqueness
            }

            return acc;
        }, new Set<string>())
    );

    return uniquePriceCategoriesArray;
};

function getSaleValues(productList: IProductItem[]) {
    const uniqueCollectionsArray = Array.from(
        productList.reduce<Set<string>>((acc, product) => {
            const sale = product.price.sale;

            // Check that the sale value is not null and add it to the Set
            if (sale !== null) {
                acc.add(sale); // Adding sale value to Set for uniqueness
            }

            return acc;
        }, new Set<string>())
    );

    return uniqueCollectionsArray;
};

