import { ActivityIndicator, StatusBar, StyleSheet, View } from "react-native";
import CatalogItem from "../components/catalog-item-screen/CatalogItem";
import { IProductItem } from "../lib/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppStack";
import { RouteProp } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { fetchProductItem } from "../lib/api";
import { Colors } from "../theme/colors";

export type CatalogItemScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "CatalogItemScreen">;
type CatalogItemScreenRouteProp = RouteProp<RootStackParamList, "CatalogItemScreen">;


function CatalogItemScreen({ navigation, route }: { navigation: CatalogItemScreenNavigationProp, route: CatalogItemScreenRouteProp }) {
    const { activeProductId } = route.params;

    const [productItem, setProductItem] = useState<Omit<IProductItem, 'price'> | null>(null);

    useEffect(() => {
        async function getProductItem() {
            const product = await fetchProductItem(+activeProductId);

            setProductItem(product);
        };

        getProductItem();
    }, []);

    return (
        <View style={styles.fullHeight}>
            <StatusBar hidden={true} />

            {productItem === null ?
                <View style={styles.loaderWrap}>
                    <ActivityIndicator
                        color={Colors.blue}
                        size={"large"}
                    />
                </View>
                :
                <CatalogItem
                    product={productItem}
                    navigation={navigation}
                />
            }
        </View>
    );
}

export default CatalogItemScreen;

const styles = StyleSheet.create({
    fullHeight: {
        height: '100%'
    },
    loaderWrap: {
        width: "100%",
        height: "80%",
        alignItems: "center",
        justifyContent: "center"
    }
});