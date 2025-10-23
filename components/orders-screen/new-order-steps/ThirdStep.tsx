import { useEffect, useState } from "react";
import { ColorPrice, Fixation, getProductsByGroupCodes, IProductByCodes, ISubgroup, OptionPrice } from "../../../lib/api/orders-screen/groups-and-products";
import { Image, ImageBackground, ImageStyle, Pressable, Text, View, StyleSheet, ViewStyle, } from "react-native";
import { Fonts } from "../../../theme/fonts";
import { Colors } from "../../../theme/colors";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import { Keyboard } from 'react-native';
import WidthAndHeight from "./third-step-components/WidthAndHeight";
import ProductsList from "./third-step-components/ProductsList";
import CountValue from "./third-step-components/CountValue";
import ControlType from "./third-step-components/ControlType";
import Color from "./third-step-components/Color";
import FixationType from "./third-step-components/FixationType";
import { ASYNC_STORAGE_USER_LOGIN } from "../../../lib/async-storage/asyncStorageKeys";
import { getDataFromAcyncStorage } from "../../../lib/async-storage/acyncStorage";
import { useCreateOrder } from "../NewOrderProvider";
import Options from "./third-step-components/Options";

export interface IErrorStateMessage {
    state: boolean,
    text: string,
    errorFieldNumber: 2 | 3 | 4 | 5 | 6 | null
}

