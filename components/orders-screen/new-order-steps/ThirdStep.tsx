import { useEffect, useState } from "react";
import { CloseButton, INewOrderObject } from "../AddNewOrder";
import { getProductsByCodes, IProductByCodes } from "../../../lib/api/orders";
import {
    Image,
    ImageBackground,
    ImageStyle,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { Fonts } from "../../../theme/fonts";
import { Colors } from "../../../theme/colors";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import Loader from "../../ui/Loader";

function ThirdStep({ orderObject }: { orderObject: INewOrderObject }) {
    // Product choice
    const [products, setProducts] = useState<IProductByCodes[] | null>(null);
    const [isProductsListOpen, setIsProductsListOpen] = useState(false);
    const [activeProduct, setActiveProduct] = useState<IProductByCodes | null>(null);

    // Color choice
    const [colorsList, setColorsList] = useState(["білий"]);
    const [activeColor, setActiveColor] = useState(colorsList[0]);
    const [isColorListOpen, setIsColorListOpen] = useState(false);

    // Type management
    const [typeManagmentList, setTypeManagmentList] = useState([""]);
    const [activeTypeManagment, setActiveTypeManagment] = useState(typeManagmentList[0]);
    const [isTypeManagmentListOpen, setIsTypeManagmentListOpen] = useState(false);

    // Fixation choise
    const [fixationTypeList, setFixationTypeList] = useState([""]);
    const [activeFixationType, setActiveFixationType] = useState(typeManagmentList[0]);
    const [isFixationTypeListOpen, setIsFixationTypeListOpen] = useState(false);

    // Error state
    const [isError, setIsError] = useState(false);

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
            const productsList = await getProductsByCodes(groupCode, subgroupCode);
            setProducts(productsList);
        }
        getProducts();
    }, [orderObject]);

    // Dropdown togglers
    function toggleProductsList() {
        setIsTypeManagmentListOpen(false);
        setIsColorListOpen(false);
        setIsFixationTypeListOpen(false);
        setIsProductsListOpen((prev) => !prev);
    }
    function toggleTypeManagmentList() {
        setIsProductsListOpen(false);
        setIsColorListOpen(false);
        setIsFixationTypeListOpen(false);
        setIsTypeManagmentListOpen((prev) => !prev);
    }
    function toggleColorList() {
        setIsProductsListOpen(false);
        setIsTypeManagmentListOpen(false);
        setIsFixationTypeListOpen(false);
        setIsColorListOpen((prev) => !prev);
    }
    function toggleFixationTypeList() {
        setIsProductsListOpen(false);
        setIsTypeManagmentListOpen(false);
        setIsColorListOpen(false);
        setIsFixationTypeListOpen((prev) => !prev);
    }

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
            {isError && <AbsentProductMessage />}

            {/* Product selection */}
            <AnimatedWrapper useOpacity offsetY={20} delay={200}>
                <Text style={styles.detailsText}>Оберіть тканину</Text>
                <View style={{ position: "relative" }}>
                    <Pressable onPress={toggleProductsList}>
                        <Text
                            style={[
                                styles.selectField,
                                activeProduct === null && styles.selectFieldInactive,
                            ]}
                        >
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
                                                    setIsError(true);
                                                    setTimeout(() => setIsError(false), 3000);
                                                } else {
                                                    setIsError(false);
                                                    setActiveProduct(product);
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
                    <View style={styles.row}>
                        <View style={styles.inputContainer}>
                            <View style={styles.rowLabel}>
                                <Text style={styles.detailsText}>Ширина </Text>
                                <Text style={styles.labelNote}>(габарит)</Text>
                            </View>
                            <TextInput style={styles.input} value="0" />
                            <Text style={styles.unitLabel}>см</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <View style={styles.rowLabel}>
                                <Text style={styles.detailsText}>Ширина </Text>
                                <Text style={styles.labelNoteSmall}>(по штапику)</Text>
                            </View>
                            <TextInput style={styles.input} value="0" />
                            <Text style={styles.unitLabel}>см</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.inputContainer}>
                            <View style={styles.rowLabel}>
                                <Text style={styles.detailsText}>Висота </Text>
                                <Text style={styles.labelNote}>(габарит)</Text>
                            </View>
                            <TextInput style={styles.input} value="0" />
                            <Text style={styles.unitLabel}>см</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <View style={styles.rowLabel}>
                                <Text style={styles.detailsText}>Ширина </Text>
                                <Text style={styles.labelNoteSmall}>(по штапику)</Text>
                            </View>
                            <TextInput style={styles.input} value="0" />
                            <Text style={styles.unitLabel}>см</Text>
                        </View>
                    </View>

                    {/* Управление и Количество */}
                    <View style={styles.row}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.detailsText}>Керування</Text>
                            <Pressable onPress={toggleTypeManagmentList}>
                                <Text style={styles.selectField}>{activeTypeManagment}</Text>
                            </Pressable>
                            <ArrowDown style={styles.arrowIcon} />

                            {isTypeManagmentListOpen && (
                                <AnimatedWrapper useOpacity offsetY={-20} style={styles.dropdownMenu}>
                                    <ScrollView style={styles.scrollModal}>
                                        {typeManagmentList.map((type, index) => (
                                            <Pressable
                                                key={index}
                                                style={[
                                                    styles.productItem,
                                                    activeTypeManagment === type && { backgroundColor: Colors.pale },
                                                ]}
                                                onPress={() => {
                                                    setActiveTypeManagment(type);
                                                    setIsTypeManagmentListOpen(false);
                                                }}
                                            >
                                                <Text style={styles.productItemText}>{type}</Text>
                                            </Pressable>
                                        ))}
                                    </ScrollView>
                                </AnimatedWrapper>
                            )}
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.detailsText}>Кількість</Text>
                            <TextInput style={styles.input} value="0" />
                            <Text style={styles.unitLabel}>шт</Text>
                        </View>
                    </View>

                    {/* Цвет системы */}
                    <View style={styles.colorContainer}>
                        <Text style={styles.detailsText}>Колір системи</Text>

                        <Pressable onPress={toggleColorList}>
                            <Text style={styles.selectField}>{activeColor}</Text>
                        </Pressable>
                        <ArrowDown style={styles.arrowIcon} />

                        {isColorListOpen && (
                            <AnimatedWrapper useOpacity offsetY={-20} style={styles.dropdownMenu}>
                                <ScrollView style={styles.scrollModal}>
                                    {colorsList.map((color, index) => (
                                        <Pressable
                                            key={index}
                                            style={[
                                                styles.productItem,
                                                activeColor === color && { backgroundColor: Colors.pale },
                                            ]}
                                            onPress={() => {
                                                setActiveColor(color);
                                                setIsColorListOpen(false);
                                            }}
                                        >
                                            <Text style={styles.productItemText}>{color}</Text>
                                        </Pressable>
                                    ))}
                                </ScrollView>
                            </AnimatedWrapper>
                        )}
                    </View>

                    {/* Фиксация */}
                    <View style={styles.colorContainer}>
                        <Text style={styles.detailsText}>Фіксація</Text>

                        <Pressable onPress={toggleFixationTypeList}>
                            <Text style={styles.selectField}>{activeFixationType}</Text>
                        </Pressable>
                        <ArrowDown style={styles.arrowIcon} />

                        {isFixationTypeListOpen && (
                            <AnimatedWrapper useOpacity offsetY={-20} style={styles.dropdownMenu}>
                                <ScrollView style={styles.scrollModal}>
                                    {fixationTypeList.map((fixationType, index) => (
                                        <Pressable
                                            key={index}
                                            style={[
                                                styles.productItem,
                                                activeFixationType === fixationType && { backgroundColor: Colors.pale },
                                            ]}
                                            onPress={() => {
                                                setActiveFixationType(fixationType);
                                                setIsFixationTypeListOpen(false);
                                            }}
                                        >
                                            <Text style={styles.productItemText}>{fixationType}</Text>
                                        </Pressable>
                                    ))}
                                </ScrollView>
                            </AnimatedWrapper>
                        )}
                    </View>

                    {/* Цена / Разом */}
                    <View style={styles.row}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.detailsText}>Ціна</Text>
                            <TextInput style={styles.input} value="67.67" />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.detailsText}>Разом</Text>
                            <TextInput style={styles.input} value="67.67" />
                        </View>
                    </View>
                </View>
            </AnimatedWrapper>

            {/* Кнопка отправки */}
            <AnimatedWrapper
                style={styles.submitButton}
                offsetY={-20}
            >
                <Pressable>
                    <ImageBackground
                        source={require("../../../assets/gradient-small.png")}
                        style={styles.submitButtonBg}
                    >
                        <Text style={styles.submitButtonText}>Покласти</Text>
                    </ImageBackground>
                </Pressable>
            </AnimatedWrapper>
        </>
    );
}

function ArrowDown({ style }: { style?: ImageStyle }) {
    return (
        <Image
            source={require("../../../assets/catalog-screen/arrow.png")}
            style={[{ width: 18, height: 11, resizeMode: "contain" }, style]}
        />
    );
}

function AbsentProductMessage() {
    return (
        <AnimatedWrapper style={styles.absentMessage} useOpacity offsetY={-20}>
            <Text style={styles.absentMessageText}>⚠️ Цїєї тканини немає в наявності!</Text>
        </AnimatedWrapper>
    );
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
    absentMessage: {
        position: "absolute",
        top: -50,
        alignSelf: "center",
        backgroundColor: Colors.pale,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 31,
    },
    absentMessageText: {
        fontFamily: Fonts.comfortaa400,
        fontSize: 14,
        lineHeight: 16,
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
        maxWidth: 150,
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
});

export default ThirdStep;
