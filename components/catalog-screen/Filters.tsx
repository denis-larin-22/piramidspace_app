import { useState } from "react"
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Fonts } from "../../theme/fonts";
import { Colors } from "../../theme/colors";
import { IProductItem } from "../../lib/types";
import { getFilterOptions } from "../../lib/catalog-filters/getFiltersOptions";
import { ICatalogListByCategory } from "../../screens/CatalogScreen";
import { filterValuesIcons } from "../../lib/filter-icons/colorsIcons";
import AnimatedWrapper from "../animation/AnimatedWrapper";

interface IProps {
    catalogList: ICatalogListByCategory,
    setCatalogList: React.Dispatch<React.SetStateAction<ICatalogListByCategory>>
}

export interface IActiveFilters {
    [key: string]: any[];
}

function Filters({ catalogList, setCatalogList }: IProps) {
    const windowWidth = Dimensions.get("window").width;
    // 
    const filtersOptions = getFilterOptions(catalogList.initList);

    const [openFilterIndex, setOpenFilterIndex] = useState<number | null>(null);
    const handleToggle = (index: number) => {
        setOpenFilterIndex(prevIndex => (prevIndex === index ? null : index));
    };

    const initActiveFiltersObj: IActiveFilters = filtersOptions
        .map((item) => item.filter)
        .reduce((acc, key) => {
            acc[key] = [];
            return acc;
        }, {} as IActiveFilters);

    const [activeFilters, setActiveFilters] = useState<IActiveFilters>(initActiveFiltersObj);

    function filtersHandler(filter: string, value: string) {
        const updatedActiveFilters: IActiveFilters = { ...activeFilters };
        const initActiveFilterState = activeFilters[filter];
        // update active filters values
        updatedActiveFilters[filter] = initActiveFilterState.includes(value)
            ? initActiveFilterState.filter((item) => item !== value)
            : [...initActiveFilterState, value];
        // getting product list filtration
        const filtredCatalogList = getFilteredItems(catalogList.initList, updatedActiveFilters);
        // save filtred list
        setCatalogList({ ...catalogList, renderList: filtredCatalogList });
        // save updated active filters
        setActiveFilters(updatedActiveFilters);
        // show reset button
        setIsResetVissible(true);
    };

    const [isResetVissible, setIsResetVissible] = useState<boolean>(false);

    function resetActiveFilters() {
        setActiveFilters(initActiveFiltersObj);
        setCatalogList({
            ...catalogList,
            renderList: catalogList.initList
        });
        setIsResetVissible(false);
        setOpenFilterIndex(null);
    }

    return (
        <View style={styles.dropdownWrap}>
            {/* Buttons */}
            <ScrollView
                horizontal={true}
                style={styles.buttonsWrap}
                showsHorizontalScrollIndicator={false}
            >
                {filtersOptions.map((filterItem, index) => {
                    const isOpen = openFilterIndex === index;

                    if (filterItem.options.length === 0) return null;

                    return (
                        <TouchableOpacity
                            key={index}
                            style={[styles.dropdownBtn, styles.shadow, {
                                borderWidth: filterItem.filter === 'sale' ? 2 : 0,
                                borderColor: Colors.blue
                            }]}
                            onPress={() => handleToggle(index)}
                        >
                            <Text style={styles.btnText}>{filterItem.title}</Text>
                            <Image
                                source={require("../../assets/catalog-screen/arrow.png")}
                                style={[styles.dropdownArrow,
                                {
                                    transform: [{ rotate: isOpen ? '180deg' : '0deg' }],
                                },
                                ]}
                                resizeMode="contain"
                            />
                            {/* active filters count */}
                            {activeFilters[filterItem.filter].length !== 0 &&
                                <Text
                                    style={styles.activeFiltersCount}
                                >{activeFilters[filterItem.filter].length}</Text>
                            }
                        </TouchableOpacity>
                    )
                })}

                {isResetVissible &&
                    <TouchableOpacity
                        style={[styles.resetButton, styles.shadow]}
                        onPress={resetActiveFilters}
                    >
                        <Text>🗑️</Text>
                    </TouchableOpacity>
                }
            </ScrollView>

            {/* Options */}
            {openFilterIndex !== null &&
                <Pressable
                    style={[styles.listWrap, {
                        width: windowWidth
                    }]}
                    onPress={() => setOpenFilterIndex(null)}
                >
                    <AnimatedWrapper
                        style={styles.list}
                        useOpacity
                        offsetY={-50}
                        duration={300}
                    >
                        {filtersOptions[openFilterIndex].options.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.listItem, {
                                    backgroundColor: activeFilters[filtersOptions[openFilterIndex].filter].includes(option) ? Colors.blue : 'white'
                                }]}
                                onPress={() => {
                                    filtersHandler(filtersOptions[openFilterIndex].filter, option)
                                }}
                            >
                                {filtersOptions[openFilterIndex].filter === "color" && <OptionIcon optionValue={option} />}

                                <Text
                                    style={[styles.listItemText, {
                                        color: activeFilters[filtersOptions[openFilterIndex].filter].includes(option) ? 'white' : Colors.blueDark
                                    }]}
                                >{getFormatedOptionValue(option, filtersOptions[openFilterIndex].filter)}</Text>
                            </TouchableOpacity>
                        ))}
                    </AnimatedWrapper>
                </Pressable>
            }
        </View>
    )
};

