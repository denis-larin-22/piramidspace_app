import { useEffect, useState } from "react";
import { INewOrderObject } from "../AddNewOrder";
import { getStructureProductsGroupByCodes, IFixationType, IProductByCodes } from "../../../lib/api/orders";
import { Image, ImageBackground, ImageStyle, Pressable, ScrollView, StyleSheet, Text, TextInput, View, } from "react-native";
import { Fonts } from "../../../theme/fonts";
import { Colors } from "../../../theme/colors";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import Loader from "../../ui/Loader";
import { Keyboard } from 'react-native';

interface IErrorStateMessage {
    state: boolean,
    text: string,
    errorFieldNumber: 2 | 3 | 4 | 5 | 6 | null
}

function ThirdStep({ orderObject, setOrderObject, stepHandler }: { orderObject: INewOrderObject, setOrderObject: React.Dispatch<React.SetStateAction<INewOrderObject>>, stepHandler: () => void }) {
    const { product, height, width, height_gab, width_gab, typeManagment, count_number, color_system, fixation_type } = orderObject;

    // Product choice
    const [products, setProducts] = useState<IProductByCodes[] | null>(null);
    const [isProductsListOpen, setIsProductsListOpen] = useState(false);
    const [activeProduct, setActiveProduct] = useState<IProductByCodes | null>(product);

    // Color choice
    const [colorsList, setColorsList] = useState<string[]>([]);
    const [activeColor, setActiveColor] = useState(color_system);
    const [isColorListOpen, setIsColorListOpen] = useState(false);

    // Type management
    const [typeManagmentList, setTypeManagmentList] = useState<string[]>([]);
    const [activeTypeManagment, setActiveTypeManagment] = useState(typeManagment);
    const [isTypeManagmentListOpen, setIsTypeManagmentListOpen] = useState(false);

    // Fixation choise
    const [fixationTypeList, setFixationTypeList] = useState<IFixationType[]>([]);
    const [activeFixationType, setActiveFixationType] = useState<IFixationType | null>(fixation_type);
    const [isFixationTypeListOpen, setIsFixationTypeListOpen] = useState(false);

    // Error state
    const initErrorObject: IErrorStateMessage = {
        state: false,
        text: '',
        errorFieldNumber: null
    }

    const [isError, setIsError] = useState<IErrorStateMessage>(initErrorObject);

    const {
        group: { code: groupCode, name: groupName },
        subgroup: { code: subgroupCode, name: subgroupName },
    } = orderObject;

    useEffect(() => {
        async function getProducts() {
            if (groupCode === null || subgroupCode === null) {
                setProducts([]);
                return;
            }
            const data = await getStructureProductsGroupByCodes(groupCode, subgroupCode);
            if (data === null) {
                return;
            } else {
                setProducts(data.products);
                setColorsList(data.colors);
                setTypeManagmentList(data.control);
            }
        }
        getProducts();
    }, [orderObject]);

    // Dropdown togglers
    function toggleProductsList() {
        Keyboard.dismiss();
        setIsTypeManagmentListOpen(false);
        setIsColorListOpen(false);
        setIsFixationTypeListOpen(false);
        setIsProductsListOpen((prev) => !prev);
    }
    function toggleTypeManagmentList() {
        Keyboard.dismiss();
        setIsProductsListOpen(false);
        setIsColorListOpen(false);
        setIsFixationTypeListOpen(false);
        setIsTypeManagmentListOpen((prev) => !prev);
    }
    function toggleColorList() {
        Keyboard.dismiss();
        setIsProductsListOpen(false);
        setIsTypeManagmentListOpen(false);
        setIsFixationTypeListOpen(false);
        setIsColorListOpen((prev) => !prev);
    }
    function toggleFixationTypeList() {
        Keyboard.dismiss();
        setIsProductsListOpen(false);
        setIsTypeManagmentListOpen(false);
        setIsColorListOpen(false);
        setIsFixationTypeListOpen((prev) => !prev);
    }

    // Final form order CHECK befor sending
    function foldOrder() {
        if (!height || !width || !height_gab || !width_gab) {
            setIsError({
                state: true,
                text: "⚠️ Введіть усі значення ширини та висоти",
                errorFieldNumber: 2
            });
        } else if (typeManagmentList.length !== 0 && typeManagment === null) {
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
                <Text style={styles.stepSubtitle}>Оформлення Замовлення</Text>
            </AnimatedWrapper>
            <AnimatedWrapper useOpacity offsetY={20} delay={100}>
                <Text style={styles.stepCategory}>{groupName}</Text>
            </AnimatedWrapper>

            {/* Error message */}
            {isError.state && <ErrorMessage errorText={isError.text} />}

            {/* Product selection */}
            <AnimatedWrapper useOpacity offsetY={20} delay={200}>
                <Text style={styles.detailsText}>Оберіть тканину</Text>
                <View style={{ position: "relative" }}>
                    <Pressable onPress={toggleProductsList}>
                        <Text style={styles.selectField}>
                            {activeProduct === null ? "Оберіть зі списку" : activeProduct.name}
                        </Text>
                    </Pressable>
                    <ArrowDown style={styles.arrowIcon} />

                    {isProductsListOpen && (
                        <AnimatedWrapper useOpacity offsetY={-20} style={styles.dropdownMenu}>
                            {products === null ? (
                                <View style={styles.loaderContainer}>
                                    <Loader />
                                </View>
                            ) : products.length === 0 ? (
                                <Text>Товари за обраними параметрами відсутні</Text>
                            ) : (
                                <ScrollView style={styles.scrollModal}>
                                    {products.map((product, index) => (
                                        <Pressable
                                            key={index}
                                            style={[
                                                styles.productItem,
                                                {
                                                    backgroundColor: getProductBackgroundColor(
                                                        product,
                                                        activeProduct
                                                    ),
                                                    opacity: getProductOpacity(product),
                                                },
                                            ]}
                                            onPress={() => {
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
                                                    setFixationTypeList(product.fixation);
                                                    setIsProductsListOpen(false);
                                                }
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    styles.productItemText,
                                                    product.sale_tk && styles.productItemTextWhite,
                                                ]}
                                            >
                                                {getProductLabel(product)}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </ScrollView>
                            )}
                        </AnimatedWrapper>
                    )}
                </View>

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
                    <View style={styles.row}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.detailsText}>Керування</Text>
                            <Pressable onPress={toggleTypeManagmentList}>
                                <Text style={[styles.selectField, isError.errorFieldNumber === 3 && styles.borderRed]}>{activeTypeManagment || "Оберіть тип"}</Text>
                            </Pressable>
                            <ArrowDown style={styles.arrowIcon} />

                            {isTypeManagmentListOpen && (
                                <AnimatedWrapper useOpacity offsetY={-20} style={styles.dropdownMenu}>
                                    <ScrollView style={styles.scrollModal}>
                                        {typeManagmentList.length ?
                                            typeManagmentList.map((type, index) => (
                                                <Pressable
                                                    key={index}
                                                    style={[
                                                        styles.productItem,
                                                        activeTypeManagment === type && { backgroundColor: Colors.pale },
                                                    ]}
                                                    onPress={() => {
                                                        setActiveTypeManagment(type);
                                                        setOrderObject({ ...orderObject, typeManagment: type });
                                                        setIsTypeManagmentListOpen(false);
                                                    }}
                                                >
                                                    <Text style={styles.productItemText}>{type}</Text>
                                                </Pressable>
                                            ))
                                            :
                                            <Text style={styles.absentValueText}>Значення відсутні</Text>
                                        }
                                    </ScrollView>
                                </AnimatedWrapper>
                            )}
                        </View>

                        <CountValue
                            orderObject={orderObject}
                            setOrderObject={setOrderObject}
                            errorFieldNumber={isError.errorFieldNumber}
                        />
                    </View>

                    {/* Цвет системы */}
                    <View style={styles.colorContainer}>
                        <Text style={styles.detailsText}>Колір системи</Text>

                        <Pressable onPress={toggleColorList}>
                            <Text style={[styles.selectField, isError.errorFieldNumber === 5 && styles.borderRed]}>{activeColor || "Оберіть колір"}</Text>
                        </Pressable>
                        <ArrowDown style={styles.arrowIcon} />

                        {isColorListOpen && (
                            <AnimatedWrapper useOpacity offsetY={-20} style={styles.dropdownMenu}>
                                <ScrollView style={styles.scrollModal}>
                                    {colorsList.length ?
                                        colorsList.map((color, index) => (
                                            <Pressable
                                                key={index}
                                                style={[
                                                    styles.productItem,
                                                    activeColor === color && { backgroundColor: Colors.pale },
                                                ]}
                                                onPress={() => {
                                                    setActiveColor(color);
                                                    setOrderObject({ ...orderObject, color_system: color });
                                                    setIsColorListOpen(false);
                                                }}
                                            >
                                                <Text style={styles.productItemText}>{color}</Text>
                                            </Pressable>
                                        ))
                                        :
                                        <Text style={styles.absentValueText}>значення відсутні</Text>
                                    }
                                </ScrollView>
                            </AnimatedWrapper>
                        )}
                    </View>

                    {/* Фиксация */}
                    <View style={styles.colorContainer}>
                        <Text style={styles.detailsText}>Фіксація</Text>

                        <Pressable onPress={toggleFixationTypeList}>
                            <Text style={[styles.selectField, isError.errorFieldNumber === 6 && styles.borderRed]}>{activeFixationType === null ? "Оберіть тип" : activeFixationType.name}</Text>
                        </Pressable>
                        <ArrowDown style={styles.arrowIcon} />

                        {isFixationTypeListOpen && (
                            <AnimatedWrapper useOpacity offsetY={-20} style={styles.dropdownMenu}>
                                <ScrollView style={styles.scrollModal}>
                                    {fixationTypeList.length ?
                                        fixationTypeList.map((fixationType, index) => (
                                            <Pressable
                                                key={index}
                                                style={[
                                                    styles.productItem,
                                                    (activeFixationType !== null && activeFixationType.name === fixationType.name) && { backgroundColor: Colors.pale },
                                                ]}
                                                onPress={() => {
                                                    setActiveFixationType(fixationType);
                                                    setOrderObject({ ...orderObject, fixation_type: fixationType });
                                                    setIsFixationTypeListOpen(false);
                                                }}
                                            >
                                                <Text style={styles.productItemText}>{fixationType.name}</Text>
                                            </Pressable>
                                        ))
                                        :
                                        <Text style={styles.absentValueText}>значення відсутні</Text>
                                    }
                                </ScrollView>
                            </AnimatedWrapper>
                        )}
                    </View>

                    {/* Цена / Разом */}
                    <View style={styles.row}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.detailsText}>Ціна</Text>
                            <Text style={styles.input} >0</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.detailsText}>Разом</Text>
                            <Text style={styles.input} >0</Text>
                        </View>
                    </View>
                </View>
            </AnimatedWrapper>

            {/* Кнопка отправки */}
            {activeProduct && <AnimatedWrapper
                style={styles.submitButton}
                offsetY={-20}
            >
                <Pressable onPress={foldOrder}>
                    <ImageBackground
                        source={require("../../../assets/gradient-small.png")}
                        style={styles.submitButtonBg}
                    >
                        <Text style={styles.submitButtonText}>Покласти</Text>
                    </ImageBackground>
                </Pressable>
            </AnimatedWrapper>
            }
        </>
    );
}

