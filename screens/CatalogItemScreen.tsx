import { ActivityIndicator, StatusBar, StyleSheet, Text, View } from "react-native";
import CatalogItem from "../components/catalog-item-screen/CatalogItem";
import { IProductItem } from "../lib/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppStack";
import { RouteProp } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Colors } from "../theme/colors";
import { getDataFromAcyncStorage } from "../lib/async-storage/acyncStorage";
import { ASYNC_STORAGE_CATALOG_DATA_KEY } from "../lib/async-storage/asyncStorageKeys";
import { fetchProductItem } from "../lib/api/catalog";

export type CatalogItemScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "CatalogItemScreen">;
type CatalogItemScreenRouteProp = RouteProp<RootStackParamList, "CatalogItemScreen">;

function CatalogItemScreen({ navigation, route }: { navigation: CatalogItemScreenNavigationProp, route: CatalogItemScreenRouteProp }) {
    const { activeProductId } = route.params;
    const [productItem, setProductItem] = useState<IProductItem | null | undefined>(null);

    useEffect(() => {
        getProductItem();
    }, []);

    async function getProductItem() {
        // get saved catalog list from cash
        const productListFromStorage = await getDataFromAcyncStorage(ASYNC_STORAGE_CATALOG_DATA_KEY);

        if (productListFromStorage !== undefined) {
            // get product from saved catalog list in the cash 
            const list = JSON.parse(productListFromStorage) as IProductItem[];
            const product = list.find((item) => item.id === +activeProductId);

            if (product !== undefined) {
                setProductItem(product);
            } else {
                setProductItem(undefined); // ther is no product in the saved catalog list
            }
        } else {
            // get product from API
            const product = await fetchProductItem(activeProductId) as IProductItem;

            setProductItem(product);
        }
    };

    return (
        <View style={styles.fullHeight}>
            <StatusBar hidden={true} />

            {productItem ?
                // product
                <CatalogItem
                    product={productItem}
                    navigation={navigation}
                />
                :
                productItem === null ?
                    // loading
                    <View style={styles.loaderWrap}>
                        <ActivityIndicator
                            color={Colors.blue}
                            size={"large"}
                        />
                    </View>
                    :
                    // there is no product in the catalog list by current active id
                    <Text>Товару з id {activeProductId} не знайдено!</Text>
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