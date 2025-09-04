import { useEffect, useState } from "react";
import { INewOrderObject } from "../AddNewOrder";
import { getStructureProductsGroupByCodes, IFixationType, IProductByCodes, MainGroupsCode } from "../../../lib/api/orders";
import { Image, ImageBackground, ImageStyle, Pressable, ScrollView, Text, TextInput, View, StyleSheet, } from "react-native";
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

export interface IErrorStateMessage {
    state: boolean,
    text: string,
    errorFieldNumber: 2 | 3 | 4 | 5 | 6 | null
}

function ThirdStep({ orderObject, setOrderObject, stepHandler }: { orderObject: INewOrderObject, setOrderObject: React.Dispatch<React.SetStateAction<INewOrderObject>>, stepHandler: () => void }) {
    const { group, subgroup, product, height_shtapik, width_shtapik, height_gab, width_gab, controlType, count_number, color_system, fixation_type } = orderObject;

    if (subgroup === null) return null;

    // Product choice
    const [products, setProducts] = useState<IProductByCodes[] | null>(null);
    const [isProductsListOpen, setIsProductsListOpen] = useState(false);
    const [activeProduct, setActiveProduct] = useState<IProductByCodes | null>(product);

    // Color choice
    const [colorsList] = useState<string[]>(subgroup.colors);
    const [activeColor, setActiveColor] = useState(color_system);
    const [isColorListOpen, setIsColorListOpen] = useState(false);

    // Control type
    const [cotrolTypesList] = useState<string[]>(subgroup.control);
    const [activeControlType, setActiveControlType] = useState(controlType);
    const [isControlTypeListOpen, setIsControlTypeListOpen] = useState(false);

    // Fixation choise
    const [fixationTypeList] = useState<string[]>(group.code === 'vertical' ? [subgroup.rb3] : subgroup.fixations.map(type => type.name));
    const [activeFixationType, setActiveFixationType] = useState<string | null>(fixation_type);
    const [isFixationTypeListOpen, setIsFixationTypeListOpen] = useState(false);

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
            if (orderObject.group.code === null || orderObject.subgroup === null) {
                setProducts([]);
                return;
            }
            const data = await getStructureProductsGroupByCodes(orderObject.group.code, orderObject.subgroup.code);
            if (data === null) {
                return;
            } else {
                setProducts(data.products);
            }
        }
        getProducts();
    }, [orderObject]);

    // Dropdown togglers
    function toggleProductsList() {
        Keyboard.dismiss();
        setIsControlTypeListOpen(false);
        setIsColorListOpen(false);
        setIsFixationTypeListOpen(false);
        setIsProductsListOpen((prev) => !prev);
    }
    function toggleControlTypeList() {
        Keyboard.dismiss();
        setIsProductsListOpen(false);
        setIsColorListOpen(false);
        setIsFixationTypeListOpen(false);
        setIsControlTypeListOpen((prev) => !prev);
    }
    function toggleColorList() {
        Keyboard.dismiss();
        setIsProductsListOpen(false);
        setIsControlTypeListOpen(false);
        setIsFixationTypeListOpen(false);
        setIsColorListOpen((prev) => !prev);
    }
    function toggleFixationTypeList() {
        Keyboard.dismiss();
        setIsProductsListOpen(false);
        setIsControlTypeListOpen(false);
        setIsColorListOpen(false);
        setIsFixationTypeListOpen((prev) => !prev);
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
            setOrderObject({ ...orderObject, product: product });
            setIsProductsListOpen(false);
        }
    }

    const controlTypesListHandler = (type: string) => {
        setActiveControlType(type);
        setOrderObject({ ...orderObject, controlType: type });
        setIsControlTypeListOpen(false);
    }

    const colorsListHandler = (color: string) => {
        setActiveColor(color);
        setOrderObject({ ...orderObject, color_system: color });
        setIsColorListOpen(false);
    }

    const fixationTypesListHandler = (type: string) => {
        setActiveFixationType(type);
        setOrderObject({ ...orderObject, fixation_type: type });
        setIsFixationTypeListOpen(false);
    }

    // Final form order CHECK befor sending
    function foldOrder() {
        if (!height_shtapik || !width_shtapik || !height_gab || !width_gab) {
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
            stepHandler();
        }

        setTimeout(() => {
            setIsError(initErrorObject);
        }, 3000);
    }


    return (
        <>
            {/* Titles */}
            <AnimatedWrapper useOpacity offsetY={20}>
                <Text style={thirdStepStyles.stepSubtitle}>Оформлення Замовлення</Text>
            </AnimatedWrapper>
            <AnimatedWrapper useOpacity offsetY={20} delay={100}>
                <Text style={thirdStepStyles.stepCategory}>{orderObject.group.name}</Text>
            </AnimatedWrapper>

            {/* Error message */}
            {isError.state && <ErrorMessage errorText={isError.text} />}

            {/* Product selection */}
            <AnimatedWrapper useOpacity offsetY={20} delay={200}>
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
                        orderObject={orderObject}
                        setOrderObject={setOrderObject}
                        errorFieldNumber={isError.errorFieldNumber}
                    />

                    {/* Управление и Количество */}
                    <View style={thirdStepStyles.row}>
                        {subgroup.control.length !== 0 && <ControlType
                            isControlTypeListOpen={isControlTypeListOpen}
                            toggleControlTypeList={toggleControlTypeList}
                            activeControlType={activeControlType}
                            cotrolTypesList={cotrolTypesList}
                            controlTypesListHandler={controlTypesListHandler}
                            isError={isError}
                        />}

                        <CountValue
                            orderObject={orderObject}
                            setOrderObject={setOrderObject}
                            errorFieldNumber={isError.errorFieldNumber}
                        />
                    </View>

                    {/* Цвет системы */}
                    {subgroup.colors.length !== 0 && <Color
                        activeColor={activeColor}
                        colorsList={colorsList}
                        isColorListOpen={isColorListOpen}
                        isError={isError}
                        toggleColorList={toggleColorList}
                        colorsListHandler={colorsListHandler}
                    />}

                    {/* Фиксация */}
                    {(subgroup.fixations.length !== 0 || subgroup.rb3.length !== 0) && <FixationType
                        activeFixationType={activeFixationType}
                        fixationTypeList={fixationTypeList}
                        fixationTypesListHandler={fixationTypesListHandler}
                        isError={isError}
                        isFixationTypeListOpen={isFixationTypeListOpen}
                        toggleFixationTypeList={toggleFixationTypeList}
                    />}

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

function ErrorMessage({ errorText }: { errorText: string }) {
    return (
        <AnimatedWrapper style={thirdStepStyles.errorMessage} useOpacity offsetY={20}>
            <Text style={thirdStepStyles.errorMessageText}>{errorText}</Text>
        </AnimatedWrapper>
    );
}

export const thirdStepStyles = StyleSheet.create({
    stepSubtitle: {
        fontFamily: Fonts.comfortaa400,
        fontSize: 16,
        textTransform: "uppercase",
        marginBottom: 0,
        textAlign: "right",
        color: Colors.gray,
    },
    stepCategory: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 30,
        textTransform: "uppercase",
        marginBottom: 10,
        textAlign: "left",
        color: Colors.blue,
    },
    detailsText: {
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
        borderWidth: 1,
        borderColor: "transparent"
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
        position: "absolute",
        top: 20,
        alignSelf: "center",
        backgroundColor: Colors.pale,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 31,
        // iOS shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,

        // Android shadow
        elevation: 5,
    },
    errorMessageText: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 16,
        lineHeight: 18,
        textAlign: 'center',
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
        borderWidth: 1,
        borderColor: 'transparent'
    },
    borderRed: {
        borderColor: Colors.red,
    },
    unitLabel: {
        fontFamily: Fonts.openSans400,
        fontSize: 16,
        color: Colors.gray,
        position: "absolute",
        bottom: 10,
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
