import { Pressable, ScrollView, Text, View } from "react-native";
import AnimatedWrapper from "../../../animation/AnimatedWrapper";
import Loader from "../../../ui/Loader";
import { IProductByCodes } from "../../../../lib/api/orders-screen/groups-and-products";
import { Colors } from "../../../../theme/colors";
import { formStyles } from "./form-styles";
import { ArrowDown } from "../../../ui/ArrowDown";

export default function ProductsList({
    productsList,
    activeProduct,
    productsListHandler,
    isProductsListOpen,
    toggleProductsList,
}: {
    activeProduct: IProductByCodes | null,
    productsList: IProductByCodes[] | null,
    isProductsListOpen: boolean,
    productsListHandler: (product: IProductByCodes) => void,
    toggleProductsList: () => void
}) {

    return (
        <View style={{ position: "relative" }}>
            <Pressable onPress={toggleProductsList}>
                <Text
                    style={[formStyles.selectField, {
                        borderColor: isProductsListOpen ? Colors.blue : Colors.blueLight
                    }]}
                >
                    {activeProduct === null ? "Оберіть зі списку" : activeProduct.name}
                </Text>
            </Pressable>
            <ArrowDown isRotate={isProductsListOpen} style={formStyles.arrowIcon} />

            {isProductsListOpen && <AnimatedWrapper
                useOpacity
                useScale
                offsetY={-30}
                style={[formStyles.dropdownMenu, {
                    minHeight: 321,
                }]}
            >
                {productsList == null ? (
                    <View style={formStyles.loaderContainer}>
                        <Loader radius={100} />
                    </View>
                ) : productsList.length === 0 ? (
                    <Text>Товари за обраними параметрами відсутні</Text>
                ) : (
                    <ScrollView style={formStyles.scrollModal}>
                        {productsList.map((product, index) => (
                            <AnimatedWrapper
                                key={index}
                                useOpacity
                                offsetY={10}
                                delay={200 + (30 * index)}
                            >
                                <Pressable
                                    style={[
                                        formStyles.productItem,
                                        {
                                            backgroundColor: getProductBackgroundColor(
                                                product,
                                                activeProduct
                                            ),
                                            opacity: getProductOpacity(product),
                                        },
                                    ]}
                                    onPress={() => productsListHandler(product)}
                                >
                                    <Text
                                        style={[
                                            formStyles.productItemText,
                                            product.sale_tk && formStyles.productItemTextWhite,
                                        ]}
                                    >
                                        {getProductLabel(product)}
                                    </Text>
                                </Pressable>
                            </AnimatedWrapper>
                        ))}
                    </ScrollView>
                )}
            </AnimatedWrapper>
            }
        </View>
    )
}

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
    if (product.sale_tk) return "#F79D1598";
    if (product.presence === "нет") return "#D1D1D6";
    return "white";
}

function getProductOpacity(product: IProductByCodes) {
    return product.presence === "нет" ? 0.6 : 1;
}