export default Filters;

// filtration logic
function getFilteredItems(products: IProductItem[], activeFilters: IActiveFilters) {
    const { availability, color, collection, rollWidth, tapeWidth, transparency, price, sale } = activeFilters;

    return products.filter((product) => {
        const { technical_info, price: productPrice, category_id, availability: productAvailability } = product;
        const { color: productColor, transparency: productTransparency, collection: productCollection, roll_width, tape_width } = technical_info;

        const matches = [
            // category_id === activeCategoryId,
            !color.length || color.includes(productColor),
            !transparency.length || transparency.includes(productTransparency),
            !collection.length || collection.includes(productCollection),
            !rollWidth.length || rollWidth.includes(roll_width),
            !tapeWidth.length || tapeWidth.includes(tape_width),
            !price.length || price.includes(productPrice.price_5),
            !availability.length || availability.includes(productAvailability),
            !sale.length || sale.includes(productPrice.sale)
        ];

        return matches.every(Boolean);
    });
};

// utils
function getFormatedOptionValue(option: string, filter: string) {
    let result = '';

    result = option.length > 100 ? option.slice(0, 40) + '...' : option

    if (filter === 'sale') {
        result = option + ' %'
    } else if (filter === 'tapeWidth' || filter === 'tapeWidth') {
        result = option + ' мм.'
    }

    return result;
}

// ui
function OptionIcon({ optionValue }: { optionValue: string }) {
    const colorIcon = filterValuesIcons[optionValue];

    return (
        <>
            {colorIcon === undefined ?
                null
                :
                <Text
                    style={{
                        backgroundColor: colorIcon,
                        borderWidth: colorIcon === "#FFFFFF" ? 1 : 0,
                        borderColor: Colors.blue,
                        height: 21,
                        width: 21,
                        position: 'relative',
                        left: -8,
                        borderRadius: 100
                    }}
                ></Text>
            }
        </>
    )
}

const styles = StyleSheet.create({
    dropdownWrap: {
        position: "relative",
    },
    shadow: {
        // iOS shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,

        // Android shadow
        elevation: 2,
    },
    buttonsWrap: {
        height: 50,
        paddingLeft: 15,
        paddingRight: 30,
        marginBottom: 16
    },
    dropdownBtn: {
        backgroundColor: "white",
        paddingBottom: 10,
        paddingTop: 8,
        paddingHorizontal: 16,
        marginRight: 10,
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        borderRadius: 50,
    },
    dropdownArrow: {
        width: 16,
        height: 9,
    },
    btnText: {
        fontFamily: Fonts.comfortaa600,
        fontSize: 14,
        color: Colors.blueDark
    },
    activeFiltersCount: {
        width: 17,
        height: 17,
        backgroundColor: Colors.blue,
        textAlign: "center",
        color: "white",
        borderRadius: 50,
        fontSize: 12,
        fontFamily: Fonts.comfortaa400,
        lineHeight: 17,
        position: "absolute",
        top: 2,
        right: 30,
    },
    resetButton: {
        width: 100,
        backgroundColor: 'white',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 50
    },
    listWrap: {
        // marginTop: 10,
        backgroundColor: "#00000070",
        height: "2300%",
        position: "absolute",
        top: "100%",
        zIndex: 20,
    },
    list: {
        backgroundColor: Colors.pale,
        padding: 18,
        paddingBottom: 30,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        flexDirection: "row",
        gap: 6,
        flexWrap: "wrap"
    },
    listItem: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 50,
        flexDirection: 'row',
        alignItems: 'center',
    },
    listItemText: {
        fontFamily: Fonts.openSans400,
        fontSize: 14,
        color: "#0E0050",
    }
});

