import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { Colors } from "../theme/colors";
import CatalogCard from "../components/catalog-screen/CatalogCard";
import Logo from "../components/ui/Logo";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppStack";
import BackButton from "../components/ui/BackButton";
import { useEffect, useState } from "react";
import { IProductItem } from "../lib/types";
import { fetchProductsList } from "../lib/api";
import { RouteProp } from "@react-navigation/native";

export type CatalogScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "CatalogScreen">;
type CatalogScreenRouteProp = RouteProp<RootStackParamList, "CatalogScreen">;

function CatalogScreen({ navigation, route }: { navigation: CatalogScreenNavigationProp, route: CatalogScreenRouteProp }) {
    const { activeCategoryId } = route.params;

    const [catalogList, setCatalogList] = useState<IProductItem[] | null>(null);

    useEffect(() => {
        async function getCatalogList() {
            const productList = await fetchProductsList();

            // preview 8 items
            const previewList = productList.filter((product) => product.category_id === +activeCategoryId).slice(0, 8);
            //
            setCatalogList(previewList);

        }
        getCatalogList();
    }, [])

    return (
        <View style={styles.screenWrap}>
            <View style={styles.backButtonWrap}>
                <BackButton
                    text="Усі категорії"
                    onPressAction={() => navigation.navigate("CatalogMenuScreen")}
                />

                <Logo />
            </View>

            {catalogList === null ?
                <View style={styles.loaderWrap}>
                    <ActivityIndicator
                        color={Colors.blue}
                        size={"large"}
                    />
                </View>
                :
                <FlatList
                    data={catalogList}
                    horizontal={false}
                    numColumns={2}
                    keyExtractor={(product) => product.id.toString()}
                    columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 10 }}
                    contentContainerStyle={{ paddingHorizontal: 15 }}
                    renderItem={({ item }) => (
                        <CatalogCard
                            product={item}
                            onPressHandler={(productId: number) => {
                                navigation.navigate("CatalogItemScreen", { activeProductId: String(productId) })
                            }}
                        />
                    )}
                    style={{
                        paddingBottom: 150
                    }}
                />
            }
        </View>
    )
};

export default CatalogScreen;

const styles = StyleSheet.create({
    screenWrap: {
        marginTop: 50,
        paddingBottom: 50,
        backgroundColor: Colors.pale,
        height: '100%'
    },
    backButtonWrap: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        marginBottom: 20
    },
    loaderWrap: {
        width: "100%",
        height: "80%",
        alignItems: "center",
        justifyContent: "center"
    }
});