function WidthAndHeight({ orderObject, setOrderObject, errorFieldNumber }: { orderObject: INewOrderObject, setOrderObject: React.Dispatch<React.SetStateAction<INewOrderObject>>, errorFieldNumber: number | null }) {
    return (
        <>
            <View style={styles.row}>
                <View style={styles.inputContainer}>
                    <View style={styles.rowLabel}>
                        <Text style={styles.detailsText}>Ширина </Text>
                        <Text style={styles.labelNote}>(габарит)</Text>
                    </View>
                    <TextInput
                        keyboardType="number-pad"
                        style={[styles.input, errorFieldNumber === 2 && styles.borderRed]}
                        placeholder="0"
                        value={orderObject.width_gab || ""}
                        onChangeText={(value) => {
                            setOrderObject({
                                ...orderObject,
                                width_gab: value
                            })
                        }}
                    />
                    <Text style={styles.unitLabel}>см</Text>
                </View>
                <View style={styles.inputContainer}>
                    <View style={styles.rowLabel}>
                        <Text style={styles.detailsText}>Ширина </Text>
                        <Text style={styles.labelNoteSmall}>(по штапику)</Text>
                    </View>
                    <TextInput
                        keyboardType="number-pad"
                        style={[styles.input, errorFieldNumber === 2 && styles.borderRed]}
                        placeholder="0"
                        value={orderObject.width || ""}
                        onChangeText={(value) => {
                            setOrderObject({
                                ...orderObject,
                                width: value
                            })
                        }}
                    />
                    <Text style={styles.unitLabel}>см</Text>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.inputContainer}>
                    <View style={styles.rowLabel}>
                        <Text style={styles.detailsText}>Висота </Text>
                        <Text style={styles.labelNote}>(габарит)</Text>
                    </View>
                    <TextInput
                        keyboardType="number-pad"
                        style={[styles.input, errorFieldNumber === 2 && styles.borderRed]}
                        placeholder="0"
                        value={orderObject.height_gab || ""}
                        onChangeText={(value) => {
                            setOrderObject({
                                ...orderObject,
                                height_gab: value
                            })
                        }}
                    />
                    <Text style={styles.unitLabel}>см</Text>
                </View>
                <View style={styles.inputContainer}>
                    <View style={styles.rowLabel}>
                        <Text style={styles.detailsText}>Висота </Text>
                        <Text style={styles.labelNoteSmall}>(по штапику)</Text>
                    </View>
                    <TextInput
                        keyboardType="number-pad"
                        style={[styles.input, errorFieldNumber === 2 && styles.borderRed]}
                        placeholder="0"
                        value={orderObject.height || ""}
                        onChangeText={(value) => {
                            setOrderObject({
                                ...orderObject,
                                height: value
                            })
                        }}
                    />
                    <Text style={styles.unitLabel}>см</Text>
                </View>
            </View>
        </>
    )
}

