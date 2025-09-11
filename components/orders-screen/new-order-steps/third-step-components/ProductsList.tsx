import { Pressable, ScrollView, Text, View } from "react-native";
import AnimatedWrapper from "../../../animation/AnimatedWrapper";
import { ArrowDown, thirdStepStyles } from "../ThirdStep";
import Loader from "../../../ui/Loader";
import { IProductByCodes } from "../../../../lib/api/orders-screen/groups-and-products";
import { Colors } from "../../../../theme/colors";

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
                    style={[thirdStepStyles.selectField, {
                        borderColor: isProductsListOpen ? Colors.blue : Colors.blueLight
                    }]}
                >
                    {activeProduct === null ? "Оберіть зі списку" : activeProduct.name}
                </Text>
            </Pressable>
            <ArrowDown isRotate={isProductsListOpen} style={thirdStepStyles.arrowIcon} />

            {isProductsListOpen && <AnimatedWrapper
                useOpacity
                useScale
                offsetY={-30}
                style={[thirdStepStyles.dropdownMenu, {
                    minHeight: 321,
                }]}
            >
                {productsList == null ? (
                    <View style={thirdStepStyles.loaderContainer}>
                        <Loader radius={100} />
                    </View>
                ) : productsList.length === 0 ? (
                    <Text>Товари за обраними параметрами відсутні</Text>
                ) : (
                    <ScrollView style={thirdStepStyles.scrollModal}>
                        {productsList.map((product, index) => (
                            <AnimatedWrapper
                                key={index}
                                useOpacity
                                offsetY={10}
                                delay={200 + (30 * index)}
                            >
                                <Pressable
                                    style={[
                                        thirdStepStyles.productItem,
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
                                            thirdStepStyles.productItemText,
                                            product.sale_tk && thirdStepStyles.productItemTextWhite,
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