function ThirdStep({ stepHandler }: { stepHandler: () => void }) {
    const { orderParams, setOrderParams } = useCreateOrder();

    const orderObject = orderParams.newOrderObject;
    const { group, subgroup, product, height_shtapik, width_shtapik, height_gab, width_gab, controlType, count_number, color_system, fixation_type, options } = orderObject;

    if (subgroup === null) return null;

    // Product choice
    const [products, setProducts] = useState<IProductByCodes[] | null>(null);
    const [isProductsListOpen, setIsProductsListOpen] = useState(false);
    const [activeProduct, setActiveProduct] = useState<IProductByCodes | null>(product);

    // Color choice
    const subgroupColors = Array.isArray(subgroup.colors) ?
        // (group.code === 'day' || group.code === 'roller') 
        (subgroup.colors as string[])
        :
        Object.keys(subgroup.colors as Record<string, ColorPrice[]>);
    const [colorsList] = useState<string[]>(subgroupColors);
    const [activeColor, setActiveColor] = useState(color_system);
    const [isColorListOpen, setIsColorListOpen] = useState(false);

    // Control type
    const [cotrolTypesList] = useState<string[]>(subgroup.control);
    const [activeControlType, setActiveControlType] = useState(controlType);
    const [isControlTypeListOpen, setIsControlTypeListOpen] = useState(false);

    // Fixation type
    const [fixationTypeList] = useState<Fixation[]>(subgroup.fixations);
    const [activeFixationType, setActiveFixationType] = useState<Fixation | null>(fixation_type);
    const [isFixationTypeListOpen, setIsFixationTypeListOpen] = useState(false);

    // Option value
    const subgroupOptions = Array.isArray(subgroup.options) ?
        // (group.code === 'day' || group.code === 'roller') 
        (subgroup.options as string[])
        :
        Object.keys(subgroup.options as Record<string, OptionPrice[]>);
    const [optionsList] = useState<string[]>(subgroupOptions);
    const [activeOption, setActiveOption] = useState(options);
    const [isOptionsListOpen, setIsOptionsListOpen] = useState(false);

    // Error state
    const initErrorObject: IErrorStateMessage = {
        state: false,
        text: '',
        errorFieldNumber: null
    }

    const [isError, setIsError] = useState<IErrorStateMessage>(initErrorObject);

    // Check subgroup === null
    useEffect(() => {
        if (subgroup === null) {
            setIsError({
                state: true,
                text: "⚠️ Не знайдено підгрупу товару!",
                errorFieldNumber: null
            });
            setTimeout(() => setIsError(initErrorObject), 3000);
        };
    }, [subgroup]);

    // Getting products list and params
    useEffect(() => {
        async function getProducts() {
            const login = await getDataFromAcyncStorage(ASYNC_STORAGE_USER_LOGIN);
            // check needed values
            if (orderObject.group.code === null || orderObject.subgroup === null || login === undefined) {
                setProducts([]);
                return;
            }

            const data = await getProductsByGroupCodes(orderObject.group.code, orderObject.subgroup.code, login);
            if (data === null) {
                return;
            } else {
                setProducts(data);
            }
        }
        getProducts();
    }, [orderParams.newOrderObject]);

    // Dropdown togglers
    function toggleProductsList() {
        Keyboard.dismiss();
        setIsControlTypeListOpen(false);
        setIsColorListOpen(false);
        setIsFixationTypeListOpen(false);
        setIsOptionsListOpen(false);
        setIsProductsListOpen((prev) => !prev);
    }
    function toggleControlTypeList() {
        Keyboard.dismiss();
        setIsProductsListOpen(false);
        setIsColorListOpen(false);
        setIsFixationTypeListOpen(false);
        setIsOptionsListOpen(false);
        setIsControlTypeListOpen((prev) => !prev);
    }
    function toggleColorList() {
        Keyboard.dismiss();
        setIsProductsListOpen(false);
        setIsControlTypeListOpen(false);
        setIsFixationTypeListOpen(false);
        setIsOptionsListOpen(false);
        setIsColorListOpen((prev) => !prev);
    }
    function toggleFixationTypeList() {
        Keyboard.dismiss();
        setIsProductsListOpen(false);
        setIsControlTypeListOpen(false);
        setIsColorListOpen(false);
        setIsOptionsListOpen(false);
        setIsFixationTypeListOpen((prev) => !prev);
    }
    function toggleOptionsList() {
        Keyboard.dismiss();
        setIsProductsListOpen(false);
        setIsControlTypeListOpen(false);
        setIsColorListOpen(false);
        setIsFixationTypeListOpen(false);
        setIsOptionsListOpen((prev) => !prev);
    }

    const productsListHandler = (product: IProductByCodes) => {
        if (product.presence === "нет") {
            setIsError({
                state: true,
                text: "⚠️ Цїєї тканини немає в наявності!",
                errorFieldNumber: null
            });
            setTimeout(() => setIsError(initErrorObject), 3000);
        } else {
            const pressebleProduct = product.name === activeProduct?.name ? null : product;

            setIsError(initErrorObject);
            setActiveProduct(pressebleProduct);
            setOrderParams({
                ...orderParams,
                newOrderObject: {
                    ...orderParams.newOrderObject,
                    product: product
                }
            });
            setIsProductsListOpen(false);
        }
    }

    const controlTypesListHandler = (type: string) => {
        setActiveControlType(type);
        setOrderParams({
            ...orderParams,
            newOrderObject: {
                ...orderParams.newOrderObject,
                controlType: type
            }
        });
        setIsControlTypeListOpen(false);
    }

    const colorsListHandler = (color: string) => {
        setActiveColor(color);
        setOrderParams({
            ...orderParams,
            newOrderObject: {
                ...orderParams.newOrderObject,
                color_system: color
            }
        });
        setIsColorListOpen(false);
    }

    const fixationTypesListHandler = (type: Fixation) => {
        setActiveFixationType(type);
        setOrderParams({
            ...orderParams,
            newOrderObject: {
                ...orderParams.newOrderObject,
                fixation_type: type
            }
        });
        setIsFixationTypeListOpen(false);
    }

    const optionsListHandler = (option: string) => {
        setActiveOption(option);
        setOrderParams({
            ...orderParams,
            newOrderObject: {
                ...orderParams.newOrderObject,
                options: option
            }
        });
        setIsOptionsListOpen(false);
    }

    // Final form order CHECK befor sending
    function foldOrder() {
        if (!height_gab || !width_gab) {
            setIsError({
                state: true,
                text: "⚠️ Введіть усі значення ширини та висоти",
                errorFieldNumber: 2
            });
        } else if (cotrolTypesList.length !== 0 && controlType === null) {
            setIsError({
                state: true,
                text: "⚠️ Оберіть тип керування",
                errorFieldNumber: 3
            });
        } else if (!count_number) {
            setIsError({
                state: true,
                text: "⚠️ Вкажіть кількість",
                errorFieldNumber: 4
            });
        } else if (colorsList.length !== 0 && color_system === null) {
            setIsError({
                state: true,
                text: "⚠️ Оберіть колір системи",
                errorFieldNumber: 5
            });
        } else if (fixationTypeList.length !== 0 && fixation_type === null) {
            setIsError({
                state: true,
                text: "⚠️ Оберіть тип фіксації",
                errorFieldNumber: 6
            });
        } else {
            const { newOrderObject, ordersList } = orderParams;

            const isThereInList = ordersList.some((order) => order.id === newOrderObject.id);

            setOrderParams({
                ...orderParams,
                ordersList: isThereInList ?
                    ordersList.map((order) => {
                        if (order.id === newOrderObject.id) {
                            return newOrderObject;
                        } else { return order };
                    })
                    :
                    [...ordersList, newOrderObject]

            });
            stepHandler();
        }

        setTimeout(() => {
            setIsError(initErrorObject);
        }, 3000);
    }

    return (
        <>
            {/* Titles */}
            <AnimatedWrapper
                useOpacity
                offsetY={20}
                delay={100}
            >
                <Text style={thirdStepStyles.stepSubtitle}>Оформлення Замовлення</Text>
            </AnimatedWrapper>

            <AnimatedWrapper
                useOpacity
                offsetY={20}
                delay={150}
            >
                <Text style={thirdStepStyles.stepCategory}>{orderObject.group.name}</Text>
            </AnimatedWrapper>

            <AnimatedWrapper
                useOpacity
                offsetY={20}
                delay={200}
            >
                <Text style={thirdStepStyles.stepSubCategory}>{subgroup.name}</Text>
            </AnimatedWrapper>

            {/* Error message */}
            {isError.state && <ErrorMessage errorText={isError.text} />}

            {/* Product selection */}
            <AnimatedWrapper useOpacity offsetY={30} delay={300}>
                {/* Product list */}
                <Text style={thirdStepStyles.detailsText}>Оберіть тканину</Text>
                <ProductsList
                    activeProduct={activeProduct}
                    productsList={products}
                    productsListHandler={productsListHandler}
                    isProductsListOpen={isProductsListOpen}
                    toggleProductsList={toggleProductsList}
                />

                <View
                    style={{
                        opacity: activeProduct === null ? 0.4 : 1,
                        pointerEvents: activeProduct === null ? 'none' : 'auto'
                    }}
                >
                    {/* Размеры: Ширина и Высота */}
                    <WidthAndHeight
                        errorFieldNumber={isError.errorFieldNumber}
                    />

                    {/* Управление и Количество */}
                    <View style={thirdStepStyles.row}>
                        {cotrolTypesList.length !== 0 ? <ControlType
                            isControlTypeListOpen={isControlTypeListOpen}
                            toggleControlTypeList={toggleControlTypeList}
                            activeControlType={activeControlType}
                            cotrolTypesList={cotrolTypesList}
                            controlTypesListHandler={controlTypesListHandler}
                            isError={isError}
                        /> : null}

                        <CountValue errorFieldNumber={isError.errorFieldNumber} />
                    </View>

                    {/* Цвет системы */}
                    {colorsList.length !== 0 ? <Color
                        activeColor={activeColor}
                        colorsList={colorsList}
                        isColorListOpen={isColorListOpen}
                        isError={isError}
                        toggleColorList={toggleColorList}
                        colorsListHandler={colorsListHandler}
                    /> : null}

                    {/* Фиксация */}
                    {fixationTypeList.length !== 0 ? <FixationType
                        activeFixationType={activeFixationType}
                        fixationTypeList={fixationTypeList}
                        fixationTypesListHandler={fixationTypesListHandler}
                        isError={isError}
                        isFixationTypeListOpen={isFixationTypeListOpen}
                        toggleFixationTypeList={toggleFixationTypeList}
                    /> : null}

                    {optionsList.length !== 0 ? <Options
                        activeOption={activeOption}
                        optionsList={optionsList}
                        optionsListHandler={optionsListHandler}
                        isError={isError}
                        isOptionsListOpen={isOptionsListOpen}
                        toggleOptionList={toggleOptionsList}
                    /> : null}
                    {/* Цена / Разом */}
                    {/* <View style={thirdStepStyles.row}>
                        <View style={thirdStepStyles.inputContainer}>
                            <Text style={thirdStepStyles.detailsText}>Ціна</Text>
                            <Text style={thirdStepStyles.input} >0</Text>
                        </View>
                        <View style={thirdStepStyles.inputContainer}>
                            <Text style={thirdStepStyles.detailsText}>Разом</Text>
                            <Text style={thirdStepStyles.input} >0</Text>
                        </View>
                    </View> */}
                </View>
            </AnimatedWrapper>

            {/* Кнопка отправки */}
            {activeProduct && <AnimatedWrapper
                style={thirdStepStyles.submitButton}
                offsetY={-20}
            >
                <Pressable onPress={foldOrder}>
                    <ImageBackground
                        source={require("../../../assets/gradient-small.png")}
                        style={thirdStepStyles.submitButtonBg}
                    >
                        <Text style={thirdStepStyles.submitButtonText}>Покласти</Text>
                    </ImageBackground>
                </Pressable>
            </AnimatedWrapper>
            }
        </>
    );
}

