import { ActivityIndicator, FlatList, StyleSheet, View, Animated } from "react-native";
import { Colors } from "../theme/colors";
import CatalogCard from "../components/catalog-screen/CatalogCard";
import Logo from "../components/ui/Logo";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppStack";
import BackButton from "../components/ui/BackButton";
import { IProductItem } from "../lib/types";
import { RouteProp } from "@react-navigation/native";
import { Fonts } from "../theme/fonts";
import { useCatalogList } from "../lib/hooks/useCatalogList";
import { useEffect, useRef } from "react";

export type CatalogScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "CatalogScreen">;
type CatalogScreenRouteProp = RouteProp<RootStackParamList, "CatalogScreen">;

function CatalogScreen({ navigation, route }: { navigation: CatalogScreenNavigationProp, route: CatalogScreenRouteProp }) {
    const { activeCategoryId } = route.params;
    const { catalogList, isLoading } = useCatalogList();

    return (
        <View style={styles.screenWrap}>
            <View style={styles.backButtonWrap}>
                <BackButton
                    text="Усі категорії"
                    onPressAction={() => navigation.goBack()}
                />

                <Logo />
            </View>

            {isLoading ?
                <View style={styles.loaderWrap}>
                    <ActivityIndicator
                        color={Colors.blue}
                        size={"large"}
                    />
                </View>
                :
                <FlatList
                    data={catalogList.filter((product) => product.category_id === +activeCategoryId)}
                    horizontal={false}
                    numColumns={2}
                    keyExtractor={(product) => product.id.toString()}
                    columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 10 }}
                    contentContainerStyle={{ paddingHorizontal: 15 }}
                    renderItem={({ item, index }) => (
                        <FlatItem
                            navigation={navigation}
                            item={item}
                            index={index}
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

function FlatItem({
    navigation,
    item,
    index
}: {
    navigation: CatalogScreenNavigationProp,
    item: IProductItem,
    index: number
}) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                delay: 20 * index,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 500,
                delay: 20 * index,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View style={{
            opacity: fadeAnim,
            transform: [{ translateY }],
            flex: 1,
            marginRight: index % 2 === 0 ? 10 : 0,
            maxWidth: '48%'
        }}>
            <CatalogCard
                product={item}
                onPressHandler={(productId: number) => {
                    navigation.navigate("CatalogItemScreen", { activeProductId: String(productId) });
                }}
            />
        </Animated.View>
    );
}



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