function CountValue({ orderObject, setOrderObject, errorFieldNumber }: { orderObject: INewOrderObject, setOrderObject: React.Dispatch<React.SetStateAction<INewOrderObject>>, errorFieldNumber: number | null }) {
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.detailsText}>Кількість</Text>
            <TextInput
                keyboardType="number-pad"
                style={[styles.input, errorFieldNumber === 4 && styles.borderRed]}
                placeholder="0"
                value={orderObject.count_number || ""}
                onChangeText={(value) => {
                    setOrderObject({
                        ...orderObject,
                        count_number: value
                    })
                }}
            />
            <Text style={styles.unitLabel}>шт</Text>
        </View>
    )
}

function ArrowDown({ style }: { style?: ImageStyle }) {
    return (
        <Image
            source={require("../../../assets/catalog-screen/arrow.png")}
            style={[{ width: 18, height: 11, resizeMode: "contain" }, style]}
        />
    );
}

function ErrorMessage({ errorText }: { errorText: string }) {
    return (
        <AnimatedWrapper style={styles.errorMessage} useOpacity offsetY={20}>
            <Text style={styles.errorMessageText}>{errorText}</Text>
        </AnimatedWrapper>
    );
}

// utils
// Helper functions for styles and labels
function getProductLabel(product: IProductByCodes) {
    if (product.sale_tk) return "🏷️ " + product.name;
    if (product.presence === "нет") return "🚫 " + product.name;
    return product.name;
}

function getProductBackgroundColor(
    product: IProductByCodes,
    activeProduct: IProductByCodes | null
) {
    if (activeProduct?.name === product.name) return Colors.pale;
    if (product.sale_tk) return Colors.blue;
    if (product.presence === "нет") return "#D1D1D6";
    return "white";
}

function getProductOpacity(product: IProductByCodes) {
    return product.presence === "нет" ? 0.6 : 1;
}

const styles = StyleSheet.create({
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
        zIndex: 20,
        padding: 8,

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
        paddingVertical: 5,
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
