import { ActivityIndicator, FlatList, StatusBar, StyleSheet, View, Text } from "react-native";
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
import { Fonts } from "../theme/fonts";

export type CatalogScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "CatalogScreen">;
type CatalogScreenRouteProp = RouteProp<RootStackParamList, "CatalogScreen">;

const ITEMS_PER_PAGE = 20;

function CatalogScreen({ navigation, route }: { navigation: CatalogScreenNavigationProp, route: CatalogScreenRouteProp }) {
    const { activeCategoryId } = route.params;

    const [catalogList, setCatalogList] = useState<IProductItem[]>([]);

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        loadMoreItems();
    }, []);

    async function loadMoreItems() {
        if (loading || !hasMore) return;
        setLoading(true);
        const productList = await fetchProductsList();
        const filteredList = sortByName(productList.filter((product) => product.category_id === +activeCategoryId));
        const nextItems = filteredList.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

        if (nextItems.length > 0) {
            setCatalogList((prev) => [...prev, ...nextItems]);
            setPage((prev) => prev + 1);
        } else {
            setHasMore(false);
        }
        setLoading(false);
    }

    return (
        <View style={styles.screenWrap}>
            <StatusBar hidden={false} />

            <View style={styles.backButtonWrap}>
                <BackButton
                    text="Усі категорії"
                    onPressAction={() => navigation.navigate("CatalogMenuScreen")}
                />
                <Logo />
            </View>

            <FlatList
                data={catalogList}
                horizontal={false}
                numColumns={2}
                keyExtractor={(product, index) => product.id.toString() + index}
                columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 20 }}
                contentContainerStyle={{ paddingHorizontal: 10 }}
                renderItem={({ item }) => (
                    <CatalogCard
                        product={item}
                        onPressHandler={(productId: number) => {
                            navigation.navigate("CatalogItemScreen", { activeProductId: String(productId) })
                        }}
                    />
                )}
                onEndReached={loadMoreItems}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    loading ?
                        <PaginationLoader catalogList={catalogList} />
                        :
                        !hasMore ?
                            <Text style={styles.endMessage}>Ви досягли кінця списку</Text>
                            :
                            null
                }
            />
        </View>
    )
};

export default CatalogScreen;

function PaginationLoader({ catalogList }: { catalogList: IProductItem[] }) {
    if (catalogList.length === 0) {
        return (
            <ActivityIndicator color={Colors.blue} size={"large"} style={{ marginTop: 250 }} />
        )
    } else {
        return (
            <View style={styles.pagLoaderContainer}>
                <View style={styles.pagLoaderWrap}>
                    <View style={styles.pagLoaderCircle}>
                        <ActivityIndicator color={Colors.blue} size={"large"} />
                    </View>
                    <Text style={styles.pagLoaderText}>Завантажуємо ще...</Text>
                </View>
            </View>
        )
    }
};

function sortByName(productList: IProductItem[]) {
    if (productList.length === 0) return productList;

    const sortedList = [...productList].sort((a, b) => a.name.localeCompare(b.name));
    return sortedList;
};

const styles = StyleSheet.create({
    screenWrap: {
        marginTop: 20,
        paddingBottom: 20,
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
    },
    endMessage: {
        textAlign: "center",
        paddingBottom: 10,
        color: Colors.gray,
        fontFamily: Fonts.openSans400,
        fontSize: 14,
    },
    pagLoaderContainer: {
        width: "100%",
        alignItems: "center",
    },
    pagLoaderWrap: {
        height: 50,
        width: 215,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        backgroundColor: Colors.blue,
        borderTopRightRadius: 23,
        borderTopLeftRadius: 23,
    },
    pagLoaderCircle: {
        backgroundColor: Colors.pale,
        borderRadius: "50%"
    },
    pagLoaderText: {
        fontFamily: Fonts.comfortaa700,
        color: Colors.pale,
    }
});