export function ArrowDown({ style, isRotate = false }: { style?: ImageStyle, isRotate?: boolean }) {
    return (
        <>
            {isRotate ?
                <AnimatedWrapper
                    key="rotated"
                    useOpacity
                    offsetY={10}
                >
                    <Image
                        source={require("../../../assets/catalog-screen/arrow.png")}
                        style={[
                            { width: 18, height: 11, resizeMode: "contain", top: -27, transform: [{ rotate: "180deg" }] },
                            style
                        ]}
                    />
                </AnimatedWrapper>
                :
                <AnimatedWrapper
                    key="notrotated"
                    useOpacity
                    offsetY={-10}
                >
                    <Image
                        source={require("../../../assets/catalog-screen/arrow.png")}
                        style={[{ width: 18, height: 11, resizeMode: "contain", top: -25 }, style]}
                    />
                </AnimatedWrapper>
            }
        </>
    );
}

export function ErrorMessage({ errorText, styles }: { errorText: string, styles?: ViewStyle }) {
    return (
        <AnimatedWrapper style={[thirdStepStyles.errorMessage, styles]} useOpacity offsetY={20}>
            <Image
                source={require('../../../assets/orders-screen/error-icon.webp')}
                style={{
                    width: 25,
                    height: 25,
                    resizeMode: 'contain',
                }}
            />
            <View>
                <Text style={[thirdStepStyles.errorMessageText, { fontFamily: Fonts.comfortaa700, fontSize: 16, marginBottom: 10 }]}>Помилка!</Text>
                <Text style={thirdStepStyles.errorMessageText}>{errorText}</Text>
            </View>
        </AnimatedWrapper>
    );
}


