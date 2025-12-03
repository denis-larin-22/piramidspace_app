import { useEffect, useState } from "react";
import { ColorPrice, Fixation, getProductsByGroupCodes, IProductByCodes, OptionPrice } from "../../../lib/api/orders-screen/groups-and-products";
import { Image, ImageBackground, ImageStyle, Pressable, Text, View } from "react-native";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import { Keyboard } from 'react-native';
import WidthAndHeight from "./third-step-components/WidthAndHeight";
import ProductsList from "./third-step-components/ProductsList";
import CountValue from "./third-step-components/CountValue";
import ControlType from "./third-step-components/ControlType";
import Color from "./third-step-components/Color";
import FixationType from "./third-step-components/FixationType";
import { ASYNC_STORAGE_USER_INFO_OBJECT } from "../../../lib/async-storage/asyncStorageKeys";
import { getDataFromAcyncStorage } from "../../../lib/async-storage/acyncStorage";
import { useCreateOrder } from "../NewOrderProvider";
import Options from "./third-step-components/Options";
import { ErrorMessage } from "../../ui/ErrorMessage";
import { IUserInfo, UnitsTypes } from "../../../lib/api/auth";
import { formStyles } from "./third-step-components/form-styles";

export interface IErrorStateMessage {
    state: boolean,
    text: string,
    errorFieldNumber: 2 | 3 | 4 | 5 | 6 | null
}

function ThirdStep({ stepHandler }: { stepHandler: () => void }) {
    const { orderParams, setOrderParams } = useCreateOrder();
    const [unit, setUnit] = useState<UnitsTypes | null>(null);

    const orderObject = orderParams.newOrderObject;
    const { subgroup, product, height_gab, width_gab, controlType, count_number, color_system, fixation_type, options } = orderObject;

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
            const userInfo = await getDataFromAcyncStorage(ASYNC_STORAGE_USER_INFO_OBJECT);
            const { "логин": login, units } = JSON.parse(userInfo) as IUserInfo;
            setUnit(units); // save main unit

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
                <Text style={formStyles.stepSubtitle}>Оформлення Замовлення</Text>
            </AnimatedWrapper>

            <AnimatedWrapper
                useOpacity
                offsetY={20}
                delay={150}
            >
                <Text style={formStyles.stepCategory}>{orderObject.group.name}</Text>
            </AnimatedWrapper>

            <AnimatedWrapper
                useOpacity
                offsetY={20}
                delay={200}
            >
                <Text style={formStyles.stepSubCategory}>{subgroup.name}</Text>
            </AnimatedWrapper>

            {/* Error message */}
            {isError.state && <ErrorMessage errorText={isError.text} />}

            {/* Product selection */}
            <AnimatedWrapper useOpacity offsetY={30} delay={300}>
                {/* Product list */}
                <Text style={formStyles.detailsText}>Оберіть тканину</Text>
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
                        unit={unit}
                        errorFieldNumber={isError.errorFieldNumber}
                    />

                    {/* Управление и Количество */}
                    <View style={formStyles.row}>
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
                    {/* <View style={formStyles.row}>
                        <View style={formStyles.inputContainer}>
                            <Text style={formStyles.detailsText}>Ціна</Text>
                            <Text style={formStyles.input} >0</Text>
                        </View>
                        <View style={formStyles.inputContainer}>
                            <Text style={formStyles.detailsText}>Разом</Text>
                            <Text style={formStyles.input} >0</Text>
                        </View>
                    </View> */}
                </View>
            </AnimatedWrapper>

            {/* Кнопка отправки */}
            {activeProduct && <AnimatedWrapper
                style={formStyles.submitButton}
                offsetY={-20}
            >
                <Pressable onPress={foldOrder}>
                    <ImageBackground
                        source={require("../../../assets/gradient-small.png")}
                        style={formStyles.submitButtonBg}
                    >
                        <Text style={formStyles.submitButtonText}>Покласти</Text>
                    </ImageBackground>
                </Pressable>
            </AnimatedWrapper>
            }
        </>
    );
}

export default ThirdStep;