export const thirdStepStyles = StyleSheet.create({
    stepSubtitle: {
        fontFamily: Fonts.comfortaa400,
        fontSize: 16,
        textTransform: "uppercase",
        textAlign: "center",
        color: Colors.gray,
        top: -10
    },
    stepCategory: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 30,
        textTransform: "uppercase",
        marginBottom: 10,
        textAlign: "left",
        color: Colors.blue,
        top: -10
    },
    stepSubCategory: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 16,
        textAlign: 'right',
        color: '#3372F965',
        borderBottomWidth: 2,
        paddingBottom: 5,
        borderColor: Colors.blueLight,
        top: -25,
        marginBottom: -25
    },
    detailsText: {
        marginTop: 5,
        fontFamily: Fonts.comfortaa600,
        fontSize: 16,
        color: Colors.gray,
    },
    selectField: {
        marginTop: 4,
        fontFamily: Fonts.openSans400,
        fontSize: 16,
        color: "black",
        backgroundColor: "white",
        paddingVertical: 9,
        paddingHorizontal: 13,
        borderRadius: 31,
        borderWidth: 2,
    },
    selectFieldInactive: {
        opacity: 0.5,
    },
    arrowIcon: {
        position: "absolute",
        zIndex: 10,
        right: 10,
        bottom: 13,
    },
    dropdownMenu: {
        maxHeight: 321,
        width: "100%",
        backgroundColor: "white",
        borderRadius: 17,
        position: "absolute",
        top: "105%",
        zIndex: 50,
        padding: 8,
        paddingBottom: 4,

        // iOS shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,

        // Android shadow
        elevation: 5,
    },
    loaderContainer: {
        height: '100%',
        alignItems: "center",
        justifyContent: "center",
    },
    scrollModal: {
        maxHeight: 321,
    },
    productItem: {
        paddingTop: 3,
        paddingBottom: 5,
        marginBottom: 5,
        borderRadius: 70,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: Colors.pale,
    },
    productItemText: {
        fontFamily: Fonts.openSans400,
        fontSize: 15,
        color: "black",
    },
    productItemTextWhite: {
        color: "white",
    },
    errorMessage: {
        overflow: 'hidden',
        position: "absolute",
        top: 20,
        alignSelf: "center",
        backgroundColor: "#fff8f6ff",
        padding: 20,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#FF0A0A",
        flexDirection: 'row',
        gap: 10,
        // iOS shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,

        // Android shadow
        elevation: 5,
    },
    errorMessageText: {
        fontFamily: Fonts.openSans400,
        fontSize: 14,
        lineHeight: 18,
        maxWidth: "95%",
        // backgroundColor: 'red'
    },
    errorMarker: {
        width: 22,
        height: '500%',
        backgroundColor: Colors.red,
        position: 'absolute',
        top: 0,
        left: 0
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
    },
    inputContainer: {
        width: "47%",
        position: "relative",
    },
    rowLabel: {
        flexDirection: "row",
        alignItems: "center",
    },
    labelNote: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 12,
        color: Colors.blue,
    },
    labelNoteSmall: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 10,
        color: Colors.blue,
    },
    input: {
        marginTop: 4,
        fontFamily: Fonts.openSans400,
        fontSize: 16,
        color: "black",
        backgroundColor: "white",
        paddingVertical: 9,
        paddingHorizontal: 13,
        borderRadius: 31,
        borderWidth: 2,
        position: 'relative',
        zIndex: 10
    },
    borderRed: {
        borderColor: Colors.red,
    },
    unitLabel: {
        fontFamily: Fonts.openSans400,
        fontSize: 16,
        color: Colors.gray,
        position: "absolute",
        bottom: 12,
        right: 10,
    },
    colorContainer: {
        position: "relative",
        marginTop: 12,
    },
    marginTop12: {
        marginTop: 10,
    },
    submitButton: {
        height: 59,
        maxWidth: 180,
        width: "100%",
        borderRadius: 31,
        overflow: "hidden",
        position: "absolute",
        zIndex: -1,
        bottom: -70,
        alignSelf: "center",
    },
    submitButtonBg: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    submitButtonText: {
        fontFamily: Fonts.comfortaa600,
        fontSize: 17,
        lineHeight: 22,
        color: "white",
    },
    absentValueText: {
        fontFamily: Fonts.openSans400,
        fontSize: 12,
        lineHeight: 14,
        color: Colors.gray,
        marginLeft: 5
    }
});

export default ThirdStep;
